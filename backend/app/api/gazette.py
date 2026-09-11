from typing import Dict, Any, List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from backend.app.db.session import get_db
from backend.app.db.models import QCOGazetteModel

router = APIRouter(prefix="/gazette", tags=["Gazette & QCO Supersession Tracking"])

@router.get("/orders")
def get_gazette_orders(
    q: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Returns Quality Control Orders (QCO) with active vs superseded status.
    """
    query = db.query(QCOGazetteModel)
    if status:
        query = query.filter(QCOGazetteModel.status == status.upper())
        
    orders = query.all()
    
    if q:
        q_low = q.lower()
        orders = [
            o for o in orders
            if q_low in o.title.lower() or q_low in o.affected_standards.lower() or q_low in o.order_number.lower()
        ]
        
    return [
        {
            "id": o.id,
            "order_number": o.order_number,
            "title": o.title,
            "ministry": o.ministry,
            "date_of_notification": o.date_of_notification,
            "effective_date": o.effective_date,
            "status": o.status,
            "supersedes_order": o.supersedes_order,
            "superseded_by_order": o.superseded_by_order,
            "affected_standards": o.affected_standards,
            "mandatory_scheme": o.mandatory_scheme,
            "msme_exemption_clause": o.msme_exemption_clause,
            "has_supersession_notice": o.status == "SUPERSEDED" or bool(o.superseded_by_order)
        }
        for o in orders
    ]

@router.get("/supersessions")
def check_supersession(standard_number: str = Query(...), db: Session = Depends(get_db)):
    """
    Checks if a standard or associated QCO has been superseded or amended.
    """
    clean_std = standard_number.strip().split(":")[0] # e.g. IS 2347
    
    orders = db.query(QCOGazetteModel).filter(QCOGazetteModel.affected_standards.contains(clean_std)).all()
    
    superseded_orders = [o for o in orders if o.status == "SUPERSEDED"]
    current_orders = [o for o in orders if o.status == "CURRENT"]
    
    is_superseded = len(superseded_orders) > 0 and len(current_orders) > 0
    
    return {
        "standard_queried": standard_number,
        "is_amended_or_superseded": is_superseded,
        "warning_banner": f"NOTICE: An updated statutory Quality Control Order ({current_orders[0].order_number if current_orders else 'Recent Notification'}) supersedes earlier regulations for {clean_std}." if is_superseded else None,
        "current_active_order": {
            "order_number": current_orders[0].order_number,
            "title": current_orders[0].title,
            "effective_date": current_orders[0].effective_date
        } if current_orders else None,
        "superseded_history": [
            {
                "order_number": so.order_number,
                "title": so.title,
                "superseded_by": so.superseded_by_order
            }
            for so in superseded_orders
        ]
    }
