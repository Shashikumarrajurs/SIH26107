from typing import Dict, Any, List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from backend.app.db.session import get_db
from backend.app.db.models import SyncJobModel

router = APIRouter(prefix="/sync", tags=["BIS Source Synchronization Engine"])

class SyncRunRequest(BaseModel):
    source_name: Optional[str] = None
    simulate_offline: Optional[bool] = False
    simulate_unreliable_metadata: Optional[bool] = False

@router.get("/status")
def get_sync_status(db: Session = Depends(get_db)):
    """
    Returns real-time health, synchronization timestamps, and status
    of official BIS source pipelines (Standards portal, DPIIT QCOs, MeitY CRS, BIS CARE).
    No technical hash information is exposed.
    """
    from backend.app.db.models import StandardVersionModel, QCOGazetteModel
    jobs = db.query(SyncJobModel).all()
    has_unavailable = any(j.status in ["SOURCE_UNAVAILABLE", "TEMPORARILY_UNAVAILABLE"] for j in jobs)
    has_review = any(j.status == "UPDATE_REVIEW_REQUIRED" for j in jobs)

    if has_unavailable:
        system_status = "SOURCE_UNAVAILABLE"
    elif has_review:
        system_status = "UPDATE_REVIEW_REQUIRED"
    elif all(j.status == "SUCCESS" for j in jobs):
        system_status = "ONLINE_SYNCHRONIZED"
    else:
        system_status = "PARTIAL_DEGRADATION"

    # Get latest official update metadata
    latest_v = db.query(StandardVersionModel).order_by(StandardVersionModel.publication_date.desc()).first()
    latest_q = db.query(QCOGazetteModel).order_by(QCOGazetteModel.date_of_notification.desc()).first()

    last_official_update = f"{latest_q.order_number} ({latest_q.title})" if latest_q else (latest_v.title if latest_v else "Official BIS Standards Gazette")
    effective_from = latest_q.effective_date if latest_q else (latest_v.effective_date if latest_v else "Currently in Force")
    now_ist = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S") + " IST"

    return {
        "system_status": system_status,
        "current_status": "ACTIVE" if system_status == "ONLINE_SYNCHRONIZED" else system_status,
        "last_checked": now_ist,
        "last_checked_utc": datetime.utcnow().isoformat() + "Z",
        "last_official_update": last_official_update,
        "effective_from": effective_from,
        "policy": "Evidence-Grounded • Source-Locked • Update-Aware",
        "polling_interval_minutes": 60,
        "sources": [
            {
                "id": j.id,
                "source_name": j.source_name,
                "source_url": j.source_url,
                "source_type": j.source_type,
                "last_checked": j.last_checked,
                "last_official_update": j.last_official_update or "Official Standard Specification",
                "last_synced": j.last_synced,
                "status": j.status,
                "current_status": j.status,
                "change_detected": j.change_detected,
                "documents_count": j.documents_count,
                "notes": j.notes
            }
            for j in jobs
        ],
        "offline_resilience": "Cached verified snapshots served automatically if official registry endpoints are unreachable.",
        "disclaimer": "NexaStandards uses scheduled polling of official BIS and ministry portals. If a source cannot be reached, the system marks SOURCE_UNAVAILABLE and serves verified cached snapshots without claiming fresh synchronization."
    }

@router.post("/run")
def trigger_sync(req: Optional[SyncRunRequest] = None, db: Session = Depends(get_db)):
    """
    Triggers an on-demand synchronization check against official BIS sources.
    - If source is unreachable: marks SOURCE_UNAVAILABLE (no pretend synchronization).
    - If update metadata cannot be reliably parsed: marks UPDATE_REVIEW_REQUIRED.
    - Otherwise marks SUCCESS.
    """
    from backend.app.core.updater import bis_update_engine
    simulate_offline = req.simulate_offline if req else False
    simulate_unreliable = req.simulate_unreliable_metadata if req else False

    result = bis_update_engine.poll_and_sync_sources(
        db=db,
        simulate_offline=simulate_offline,
        simulate_unreliable_metadata=simulate_unreliable
    )

    if simulate_offline:
        msg = "Official source cannot be reached (SOURCE_UNAVAILABLE). Serving last verified snapshot; synchronization halted."
    elif simulate_unreliable:
        msg = "Update metadata cannot be reliably interpreted (UPDATE_REVIEW_REQUIRED). Regulatory status preserved."
    else:
        msg = "Source synchronization completed against official BIS portals."

    return {
        "status": result["status"],
        "sync_time": result["sync_time"],
        "simulated_offline": simulate_offline,
        "unreliable_metadata": simulate_unreliable,
        "message": msg
    }
