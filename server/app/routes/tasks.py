from flask import Blueprint, jsonify, request, session

from app import db
from app.models import Project, Task
from app.utils.auth import login_required


tasks_bp = Blueprint(
    "tasks",
    __name__,
    url_prefix="/api",
)


def get_owned_project(project_id):
    """Return a project only when it belongs to the logged-in user."""
    user_id = session.get("user_id")

    return Project.query.filter_by(
        id=project_id,
        user_id=user_id,
    ).first()


def get_owned_task(task_id):
    """Return a task only when its parent project belongs to the logged-in user."""
    user_id = session.get("user_id")

    return (
        Task.query
        .join(Project)
        .filter(
            Task.id == task_id,
            Project.user_id == user_id,
        )
        .first()
    )


@tasks_bp.post("/projects/<int:project_id>/tasks")
@login_required
def create_task(project_id):
    project = get_owned_project(project_id)

    if project is None:
        return jsonify(
            {
                "error": "Project not found.",
            }
        ), 404

    data = request.get_json(silent=True) or {}

    title = data.get("title", "").strip()
    description = data.get("description")

    if not title:
        return jsonify(
            {
                "error": "Task title is required.",
            }
        ), 400

    if description is not None:
        description = str(description).strip()

    task = Task(
        title=title,
        description=description,
        project_id=project.id,
    )

    db.session.add(task)
    db.session.commit()

    return jsonify(
        {
            "message": "Task created successfully.",
            "task": task.to_dict(),
        }
    ), 201


@tasks_bp.get("/projects/<int:project_id>/tasks")
@login_required
def list_tasks(project_id):
    project = get_owned_project(project_id)

    if project is None:
        return jsonify(
            {
                "error": "Project not found.",
            }
        ), 404

    try:
        page = max(
            int(request.args.get("page", 1)),
            1,
        )

        per_page = min(
            max(
                int(request.args.get("per_page", 10)),
                1,
            ),
            100,
        )
    except (TypeError, ValueError):
        return jsonify(
            {
                "error": "page and per_page must be valid integers.",
            }
        ), 400

    pagination = (
        Task.query
        .filter_by(project_id=project.id)
        .order_by(Task.created_at.desc())
        .paginate(
            page=page,
            per_page=per_page,
            error_out=False,
        )
    )

    return jsonify(
        {
            "tasks": [
                task.to_dict()
                for task in pagination.items
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


@tasks_bp.get("/tasks/<int:task_id>")
@login_required
def get_task(task_id):
    task = get_owned_task(task_id)

    if task is None:
        return jsonify(
            {
                "error": "Task not found.",
            }
        ), 404

    return jsonify(
        {
            "task": task.to_dict(),
        }
    ), 200


@tasks_bp.patch("/tasks/<int:task_id>")
@login_required
def update_task(task_id):
    task = get_owned_task(task_id)

    if task is None:
        return jsonify(
            {
                "error": "Task not found.",
            }
        ), 404

    data = request.get_json(silent=True) or {}

    if "title" in data:
        title = str(data.get("title", "")).strip()

        if not title:
            return jsonify(
                {
                    "error": "Task title cannot be empty.",
                }
            ), 400

        task.title = title

    if "description" in data:
        description = data.get("description")

        if description is None:
            task.description = None
        else:
            task.description = str(description).strip()

    if "completed" in data:
        completed = data.get("completed")

        if not isinstance(completed, bool):
            return jsonify(
                {
                    "error": "completed must be a boolean.",
                }
            ), 400

        task.completed = completed

    db.session.commit()

    return jsonify(
        {
            "message": "Task updated successfully.",
            "task": task.to_dict(),
        }
    ), 200


@tasks_bp.delete("/tasks/<int:task_id>")
@login_required
def delete_task(task_id):
    task = get_owned_task(task_id)

    if task is None:
        return jsonify(
            {
                "error": "Task not found.",
            }
        ), 404

    db.session.delete(task)
    db.session.commit()

    return jsonify(
        {
            "message": "Task deleted successfully.",
        }
    ), 200