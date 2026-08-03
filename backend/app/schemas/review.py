from pydantic import BaseModel, Field


class ReviewRequest(BaseModel):
    language: str = Field(..., description="プログラミング言語（例: python）")
    code: str = Field(..., min_length=1, description="レビュー対象のコード")
    review_points: list[str] = Field(
        default_factory=list,
        description="レビュー観点（例: readability, security）",
    )


class ReviewResponse(BaseModel):
    overall_evaluation: str
    issues: list[str]
    improvements: list[str]
    suggested_fixes: str
    learning_points: list[str]
