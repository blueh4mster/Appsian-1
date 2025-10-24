import React, { useEffect, useState } from "react";
import axios from "axios";
import { TaskItem } from "./types";
import "bootstrap/dist/css/bootstrap.min.css";

const API_URL = "http://localhost:5171/api/tasks";

function App() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await axios.get<TaskItem[]>(API_URL);
    setTasks(res.data);
  };

  const addTask = async () => {
    if (!description.trim()) return;
    const newTask = { description, isCompleted: false };
    await axios.post(API_URL, newTask);
    setDescription("");
    fetchTasks();
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Task List</h2>

      <div className="d-flex mb-3">
        <input
          type="text"
          className="form-control me-2"
          placeholder="New task..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button className="btn btn-primary" onClick={addTask}>
          Add
        </button>
      </div>

      <ul className="list-group">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <span
              style={{
                textDecoration: task.isCompleted ? "line-through" : "none",
                cursor: "pointer",
              }}
            >
              {task.description}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;