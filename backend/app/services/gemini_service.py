import json
import logging

from google import genai

from app.schemas.review import ReviewRequest

logger = logging.getLogger(__name__)

# 使用するGeminiモデル
MODEL_NAME = "gemini-3.5-flash-lite"


def _build_prompt(request: ReviewRequest) -> str:
    """Geminiに渡すプロンプトを組み立てる"""
    points = "、".join(request.review_points) if request.review_points else "全般的な観点"

    return f"""あなたは経験豊富なシニアソフトウェアエンジニアです。
以下の{request.language}のコードを、次の観点でレビューしてください: {points}

# レビュー対象コード
{request.code}

# 出力形式
説明文やコードブロックの記号（```など）を付けず、必ず以下のJSON形式のみで回答してください。
{{
  "overall_evaluation": "総合評価を一文で",
  "issues": ["問題点1", "問題点2"],
  "improvements": ["改善ポイント1", "改善ポイント2"],
  "suggested_fixes": "修正案（コードや説明）",
  "learning_points": ["学習ポイント1", "学習ポイント2"]
}}
"""


def _extract_text(interaction) -> str:
    """Interactions APIのレスポンスからテキスト本文を取り出す"""
    # output_text が使える場合はそちらを優先（一番シンプルな取得方法）
    text = getattr(interaction, "output_text", None)
    if text:
        return text
    # フォールバック: outputsの中から最後のテキスト出力を探す
    return interaction.outputs[-1].text


def generate_review(request: ReviewRequest) -> dict:
    """Gemini APIを呼び出し、レビュー結果をdictで返す"""
    # genai.Client() は環境変数 GEMINI_API_KEY を自動で読み込む
    client = genai.Client()

    interaction = client.interactions.create(
        model=MODEL_NAME,
        input=_build_prompt(request),
    )

    raw_text = _extract_text(interaction).strip()

    # Geminiが ```json ... ``` のようにコードブロックで囲って返すことがあるため除去する
    if raw_text.startswith("```"):
        raw_text = raw_text.strip("`")
        if raw_text.startswith("json"):
            raw_text = raw_text[len("json"):]
        raw_text = raw_text.strip()

    try:
        return json.loads(raw_text)
    except json.JSONDecodeError:
        # 何が返ってきて解析に失敗したのかをログに残す（デバッグ用）
        logger.error("Geminiの応答をJSONとして解析できませんでした: %s", raw_text)
        raise
