import os

from dotenv import load_dotenv
from flask import Flask, app
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy


load_dotenv()


db = SQLAlchemy()
bcrypt = Bcrypt()


class Config:
    SECRET_KEY = os.getenv(
        "SECRET_KEY",
        "development-secret-key",
    )

    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        "postgresql://postgres:postgres@127.0.0.1:5432/focusflow",
    )

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    CLIENT_URL = os.getenv(
        "CLIENT_URL",
        "http://localhost:5173",
    )

    CLIENT_URLS = os.getenv(
        "CLIENT_URLS",
        "http://localhost:5173,http://localhost:5174",
    )

    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = "Lax"
    SESSION_COOKIE_SECURE = False


def create_app():
    app = Flask(__name__)

    app.config.from_object(Config)

    db.init_app(app)
    bcrypt.init_app(app)

    # Import models so SQLAlchemy knows about all
    # database tables and relationships.
    from .models import Project, SavedCity, Task, User

    # Register API blueprints.
    from .routes.auth import auth_bp
    from .routes.projects import projects_bp
    from .routes.saved_cities import saved_cities_bp
    from .routes.tasks import tasks_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(projects_bp)
    app.register_blueprint(saved_cities_bp)
    app.register_blueprint(tasks_bp)

    CORS(
        app,
        supports_credentials=True,
        origins=[
            origin.strip()
            for origin in app.config["CLIENT_URLS"].split(",")
            if origin.strip()
        ] or [app.config["CLIENT_URL"]],
    )

    @app.get("/api/health")
    def health_check():
        return {
            "status": "ok",
            "message": "FocusFlow API is running.",
        }, 200

    return app