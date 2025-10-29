// backend/routes/taskRoutes.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const Task = require('../models/Task');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes are protected
router.use(protect);

/**
 * @route   GET /api/tasks
 * @desc    Get all tasks for logged-in user
 * @access  Private
 */
router.get('/', async (req, res) => {
  try {
    const { status, priority, sort } = req.query;
    
    // Build query
    const query = { user: req.user._id };
    
    if (status) {
      query.status = status;
    }
    
    if (priority) {
      query.priority = priority;
    }

    // Determine sort order
    let sortOption = { createdAt: -1 }; // Default: newest first
    if (sort === 'oldest') {
      sortOption = { createdAt: 1 };
    } else if (sort === 'title') {
      sortOption = { title: 1 };
    } else if (sort === 'dueDate') {
      sortOption = { dueDate: 1 };
    }

    const tasks = await Task.find(query).sort(sortOption);

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: { tasks }
    });
  } catch (error) {
    console.error('Get Tasks Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tasks',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/tasks/search
 * @desc    Search tasks by title or description
 * @access  Private
 */
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    // Text search using MongoDB text index
    const tasks = await Task.find({
      user: req.user._id,
      $text: { $search: q }
    }).sort({ score: { $meta: 'textScore' } });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: { tasks }
    });
  } catch (error) {
    console.error('Search Tasks Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching tasks',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/tasks/:id
 * @desc    Get single task by ID
 * @access  Private
 */
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { task }
    });
  } catch (error) {
    console.error('Get Task Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching task',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/tasks
 * @desc    Create a new task
 * @access  Private
 */
router.post(
  '/',
  [
    body('title')
      .trim()
      .isLength({ min: 3, max: 100 })
      .withMessage('Title must be between 3 and 100 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Description cannot exceed 500 characters'),
    body('status')
      .optional()
      .isIn(['pending', 'in-progress', 'completed'])
      .withMessage('Invalid status'),
    body('priority')
      .optional()
      .isIn(['low', 'medium', 'high'])
      .withMessage('Invalid priority')
  ],
  async (req, res) => {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { title, description, status, priority, dueDate } = req.body;

      // Create task
      const task = await Task.create({
        title,
        description,
        status: status || 'pending',
        priority: priority || 'medium',
        dueDate,
        user: req.user._id
      });

      res.status(201).json({
        success: true,
        message: 'Task created successfully',
        data: { task }
      });
    } catch (error) {
      console.error('Create Task Error:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating task',
        error: error.message
      });
    }
  }
);

/**
 * @route   PUT /api/tasks/:id
 * @desc    Update a task
 * @access  Private
 */
router.put(
  '/:id',
  [
    body('title')
      .optional()
      .trim()
      .isLength({ min: 3, max: 100 })
      .withMessage('Title must be between 3 and 100 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Description cannot exceed 500 characters'),
    body('status')
      .optional()
      .isIn(['pending', 'in-progress', 'completed'])
      .withMessage('Invalid status'),
    body('priority')
      .optional()
      .isIn(['low', 'medium', 'high'])
      .withMessage('Invalid priority')
  ],
  async (req, res) => {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      // Find task and verify ownership
      let task = await Task.findOne({
        _id: req.params.id,
        user: req.user._id
      });

      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        });
      }

      // Update task
      const { title, description, status, priority, dueDate } = req.body;
      
      if (title) task.title = title;
      if (description !== undefined) task.description = description;
      if (status) task.status = status;
      if (priority) task.priority = priority;
      if (dueDate !== undefined) task.dueDate = dueDate;

      await task.save();

      res.status(200).json({
        success: true,
        message: 'Task updated successfully',
        data: { task }
      });
    } catch (error) {
      console.error('Update Task Error:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating task',
        error: error.message
      });
    }
  }
);

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete a task
 * @access  Private
 */
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: { task }
    });
  } catch (error) {
    console.error('Delete Task Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting task',
      error: error.message
    });
  }
});

module.exports = router;