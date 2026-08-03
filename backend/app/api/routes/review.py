from fastapi import APIRouter

from app.schemas.review import ReviewRequest, ReviewResponse

router = APIRouter()


@router.post("/api/review", response_model=ReviewResponse)
def review_code(request: ReviewRequest):
    # TODO: 次のステップでここをGemini API呼び出しに差し替える
    # 現時点ではAPIの疎通・スキーマ確認のため固定値を返す
    return ReviewResponse(
        overall_evaluation=f"{request.language}のコードを受け取りました（ダミー応答）",
        issues=["これはダミーの問題点です"],
        improvements=["これはダミーの改善ポイントです"],
        suggested_fixes="ここに修正案が入ります（ダミー）",
        learning_points=["これはダミーの学習ポイントです"],
    )
