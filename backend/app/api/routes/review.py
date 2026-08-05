import json
import logging

from fastapi import APIRouter, HTTPException, Depends

from app.schemas.review import ReviewRequest, ReviewResponse
from app.services.gemini_service import generate_review
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.crud.review import create_review

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/api/review", response_model=ReviewResponse)
def review_code(request: ReviewRequest, db: Session = Depends(get_db)):
    try:
        result = generate_review(request)
    except json.JSONDecodeError:
        raise HTTPException(status_code=502, detail="AIの応答を解析できませんでした")
    except Exception:
        logger.exception("Gemini API呼び出しに失敗しました")
        raise HTTPException(status_code=502, detail="AIサービスへの接続に失敗しました")

    create_review(db, request, result)
    return ReviewResponse(**result)