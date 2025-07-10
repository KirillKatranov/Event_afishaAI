from models import Review
from tests.conftest import TestingSessionLocal


class TestReviews:
    def test_create_review(
        self,
        client,
        create_test_user1,
        create_test_content1,
    ):
        response = client.post(
            "/api/v1/reviews",
            json={"username": "TestUser", "content_id": 1, "text": "TestTextReview"},
        )
        data = response.json()

        assert response.status_code == 201
        assert data["id"] == 1
        assert data["user_id"] == 1
        assert data["content_id"] == 1
        assert data["text"] == "TestTextReview"
        assert data["username"] == "TestUser"
        assert isinstance(data["created"], str) == True
        assert isinstance(data["updated"], str) == True

    def test_create_review_without_user(self, client, create_test_content1):
        response = client.post(
            "/api/v1/reviews",
            json={"username": "TestUser", "content_id": 1, "text": "TestTextReview"},
        )
        data = response.json()

        assert response.status_code == 404
        assert data["detail"] == "User not found"

    def test_create_review_without_content(self, client, create_test_user1):
        response = client.post(
            "/api/v1/reviews",
            json={"username": "TestUser", "content_id": 1, "text": "TestTextReview"},
        )
        data = response.json()

        assert response.status_code == 404
        assert data["detail"] == "Content not found"

    def test_delete_review(self, client, create_test_user1, create_test_review):
        response = client.delete("/api/v1/reviews/1?username=TestUser")

        assert response.status_code == 204
        with TestingSessionLocal() as db:
            review = db.query(Review).first()
            assert review is None

    def test_delete_review_without_user(self, client):
        response = client.delete("/api/v1/reviews/1?username=TestUser")
        data = response.json()

        assert response.status_code == 404
        assert data["detail"] == "User not found"

    def test_delete_review_without_review(self, client, create_test_user1):
        response = client.delete("/api/v1/reviews/1?username=TestUser")
        data = response.json()

        assert response.status_code == 404
        assert (
            data["detail"]
            == "Review not found or you don't have permission to delete it"
        )

    def test_get_reviews_for_content_default_pagination(
        self,
        client,
        create_test_user1,
        create_test_user2,
        create_test_content1,
        create_test_review_for_one_content_by_user1,
        create_test_review_for_one_content_by_user2,
    ):
        response = client.get("/api/v1/reviews?content_id=1")
        data = response.json()
        
        assert response.status_code == 200
        assert data["total_count"] == 2
        assert len(data["reviews"]) == 2
        assert all(r["content_id"] == 1 for r in data["reviews"])

    
    def test_get_reviews_for_content_with_limit_and_skip(
        self,
        client,
        create_test_user1,
        create_test_user2,
        create_test_content1,
        create_test_review_for_one_content_by_user1,
        create_test_review_for_one_content_by_user2,
    ):
        response = client.get("/api/v1/reviews?content_id=1&limit=1&skip=1")
        data = response.json()
        
        assert response.status_code == 200
        assert data["total_count"] == 2
        assert len(data["reviews"]) == 1
        assert data["reviews"][0]["text"] == "TestTextReview"

    def test_get_reviews_for_content_with_skip_beyond(
        self,
        client,
        create_test_user1,
        create_test_user2,
        create_test_content1,
        create_test_review_for_one_content_by_user1,
        create_test_review_for_one_content_by_user2,
    ):
        """Если skip больше количества записей, список пустой."""
        response = client.get("/api/v1/reviews?content_id=1&skip=5")
        data = response.json()
        
        assert response.status_code == 200
        assert data["total_count"] == 2
        assert data["reviews"] == []

    def test_get_reviews_for_content_without_content(self, client):
        response = client.get("/api/v1/reviews?content_id=1")
        data = response.json()

        assert response.status_code == 404
        assert data["detail"] == "Content not found"


    def test_get_user_reviews_default_pagination(self, client, 
                                      create_test_user1,
                                      create_test_content1,
                                      create_test_content2,
                                      create_test_review_for_one_content_by_user1,
                                      create_test_review_for_second_content_by_user1
                                      ):
        response = client.get("/api/v1/users/TestUser/reviews")
        data = response.json()

        assert response.status_code == 200
        assert data['total_count'] == 2
        assert len(data["reviews"]) == 2
        assert all([r["username"] == "TestUser" for r in data["reviews"]])


    def test_get_user_reviews_default_pagination_without_user(self, client):
        response = client.get("/api/v1/users/TestUser/reviews")
        data = response.json() 

        assert response.status_code == 404
        assert data["detail"] == "User not found"

    def test_get_user_reviews_wirh_skip_limit(self, client,
                                      create_test_user1,
                                      create_test_content1,
                                      create_test_content2,
                                      create_test_review_for_one_content_by_user1,
                                      create_test_review_for_second_content_by_user1):
        response = client.get("/api/v1/users/TestUser/reviews?skip=1&limit=1")
        data = response.json()

        assert response.status_code == 200
        assert data['total_count'] == 2
        assert len(data["reviews"]) == 1
        assert data["reviews"][0]["username"] == "TestUser"
        assert data["reviews"][0]["text"] == "TestTextReview"

    def test_get_user_reviews_with_skip_beyond(self, client,
                                      create_test_user1,
                                      create_test_content1,
                                      create_test_content2,
                                      create_test_review_for_one_content_by_user1,
                                      create_test_review_for_second_content_by_user1):
        response = client.get("/api/v1/users/TestUser/reviews?skip=5")
        data = response.json()

        assert response.status_code == 200
        assert data['total_count'] == 2
        assert len(data["reviews"]) == 0
        assert data["reviews"] == []


