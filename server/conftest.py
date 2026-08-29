import os

# Use a separate SQLite database for automated tests.
# This prevents pytest from modifying the development PostgreSQL database.
os.environ["DATABASE_URL"] = "sqlite:///:memory:"

import pytest

from app import create_app, db
from app.models import User


@pytest.fixture()
def app():
    app = create_app()

    app.config.update(
        TESTING=True,
        SECRET_KEY="test-secret-key",
    )

    with app.app_context():
        db.create_all()

        yield app

        db.session.remove()
        db.drop_all()


@pytest.fixture()
def client(app):
    return app.test_client()


@pytest.fixture()
def user_a(app):
    with app.app_context():
        user = User(
            username="testuser_a",
            email="usera@test.com",
        )
        user.set_password("Password123!")

        db.session.add(user)
        db.session.commit()

        return {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "password": "Password123!",
        }


@pytest.fixture()
def user_b(app):
    with app.app_context():
        user = User(
            username="testuser_b",
            email="userb@test.com",
        )
        user.set_password("Password123!")

        db.session.add(user)
        db.session.commit()

        return {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "password": "Password123!",
        }


def login(client, email, password):
    response = client.post(
        "/api/auth/login",
        json={
            "email": email,
            "password": password,
        },
    )

    assert response.status_code == 200

    return response