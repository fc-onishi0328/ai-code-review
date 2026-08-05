import os

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# docker-compose.ymlのdbサービス名（"db"）がホスト名として使える
# （Docker Composeは同じネットワーク内のサービス名を自動で名前解決してくれる）
DATABASE_URL = os.environ.get(
    "DATABASE_URL",
    "postgresql://postgres:postgres@db:5432/ai_code_review",
)

engine = create_engine(DATABASE_URL)

# DBとやり取りするための「セッション」を作る仕組み
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 全てのテーブル定義（models/review.pyなど）の親クラスになる
Base = declarative_base()


def get_db():
    """FastAPIのDependsで使う、リクエストごとのDBセッションを生成する関数"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()