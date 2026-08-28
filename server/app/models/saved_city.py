from datetime import datetime, timezone

from app import db


class SavedCity(db.Model):
    __tablename__ = "saved_cities"

    id = db.Column(
        db.Integer,
        primary_key=True,
    )

    city_name = db.Column(
        db.String(120),
        nullable=False,
    )

    country = db.Column(
        db.String(120),
        nullable=False,
    )

    region = db.Column(
        db.String(120),
        nullable=True,
    )

    latitude = db.Column(
        db.Float,
        nullable=False,
    )

    longitude = db.Column(
        db.Float,
        nullable=False,
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False,
        index=True,
    )

    created_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    updated_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    user = db.relationship(
        "User",
        backref=db.backref(
            "saved_cities",
            lazy=True,
            cascade="all, delete-orphan",
        ),
    )

    def to_dict(self):
        return {
            "id": self.id,
            "city_name": self.city_name,
            "country": self.country,
            "region": self.region,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "user_id": self.user_id,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }