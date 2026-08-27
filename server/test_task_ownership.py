from app import create_app


app = create_app()


with app.test_client() as client:
    # ---------------------------------------------------------
    # USER A LOGIN
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
    # CREATE A PROJECT
    # ---------------------------------------------------------

    create_project = client.post(
        "/api/projects",
        json={
            "name": "Task Ownership Test Project",
            "description": "Temporary project for ownership testing.",
            "status": "active",
        },
    )

    print("\nCREATE PROJECT")
    print("Status:", create_project.status_code)

    if create_project.status_code != 201:
        print(create_project.get_json())
        raise SystemExit("Project creation failed.")

    project = create_project.get_json()["project"]
    project_id = project["id"]

    print("Project:", project)

    # ---------------------------------------------------------
    # CREATE A TASK
    # ---------------------------------------------------------

    create_task = client.post(
        f"/api/projects/{project_id}/tasks",
        json={
            "title": "Private User A Task",
            "description": "This task belongs to User A.",
        },
    )

    print("\nCREATE USER A TASK")
    print("Status:", create_task.status_code)

    if create_task.status_code != 201:
        print(create_task.get_json())
        raise SystemExit("Task creation failed.")

    task = create_task.get_json()["task"]
    task_id = task["id"]

    print("Task:", task)

    # ---------------------------------------------------------
    # LOGOUT USER A
    # ---------------------------------------------------------

    client.post("/api/auth/logout")

    # ---------------------------------------------------------
    # USER B LOGIN
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
    # USER B GETS USER A'S TASK
    # ---------------------------------------------------------

    get_task = client.get(
        f"/api/tasks/{task_id}"
    )

    print("\nUSER B GET USER A TASK")
    print("Status:", get_task.status_code)
    print("Response:", get_task.get_json())

    # ---------------------------------------------------------
    # USER B UPDATES USER A'S TASK
    # ---------------------------------------------------------

    update_task = client.patch(
        f"/api/tasks/{task_id}",
        json={
            "title": "Unauthorized Update",
            "completed": True,
        },
    )

    print("\nUSER B UPDATE USER A TASK")
    print("Status:", update_task.status_code)
    print("Response:", update_task.get_json())

    # ---------------------------------------------------------
    # USER B DELETES USER A'S TASK
    # ---------------------------------------------------------

    delete_task = client.delete(
        f"/api/tasks/{task_id}"
    )

    print("\nUSER B DELETE USER A TASK")
    print("Status:", delete_task.status_code)
    print("Response:", delete_task.get_json())

    # ---------------------------------------------------------
    # USER B TRIES TO LIST USER A'S PROJECT TASKS
    # ---------------------------------------------------------

    list_tasks = client.get(
        f"/api/projects/{project_id}/tasks"
    )

    print("\nUSER B LIST USER A PROJECT TASKS")
    print("Status:", list_tasks.status_code)
    print("Response:", list_tasks.get_json())
    