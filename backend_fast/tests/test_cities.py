import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from fast import app

client = TestClient(app)

def test_get_cities():
    response = client.get("/")
    assert response.status_code == 200
