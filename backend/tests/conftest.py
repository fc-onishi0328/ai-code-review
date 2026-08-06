import os

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.core.database import Base, get_db

TEST_DATABASE_URL = os.environ.get(
    "TEST_DATABASE_URL",
    "postgresql://postgres:postgres@db:5432/ai_code_review_test",
)

engine = create_engine(TEST_DATABASE_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture()
def db_session():
    """テストごとに、まっさらなテーブルを用意してセッションを渡す"""
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        # テスト後にテーブルごと削除し、次のテストに影響を残さない
        Base.metadata.drop_all(bind=engine)


@pytest.fixture()
def client(db_session):
    """本番用DBの代わりに、テスト用DBセッションを使うクライアント"""

    def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)
    app.dependency_overrides.clear()

@pytest.fixture()
def registered_user(client):
    """テスト用ユーザーを1人登録して、その認証情報を返す"""
    email_and_password = {"email": "taro@example.com", "password": "password123"}
    client.post("/api/auth/register", json=email_and_password)
    return email_and_password

@pytest.fixture()
def registered_users(client):
    """テストユーザーを複数登録して、全員分の認証情報をリストで返す"""
    users = [
        {"email": "taro@example.com", "password": "password123"},
        {"email": "hanako@example.com", "password": "password456"},
        {"email": "jiro@example.com", "password": "password789"},
    ]
    for user in users:
        client.post("/api/auth/register", json=user)
    return users

@pytest.fixture()
def auth_headers(client, registered_user):
    """ログイン済みの状態を表すAuthorizationヘッダーを返す"""
    response = client.post("/api/auth/login", json=registered_user)
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}
