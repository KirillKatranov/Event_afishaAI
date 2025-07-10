from models import Feedback, User
from tests.conftest import TestingSessionLocal


def test_create_feedback(client, create_test_user1):
    response = client.post(
        "/api/v1/feedback", json={"username": "TestUser", "message": "TestMessage"}
    )
    data = response.json()

    assert response.status_code == 200
    assert data == {"status": "ok"}
    with TestingSessionLocal() as db:
        feedback = db.query(Feedback).filter(Feedback.user_id == 1).one()


def test_create_feedback_without_user(client):
    response = client.post(
        "/api/v1/feedback", json={"username": "TestUser", "message": "TestMessage"}
    )
    data = response.json()

    assert response.status_code == 200
    assert data == {"status": "ok"}
    with TestingSessionLocal() as db:
        feedback = db.query(Feedback).filter(Feedback.user_id == 1).one()
        user = db.query(User).filter(User.username == "TestUser").one()
