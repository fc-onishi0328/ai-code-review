import json
import logging

from fastapi import APIRouter, HTTPException

from app.schemas.review import ReviewRequest, ReviewResponse
from app.services.gemini_service import generate_review

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/api/review", response_model=ReviewResponse)
def review_code(request: ReviewRequest):
    try:
        result = generate_review(request)
    except json.JSONDecodeError:
        # Geminiの応答が期待したJSON形式でなかった場合
        raise HTTPException(status_code=502, detail="AIの応答を解析できませんでした")
    except Exception:
        # APIキー未設定・ネットワークエラーなど、Gemini呼び出し自体に失敗した場合
        logger.exception("Gemini API呼び出しに失敗しました")
        raise HTTPException(status_code=502, detail="AIサービスへの接続に失敗しました")

    return ReviewResponse(**result)
