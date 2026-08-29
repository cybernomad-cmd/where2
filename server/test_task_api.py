from conftest import login


def create_project(client):
    response = client.post(
        "/api/projects",
        json={
            "name": "Task Test Project",
            "description": "Project for task testing.",
            "status": "active",
        },
    )

    assert response.status_code == 201

    return response.get_json()["project"]["id"]


def test_task_full_crud(client, user_a):
    # ---------------------------------------------------------
    # LOGIN
    # ---------------------------------------------------------

    login(
        client,
        user_a["email"],
        user_a["password"],
    )

    # ---------------------------------------------------------
    # CREATE PROJECT
    # ---------------------------------------------------------

    project_id = create_project(client)

    # ---------------------------------------------------------
    # CREATE TASK - POST
    # ---------------------------------------------------------

    create_response = client.post(
        f"/api/projects/{project_id}/tasks",
        json={
            "title": "Build Task Management",
            "description": "Implement Task CRUD.",
        },
    )

    assert create_response.status_code == 201

    task = create_response.get_json()["task"]

    assert task["title"] == "Build Task Management"
    assert task["description"] == "Implement Task CRUD."
    assert task["completed"] is False
    assert task["project_id"] == project_id

    task_id = task["id"]

    # ---------------------------------------------------------
    # LIST TASKS - GET
    # ---------------------------------------------------------

    list_response = client.get(
        f"/api/projects/{project_id}/tasks"
        "?page=1&per_page=10"
    )

    assert list_response.status_code == 200

    list_data = list_response.get_json()

    assert "tasks" in list_data
    assert "pagination" in list_data
    assert list_data["pagination"]["page"] == 1

    assert any(
        item["id"] == task_id
        for item in list_data["tasks"]
    )

    # ---------------------------------------------------------
    # GET SINGLE TASK
    # ---------------------------------------------------------

    get_response = client.get(
        f"/api/tasks/{task_id}"
    )

    assert get_response.status_code == 200

    fetched_task = get_response.get_json()["task"]

    assert fetched_task["id"] == task_id
    assert fetched_task["title"] == "Build Task Management"

    # ---------------------------------------------------------
    # UPDATE TASK - PATCH
    # ---------------------------------------------------------

    update_response = client.patch(
        f"/api/tasks/{task_id}",
        json={
            "title": "Build Task Management API",
            "description": "Task CRUD is being tested.",
            "completed": True,
        },
    )

    assert update_response.status_code == 200

    updated_task = update_response.get_json()["task"]

    assert updated_task["title"] == "Build Task Management API"
    assert updated_task["description"] == "Task CRUD is being tested."
    assert updated_task["completed"] is True

    # ---------------------------------------------------------
    # DELETE TASK
    # ---------------------------------------------------------

    delete_response = client.delete(
        f"/api/tasks/{task_id}"
    )

    assert delete_response.status_code == 200

    # ---------------------------------------------------------
    # VERIFY DELETE
    # ---------------------------------------------------------

    verify_response = client.get(
        f"/api/tasks/{task_id}"
    )

    assert verify_response.status_code == 404


def test_task_requires_authentication(client):
    response = client.get("/api/tasks/1")

    assert response.status_code in (401, 403)


def test_task_validation(client, user_a):
    login(
        client,
        user_a["email"],
        user_a["password"],
    )

    project_id = create_project(client)

    response = client.post(
        f"/api/projects/{project_id}/tasks",
        json={
            "title": "",
        },
    )

    assert response.status_code == 400