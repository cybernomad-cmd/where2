from app import create_app


app = create_app()


with app.test_client() as client:
    # ---------------------------------------------------------
    # Create/login as User A
    # ---------------------------------------------------------

    email_a = input("User A email: ")
    password_a = input("User A password: ")

    login_a = client.post(
        "/api/auth/login",
        json={
            "email": email_a,
            "password": password_a,
        },
    )

    print("\nUSER A LOGIN")
    print("Status:", login_a.status_code)

    if login_a.status_code != 200:
        print(login_a.get_json())
        raise SystemExit("User A login failed.")

    user_a = login_a.get_json()["user"]

    print("User A:", user_a)

    # ---------------------------------------------------------
    # Create a project owned by User A
    # ---------------------------------------------------------

    create_a = client.post(
        "/api/projects",
        json={
            "name": "User A Private Project",
            "description": "This project belongs to User A.",
            "status": "active",
        },
    )

    print("\nUSER A PROJECT")
    print("Status:", create_a.status_code)
    print("Response:", create_a.get_json())

    if create_a.status_code != 201:
        raise SystemExit("User A project creation failed.")

    project_a = create_a.get_json()["project"]
    project_a_id = project_a["id"]

    # ---------------------------------------------------------
    # Logout User A
    # ---------------------------------------------------------

    client.post("/api/auth/logout")

    # ---------------------------------------------------------
    # Create/login as User B
    # ---------------------------------------------------------

    email_b = input("\nUser B email: ")
    password_b = input("User B password: ")

    login_b = client.post(
        "/api/auth/login",
        json={
            "email": email_b,
            "password": password_b,
        },
    )

    print("\nUSER B LOGIN")
    print("Status:", login_b.status_code)

    if login_b.status_code != 200:
        print(login_b.get_json())
        raise SystemExit("User B login failed.")

    user_b = login_b.get_json()["user"]

    print("User B:", user_b)

    # ---------------------------------------------------------
    # User B tries to GET User A's project
    # ---------------------------------------------------------

    get_other_project = client.get(
        f"/api/projects/{project_a_id}"
    )

    print("\nUSER B GET USER A PROJECT")
    print("Status:", get_other_project.status_code)
    print("Response:", get_other_project.get_json())

    # ---------------------------------------------------------
    # User B tries to UPDATE User A's project
    # ---------------------------------------------------------

    update_other_project = client.patch(
        f"/api/projects/{project_a_id}",
        json={
            "name": "HACKED PROJECT",
        },
    )

    print("\nUSER B UPDATE USER A PROJECT")
    print("Status:", update_other_project.status_code)
    print("Response:", update_other_project.get_json())

    # ---------------------------------------------------------
    # User B tries to DELETE User A's project
    # ---------------------------------------------------------

    delete_other_project = client.delete(
        f"/api/projects/{project_a_id}"
    )

    print("\nUSER B DELETE USER A PROJECT")
    print("Status:", delete_other_project.status_code)
    print("Response:", delete_other_project.get_json())

    # ---------------------------------------------------------
    # User B's project list should not contain User A's project
    # ---------------------------------------------------------

    list_projects = client.get(
        "/api/projects?page=1&per_page=10"
    )

    print("\nUSER B PROJECT LIST")
    print("Status:", list_projects.status_code)
    print("Response:", list_projects.get_json())