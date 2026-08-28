from flask import Blueprint, jsonify, request, session

from app import db
from app.models import SavedCity
from app.utils.auth import login_required


saved_cities_bp = Blueprint(
    "saved_cities",
    __name__,
    url_prefix="/api/saved-cities",
)


@saved_cities_bp.post("")
@login_required
def create_saved_city():
    data = request.get_json(silent=True) or {}

    city_name = str(
        data.get("city_name", "")
    ).strip()

    country = str(
        data.get("country", "")
    ).strip()

    region = str(
        data.get("region", "")
    ).strip()

    if not city_name:
        return jsonify(
            {
                "error": "City name is required."
            }
        ), 400

    if not country:
        return jsonify(
            {
                "error": "Country is required."
            }
        ), 400

    try:
        latitude = float(data["latitude"])
        longitude = float(data["longitude"])
    except (KeyError, TypeError, ValueError):
        return jsonify(
            {
                "error": (
                    "Latitude and longitude "
                    "must be valid numbers."
                )
            }
        ), 400

    if not -90 <= latitude <= 90:
        return jsonify(
            {
                "error": (
                    "Latitude must be between "
                    "-90 and 90."
                )
            }
        ), 400

    if not -180 <= longitude <= 180:
        return jsonify(
            {
                "error": (
                    "Longitude must be between "
                    "-180 and 180."
                )
            }
        ), 400

    saved_city = SavedCity(
        city_name=city_name,
        country=country,
        region=region or None,
        latitude=latitude,
        longitude=longitude,
        user_id=session["user_id"],
    )

    db.session.add(saved_city)
    db.session.commit()

    return jsonify(
        {
            "message": "City saved successfully.",
            "saved_city": saved_city.to_dict(),
        }
    ), 201


@saved_cities_bp.get("")
@login_required
def get_saved_cities():
    user_id = session["user_id"]

    saved_cities = (
        SavedCity.query
        .filter_by(user_id=user_id)
        .order_by(SavedCity.created_at.desc())
        .all()
    )

    return jsonify(
        {
            "saved_cities": [
                saved_city.to_dict()
                for saved_city in saved_cities
            ]
        }
    ), 200


@saved_cities_bp.get("/<int:saved_city_id>")
@login_required
def get_saved_city(saved_city_id):
    user_id = session["user_id"]

    saved_city = (
        SavedCity.query
        .filter_by(
            id=saved_city_id,
            user_id=user_id,
        )
        .first()
    )

    if saved_city is None:
        return jsonify(
            {
                "error": "Saved city not found."
            }
        ), 404

    return jsonify(
        {
            "saved_city": saved_city.to_dict()
        }
    ), 200


@saved_cities_bp.patch("/<int:saved_city_id>")
@login_required
def update_saved_city(saved_city_id):
    user_id = session["user_id"]

    saved_city = (
        SavedCity.query
        .filter_by(
            id=saved_city_id,
            user_id=user_id,
        )
        .first()
    )

    if saved_city is None:
        return jsonify(
            {
                "error": "Saved city not found."
            }
        ), 404

    data = request.get_json(silent=True) or {}

    if "city_name" in data:
        city_name = str(
            data["city_name"]
        ).strip()

        if not city_name:
            return jsonify(
                {
                    "error": (
                        "City name cannot be empty."
                    )
                }
            ), 400

        saved_city.city_name = city_name

    if "country" in data:
        country = str(
            data["country"]
        ).strip()

        if not country:
            return jsonify(
                {
                    "error": (
                        "Country cannot be empty."
                    )
                }
            ), 400

        saved_city.country = country

    if "region" in data:
        region = str(
            data["region"]
        ).strip()

        saved_city.region = region or None

    if "latitude" in data:
        try:
            latitude = float(data["latitude"])
        except (TypeError, ValueError):
            return jsonify(
                {
                    "error": (
                        "Latitude must be a "
                        "valid number."
                    )
                }
            ), 400

        if not -90 <= latitude <= 90:
            return jsonify(
                {
                    "error": (
                        "Latitude must be between "
                        "-90 and 90."
                    )
                }
            ), 400

        saved_city.latitude = latitude

    if "longitude" in data:
        try:
            longitude = float(
                data["longitude"]
            )
        except (TypeError, ValueError):
            return jsonify(
                {
                    "error": (
                        "Longitude must be a "
                        "valid number."
                    )
                }
            ), 400

        if not -180 <= longitude <= 180:
            return jsonify(
                {
                    "error": (
                        "Longitude must be between "
                        "-180 and 180."
                    )
                }
            ), 400

        saved_city.longitude = longitude

    db.session.commit()

    return jsonify(
        {
            "message": "Saved city updated successfully.",
            "saved_city": saved_city.to_dict(),
        }
    ), 200


@saved_cities_bp.delete("/<int:saved_city_id>")
@login_required
def delete_saved_city(saved_city_id):
    user_id = session["user_id"]

    saved_city = (
        SavedCity.query
        .filter_by(
            id=saved_city_id,
            user_id=user_id,
        )
        .first()
    )

    if saved_city is None:
        return jsonify(
            {
                "error": "Saved city not found."
            }
        ), 404

    db.session.delete(saved_city)
    db.session.commit()

    return jsonify(
        {
            "message": "Saved city deleted successfully."
        }
    ), 200