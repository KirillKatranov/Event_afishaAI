import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from fast import app
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, get_db, User
from tests.config import test_settings

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)


def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


class TestRegisterUser:
    def test_register_user_success(self):
        assert test_settings.TEST_MODE == True
        Base.metadata.drop_all(bind=engine)
        Base.metadata.create_all(bind=engine)
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

    def test_register_existing_user(self):
        assert test_settings.TEST_MODE == True
        Base.metadata.drop_all(bind=engine)
        Base.metadata.create_all(bind=engine)
        client.post("/api/v1/register", json={"username": "existing", "city": "spb"})
        response = client.post("/api/v1/register", json={"username": "existing", "city": "spb"})
        assert response.status_code == 400
        assert response.json() == {"detail": "Пользователь уже существует"}
        with TestingSessionLocal() as db:
            users = db.query(User).filter_by(username="existing").all()
            assert len(users) == 1