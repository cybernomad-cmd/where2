from conftest import login


def test_task_ownership_protection(
    client,
    user_a,
    user_b,
):
    # ---------------------------------------------------------
    # USER A LOGIN
    # ---------------------------------------------------------

    login(
        client,
        user_a["email"],
        user_a["password"],
    )

    # ---------------------------------------------------------
    # USER A CREATES PROJECT
    # ---------------------------------------------------------

    project_response = client.post(
        "/api/projects",
        json={
            "name": "Private Task Project",
            "description": "Temporary ownership test project.",
            "status": "active",
        },
    )

    assert project_response.status_code == 201

    project_id = project_response.get_json()["project"]["id"]

    # ---------------------------------------------------------
    # USER A CREATES TASK
    # ---------------------------------------------------------

    task_response = client.post(
        f"/api/projects/{project_id}/tasks",
        json={
            "title": "Private User A Task",
            "description": "This task belongs to User A.",
        },
    )

    assert task_response.status_code == 201

    task_id = task_response.get_json()["task"]["id"]

    # ---------------------------------------------------------
    # LOGOUT USER A
    # ---------------------------------------------------------

    client.post("/api/auth/logout")

    # ---------------------------------------------------------
    # USER B LOGIN
    # ---------------------------------------------------------

    login(
        client,
        user_b["email"],
        user_b["password"],
    )

    # ---------------------------------------------------------
    # USER B CANNOT GET USER A'S TASK
    # ---------------------------------------------------------

    get_response = client.get(
        f"/api/tasks/{task_id}"
    )

    assert get_response.status_code == 404

    # ---------------------------------------------------------
    # USER B CANNOT UPDATE USER A'S TASK
    # ---------------------------------------------------------

    update_response = client.patch(
        f"/api/tasks/{task_id}",
        json={
            "title": "Unauthorized Update",
            "completed": True,
        },
    )

    assert update_response.status_code == 404

    # ---------------------------------------------------------
    # USER B CANNOT DELETE USER A'S TASK
    # ---------------------------------------------------------

    delete_response = client.delete(
        f"/api/tasks/{task_id}"
    )

    assert delete_response.status_code == 404

    # ---------------------------------------------------------
    # USER B CANNOT LIST USER A'S PROJECT TASKS
    # ---------------------------------------------------------

    list_response = client.get(
        f"/api/projects/{project_id}/tasks"
    )

    assert list_response.status_code == 404