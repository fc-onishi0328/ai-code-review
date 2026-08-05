"""
テスト用のモックレビューデータをDBに投入するスクリプト。

実行方法:
    docker compose exec backend python -m app.scripts.seed_reviews

何度実行しても、その都度25件が追加登録される（重複チェックはしていない）。
履歴一覧・ページネーションの動作確認用としてだけ使う想定。
"""
import random
from datetime import datetime, timedelta, timezone

from app.core.database import SessionLocal
from app.models.review import Review

LANGUAGES = ["python", "javascript", "typescript", "java", "go"]
REVIEW_POINT_OPTIONS = ["可読性", "保守性", "セキュリティ", "パフォーマンス"]

# 言語ごとのサンプルコード（ダミー表示用の短いもの）
SAMPLE_CODES = {
    "python": "def add(a, b):\n    return a + b",
    "javascript": "function add(a, b) {\n  return a + b;\n}",
    "typescript": "const add = (a: number, b: number): number => a + b;",
    "java": "public int add(int a, int b) {\n    return a + b;\n}",
    "go": "func add(a, b int) int {\n    return a + b\n}",
}

# レビュー結果のパターンをいくつか用意し、ランダムに割り当てる
MOCK_RESULTS = [
    {
        "overall_evaluation": "全体的にシンプルで読みやすいコードです。",
        "issues": ["変数名がやや抽象的です"],
        "improvements": ["型ヒントを追加するとより堅牢になります"],
        "suggested_fixes": "型注釈を追加した形に書き換えることを推奨します。",
        "learning_points": ["静的型付けのメリットについて調べてみましょう"],
    },
    {
        "overall_evaluation": "セキュリティ面でやや懸念があります。",
        "issues": ["入力値のバリデーションがありません"],
        "improvements": ["境界値・型のチェックを追加してください"],
        "suggested_fixes": "不正な入力の場合は例外を送出するようにしてください。",
        "learning_points": ["入力値検証の重要性について"],
    },
    {
        "overall_evaluation": "パフォーマンス上の大きな問題は見当たりません。",
        "issues": [],
        "improvements": ["テストコードを追加すると安心です"],
        "suggested_fixes": "特に修正の必要はありません。",
        "learning_points": ["ユニットテストの書き方を学んでみましょう"],
    },
]


def seed(count: int = 25) -> None:
    db = SessionLocal()
    try:
        now = datetime.now(timezone.utc)
        for i in range(count):
            language = random.choice(LANGUAGES)
            # 0〜3件のレビュー観点をランダムに選ぶ（何も選ばないケースも含める）
            points = random.sample(REVIEW_POINT_OPTIONS, k=random.randint(0, 3))
            result = random.choice(MOCK_RESULTS)

            review = Review(
                language=language,
                code=SAMPLE_CODES[language],
                review_points=points,
                overall_evaluation=result["overall_evaluation"],
                issues=result["issues"],
                improvements=result["improvements"],
                suggested_fixes=result["suggested_fixes"],
                learning_points=result["learning_points"],
                # 数時間おきにずらした日時を入れて、新しい順の並び替えを確認しやすくする
                created_at=now - timedelta(hours=i * 7, minutes=random.randint(0, 59)),
            )
            db.add(review)

        db.commit()
        print(f"{count}件のモックデータを投入しました")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
