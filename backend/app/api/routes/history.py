import json
import logging

from fastapi import APIRouter, HTTPException, Depends

from app.schemas.history import ReviewHistoryItem
from app.services.gemini_service import generate_review
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user
from app.crud.review import get_all_histories

from app.models.user import User

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/api/history", response_model=list[ReviewHistoryItem])
def get_history(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_all_histories(db, user_id=current_user)