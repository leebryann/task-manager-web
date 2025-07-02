import React, { useState } from 'react';
import { createTask } from '../services/TaskService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function TaskForm({ onTaskCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTask({ title, description, completed: false });
      toast.success("Task added!");
      setTitle("");
      setDescription("");

      if (onTaskCreated) {
        onTaskCreated();
      }

      navigate("/tasks");
    } catch (error) {
      toast.error("Failed to add task.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="mb-3">
        <input className="form-control" placeholder="Title"
          value={title} onChange={e => setTitle(e.target.value)} required />
      </div>
      <div className="mb-3">
        <input className="form-control" placeholder="Description"
          value={description} onChange={e => setDescription(e.target.value)} required />
      </div>
      <button className="btn btn-success" type="submit">Add Task</button>
    </form>
  );
}

export default TaskForm;
