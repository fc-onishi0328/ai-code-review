from sqlalchemy import Column, Integer, String, DateTime, func

from app.core.database import Base


class User(Base):
    """アプリのユーザーアカウントを表すテーブル"""

    __tablename__ = "users"

    id = Column(
        Integer,
        primary_key=True,
        autoincrement=True,
        comment="主キー（自動採番）",
    )
    email = Column(
        String,
        unique=True,
        nullable=False,
        index=True,
        comment="ログインに使うメールアドレス（重複登録は不可）",
    )
    hashed_password = Column(
        String,
        nullable=False,
        comment="bcryptでハッシュ化されたパスワード（平文は保存しない）",
    )
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
        comment="登録日時（DB側で自動設定）",
    )