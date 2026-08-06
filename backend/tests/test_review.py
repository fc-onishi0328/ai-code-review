import json

from app.models.review import Review
from app.models.user import User

def fake_generate_review(request):
    return {
        "overall_evaluation": "テスト用の評価",
        "issues": [],
        "improvements": [],
        "suggested_fixes": "",
        "learning_points": [],
    }

def fake_generate_review_exception(request):
    raise json.JSONDecodeError("テスト用のエラー", "invalid json", 0)

def fake_generate_review_conn_error(request):
    raise ConnectionError("テスト用接続失敗エラー")

def test_review_without_login_returns_200_and_not_saved(client, monkeypatch, db_session):
    """未ログインでも200は返るが、DBには保存されないことを確認"""
    request={
        "language": "python",
        "code": "print('hello')",
        "review_points": [
            "security"
        ]
    }
    # monkeypatchでgenerate_reviewを差し替える
    monkeypatch.setattr("app.api.routes.review.generate_review", fake_generate_review)
    # Authorizationヘッダーを付けずに client.post("/api/review", json=...)
    response = client.post("/api/review", json=request)
    # assert: ステータスコード
    assert response.status_code == 200
    # assert: DBに保存されていないこと（db_sessionフィクスチャでクエリして件数確認）
    assert db_session.query(Review).count() == 0

def test_review_with_login_saves_to_db(client, monkeypatch, auth_headers, registered_user, db_session):
    """ログイン済みなら200が返り、user_id付きでDBに保存されることを確認"""
    request={
        "language": "python",
        "code": "print('hello')",
        "review_points": [
            "security"
        ]
    }
    # monkeypatchでgenerate_reviewを差し替える
    monkeypatch.setattr("app.api.routes.review.generate_review", fake_generate_review)
    response = client.post("/api/review", headers=auth_headers,json=request)
    assert response.status_code == 200
    user = db_session.query(User).filter(User.email == registered_user["email"]).first()
    assert db_session.query(Review).filter(Review.user_id == user.id).count() == 1

def test_review_with_empty_review_points(client, monkeypatch, auth_headers):
    """review_pointsが空配列でもエラーにならないことを確認"""
    request={
        "language": "javascript",
        "code": "console.log('hello')",
        "review_points": []
    }
    monkeypatch.setattr("app.api.routes.review.generate_review", fake_generate_review)
    response = client.post("/api/review", headers=auth_headers,json=request)
    assert response.status_code == 200


def test_review_with_empty_code_returns_422(client, auth_headers):
    """codeが空文字なら422になることを確認（monkeypatch不要、バリデーションで弾かれるはず）"""
    request={
        "language": "python",
        "code": "",
        "review_points": [
            "security"
        ]
    }
    response = client.post("/api/review", headers=auth_headers,json=request)
    assert response.status_code == 422

def test_review_without_code_field_returns_422(client, auth_headers):
    """codeキー自体が無ければ422になることを確認"""
    request={
        "language": "python",
        "review_points": [
            "security"
        ]
    }
    response = client.post("/api/review", headers=auth_headers,json=request)
    assert response.status_code == 422

def test_review_gemini_json_decode_error_returns_502(client, monkeypatch, auth_headers):
    """Geminiの応答がJSONとして解析できない場合、502になることを確認"""
    monkeypatch.setattr("app.api.routes.review.generate_review", fake_generate_review_exception)

    request = {
        "language": "python",
        "code": "print('hello')",
        "review_points": ["security"],
    }
    response = client.post("/api/review", headers=auth_headers, json=request)

    assert response.status_code == 502
    assert response.json()["detail"] == "AIの応答を解析できませんでした"


def test_review_gemini_connection_error_returns_502(client, monkeypatch, auth_headers):
    """Gemini呼び出し自体が失敗した場合、502になることを確認"""
    monkeypatch.setattr("app.api.routes.review.generate_review", fake_generate_review_conn_error)

    request = {
        "language": "python",
        "code": "print('hello')",
        "review_points": ["security"],
    }
    response = client.post("/api/review", headers=auth_headers, json=request)

    assert response.status_code == 502
    assert response.json()["detail"] == "AIサービスへの接続に失敗しました"


def test_review_with_invalid_token_treated_as_anonymous(client, monkeypatch, db_session):
    """無効なトークンでも401にならず、未ログイン扱い（200＋未保存）になることを確認"""
    # ヒント: headers={"Authorization": "Bearer invalid-token"}
    request={
        "language": "python",
        "code": "print('hello')",
        "review_points": [
            "security"
        ]
    }
    # monkeypatchでgenerate_reviewを差し替える
    monkeypatch.setattr("app.api.routes.review.generate_review", fake_generate_review)
    response = client.post("/api/review", headers={"Authorization": "Bearer invalid-token"}, json=request)
    # assert: ステータスコード
    assert response.status_code == 200
    # assert: DBに保存されていないこと（db_sessionフィクスチャでクエリして件数確認）
    assert db_session.query(Review).count() == 0