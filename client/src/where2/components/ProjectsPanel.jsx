import { useEffect, useState } from "react";
import {
  ArrowRight,
  Check,
  FolderKanban,
  LoaderCircle,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
} from "../../api";

import "./ProjectsPanel.css";
function ProjectsPanel() {
  const [projects, setProjects] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    has_next: false,
    has_prev: false,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    status: "active",
  });

  const [submitting, setSubmitting] = useState(false);

  const [editingProjectId, setEditingProjectId] = useState(null);

  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    status: "active",
  });

  const [deletingProjectId, setDeletingProjectId] = useState(null);

/* =========================================================
   LOAD PROJECTS
========================================================= */

async function loadProjects(page = 1) {
  try {
    setLoading(true);
    setError("");

    const data = await getProjects(page, 6);

    setProjects(data.projects || []);

    setPagination(
      data.pagination || {
        page: 1,
        pages: 1,
        total: 0,
        has_next: false,
        has_prev: false,
      }
    );
  } catch (requestError) {
    console.error("Failed to load projects:", requestError);

    setError(
      requestError.message ||
        "Unable to load your projects."
    );
  } finally {
    setLoading(false);
  }
}

useEffect(() => {
  // eslint-disable-next-line react-hooks/set-state-in-effect
  loadProjects();
}, []);


  /* =========================================================
     CREATE PROJECT
  ========================================================= */

  function handleFormChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }


  async function handleCreateProject(event) {
    event.preventDefault();

    if (!form.name.trim()) {
      setError("Project name is required.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      await createProject({
        name: form.name.trim(),
        description: form.description.trim(),
        status: form.status,
      });

      setForm({
        name: "",
        description: "",
        status: "active",
      });

      setShowForm(false);

      await loadProjects(1);
    } catch (requestError) {
      console.error(
        "Failed to create project:",
        requestError
      );

      setError(
        requestError.message ||
          "Unable to create the project."
      );
    } finally {
      setSubmitting(false);
    }
  }


  /* =========================================================
     EDIT PROJECT
  ========================================================= */

  function startEditing(project) {
    setEditingProjectId(project.id);

    setEditForm({
      name: project.name || "",
      description: project.description || "",
      status: project.status || "active",
    });

    setError("");
  }


  function cancelEditing() {
    setEditingProjectId(null);

    setEditForm({
      name: "",
      description: "",
      status: "active",
    });
  }


  function handleEditChange(event) {
    const { name, value } = event.target;

    setEditForm((current) => ({
      ...current,
      [name]: value,
    }));
  }


  async function handleUpdateProject(event) {
    event.preventDefault();

    if (!editForm.name.trim()) {
      setError("Project name is required.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      await updateProject(
        editingProjectId,
        {
          name: editForm.name.trim(),
          description:
            editForm.description.trim(),
          status: editForm.status,
        }
      );

      cancelEditing();

      await loadProjects(pagination.page);
    } catch (requestError) {
      console.error(
        "Failed to update project:",
        requestError
      );

      setError(
        requestError.message ||
          "Unable to update the project."
      );
    } finally {
      setSubmitting(false);
    }
  }


  /* =========================================================
     DELETE PROJECT
  ========================================================= */

  async function handleDeleteProject(projectId) {
    const confirmed = window.confirm(
      "Delete this project? Any tasks belonging to it will also be removed."
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingProjectId(projectId);
      setError("");

      await deleteProject(projectId);

      const nextPage =
        projects.length === 1 &&
        pagination.page > 1
          ? pagination.page - 1
          : pagination.page;

      await loadProjects(nextPage);
    } catch (requestError) {
      console.error(
        "Failed to delete project:",
        requestError
      );

      setError(
        requestError.message ||
          "Unable to delete the project."
      );
    } finally {
      setDeletingProjectId(null);
    }
  }


  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <section
      id="focusflow-projects"
      className="focusflow-projects"
    >
      <div className="focusflow-projects-header">
        <div>
          <p className="where2-redesign-eyebrow">
            YOUR WORKSPACE
          </p>

          <h2>Projects</h2>

          <p>
            Organize the goals, plans and tasks you are
            working toward.
          </p>
        </div>

        <button
          type="button"
          className="focusflow-projects-add-button"
          onClick={() => {
            setShowForm((current) => !current);
            setError("");
          }}
        >
          {showForm ? (
            <X size={17} />
          ) : (
            <Plus size={17} />
          )}

          <span>
            {showForm
              ? "Close"
              : "New project"}
          </span>
        </button>
      </div>


      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div
          className="focusflow-projects-error"
          role="alert"
        >
          {error}
        </div>
      )}


      {/* =====================================================
          CREATE FORM
      ===================================================== */}

      {showForm && (
        <form
          className="focusflow-project-form"
          onSubmit={handleCreateProject}
        >
          <div className="focusflow-project-form-heading">
            <FolderKanban size={20} />

            <div>
              <h3>Create a project</h3>

              <p>
                Give your project a clear name and
                describe what you want to accomplish.
              </p>
            </div>
          </div>

          <div className="focusflow-form-grid">
            <label>
              <span>Project name</span>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleFormChange}
                placeholder="e.g. Launch my portfolio"
                maxLength={120}
                required
              />
            </label>

            <label>
              <span>Status</span>

              <select
                name="status"
                value={form.status}
                onChange={handleFormChange}
              >
                <option value="active">
                  Active
                </option>

                <option value="completed">
                  Completed
                </option>

                <option value="archived">
                  Archived
                </option>
              </select>
            </label>
          </div>

          <label>
            <span>Description</span>

            <textarea
              name="description"
              value={form.description}
              onChange={handleFormChange}
              placeholder="What is this project about?"
              rows={3}
            />
          </label>

          <div className="focusflow-project-form-actions">
            <button
              type="button"
              className="focusflow-secondary-button"
              onClick={() => setShowForm(false)}
              disabled={submitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="focusflow-primary-button"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <LoaderCircle
                    size={16}
                    className="focusflow-spin"
                  />

                  Creating...
                </>
              ) : (
                <>
                  <Plus size={16} />

                  Create project
                </>
              )}
            </button>
          </div>
        </form>
      )}


      {/* =====================================================
          PROJECT LIST
      ===================================================== */}

      {loading ? (
        <div className="focusflow-projects-state">
          <LoaderCircle
            size={24}
            className="focusflow-spin"
          />

          <p>Loading your projects...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="focusflow-projects-empty">
          <div className="focusflow-empty-icon">
            <FolderKanban size={22} />
          </div>

          <h3>No projects yet</h3>

          <p>
            Create your first project to start
            organizing your work.
          </p>

          {!showForm && (
            <button
              type="button"
              className="focusflow-primary-button"
              onClick={() => setShowForm(true)}
            >
              <Plus size={16} />

              Create your first project
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="focusflow-project-grid">
            {projects.map((project) => {
              const isEditing =
                editingProjectId === project.id;

              const isDeleting =
                deletingProjectId === project.id;

              if (isEditing) {
                return (
                  <form
                    key={project.id}
                    className="focusflow-project-card focusflow-project-card-editing"
                    onSubmit={handleUpdateProject}
                  >
                    <div className="focusflow-project-edit-header">
                      <Pencil size={17} />

                      <span>
                        Edit project
                      </span>
                    </div>

                    <label>
                      <span>Project name</span>

                      <input
                        type="text"
                        name="name"
                        value={editForm.name}
                        onChange={handleEditChange}
                        maxLength={120}
                        required
                      />
                    </label>

                    <label>
                      <span>Status</span>

                      <select
                        name="status"
                        value={editForm.status}
                        onChange={handleEditChange}
                      >
                        <option value="active">
                          Active
                        </option>

                        <option value="completed">
                          Completed
                        </option>

                        <option value="archived">
                          Archived
                        </option>
                      </select>
                    </label>

                    <label>
                      <span>Description</span>

                      <textarea
                        name="description"
                        value={
                          editForm.description
                        }
                        onChange={handleEditChange}
                        rows={3}
                      />
                    </label>

                    <div className="focusflow-project-card-actions">
                      <button
                        type="button"
                        className="focusflow-secondary-button"
                        onClick={cancelEditing}
                        disabled={submitting}
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        className="focusflow-primary-button"
                        disabled={submitting}
                      >
                        {submitting ? (
                          <>
                            <LoaderCircle
                              size={15}
                              className="focusflow-spin"
                            />

                            Saving...
                          </>
                        ) : (
                          <>
                            <Check size={15} />

                            Save
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                );
              }

              return (
                <article
                  key={project.id}
                  className="focusflow-project-card"
                >
                  <div className="focusflow-project-card-top">
                    <div className="focusflow-project-icon">
                      <FolderKanban size={19} />
                    </div>

                    <span
                      className={`focusflow-project-status focusflow-status-${project.status}`}
                    >
                      {project.status}
                    </span>
                  </div>

                  <div className="focusflow-project-card-content">
                    <h3>{project.name}</h3>

                    <p>
                      {project.description ||
                        "No description provided."}
                    </p>
                  </div>

                  <div className="focusflow-project-card-footer">
                    <button
                      type="button"
                      className="focusflow-project-open"
                      onClick={() => {
                        document
                          .getElementById(
                            "focusflow-tasks"
                          )
                          ?.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                      }}
                    >
                      <span>View tasks</span>

                      <ArrowRight size={15} />
                    </button>

                    <div className="focusflow-project-actions">
                      <button
                        type="button"
                        aria-label={`Edit ${project.name}`}
                        title="Edit project"
                        onClick={() =>
                          startEditing(project)
                        }
                      >
                        <Pencil size={15} />
                      </button>

                      <button
                        type="button"
                        aria-label={`Delete ${project.name}`}
                        title="Delete project"
                        disabled={isDeleting}
                        onClick={() =>
                          handleDeleteProject(
                            project.id
                          )
                        }
                      >
                        {isDeleting ? (
                          <LoaderCircle
                            size={15}
                            className="focusflow-spin"
                          />
                        ) : (
                          <Trash2 size={15} />
                        )}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>


          {/* =================================================
              PAGINATION
          ================================================= */}

          {pagination.pages > 1 && (
            <div className="focusflow-pagination">
              <button
                type="button"
                disabled={!pagination.has_prev}
                onClick={() =>
                  loadProjects(
                    pagination.page - 1
                  )
                }
              >
                Previous
              </button>

              <span>
                Page {pagination.page} of{" "}
                {pagination.pages}
              </span>

              <button
                type="button"
                disabled={!pagination.has_next}
                onClick={() =>
                  loadProjects(
                    pagination.page + 1
                  )
                }
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default ProjectsPanel;