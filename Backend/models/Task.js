// backend/models/Task.js
const mongoose = require('mongoose');

/**
 * Task Schema
 * Stores tasks associated with users
 */
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  dueDate: {
    type: Date
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for faster queries
taskSchema.index({ user: 1, createdAt: -1 });
taskSchema.index({ status: 1 });
taskSchema.index({ title: 'text', description: 'text' }); // Text search index

/**
 * Pre-save middleware to update updatedAt timestamp
 */
taskSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

/**
 * Static method to get tasks with filtering
 * @param {string} userId - User ID
 * @param {Object} filters - Filter options
 * @returns {Promise<Array>} - Array of tasks
 */
taskSchema.statics.getTasksByUser = function(userId, filters = {}) {
  const query = { user: userId };
  
  // Apply filters
  if (filters.status) {
    query.status = filters.status;
  }
  
  if (filters.priority) {
    query.priority = filters.priority;
  }
  
  return this.find(query).sort({ createdAt: -1 });
};

/**
 * Method to format task output
 * @returns {Object} - Formatted task object
 */
taskSchema.methods.toJSON = function() {
  const task = this.toObject();
  delete task.__v;
  return task;
};

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;