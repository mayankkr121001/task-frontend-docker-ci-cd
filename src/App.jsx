
import { useEffect, useState } from "react";
import "./App.css";

const API = "/api/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  async function loadTasks() {
    const res = await fetch(API);
    setTasks(await res.json());
  }

  useEffect(() => {
    loadTasks().catch(console.error);
  }, []);

  async function addTask(e) {
    e.preventDefault();
    if (!title.trim()) return;

    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });

    if (res.ok) {
      setTitle("");
      loadTasks();
    }
  }

  async function toggleTask(task) {
    const res = await fetch(`${API}/${task._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !task.completed }),
    });

    if (res.ok) loadTasks();
  }

  async function deleteTask(id) {
    const res = await fetch(`${API}/${id}`, { method: "DELETE" });
    if (res.ok) loadTasks();
  }

  return (
    <main className="container">
      <h1>Task Manager</h1>
      <p>Keep track of your tasks.</p>

      <form onSubmit={addTask}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a task..."
        />
        <button type="submit">Add Task</button>
      </form>

      {tasks.map((task) => (
        <div className="task" key={task._id}>
          <label>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task)}
            />
            <span className={task.completed ? "completed" : ""}>
              {task.title}
            </span>
          </label>
          <button className="delete" onClick={() => deleteTask(task._id)}>
            Delete
          </button>
        </div>
      ))}
    </main>
  );
}

export default App;
