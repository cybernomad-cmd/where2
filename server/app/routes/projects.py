from flask import Blueprint, jsonify, request, session

from app import db
from app.models import Project, Task
from app.utils.auth import login_required


projects_bp = Blueprint(
    "projects",
    __name__,
    url_prefix="/api/projects",
)


@projects_bp.post("")
@login_required
def create_project():
    data = request.get_json(silent=True) or {}

    name = str(data.get("name", "")).strip()
    description = str(
        data.get("description", "")
    ).strip()
    status = str(
        data.get("status", "active")
    ).strip().lower()

    if not name:
        return jsonify(
            {
                "error": "Project name is required."
            }
        ), 400

    allowed_statuses = {
        "active",
        "completed",
        "archived",
    }

    if status not in allowed_statuses:
        return jsonify(
            {
                "error": (
                    "Status must be active, "
                    "completed, or archived."
                )
            }
        ), 400

    project = Project(
        name=name,
        description=description or None,
        status=status,
        user_id=session["user_id"],
    )

    db.session.add(project)
    db.session.commit()

    return jsonify(
        {
            "message": "Project created successfully.",
            "project": project.to_dict(),
        }
    ), 201


@projects_bp.get("")
@login_required
def get_projects():
    user_id = session["user_id"]

    try:
        page = max(
            int(request.args.get("page", 1)),
            1,
        )

        per_page = int(
            request.args.get("per_page", 10)
        )

    except (TypeError, ValueError):
        return jsonify(
            {
                "error": (
                    "page and per_page must "
                    "be valid integers."
                )
            }
        ), 400

    per_page = min(
        max(per_page, 1),
        50,
    )

    pagination = (
        Project.query
        .filter_by(user_id=user_id)
        .order_by(Project.created_at.desc())
        .paginate(
            page=page,
            per_page=per_page,
            error_out=False,
        )
    )

    return jsonify(
        {
            "projects": [
                project.to_dict()
                for project in pagination.items
            ],
            "pagination": {
                "page": pagination.page,
                "per_page": pagination.per_page,
                "total": pagination.total,
                "pages": pagination.pages,
                "has_next": pagination.has_next,
                "has_prev": pagination.has_prev,
            },
        }
    ), 200


@projects_bp.get("/<int:project_id>")
@login_required
def get_project(project_id):
    user_id = session["user_id"]

    project = (
        Project.query
        .filter_by(
            id=project_id,
            user_id=user_id,
        )
        .first()
    )

    if project is None:
        return jsonify(
            {
                "error": "Project not found."
            }
        ), 404

    return jsonify(
        {
            "project": project.to_dict(
                include_tasks=True
            )
        }
    ), 200


@projects_bp.patch("/<int:project_id>")
@login_required
def update_project(project_id):
    user_id = session["user_id"]

    project = (
        Project.query
        .filter_by(
            id=project_id,
            user_id=user_id,
        )
        .first()
    )

    if project is None:
        return jsonify(
            {
                "error": "Project not found."
            }
        ), 404

    data = request.get_json(silent=True) or {}

    if "name" in data:
        name = str(data["name"]).strip()

        if not name:
            return jsonify(
                {
                    "error": "Project name cannot be empty."
                }
            ), 400

        project.name = name

    if "description" in data:
        description = str(
            data["description"]
        ).strip()

        project.description = (
            description or None
        )

    if "status" in data:
        status = str(
            data["status"]
        ).strip().lower()

        allowed_statuses = {
            "active",
            "completed",
            "archived",
        }

        if status not in allowed_statuses:
            return jsonify(
                {
                    "error": (
                        "Status must be active, "
                        "completed, or archived."
                    )
                }
            ), 400

        project.status = status

    db.session.commit()

    return jsonify(
        {
            "message": "Project updated successfully.",
            "project": project.to_dict(),
        }
    ), 200


@projects_bp.delete("/<int:project_id>")
@login_required
def delete_project(project_id):
    user_id = session["user_id"]

    project = (
        Project.query
        .filter_by(
            id=project_id,
            user_id=user_id,
        )
        .first()
    )

    if project is None:
        return jsonify(
            {
                "error": "Project not found."
            }
        ), 404

    db.session.delete(project)
    db.session.commit()

    return jsonify(
        {
            "message": "Project deleted successfully."
        }
    ), 200