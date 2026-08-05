from sqlalchemy import Column, Integer, String, Text, DateTime, func
from sqlalchemy.dialects.postgresql import JSONB

from app.core.database import Base


class Review(Base):
    """1回分のコードレビューの記録を表すテーブル"""

    __tablename__ = "reviews"

    id = Column(
        Integer,
        primary_key=True,
        autoincrement=True,
        comment="主キー（自動採番）",
    )
    language = Column(
        String,
        nullable=False,
        comment="プログラミング言語（例: python）",
    )
    code = Column(
        Text,
        nullable=False,
        comment="レビュー対象のコード本文",
    )
    review_points = Column(
        JSONB,
        nullable=False,
        comment="選択されたレビュー観点の配列（例: [\"可読性\", \"セキュリティ\"]）",
    )
    overall_evaluation = Column(
        Text,
        nullable=True,
        comment="AIによる総合評価",
    )
    issues = Column(
        JSONB,
        nullable=True,
        comment="AIが指摘した問題点の配列",
    )
    improvements = Column(
        JSONB,
        nullable=True,
        comment="AIによる改善ポイントの配列",
    )
    suggested_fixes = Column(
        Text,
        nullable=True,
        comment="AIによる修正案",
    )
    learning_points = Column(
        JSONB,
        nullable=True,
        comment="AIによる学習ポイントの配列",
    )
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
        comment="レコード作成日時（DB側で自動設定）",
    )