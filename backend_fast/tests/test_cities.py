import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))




class TestCities():
    def test_get_cities_returns_expected_list(self, client):
        #arrange 
        expected_cities = ["spb", "msk", "ekb", "nsk", "nn"]

        #act 
        response = client.get("/api/v1/cities")

        #assert
        assert response.status_code == 200
        assert response.json() == {"cities": expected_cities}


    def test_get_cities_returns_json_content_type(self, client):
        response = client.get("/api/v1/cities")

        assert response.status_code == 200
        assert response.headers["content-type"].startswith("application/json")


    def test_post_cities_not_allowed(self, client):
        response = client.post("/api/v1/cities")
        
        assert response.status_code == 405