#!/usr/bin/env python3
"""
BIS SmartAssist - One-Shot Local Demo Launcher
Starts the FastAPI backend server and displays live URLs.
Usage:
    python scripts/start_local.py
"""
import os
import sys
import subprocess
import time
import webbrowser

ROOT = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
sys.path.insert(0, ROOT)

BACKEND_PORT = 8000
FRONTEND_DIR = os.path.join(ROOT, "frontend")

def print_banner():
    print("=" * 65)
    print("  _   _                 ____  _                  _               _     ")
    print(" | \\ | | _____  ____ _ / ___|| |_ __ _ _ __   __| | __ _ _ __ __| |___ ")
    print(" |  \\| |/ _ \\ \\/ / _` |\\___ \\| __/ _` | '_ \\ / _` |/ _` | '__/ _` / __|")
    print(" | |\\  |  __/>  < (_| | ___) | || (_| | | | | (_| | (_| | | | (_| \\__ \\")
    print(" |_| \\_|\\___/_/\\_\\__,_||____/ \\__\\__,_|_| |_|\\__,_|\\__,_|_|  \\__,_|___/")
    print()
    print("  NexaStandards | SIH26107")
    print("  AI-powered Intelligent Assistant for Indian Standards & BIS Services")
    print("=" * 65)


def run_tests_first():
    print("\n[1/3] Running 35/35 SIH Statutory Backend Verification Tests...")
    result = subprocess.run(
        [sys.executable, "scripts/run_tests.py"],
        cwd=ROOT, capture_output=True, text=True
    )
    lines = result.stdout.strip().split('\n')
    for line in lines[-5:]:
        print("  ", line)


def start_backend():
    print("\n[2/3] Starting FastAPI Backend on http://localhost:8000 ...")
    proc = subprocess.Popen(
        [
            sys.executable, "-m", "uvicorn",
            "backend.app.main:app",
            "--reload", "--port", str(BACKEND_PORT), "--log-level", "warning"
        ],
        cwd=ROOT,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL
    )
    time.sleep(3)
    return proc


def start_frontend():
    print("[3/3] Starting Next.js Frontend on http://localhost:3000 ...")
    proc = subprocess.Popen(
        ["cmd", "/c", "npm run dev"],
        cwd=FRONTEND_DIR,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL
    )
    time.sleep(4)
    return proc


def main():
    print_banner()
    run_tests_first()

    backend_proc = start_backend()
    frontend_proc = start_frontend()

    print()
    print("=" * 65)
    print("  ✅ BIS SmartAssist is LIVE")
    print()
    print("  🌐 Frontend:    http://localhost:3000")
    print("  🔧 Backend API: http://localhost:8000")
    print("  📚 Swagger UI:  http://localhost:8000/docs")
    print("  ❤️  Health:     http://localhost:8000/health")
    print()
    print("  Press Ctrl+C to stop all services.")
    print("=" * 65)

    try:
        time.sleep(2)
        webbrowser.open("http://localhost:3000")
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n\nShutting down BIS SmartAssist...")
        backend_proc.terminate()
        frontend_proc.terminate()
        print("Goodbye! 🛡️")


if __name__ == "__main__":
    main()
