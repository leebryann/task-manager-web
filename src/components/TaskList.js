import React, { useEffect, useState } from 'react';
import { getTasks, deleteTask, updateTask } from '../services/TaskService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("jwtToken");
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await getTasks();
        setTasks(res.data);
      } catch (err) {
        console.error("Cannot get tasks", err);
        toast.error("Internal Server Error!");
      }
    };

    fetchTasks();
  }, []);


  const loadTasks = async () => {
    const response = await getTasks();
    setTasks(response.data);
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      toast.success("Task deleted.");
      loadTasks();
    } catch (err) {
      toast.error("Failed to delete task.");
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      await updateTask(task.id, { ...task, completed: !task.completed });
      toast.success("Task updated.");
      loadTasks();
    } catch (err) {
      toast.error("Failed to update task.");
    }
  };

  const openEditModal = (task) => {
    setSelectedTask({ ...task }); // clone to avoid direct state mutation
    setShowModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setSelectedTask((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleEditSubmit = async () => {
    try {
      await updateTask(selectedTask.id, selectedTask);
      toast.success("Task updated!");
      setShowModal(false);
      loadTasks();
    } catch (err) {
      toast.error("Failed to update task.");
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesStatus =
        filter === "all"
        ? true
        : filter === "completed"
        ? task.completed
        : !task.completed;

    const matchesSearch =
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });
  

  return (
    <div>
      <div className="mb-3 d-flex justify-content-between align-items-center">
        {/* Search Bar on the left */}
        <input
          type="text"
          className="form-control me-3"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ maxWidth: "1000px" }}
        />

        {/* Buttons on the right */}
        <div className="d-flex align-items-center gap-2">
          <button
            className={`btn btn-sm ${filter === "all" ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={`btn btn-sm ${filter === "completed" ? "btn-success" : "btn-outline-success"}`}
            onClick={() => setFilter("completed")}
          >
            Completed
          </button>
          <button
            className={`btn btn-sm ${filter === "incomplete" ? "btn-warning" : "btn-outline-warning"}`}
            onClick={() => setFilter("incomplete")}
          >
            Incomplete
          </button>
          <button
            className="btn btn-sm btn-success"
            onClick={() => navigate("/tasks/new")}
          >
            + Add New Task
          </button>
        </div>
      </div>
      <h2>Tasks</h2>
      {filteredTasks.length === 0 ? (
        <p className="text-muted">No tasks found.</p>
      ) : (
        <ul className="list-group">
          {filteredTasks.map(task => (
            <li key={task.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong className={task.completed ? "text-success" : "text-dark"}>
                  {task.title}
                </strong>
                <br />
                <small>{task.description}</small>
              </div>
              <div>
                <button onClick={() => handleToggleComplete(task)} className="btn btn-sm btn-outline-primary me-2">
                  {task.completed ? "Undo" : "Done"}
                </button>
                <button onClick={() => openEditModal(task)} className="btn btn-sm btn-outline-warning me-2">
                  Edit
                </button>
                <button onClick={() => handleDelete(task.id)} className="btn btn-sm btn-outline-danger">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Modal */}
      {showModal && selectedTask && (
        <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">Edit Task</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>

              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    value={selectedTask.title}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <input
                    type="text"
                    className="form-control"
                    name="description"
                    value={selectedTask.description}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="completed"
                    checked={selectedTask.completed}
                    onChange={handleEditChange}
                  />
                  <label className="form-check-label">Completed</label>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={handleEditSubmit}>Save Changes</button>
              </div>

            </div>
          </div>
        </div>
      )}
      <button
        className="btn btn-sm btn-dark mt-3"
        onClick={() => {
          logout();
          navigate("/");
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default TaskList;
