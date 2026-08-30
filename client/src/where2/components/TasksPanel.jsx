import { useEffect, useState } from "react";
import {
  Check,
  CheckCircle2,
  Circle,
  LoaderCircle,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from "../../api";


function TasksPanel({ project, onBack }) {
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 10,
    total: 0,
    pages: 0,
    has_next: false,
    has_prev: false,
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
  });

  const [editingTaskId, setEditingTaskId] = useState(null);

  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
  });

  const [deletingTaskId, setDeletingTaskId] = useState(null);


  async function loadTasks(page = 1) {
    if (!project?.id) {
      setTasks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await getTasks(project.id, page, 10);

      setTasks(data.tasks || []);
      setPagination(
        data.pagination || {
          page: 1,
          per_page: 10,
          total: 0,
          pages: 0,
          has_next: false,
          has_prev: false,
        }
      );
    } catch (err) {
      console.error("Failed to load tasks:", err);
      setError(
        err.message || "Unable to load tasks. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }


useEffect(() => {
  let cancelled = false;

  async function fetchTasks() {
    if (!project?.id) {
      return;
    }

    try {
      const data = await getTasks(project.id, 1, 10);

      if (cancelled) {
        return;
      }

      setTasks(data.tasks || []);

      setPagination(
        data.pagination || {
          page: 1,
          pages: 1,
          total: 0,
          has_next: false,
          has_prev: false,
        }
      );

      setError("");
    } catch (requestError) {
      if (cancelled) {
        return;
      }

      console.error("Failed to load tasks:", requestError);
      setError(
        requestError.message || "Failed to load tasks."
      );
    } finally {
      if (!cancelled) {
        setLoading(false);
      }
    }
  }

  fetchTasks();

  return () => {
    cancelled = true;
  };
}, [project?.id]);


  function handleFormChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }


  function handleEditChange(event) {
    const { name, value } = event.target;

    setEditForm((current) => ({
      ...current,
      [name]: value,
    }));
  }


  async function handleCreateTask(event) {
    event.preventDefault();

    if (!project?.id || !form.title.trim()) {
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await createTask(project.id, {
        title: form.title.trim(),
        description: form.description.trim(),
      });

      setForm({
        title: "",
        description: "",
      });

      setShowForm(false);

      await loadTasks(pagination.page);
    } catch (err) {
      console.error("Failed to create task:", err);
      setError(
        err.message || "Unable to create task. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }


  function startEditing(task) {
    setEditingTaskId(task.id);

    setEditForm({
      title: task.title || "",
      description: task.description || "",
    });
  }


  function cancelEditing() {
    setEditingTaskId(null);

    setEditForm({
      title: "",
      description: "",
    });
  }


  async function handleUpdateTask(event) {
    event.preventDefault();

    if (!editingTaskId || !editForm.title.trim()) {
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await updateTask(editingTaskId, {
        title: editForm.title.trim(),
        description: editForm.description.trim(),
      });

      cancelEditing();

      await loadTasks(pagination.page);
    } catch (err) {
      console.error("Failed to update task:", err);
      setError(
        err.message || "Unable to update task. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }


  async function handleToggleTask(task) {
    setError("");

    try {
      const data = await updateTask(task.id, {
        completed: !task.completed,
      });

      setTasks((current) =>
        current.map((item) =>
          item.id === task.id
            ? data.task
            : item
        )
      );
    } catch (err) {
      console.error("Failed to update task status:", err);
      setError(
        err.message ||
          "Unable to update task status. Please try again."
      );
    }
  }


  async function handleDeleteTask(taskId) {
    const confirmed = window.confirm(
      "Delete this task?"
    );

    if (!confirmed) {
      return;
    }

    setDeletingTaskId(taskId);
    setError("");

    try {
      await deleteTask(taskId);

      const remainingTasks = tasks.filter(
        (task) => task.id !== taskId
      );

      if (
        remainingTasks.length === 0 &&
        pagination.page > 1
      ) {
        await loadTasks(pagination.page - 1);
      } else {
        await loadTasks(pagination.page);
      }
    } catch (err) {
      console.error("Failed to delete task:", err);
      setError(
        err.message || "Unable to delete task. Please try again."
      );
    } finally {
      setDeletingTaskId(null);
    }
  }


  if (!project) {
    return null;
  }


  return (
    <section
      id="focusflow-tasks"
      className="focusflow-tasks"
    >
      <div className="focusflow-tasks-header">
        <div>
          <button
            type="button"
            className="focusflow-task-back-button"
            onClick={onBack}
          >
            <X size={15} />
            Back to projects
          </button>

          <h2>Destination Plans</h2>

          <p>
            Organize the work for{" "}
            <strong>{project.name}</strong>.
          </p>
        </div>

        <button
          type="button"
          className="focusflow-tasks-add-button"
          onClick={() =>
            setShowForm((current) => !current)
          }
        >
          <Plus size={16} />
          {showForm ? "Close" : "Add task"}
        </button>
      </div>


      {error && (
        <div
          className="focusflow-tasks-error"
          role="alert"
        >
          {error}
        </div>
      )}


      {showForm && (
        <form
          className="focusflow-task-form"
          onSubmit={handleCreateTask}
        >
          <div className="focusflow-task-form-heading">
            <Plus size={18} />

            <div>
              <h3>Create a task</h3>
              <p>
                Add a task to this project.
              </p>
            </div>
          </div>

          <label>
            <span>Task title</span>

            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleFormChange}
              maxLength={160}
              placeholder="e.g. Compare accommodation options"
              required
            />
          </label>

          <label>
            <span>Description</span>

            <textarea
              name="description"
              value={form.description}
              onChange={handleFormChange}
              rows={3}
              placeholder="Add some details about this task..."
            />
          </label>

          <div className="focusflow-task-form-actions">
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
              disabled={
                submitting ||
                !form.title.trim()
              }
            >
              {submitting ? (
                <>
                  <LoaderCircle
                    size={15}
                    className="focusflow-spin"
                  />
                  Creating...
                </>
              ) : (
                <>
                  <Check size={15} />
                  Create task
                </>
              )}
            </button>
          </div>
        </form>
      )}


      {loading ? (
        <div className="focusflow-tasks-state">
          <LoaderCircle
            size={22}
            className="focusflow-spin"
          />
          <p>Loading tasks...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="focusflow-tasks-empty">
          <div className="focusflow-empty-icon">
            <CheckCircle2 size={22} />
          </div>

          <h3>No tasks yet</h3>

          <p>
            Add your first task to start organizing
            this project.
          </p>

          {!showForm && (
            <button
              type="button"
              className="focusflow-primary-button"
              onClick={() => setShowForm(true)}
            >
              <Plus size={16} />
              Add your first task
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="focusflow-task-list">
            {tasks.map((task) => {
              const isEditing =
                editingTaskId === task.id;

              const isDeleting =
                deletingTaskId === task.id;

              if (isEditing) {
                return (
                  <form
                    key={task.id}
                    className="focusflow-task-card focusflow-task-card-editing"
                    onSubmit={handleUpdateTask}
                  >
                    <div className="focusflow-task-edit-icon">
                      <Pencil size={17} />
                    </div>

                    <div className="focusflow-task-edit-fields">
                      <label>
                        <span>Task title</span>

                        <input
                          type="text"
                          name="title"
                          value={editForm.title}
                          onChange={handleEditChange}
                          maxLength={160}
                          required
                        />
                      </label>

                      <label>
                        <span>Description</span>

                        <textarea
                          name="description"
                          value={
                            editForm.description
                          }
                          onChange={
                            handleEditChange
                          }
                          rows={3}
                        />
                      </label>

                      <div className="focusflow-task-form-actions">
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
                    </div>
                  </form>
                );
              }

              return (
                <article
                  key={task.id}
                  className={`focusflow-task-card ${
                    task.completed
                      ? "focusflow-task-card-completed"
                      : ""
                  }`}
                >
                  <button
                    type="button"
                    className="focusflow-task-check"
                    aria-label={
                      task.completed
                        ? `Mark ${task.title} as incomplete`
                        : `Mark ${task.title} as complete`
                    }
                    onClick={() =>
                      handleToggleTask(task)
                    }
                  >
                    {task.completed ? (
                      <CheckCircle2 size={21} />
                    ) : (
                      <Circle size={21} />
                    )}
                  </button>

                  <div className="focusflow-task-content">
                    <h3>{task.title}</h3>

                    {task.description && (
                      <p>{task.description}</p>
                    )}
                  </div>

                  <div className="focusflow-task-actions">
                    <button
                      type="button"
                      aria-label={`Edit ${task.title}`}
                      title="Edit task"
                      onClick={() =>
                        startEditing(task)
                      }
                    >
                      <Pencil size={15} />
                    </button>

                    <button
                      type="button"
                      aria-label={`Delete ${task.title}`}
                      title="Delete task"
                      disabled={isDeleting}
                      onClick={() =>
                        handleDeleteTask(task.id)
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
                </article>
              );
            })}
          </div>


          {pagination.pages > 1 && (
            <div className="focusflow-pagination">
              <button
                type="button"
                disabled={!pagination.has_prev}
                onClick={() =>
                  loadTasks(
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
                  loadTasks(
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


export default TasksPanel;