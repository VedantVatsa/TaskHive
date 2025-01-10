import axios from "axios";
import { API_BASE_URL } from "../config";

const TaskItem = ({ task, onDelete, onToggleComplete }) => {
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/tasks/${task._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onDelete(task._id);
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const handleToggleComplete = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `${API_BASE_URL}/tasks/${task._id}/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onToggleComplete(response.data);
    } catch (err) {
      console.error("Error toggling task completion:", err);
    }
  };

  return (
    <div
      className={`border p-4 rounded-lg mb-2 ${
        task.completed ? "bg-gray-100" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={handleToggleComplete}
            className="h-4 w-4"
          />
          <h3
            className={`font-medium ${
              task.completed ? "line-through text-gray-500" : ""
            }`}
          >
            {task.title}
          </h3>
        </div>
        <button
          onClick={handleDelete}
          className="text-red-500 hover:text-red-700"
        >
          Delete
        </button>
      </div>
      {/* ... rest of task details ... */}
    </div>
  );
};

export default TaskItem;
