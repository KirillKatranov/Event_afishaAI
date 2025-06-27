
 

class TestLikes:
    def test_set_like(self, client, create_test_user, create_test_content):
        response = client.post(
            "/api/v1/like", json={"username": "TestUser", "content_id": 1}
        )
        data = response.json()
        assert response.status_code == 200
        assert data == {"user": "TestUser", "content": 1, "value": True}


    def test_set_dislike(self, client, create_test_user, create_test_content):
        response = client.post(
            "/api/v1/dislike", json={"username": "TestUser", "content_id": 1}
        )
        data = response.json()
        assert response.status_code == 200
        assert data == {"user": "TestUser", "content": 1, "value": False}


    def test_set_like_without_content(self, client, create_test_user, create_test_content):
        response = client.post(
            "/api/v1/like", json={"username": "TestUser", "content_id": 2}
        )
        data = response.json()
        assert response.status_code == 404
        assert data["detail"] == "Content not found"

    def test_set_dislike_without_content(self, client, create_test_user, create_test_content):
        response = client.post(
            "/api/v1/like", json={"username": "TestUser", "content_id": 2}
        )
        data = response.json()
        assert response.status_code == 404
        assert data["detail"] == "Content not found"