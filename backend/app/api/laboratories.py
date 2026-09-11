from typing import Dict, Any, Optional, List
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from backend.app.db.session import get_db
from backend.app.db.models import LaboratoryModel, LaboratoryCapabilityModel

router = APIRouter(prefix="/laboratories", tags=["Testing Laboratories"])

class LabSearchRequest(BaseModel):
    location: Optional[str] = None
    product: Optional[str] = None
    standard: Optional[str] = None
    testing_capability: Optional[str] = None

@router.get("")
def list_laboratories(db: Session = Depends(get_db)):
    labs = db.query(LaboratoryModel).all()
    return {"laboratories": labs}

@router.get("/{id}")
def get_laboratory_detail(id: str, db: Session = Depends(get_db)):
    lab = db.query(LaboratoryModel).filter(LaboratoryModel.id == id).first()
    if not lab:
        raise HTTPException(status_code=404, detail="Laboratory not found")
        
    caps = db.query(LaboratoryCapabilityModel).filter(LaboratoryCapabilityModel.lab_id == lab.id).all()
    return {
        "laboratory": lab,
        "capabilities": caps
    }

@router.post("/search")
def search_laboratories(req: LabSearchRequest, db: Session = Depends(get_db)):
    query = db.query(LaboratoryModel)
    if req.location:
        loc_term = f"%{req.location}%"
        query = query.filter((LaboratoryModel.city.ilike(loc_term)) | (LaboratoryModel.state.ilike(loc_term)) | (LaboratoryModel.location.ilike(loc_term)))
        
    labs = query.all()
    results = []
    for l in labs:
        caps = db.query(LaboratoryCapabilityModel).filter(LaboratoryCapabilityModel.lab_id == l.id).all()
        results.append({
            "id": l.id,
            "lab_code": l.lab_code,
            "name": l.name,
            "location": l.location,
            "city": l.city,
            "state": l.state,
            "contact_email": l.contact_email,
            "contact_phone": l.contact_phone,
            "accreditation_status": l.accreditation_status,
            "is_bis_recognized": l.is_bis_recognized,
            "capabilities": [c.product_scope for c in caps]
        })
    return {"laboratories": results}
