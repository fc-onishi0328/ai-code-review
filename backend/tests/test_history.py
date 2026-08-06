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


def test_history_returns_only_own_reviews(client, monkeypatch, registered_users):
    """他ユーザーのレビューが混ざらないことを確認"""
    request = {
        "language": "python",
        "code": "print('hello')",
        "review_points": ["security"],
    }
    monkeypatch.setattr("app.api.routes.review.generate_review", fake_generate_review)

    # taro(1人目)でログインしてトークンを取得
    taro_token = client.post("/api/auth/login", json=registered_users[0]).json()["access_token"]
    taro_headers = {"Authorization": f"Bearer {taro_token}"}
    client.post("/api/review", headers=taro_headers, json=request)

    # hanako(2人目)でログインしてトークンを取得
    hanako_token = client.post("/api/auth/login", json=registered_users[1]).json()["access_token"]
    hanako_headers = {"Authorization": f"Bearer {hanako_token}"}
    response = client.get("/api/history", headers=hanako_headers)

    assert response.status_code == 200
    assert response.json() == []

def test_history_ordered_by_created_at_desc(client, monkeypatch, auth_headers):
    """新しい順に並んでいることを確認"""
    request = {
        "language": "python",
        "code": "print('hello')",
        "review_points": ["security"],
    }
    monkeypatch.setattr("app.api.routes.review.generate_review", fake_generate_review)
    client.post("/api/review", headers=auth_headers, json=request)
    request = {
        "language": "javascript",
        "code": "console.log('konbanha')",
        "review_points": ["performance"],
    }
    client.post("/api/review", headers=auth_headers, json=request)

    response = client.get("/api/history", headers=auth_headers)
    data = response.json()
    assert response.status_code == 200
    assert len(data) == 2
    assert data[0]["language"] == "javascript"
    assert data[0]["code"] == "console.log('konbanha')"
    assert data[0]["review_points"] == ["performance"]

def test_history_empty_for_new_user(client, auth_headers):
    """レビューを1件も投稿していないユーザーは空配列が返ることを確認"""
    response = client.get("/api/history", headers=auth_headers)
    assert response.status_code == 200
    assert response.json() == []


def test_history_without_auth_returns_401(client):
    """Authorizationヘッダーなしなら401になることを確認"""
    response = client.get("/api/history")
    assert response.status_code == 401

def test_history_with_invalid_token_returns_401(client):
    """無効なトークンなら401になることを確認"""
    response = client.get("/api/history", headers={"Authorization": "Bearer invalid-token"})
    assert response.status_code == 401
