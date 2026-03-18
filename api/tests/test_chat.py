from fastapi.testclient import TestClient
from api.index import app

client = TestClient(app)


def test_chat_endpoint():
    response = client.post("/api/chat", json={"message": "What are your skills?"})
    assert response.status_code == 200
    data = response.json()
    assert "response" in data
    assert len(data["response"]) > 0
