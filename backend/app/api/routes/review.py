import json
import logging

from fastapi import APIRouter, HTTPException, Depends

from app.schemas.review import ReviewRequest, ReviewResponse
from app.services.gemini_service import generate_review
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user_optional
from app.crud.review import create_review

from app.models.user import User

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/api/review", response_model=ReviewResponse)
def review_code(request: ReviewRequest, db: Session = Depends(get_db), current_user: User | None = Depends(get_current_user_optional)):
    try:
        result = generate_review(request)
    except json.JSONDecodeError:
        raise HTTPException(status_code=502, detail="AIの応答を解析できませんでした")
    except Exception:
        logger.exception("Gemini API呼び出しに失敗しました")
        raise HTTPException(status_code=502, detail="AIサービスへの接続に失敗しました")

    if current_user is not None:
        create_review(db, request, result, user_id=current_user.id)

    return ReviewResponse(**result)