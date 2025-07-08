from models import Rating
from tests.conftest import TestingSessionLocal


class TestRatings:
    def test_create_rating(self, client, create_test_content1, create_test_user1):
        response = client.post(
            "api/v1/ratings",
            json={"username": "TestUser", "content_id": 1, "rating": 4},
        )
        data = response.json()

        assert response.status_code == 200
        assert data["id"] == 1
        assert data["user_id"] == 1
        assert data["content_id"] == 1
        assert data["rating"] == 4
        assert True == isinstance(data["created"], str)
        assert True == isinstance(data["updated"], str)
        assert data["username"] == "TestUser"
        with TestingSessionLocal() as db:
            rating = db.query(Rating).filter_by(user_id=1).one()
            assert rating.rating == 4

    def test_update_rating(
        self,
        client,
        create_test_content1,
        create_test_user1,
        create_test_rating_for_one_content_rait3,
    ):
        response = client.post(
            "api/v1/ratings",
            json={"username": "TestUser", "content_id": 1, "rating": 4},
        )
        data = response.json()

        assert response.status_code == 200
        assert data["id"] == 1
        assert data["user_id"] == 1
        assert data["content_id"] == 1
        assert data["rating"] == 4
        assert True == isinstance(data["created"], str)
        assert True == isinstance(data["updated"], str)
        assert data["username"] == "TestUser"
        with TestingSessionLocal() as db:
            rating = db.query(Rating).filter_by(user_id=1).one()
            assert rating.rating == 4

    def test_create_or_update_rating_without_user(self, client, create_test_content1):
        response = client.post(
            "api/v1/ratings",
            json={"username": "TestUknowUser", "content_id": 1, "rating": 4},
        )
        data = response.json()

        assert response.status_code == 404
        assert data["detail"] == "Пользователь не найден"

    def test_create_or_update_rating_without_content(self, client, create_test_user1):
        response = client.post(
            "api/v1/ratings",
            json={"username": "TestUser", "content_id": 1, "rating": 4},
        )
        data = response.json()

        assert response.status_code == 404
        assert data["detail"] == "Мероприятие не найдено"

    def test_get_content_ratings_stats(
        self,
        client,
        create_test_user1,
        create_test_user2,
        create_test_content1,
        create_test_rating_for_one_content_rait3,
        create_test_rating_for_one_content_rait5,
    ):
        response = client.get("api/v1/ratings/stats/1")
        data = response.json()

        assert response.status_code == 200
        assert data["content_id"] == 1
        assert data["average_rating"] == 4.00
        assert data["total_ratings"] == 2
        assert data["ratings_distribution"] == {"3":1, "5":1}

    def test_get_content_ratings_stats_without_rating(
        self,
        client,
        create_test_user1,
        create_test_content1,
    ):
        response = client.get("api/v1/ratings/stats/1")
        data = response.json()

        assert response.status_code == 200
        assert data["content_id"] == 1
        assert data["average_rating"] == 0.0
        assert data["total_ratings"] == 0
        assert data["ratings_distribution"] == {}

    def test_get_content_ratings_stats_without_content(
        self,
        client,
        create_test_user1,
        create_test_rating_for_one_content_rait3,
    ):
        response = client.get("api/v1/ratings/stats/1")
        data = response.json()

        assert response.status_code == 404
        assert data["detail"] == "Мероприятие не найдено"


    def test_delete_ratings(self, 
                            client,
                            create_test_user1,
                            create_test_content1,
                            create_test_rating_for_one_content_rait3 ):
        response = client.delete("api/v1/ratings/1?username=TestUser")
        data = response.json()

        assert response.status_code == 200
        assert data == {"message": "Оценка успешно удалена"}
        with TestingSessionLocal() as db:
            rating = db.query(Rating).filter_by(user_id=1).first()
            assert rating is None

    def test_delete_ratings_without_user(self, 
                            client,
                            create_test_user1,
                            create_test_content1,
                            create_test_rating_for_one_content_rait3 ):
        response = client.delete("api/v1/ratings/1?username=TestUser2")
        data = response.json()

        assert response.status_code == 404
        assert data["detail"] == "Пользователь не найден"



    def test_get_user_ratings(self,
                              client,
                              create_test_user1,
                              create_test_user2,
                              create_test_content1,
                              create_test_content2, 
                              create_test_rating_for_one_content_rait3,
                              create_test_rating_for_second_content_rait3

):
        """
        Состояние базы перед тестом: создано 2 контента,  первому оценка 3 от 
        пользователя второму оценка 3
        """
        response = client.get("api/v1/users/TestUser/ratings?limit=10&skip=1")
        data = response.json()

        assert response.status_code == 200
