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


def fake_generate_review_fill(request):
    return {
        "overall_evaluation": "テスト用の評価",
        "issues": ["入力値のバリデーションがありません"],
        "improvements": ["境界値・型のチェックを追加してください"],
        "suggested_fixes": "不正な入力の場合は例外を送出するようにしてください。",
        "learning_points": ["入力値検証の重要性について"],
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


def test_history_detail_returns_full_review(client, monkeypatch, auth_headers, db_session):
    """自分のレビューの詳細を取得すると、レビュー結果まで含めて全項目返ることを確認"""
    monkeypatch.setattr("app.api.routes.review.generate_review", fake_generate_review_fill)

    request = {
        "language": "python",
        "code": "print('hello')",
        "review_points": ["security"],
    }
    client.post("/api/review", headers=auth_headers, json=request)

    review = db_session.query(Review).first()
    review_id = review.id

    response = client.get(f"/api/history/{review_id}", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["language"] == "python"
    assert data["code"] == "print('hello')"
    assert data["review_points"] == ["security"]
    assert data["overall_evaluation"] == "テスト用の評価"
    assert data["issues"] == ["入力値のバリデーションがありません"]
    assert data["improvements"] == ["境界値・型のチェックを追加してください"]
    assert data["suggested_fixes"] == "不正な入力の場合は例外を送出するようにしてください。"
    assert data["learning_points"] == ["入力値検証の重要性について"]

def test_history_detail_no_id_404(client, auth_headers):
    """存在しないレビューの詳細を取得すると、404になることを確認"""
    response = client.get("/api/history/9999", headers=auth_headers)
    assert response.status_code == 404

def test_history_detail_other_member_404(client, monkeypatch, registered_users, db_session):
    """レビューIDは存在するが、他のユーザーからは404になることを確認"""
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
    review = db_session.query(Review).first()
    review_id = review.id
    response = client.get(f"/api/history/{review_id}", headers=hanako_headers)

    assert response.status_code == 404
    assert response.json() == {
        'detail': 'レビューが見つかりません'
    }

def test_history_detail_no_id_int_422(client, auth_headers):
    """review_idが数値以外の場合、422になることを確認"""
    response = client.get("/api/history/abc", headers=auth_headers)
    assert response.status_code == 422

def test_history_detail_without_auth_returns_401(client):
    """Authorizationヘッダーなしなら401になることを確認"""
    response = client.get("/api/history/1")
    assert response.status_code == 401

def test_history_detail_with_invalid_token_returns_401(client):
    """無効なトークンなら401になることを確認"""
    response = client.get("/api/history/1", headers={"Authorization": "Bearer invalid-token"})
    assert response.status_code == 401
