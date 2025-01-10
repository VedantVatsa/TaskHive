import { useState } from 'react';

function App() {
  const [tasks, setTasks] = useState([]);

  const addTask = (task) => {
    setTasks([...tasks, task]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold text-center mb-4">Task Manager</h1>
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const task = e.target.task.value;
            addTask(task);
            e.target.reset();
          }}
        >
          <input
            type="text"
            name="task"
            placeholder="Add a task"
            className="w-full p-2 border rounded-lg"
            required
          />
          <button
            type="submit"
            className="mt-2 w-full bg-blue-500 text-white p-2 rounded-lg"
          >
            Add Task
          </button>
        </form>
        <ul className="mt-4">
          {tasks.map((task, index) => (
            <li key={index} className="p-2 border-b">
              {task}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;