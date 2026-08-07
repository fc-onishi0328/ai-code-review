import json
import logging

from fastapi import APIRouter, HTTPException, Depends

from app.schemas.history import ReviewHistoryItem, ReviewHistoryDetail
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user
from app.crud.review import get_all_histories, get_review_by_id

from app.models.user import User

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/api/history", response_model=list[ReviewHistoryItem])
def get_history(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_all_histories(db, user_id=current_user.id)

@router.get("/api/history/{review_id}", response_model=ReviewHistoryDetail)
def get_history_detail(review_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    review = get_review_by_id(db, review_id, current_user.id)
    if review is None:
        raise HTTPException(status_code=404, detail="レビューが見つかりません")
    return review