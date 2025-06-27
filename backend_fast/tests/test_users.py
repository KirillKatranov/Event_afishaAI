import sys
import os

from tests.conftest import TestingSessionLocal

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient


from sqlalchemy.orm import sessionmaker
from models import Base, User
from tests.config import test_settings


class TestRegisterUser:
    def test_register_user_success(self, client):
        assert test_settings.TEST_MODE == True

        response = client.post(
            "/api/v1/register", json={"username": "testuser", "city": "nn"}
        )
        assert response.status_code == 201
        data = response.json()
        assert data["message"] == "Пользователь успешно зарегистрирован"
        assert "user_id" in data
        with TestingSessionLocal() as db:
            user = db.query(User).filter_by(username="testuser").first()
            assert user is not None
            assert user.id == data["user_id"]
            assert user.city == "nn"

    def test_register_existing_user(self, client):
        assert test_settings.TEST_MODE == True

        client.post("/api/v1/register", json={"username": "existing", "city": "spb"})
        response = client.post("/api/v1/register", json={"username": "existing", "city": "spb"})
        assert response.status_code == 400
        assert response.json() == {"detail": "Пользователь уже существует"}
        with TestingSessionLocal() as db:
            users = db.query(User).filter_by(username="existing").all()
            assert len(users) == 1