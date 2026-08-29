from app import db
from app.models import Project

from conftest import login


def test_project_full_crud(client, user_a):
    # ---------------------------------------------------------
    # LOGIN
    # ---------------------------------------------------------

    login_response = login(
        client,
        user_a["email"],
        user_a["password"],
    )

    assert login_response.get_json()["user"]["email"] == user_a["email"]

    # ---------------------------------------------------------
    # CREATE PROJECT - POST
    # ---------------------------------------------------------

    create_response = client.post(
        "/api/projects",
        json={
            "name": "My Test Project",
            "description": "Testing project CRUD.",
            "status": "active",
        },
    )

    assert create_response.status_code == 201

    project = create_response.get_json()["project"]

    assert project["name"] == "My Test Project"
    assert project["description"] == "Testing project CRUD."
    assert project["status"] == "active"
    assert project["user_id"] == user_a["id"]

    project_id = project["id"]

    # ---------------------------------------------------------
    # GET PROJECT LIST
    # ---------------------------------------------------------

    list_response = client.get(
        "/api/projects?page=1&per_page=10"
    )

    assert list_response.status_code == 200

    list_data = list_response.get_json()

    assert "projects" in list_data
    assert "pagination" in list_data
    assert list_data["pagination"]["page"] == 1

    assert any(
        item["id"] == project_id
        for item in list_data["projects"]
    )

    # ---------------------------------------------------------
    # GET SINGLE PROJECT
    # ---------------------------------------------------------

    get_response = client.get(
        f"/api/projects/{project_id}"
    )

    assert get_response.status_code == 200

    fetched_project = get_response.get_json()["project"]

    assert fetched_project["id"] == project_id
    assert fetched_project["name"] == "My Test Project"

    # ---------------------------------------------------------
    # UPDATE PROJECT - PATCH
    # ---------------------------------------------------------

    update_response = client.patch(
        f"/api/projects/{project_id}",
        json={
            "name": "Updated Test Project",
            "description": "Updated description.",
            "status": "completed",
        },
    )

    assert update_response.status_code == 200

    updated_project = update_response.get_json()["project"]

    assert updated_project["name"] == "Updated Test Project"
    assert updated_project["description"] == "Updated description."
    assert updated_project["status"] == "completed"

    # ---------------------------------------------------------
    # DELETE PROJECT - DELETE
    # ---------------------------------------------------------

    delete_response = client.delete(
        f"/api/projects/{project_id}"
    )

    assert delete_response.status_code == 200

    # ---------------------------------------------------------
    # VERIFY DELETE
    # ---------------------------------------------------------

    verify_response = client.get(
        f"/api/projects/{project_id}"
    )

    assert verify_response.status_code == 404


def test_project_requires_authentication(client):
    response = client.get("/api/projects")

    assert response.status_code in (401, 403)


def test_project_validation(client, user_a):
    login(
        client,
        user_a["email"],
        user_a["password"],
    )

    response = client.post(
        "/api/projects",
        json={
            "name": "",
            "description": "Invalid project",
            "status": "active",
        },
    )

    assert response.status_code == 400


def test_project_ownership(
    client,
    app,
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

    create_response = client.post(
        "/api/projects",
        json={
            "name": "Private User A Project",
            "description": "This belongs to User A.",
            "status": "active",
        },
    )

    assert create_response.status_code == 201

    project_id = create_response.get_json()["project"]["id"]

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
    # USER B CANNOT GET PROJECT
    # ---------------------------------------------------------

    get_response = client.get(
        f"/api/projects/{project_id}"
    )

    assert get_response.status_code == 404

    # ---------------------------------------------------------
    # USER B CANNOT UPDATE PROJECT
    # ---------------------------------------------------------

    update_response = client.patch(
        f"/api/projects/{project_id}",
        json={
            "name": "HACKED PROJECT",
        },
    )

    assert update_response.status_code == 404

    # ---------------------------------------------------------
    # USER B CANNOT DELETE PROJECT
    # ---------------------------------------------------------

    delete_response = client.delete(
        f"/api/projects/{project_id}"
    )

    assert delete_response.status_code == 404

    # ---------------------------------------------------------
    # USER B PROJECT LIST DOES NOT SHOW USER A PROJECT
    # ---------------------------------------------------------

    list_response = client.get(
        "/api/projects?page=1&per_page=10"
    )

    assert list_response.status_code == 200

    projects = list_response.get_json()["projects"]

    assert all(
        project["id"] != project_id
        for project in projects
    )

    # ---------------------------------------------------------
    # CONFIRM PROJECT STILL EXISTS IN DATABASE
    # ---------------------------------------------------------

    with app.app_context():
        project = db.session.get(Project, project_id)

        assert project is not None
        assert project.user_id == user_a["id"]
        assert project.name == "Private User A Project"