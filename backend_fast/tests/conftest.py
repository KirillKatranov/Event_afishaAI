import sys
import os
import pytest

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from fast import app
from models import Base, Content, Rating, get_db, User
from tests.config import test_settings

# Тестовая база SQLite
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)



@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    """Создание таблиц в тестовой БД перед всеми тестами"""
    assert test_settings.TEST_MODE == True
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)


def override_get_db():
    """Подмена зависимости get_db на тестовую сессию"""
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture()
def client():
    """TestClient с переопределённой зависимостью get_db"""
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()

@pytest.fixture()
def create_test_user1(client):
    with TestingSessionLocal() as db:
        user = User(username="TestUser")
        db.add(user)
        db.commit()

@pytest.fixture()
def create_test_user2(client):
    with TestingSessionLocal() as db:
        user = User(username="TestUser2")
        db.add(user)
        db.commit()





@pytest.fixture()
def create_test_content1():
    with TestingSessionLocal() as db:
        content = Content(name="TestContent", description="TestDescription")
        db.add(content)
        db.commit()

@pytest.fixture()
def create_test_content2():
    with TestingSessionLocal() as db:
        content = Content(name="TestContent2", description="TestDescription")
        db.add(content)
        db.commit()

@pytest.fixture()
def create_test_rating_for_one_content_rait3():
    """Создаёт запись в Rating(user_id=1, content_id=1, rating=3)"""
    with TestingSessionLocal() as db:
        rating = Rating(user_id=1, content_id=1, rating=3)
        db.add(rating)
        db.commit()

@pytest.fixture()
def create_test_rating_for_one_content_rait5():
    """Создаёт запись в Rating(user_id=2, content_id=1, rating=5)"""
    with TestingSessionLocal() as db:
        rating = Rating(user_id=2, content_id=1, rating=5)
        db.add(rating)
        db.commit()

@pytest.fixture()
def create_test_rating_for_second_content_rait3():
    """Создаёт запись в Rating(user_id=1, content_id=1, rating=3)"""
    with TestingSessionLocal() as db:
        rating = Rating(user_id=1, content_id=2, rating=3)
        db.add(rating)
        db.commit()

@pytest.fixture()
def create_test_rating_for_second_content_rait5():
    """Создаёт запись в Rating(user_id=2, content_id=1, rating=5)"""
    with TestingSessionLocal() as db:
        rating = Rating(user_id=2, content_id=2, rating=5)
        db.add(rating)
        db.commit()

@pytest.fixture(autouse=True)
def clear_db():
    """Очищает все таблицы перед каждым тестом"""
    # Используем отдельную сессию
    db = TestingSessionLocal()
    try:
        for table in reversed(Base.metadata.sorted_tables):
            db.execute(table.delete())
        db.commit()
    finally:
        db.close()