from sqlalchemy.orm import Session

from app.models.review import Review
from app.schemas.review import ReviewRequest


def create_review(db: Session, request: ReviewRequest, result: dict) -> Review:
    new_review = Review(
        language=request.language,
        code=request.code,
        review_points=request.review_points,
        overall_evaluation=result["overall_evaluation"],
        issues=result["issues"],
        improvements=result["improvements"],
        suggested_fixes=result["suggested_fixes"],
        learning_points=result["learning_points"]
        
    )
    db.add(new_review)
    db.commit()
    db.refresh(new_review)
    return new_review



def get_all_histories(db: Session) -> list[Review]:
    return db.query(Review).order_by(Review.created_at.desc()).all()