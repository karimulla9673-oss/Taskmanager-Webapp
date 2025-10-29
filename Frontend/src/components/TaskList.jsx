// frontend/src/components/TaskList.jsx
import { useState } from 'react';

function TaskList({ tasks, onEdit, onDelete, loading }) {
  const [filter, setFilter] = useState({ status: '', priority: '' });
  const [searchQuery, setSearchQuery] = useState('');

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  // Get priority badge color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter tasks based on search and filters
  const filteredTasks = tasks.filter((task) => {
    const matchesStatus = !filter.status || task.status === filter.status;
    const matchesPriority = !filter.priority || task.priority === filter.priority;
    const matchesSearch =
      !searchQuery ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesPriority && matchesSearch;
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Tasks</h3>

        {/* Search and Filters */}
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />

          <div className="flex flex-wrap gap-3">
            <select
              value={filter.status}
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            <select
              value={filter.priority}
              onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="mt-2 text-gray-600">Loading tasks...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredTasks.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">
            {tasks.length === 0 ? 'No tasks yet. Create one to get started!' : 'No tasks match your filters.'}
          </p>
        </div>
      )}

      {/* Task List */}
      {!loading && filteredTasks.length > 0 && (
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <div
              key={task._id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-lg font-semibold text-gray-900">{task.title}</h4>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEdit(task)}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(task._id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {task.description && (
                <p className="text-gray-600 text-sm mb-3">{task.description}</p>
              )}

              <div className="flex flex-wrap gap-2 items-center">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                  {task.status === 'in-progress' ? 'In Progress' : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                </span>
                {task.dueDate && (
                  <span className="text-xs text-gray-500">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Task Count */}
      {!loading && filteredTasks.length > 0 && (
        <div className="mt-4 text-sm text-gray-600 text-center">
          Showing {filteredTasks.length} of {tasks.length} tasks
        </div>
      )}
    </div>
  );
}

export default TaskList;