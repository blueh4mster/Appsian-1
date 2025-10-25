import React, { useEffect, useState } from "react";
import axios from "axios";
import { TaskItem } from "./types";
import "bootstrap/dist/css/bootstrap.min.css";

const API_URL = "https://appsian-1.onrender.com/api/tasks";

function App() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [description, setDescription] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  const filteredTasks = tasks.filter(task =>
    filter === "all"
      ? true
      : filter === "completed"
      ? task.isCompleted
      : !task.isCompleted
  );

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("tasks");
    if (saved) setTasks(JSON.parse(saved));
  }, []);
  
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

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

  const toggleTask = async (task: TaskItem) => {
    await axios.put(`${API_URL}/${task.id}`, {
      ...task,
      isCompleted: !task.isCompleted,
    });
    fetchTasks();
  };

  const deleteTask = async (id: string) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchTasks();
  };

  return (
    <div className="container py-5 " style={{ backgroundColor: "#ffe6f0", minHeight: "100vh" }}>
      <img
    src=""
    alt="Ribbon"
    style={{
      position: "absolute",
      top: "-20px",       // adjust vertical position
      right: "-20px",     // adjust horizontal position
      width: "120px",     // adjust size
      opacity: 0.4,       // soft pastel effect
      zIndex: 0           // behind the card
    }}
  />
      <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow-lg rounded-4" style={{ backgroundColor: "#fff0f6" }}>
              <h2 className="text-center mb-4 fw-bold" style={{ color: "#e75480" }}> My Tasks </h2>
              <div className="ribbon"></div>

      <div className="input-group mb-4 shadow-sm rounded" style={{ boxShadow: "0 2px 6px rgba(231, 84, 128, 0.2)" }}>
        <input
          type="text"
          className="form-control border-0"
          placeholder="New task..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button className="btn" style={{ backgroundColor: "#e75480", color: "#fff" }} onClick={addTask}>
          Add
        </button>
      </div>
      <div className="d-flex justify-content-center gap-2 mb-4">
              {(["all", "active", "completed"] as const).map((f) => (
                <button
                  key={f}
                  className={`btn btn-sm rounded-pill fw-semibold ${
                    filter === f ? "btn-primary" : "btn-outline-primary"
                  }`}
                  style={{
                    backgroundColor: filter === f ? "#e75480" : "#fff",
                    color: filter === f ? "#fff" : "#e75480",
                    border: "1px solid #e75480"
                  }}
                  onClick={() => setFilter(f)}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
      <ul className="list-group">
      {filteredTasks.length === 0 ? (
                <li className="list-group-item text-center text-muted" style={{ backgroundColor: "#fff0f6" }}>No tasks yet ✨</li>
              ) : ( filteredTasks.map((task) => (
          <li
            key={task.id}
            className="list-group-item d-flex justify-content-between align-items-center rounded-3 mb-2 shadow-sm gap-1 "
            style={{
              backgroundColor: "#fff",
              boxShadow: "0 2px 6px rgba(231, 84, 128, 0.1)",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            <span
              style={{
                textDecoration: task.isCompleted ? "line-through" : "none",
                color: task.isCompleted ? "#e0aebf" : "#e75480",
                flex: 1
              }}
              onClick={()=>toggleTask(task)}
            >
              {task.description}
            </span>
            {task.isCompleted && (
            <span className="badge rounded-pill me-2" style={{backgroundColor: "#ff4d6d", color: "#fff", fontWeight: "500" }}>Done</span>
            )}
            <button
              className="btn btn-sm"
              style={{ backgroundColor: "#ff4d6d", color: "#fff" }}
              onClick={() => deleteTask(task.id)}
            >
              Delete
            </button>
          </li>
        )))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;