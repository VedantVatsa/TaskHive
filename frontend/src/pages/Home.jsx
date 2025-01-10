import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import TaskForm from "../components/TaskForm";
import TaskSearch from "../components/TaskSearch";
import Navbar from "../components/Navbar";
import Toast from "../components/Toast";
import VoiceAssistant from "../components/VoiceAssistant";
import NotificationService from "../services/NotificationService";

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(""); // Added error state
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [notification, setNotification] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [searchParams, setSearchParams] = useState({
    q: "",
    sort: "created",
    category: "",
    priority: "",
  });

  // Fetch tasks from the backend
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      // Use regular tasks endpoint if no search params, otherwise use search endpoint
      const endpoint = Object.values(searchParams).some(Boolean)
        ? `/tasks/search?${new URLSearchParams(searchParams).toString()}`
        : "/tasks";

      const res = await axios.get(`${API_BASE_URL}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Fetched tasks:", res.data); // Debug log
      setTasks(res.data);
      setError("");
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError(err.response?.data?.error || "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
  };

  // Mark a task as completed
  const handleComplete = async (taskId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `${API_BASE_URL}/tasks/${taskId}/complete`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === taskId
              ? { ...task, completed: !task.completed, completedAt: new Date() }
              : task
          )
        );
        showNotification("Task updated successfully!", "success");
      }
    } catch (err) {
      console.error("Error completing task:", err);
      showNotification("Failed to update task", "error");
    }
  };

  // Delete a task
  const handleDelete = async (taskId) => {
    try {
      console.log("Deleting task:", taskId);
      const token = localStorage.getItem("token");
      const response = await axios.delete(`${API_BASE_URL}/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data) {
        setTasks((prevTasks) =>
          prevTasks.filter((task) => task._id !== taskId)
        );
        setError("");
        showNotification("Task deleted successfully!", "success");
      }
    } catch (err) {
      console.error("Error deleting task:", err.response || err);
      setError(err.response?.data?.error || "Failed to delete task");
      showNotification(
        err.response?.data?.error || "Failed to delete task",
        "error"
      );
    }
  };

  const handleSearch = (searchData) => {
    setSearchParams(searchData);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    document
      .querySelector(".task-form")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
    NotificationService.init();
  }, [searchParams]);

  const handleVoiceCommand = (command) => {
    switch (command) {
      case "add_task":
        // Scroll to task form
        document
          .querySelector(".task-form")
          ?.scrollIntoView({ behavior: "smooth" });
        break;
      case "show_tasks":
        // Reset filter to show all tasks
        setFilter("all");
        break;
      case "complete_task":
        // Show uncompleted tasks
        setFilter("pending");
        break;
      default:
        break;
    }
  };

  const handleTaskUpdate = (updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === updatedTask._id ? updatedTask : task
      )
    );
    setEditingTask(null); // Clear editing state
    showNotification("Task updated successfully!", "success");
  };

  const handleTaskAdd = (newTask) => {
    if (editingTask) {
      handleTaskUpdate(newTask);
    } else {
      setTasks((prevTasks) => [...prevTasks, newTask]);
      showNotification("Task created successfully!", "success");
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true;
  });

  return (
    <div className="page-gradient min-h-screen">
      <Navbar />
      <div className="page-container">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h1 className="page-title">Task Manager</h1>
          <div className="w-full md:w-auto">
            <TaskSearch onSearch={handleSearch} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Task Form Section */}
          <div className="lg:col-span-1">
            <div className="card-base">
              <h2 className="text-xl font-semibold mb-4">
                {editingTask ? "Edit Task" : "Add New Task"}
              </h2>
              <TaskForm
                task={editingTask}
                onAddTask={handleTaskAdd}
                onCancel={() => setEditingTask(null)}
                onNotify={showNotification}
              />
            </div>
          </div>

          {/* Tasks List Section */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-indigo-400"></div>
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="glass-morphism rounded-2xl p-12 text-center">
                <img
                  src="/empty-state.svg"
                  alt="No tasks"
                  className="w-48 h-48 mx-auto mb-4 animate-float"
                />
                <p className="text-gray-500 text-lg">No tasks found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTasks.map((task) => (
                  <div
                    key={`task-${task._id}-${task.updatedAt}`}
                    className={`task-card task-card-${task.priority} ${
                      task.completed ? "opacity-75" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold">{task.title}</h3>
                        <p className="text-gray-600 mt-2">{task.description}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditTask(task)}
                          className="btn btn-secondary"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleComplete(task._id)}
                          className={`btn ${
                            task.completed
                              ? "bg-gray-500"
                              : "bg-gradient-to-r from-emerald-500 to-green-600"
                          } text-white px-4 py-2`}
                        >
                          {task.completed ? "Completed" : "Complete"}
                        </button>
                        <button
                          onClick={() => handleDelete(task._id)}
                          className="btn btn-danger"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div className="glass-morphism p-3 rounded-xl">
                        <p className="text-sm text-gray-500">Category</p>
                        <p className="font-medium capitalize">
                          {task.category}
                        </p>
                      </div>
                      <div className="glass-morphism p-3 rounded-xl">
                        <p className="text-sm text-gray-500">Priority</p>
                        <p className="font-medium capitalize">
                          {task.priority}
                        </p>
                      </div>
                      <div className="glass-morphism p-3 rounded-xl">
                        <p className="text-sm text-gray-500">Deadline</p>
                        <p className="font-medium">
                          {new Date(task.deadline).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <VoiceAssistant onCommand={handleVoiceCommand} />
      {notification && (
        <Toast
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};

export default Home;
