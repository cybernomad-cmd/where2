import os


class Config:
    SECRET_KEY = os.getenv(
        "SECRET_KEY",
        "development-secret-key",
    )

    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        "postgresql://postgres:postgres@localhost:5432/focusflow",
    )

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    CLIENT_URL = os.getenv(
        "CLIENT_URL",
        "http://localhost:5173",
    )