from flask import Blueprint, jsonify, request, session

from app import db
from app.models import User


auth_bp = Blueprint(
    "auth",
    __name__,
    url_prefix="/api/auth",
)


@auth_bp.post("/signup")
def signup():
    data = request.get_json(silent=True) or {}

    username = data.get("username", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not username or not email or not password:
        return jsonify(
            {
                "error": "Username, email, and password are required."
            }
        ), 400

    if len(password) < 8:
        return jsonify(
            {
                "error": "Password must be at least 8 characters."
            }
        ), 400

    existing_username = User.query.filter_by(
        username=username
    ).first()

    if existing_username:
        return jsonify(
            {
                "error": "Username is already in use."
            }
        ), 409

    existing_email = User.query.filter_by(
        email=email
    ).first()

    if existing_email:
        return jsonify(
            {
                "error": "Email is already registered."
            }
        ), 409

    user = User(
        username=username,
        email=email,
    )

    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    session.clear()
    session["user_id"] = user.id

    return jsonify(
        {
            "message": "Account created successfully.",
            "user": user.to_dict(),
        }
    ), 201


@auth_bp.post("/login")
def login():
    data = request.get_json(silent=True) or {}

    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return jsonify(
            {
                "error": "Email and password are required."
            }
        ), 400

    user = User.query.filter_by(
        email=email
    ).first()

    if user is None or not user.check_password(password):
        return jsonify(
            {
                "error": "Invalid email or password."
            }
        ), 401

    session.clear()
    session["user_id"] = user.id

    return jsonify(
        {
            "message": "Login successful.",
            "user": user.to_dict(),
        }
    ), 200


@auth_bp.get("/me")
def get_current_user():
    user_id = session.get("user_id")

    if user_id is None:
        return jsonify(
            {
                "user": None
            }
        ), 200

    user = db.session.get(User, user_id)

    if user is None:
        session.clear()

        return jsonify(
            {
                "user": None
            }
        ), 200

    return jsonify(
        {
            "user": user.to_dict()
        }
    ), 200


@auth_bp.post("/logout")
def logout():
    session.clear()

    return jsonify(
        {
            "message": "Logout successful."
        }
    ), 200