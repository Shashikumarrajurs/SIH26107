"""
Security & Observability Middleware for BIS SmartAssist
- Request ID injection
- Simple in-memory rate limiting
- Audit logging on each request
"""

import uuid
import time
from collections import defaultdict
from typing import Dict, Tuple
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware


# -------------------------------------------------------------------
# Simple in-memory rate limiter (per IP, sliding window)
# In production, replace with Redis-backed solution.
# -------------------------------------------------------------------
_RATE_STORE: Dict[str, Tuple[int, float]] = defaultdict(lambda: (0, 0.0))

RATE_LIMIT_CALLS = 60       # max requests
RATE_LIMIT_WINDOW = 60.0    # per 60 seconds


class SecurityMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # 1. Inject request ID
        request_id = str(uuid.uuid4())
        request.state.request_id = request_id

        # 2. Rate limiting
        client_ip = request.client.host if request.client else "unknown"
        now = time.monotonic()
        calls, window_start = _RATE_STORE[client_ip]

        if now - window_start > RATE_LIMIT_WINDOW:
            # Reset window
            _RATE_STORE[client_ip] = (1, now)
        else:
            calls += 1
            if calls > RATE_LIMIT_CALLS:
                from fastapi.responses import JSONResponse
                return JSONResponse(
                    status_code=429,
                    content={
                        "error": "Rate limit exceeded. Maximum 60 requests per minute.",
                        "request_id": request_id
                    }
                )
            _RATE_STORE[client_ip] = (calls, window_start)

        # 3. Process request and attach security headers
        start_time = time.monotonic()
        response: Response = await call_next(request)
        latency_ms = int((time.monotonic() - start_time) * 1000)

        # Security response headers
        response.headers["X-Request-ID"] = request_id
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["X-Latency-MS"] = str(latency_ms)

        return response
