// frontend/src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import { getTasks, createTask, updateTask, deleteTask, getProfile } from '../utils/api';

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userProfile, setUserProfile] = useState(null);

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        setUserProfile(response.data.user);
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };
    fetchProfile();
  }, []);

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await getTasks();
      setTasks(response.data.tasks);
      setError('');
    } catch (err) {
      setError('Failed to load tasks');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    if (type === 'success') {
      setSuccess(text);
      setError('');
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(text);
      setSuccess('');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const response = await createTask(taskData);
      setTasks([response.data.task, ...tasks]);
      showMessage('success', 'Task created successfully!');
    } catch (err) {
      showMessage('error', err.response?.data?.message || 'Failed to create task');
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      const response = await updateTask(editingTask._id, taskData);
      setTasks(tasks.map((t) => (t._id === editingTask._id ? response.data.task : t)));
      setEditingTask(null);
      showMessage('success', 'Task updated successfully!');
    } catch (err) {
      showMessage('error', err.response?.data?.message || 'Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await deleteTask(taskId);
      setTasks(tasks.filter((t) => t._id !== taskId));
      showMessage('success', 'Task deleted successfully!');
    } catch (err) {
      showMessage('error', err.response?.data?.message || 'Failed to delete task');
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {userProfile?.name || 'User'}!
          </h1>
          <p className="mt-1 text-gray-600">Manage your tasks efficiently</p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Task Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Total Tasks</p>
            <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">
              {tasks.filter((t) => t.status === 'pending').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-600 text-sm">In Progress</p>
            <p className="text-2xl font-bold text-blue-600">
              {tasks.filter((t) => t.status === 'in-progress').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Completed</p>
            <p className="text-2xl font-bold text-green-600">
              {tasks.filter((t) => t.status === 'completed').length}
            </p>
          </div>
        </div>

        {/* Task Form */}
        <TaskForm
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          editTask={editingTask}
          onCancel={handleCancelEdit}
        />

        {/* Task List */}
        <TaskList
          tasks={tasks}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          loading={loading}
        />
      </div>
    </div>
  );
}

export default Dashboard;