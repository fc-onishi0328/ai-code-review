from fastapi import APIRouter

router = APIRouter()


@router.get("/")
def root():
    return {
        "message": "AI Code Review API"
    }


@router.get("/api/health")
def health():
    return {
        "status": "ok"
    }
