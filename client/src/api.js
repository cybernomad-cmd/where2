const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";


async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.error || `Request failed with status ${response.status}.`
    );
  }

  return data;
}


/* =========================================================
   AUTHENTICATION
========================================================= */

export async function getCurrentUser() {
  const data = await request("/api/auth/me");

  return data.user;
}


export async function login(email, password) {
  const data = await request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });

  return data.user;
}


export async function signup(username, email, password) {
  const data = await request("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({
      username,
      email,
      password,
    }),
  });

  return data.user;
}


export async function logout() {
  return request("/api/auth/logout", {
    method: "POST",
  });
}


/* =========================================================
   PROJECTS
========================================================= */

export async function getProjects(page = 1, perPage = 10) {
  return request(
    `/api/projects?page=${page}&per_page=${perPage}`
  );
}


export async function getProject(projectId) {
  return request(
    `/api/projects/${projectId}`
  );
}


export async function createProject({
  name,
  description = "",
  status = "active",
}) {
  return request("/api/projects", {
    method: "POST",
    body: JSON.stringify({
      name,
      description,
      status,
    }),
  });
}


export async function updateProject(
  projectId,
  updates
) {
  return request(
    `/api/projects/${projectId}`,
    {
      method: "PATCH",
      body: JSON.stringify(updates),
    }
  );
}


export async function deleteProject(projectId) {
  return request(
    `/api/projects/${projectId}`,
    {
      method: "DELETE",
    }
  );
}


/* =========================================================
   TASKS
========================================================= */

export async function getTasks(
  projectId,
  page = 1,
  perPage = 10
) {
  return request(
    `/api/projects/${projectId}/tasks?page=${page}&per_page=${perPage}`
  );
}


export async function getTask(taskId) {
  return request(
    `/api/tasks/${taskId}`
  );
}


export async function createTask(
  projectId,
  {
    title,
    description = "",
  }
) {
  return request(
    `/api/projects/${projectId}/tasks`,
    {
      method: "POST",
      body: JSON.stringify({
        title,
        description,
      }),
    }
  );
}


export async function updateTask(
  taskId,
  updates
) {
  return request(
    `/api/tasks/${taskId}`,
    {
      method: "PATCH",
      body: JSON.stringify(updates),
    }
  );
}


export async function deleteTask(taskId) {
  return request(
    `/api/tasks/${taskId}`,
    {
      method: "DELETE",
    }
  );
}

/* =========================================================
   SAVED CITIES
========================================================= */

export async function getSavedCities() {
  return request("/api/saved-cities");
}


export async function getSavedCity(savedCityId) {
  return request(
    `/api/saved-cities/${savedCityId}`
  );
}


export async function createSavedCity({
  city_name,
  country,
  region = "",
  latitude,
  longitude,
}) {
  return request("/api/saved-cities", {
    method: "POST",
    body: JSON.stringify({
      city_name,
      country,
      region,
      latitude,
      longitude,
    }),
  });
}


export async function updateSavedCity(
  savedCityId,
  updates
) {
  return request(
    `/api/saved-cities/${savedCityId}`,
    {
      method: "PATCH",
      body: JSON.stringify(updates),
    }
  );
}


export async function deleteSavedCity(
  savedCityId
) {
  return request(
    `/api/saved-cities/${savedCityId}`,
    {
      method: "DELETE",
    }
  );
}