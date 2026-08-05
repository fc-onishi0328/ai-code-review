from sqlalchemy.orm import Session

from app.models.user import User
from app.core.security import hash_password

def get_user_by_email(db: Session, email: str) -> User | None:
    """メールアドレスでユーザーを検索する(見つからなければNone)"""
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, email: str, password: str) -> User:
    """新規ユーザーを作成する（パスワードはハッシュ化してから保存する）"""
    new_user = User(
        email=email,
        hashed_password=hash_password(password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user