from app import create_app


app = create_app()


with app.test_client() as client:
    # ---------------------------------------------------------
    # LOGIN
    # ---------------------------------------------------------

    email = input("Login email: ")
    password = input("Login password: ")

    login_response = client.post(
        "/api/auth/login",
        json={
            "email": email,
            "password": password,
        },
    )

    print("\nLOGIN")
    print("Status:", login_response.status_code)
    print("Response:", login_response.get_json())

    if login_response.status_code != 200:
        raise SystemExit("Login failed.")

    # ---------------------------------------------------------
    # CREATE TASK
    # ---------------------------------------------------------

    project_id = int(
        input("\nProject ID for task: ")
    )

    create_response = client.post(
        f"/api/projects/{project_id}/tasks",
        json={
            "title": "Build Task Management",
            "description": "Implement and test Task CRUD functionality.",
        },
    )

    print("\nCREATE TASK")
    print("Status:", create_response.status_code)
    print("Response:", create_response.get_json())

    if create_response.status_code != 201:
        raise SystemExit("Task creation failed.")

    task = create_response.get_json()["task"]
    task_id = task["id"]

    # ---------------------------------------------------------
    # LIST TASKS
    # ---------------------------------------------------------

    list_response = client.get(
        f"/api/projects/{project_id}/tasks"
        "?page=1&per_page=10"
    )

    print("\nLIST TASKS")
    print("Status:", list_response.status_code)
    print("Response:", list_response.get_json())

    # ---------------------------------------------------------
    # GET SINGLE TASK
    # ---------------------------------------------------------

    get_response = client.get(
        f"/api/tasks/{task_id}"
    )

    print("\nGET TASK")
    print("Status:", get_response.status_code)
    print("Response:", get_response.get_json())

    # ---------------------------------------------------------
    # UPDATE TASK
    # ---------------------------------------------------------

    update_response = client.patch(
        f"/api/tasks/{task_id}",
        json={
            "title": "Build Task Management API",
            "description": "Task CRUD is being tested.",
            "completed": True,
        },
    )

    print("\nUPDATE TASK")
    print("Status:", update_response.status_code)
    print("Response:", update_response.get_json())

    # ---------------------------------------------------------
    # DELETE TASK
    # ---------------------------------------------------------

    delete_response = client.delete(
        f"/api/tasks/{task_id}"
    )

    print("\nDELETE TASK")
    print("Status:", delete_response.status_code)
    print("Response:", delete_response.get_json())

    # ---------------------------------------------------------
    # VERIFY DELETE
    # ---------------------------------------------------------

    verify_response = client.get(
        f"/api/tasks/{task_id}"
    )

    print("\nVERIFY DELETE")
    print("Status:", verify_response.status_code)
    print("Response:", verify_response.get_json())