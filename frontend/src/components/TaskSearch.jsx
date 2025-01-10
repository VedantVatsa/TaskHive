import React, { useState, useCallback } from "react";
import { FaSearch, FaFilter } from "react-icons/fa";

const TaskSearch = ({ onSearch, onFilter }) => {
  const [searchText, setSearchText] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    priority: "",
    sort: "created",
  });

  const handleSearch = useCallback(
    (e) => {
      e.preventDefault();
      onSearch({ ...filters, q: searchText });
    },
    [searchText, filters, onSearch]
  );

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  return (
    <div className="mb-6">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search tasks..."
            className="input-field pl-10 w-full"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="btn btn-secondary"
        >
          <FaFilter />
        </button>
      </form>

      {showFilters && (
        <div className="mt-4 grid grid-cols-3 gap-4 animate-slide-down">
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange("category", e.target.value)}
            className="input-field"
          >
            <option value="">All Categories</option>
            <option value="work">Work</option>
            <option value="personal">Personal</option>
            <option value="health">Health</option>
            <option value="shopping">Shopping</option>
            <option value="education">Education</option>
            <option value="finance">Finance</option>
            <option value="family">Family</option>
          </select>

          <select
            value={filters.priority}
            onChange={(e) => handleFilterChange("priority", e.target.value)}
            className="input-field"
          >
            <option value="">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            value={filters.sort}
            onChange={(e) => handleFilterChange("sort", e.target.value)}
            className="input-field"
          >
            <option value="created">Created Date</option>
            <option value="deadline">Deadline</option>
            <option value="priority">Priority</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default TaskSearch;
