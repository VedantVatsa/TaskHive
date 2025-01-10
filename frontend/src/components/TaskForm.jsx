import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import AlarmSystem from "./AlarmSystem";

const TaskForm = ({ onAddTask, onNotify, onCancel, task = null }) => {
  const isEditing = Boolean(task);
  const [formData, setFormData] = useState({
    title: task?.title || "",
    description: task?.description || "",
    category: task?.category || "personal",
    priority: task?.priority || "medium",
    deadline: task?.deadline
      ? new Date(task.deadline).toISOString().slice(0, 16)
      : "",
    tags: task?.tags?.join(", ") || "",
    alarm: task?.alarm || null,
  });

  // Effect to update form when editing task changes
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        category: task.category || "personal",
        priority: task.priority || "medium",
        deadline: task.deadline
          ? new Date(task.deadline).toISOString().slice(0, 16)
          : "",
        tags: task.tags?.join(", ") || "",
        alarm: task.alarm || null,
      });
    }
  }, [task]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const payload = {
        ...formData,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      };

      const response = await axios({
        method: isEditing ? "patch" : "post",
        url: `${API_BASE_URL}/tasks${isEditing ? `/${task._id}` : ""}`,
        data: payload,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      onAddTask(response.data);
      if (!isEditing) {
        resetForm();
      }
    } catch (err) {
      console.error("Task submission error:", err);
      onNotify(err.response?.data?.error || "Failed to save task", "error");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "personal",
      priority: "medium",
      deadline: "",
      tags: "",
      alarm: null,
    });
  };

  const CATEGORIES = [
    { value: "work", label: "Work" },
    { value: "personal", label: "Personal" },
    { value: "health", label: "Health" },
    { value: "shopping", label: "Shopping" },
    { value: "education", label: "Education" },
    { value: "finance", label: "Finance" },
    { value: "family", label: "Family" },
    { value: "other", label: "Other" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Task title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="input-field"
          required
        />
        <textarea
          placeholder="Task description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="input-field min-h-[100px] resize-none"
        />
        <div className="grid grid-cols-2 gap-4">
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="input-field"
          >
            <option value="" disabled>
              Category
            </option>
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
          <select
            value={formData.priority}
            onChange={(e) =>
              setFormData({ ...formData, priority: e.target.value })
            }
            className="input-field"
          >
            <option value="" disabled>
              Priority
            </option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <input
          type="datetime-local"
          value={formData.deadline}
          onChange={(e) =>
            setFormData({ ...formData, deadline: e.target.value })
          }
          className="input-field"
        />
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          className="input-field"
        />
      </div>

      <div className="mt-6">
        <AlarmSystem
          deadline={formData.deadline}
          taskTitle={formData.title}
          onAlarmChange={(alarm) => setFormData({ ...formData, alarm })}
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary flex-1"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span className="ml-2">
                {isEditing ? "Updating..." : "Adding..."}
              </span>
            </div>
          ) : isEditing ? (
            "Update Task"
          ) : (
            "Add Task"
          )}
        </button>
        {isEditing && (
          <button
            type="button"
            onClick={() => {
              onCancel?.();
              resetForm();
            }}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default TaskForm;
