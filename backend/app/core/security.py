import os
from datetime import datetime, timedelta, timezone

import bcrypt
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.user import User

JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "dev-secret-key-change-me")
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 # 24Hours

# ログイン必須のエンドポイント用。Authorizationヘッダーがなければ401を返却する。
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")
# ログイン任意のエンドポイント。ヘッダーがなくてもエラーにせずNoneを返却する
oauth2_scheme_optional = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)

def hash_password(plain_password: str) -> str:
    """パスワードをbcrypyでハッシュ化する"""
    hashed = bcrypy.hashpw(plain_password.encode("UTF-8"), bcrypt.gensalt())
    return hashed.decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """入力されたパスワードが保存されているハッシュと一致するか確認する"""
    return bcrypt.checkpw(plain_password.encode("utf-8"), hash_password.encode("utf-8"))

def create_access_token(user_id: int) -> str:
    """指定したユーザーIDを含むJWTを発行する"""
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {"sub": str(user_id), "exp": expire}
    return jwt.encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)

def _decode_token(token: str) -> int | None:
    """トークンを検証し、中身のユーザーIDを取り出す。無効ならNoneを返す"""
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithm=[JWT_ALGORITHM])
        return int(payload["sub"])
    except jwt.PyJWTError:
        return None

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    """ログイン必須のエンドポイント用。トークンが無効・未指定なら401を返却する"""
    user_id = _decode_token(token)
    if user_id is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="認証情報が無効です")

    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="ユーザーが見つかりません")
    return user

def get_current_user_optional(
    token: str | None = Depends(oauth2_scheme_optional),
    db: Session = Depends(get_db),
) -> User | None:
    """ログイン任意のエンドポイント用。トークンが無い/無効ならNoneを返す（エラーにしない）"""
    if token is None:
        return None
    user_id = _decode_token(token)
    if user_id is None:
        return None
    return db.query(User).filter(User.id == user_id).first()