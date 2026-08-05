def test_register_success(client):
    response = client.post("/api/auth/register", json={
        "email": "taro@example.com",
        "password": "password123",
    })

    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "taro@example.com"
    assert "id" in data
    assert "hashed_password" not in data  # パスワード関連の情報が漏れていないことの確認


def test_register_duplicate_email(client):
    client.post("/api/auth/register", json={"email": "taro@example.com", "password": "password123"})

    response = client.post("/api/auth/register", json={"email": "taro@example.com", "password": "anotherpass"})

    assert response.status_code == 400


def test_register_short_password(client):
    response = client.post("/api/auth/register", json={"email": "test2@example.com", "password": "1234567"})

    assert response.status_code == 422


def test_register_invalid_email(client):
    response = client.post("/api/auth/register", json={"email": "not-an-email", "password": "password123"})

    assert response.status_code == 422


def test_login_success(client):
    client.post("/api/auth/register", json={"email": "taro@example.com", "password": "password123"})

    response = client.post("/api/auth/login", json={"email": "taro@example.com", "password": "password123"})

    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_wrong_password(client):
    client.post("/api/auth/register", json={"email": "taro@example.com", "password": "password123"})

    response = client.post("/api/auth/login", json={"email": "taro@example.com", "password": "wrongpassword"})

    assert response.status_code == 401


def test_login_nonexistent_email_gives_same_message_as_wrong_password(client):
    client.post("/api/auth/register", json={"email": "taro@example.com", "password": "password123"})

    wrong_password = client.post("/api/auth/login", json={"email": "taro@example.com", "password": "wrongpassword"})
    nonexistent_email = client.post("/api/auth/login", json={"email": "nobody@example.com", "password": "password123"})

    assert nonexistent_email.status_code == 401
    # セキュリティ上、「メールが存在しない」と「パスワードが違う」でメッセージを変えていないことの確認
    assert nonexistent_email.json()["detail"] == wrong_password.json()["detail"]