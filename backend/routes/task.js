const express = require("express");
const mongoose = require("mongoose");
const Task = require("../models/Task");
const auth = require("../middleware/auth");
const router = express.Router();

// Middleware to validate MongoDB ObjectId
const validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: "Invalid task ID" });
  }
  next();
};

// Create Task
router.post("/", auth, async (req, res) => {
  try {
    const taskData = {
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      priority: req.body.priority,
      deadline: req.body.deadline,
      tags: req.body.tags,
      alarm: req.body.alarm,
      user: req.userId,
    };

    console.log("Creating task:", taskData); // Debug log

    const task = new Task(taskData);
    const savedTask = await task.save();

    console.log("Task created:", savedTask); // Debug log
    res.status(201).json(savedTask);
  } catch (err) {
    console.error("Task creation error:", err);
    res.status(400).json({ error: err.message });
  }
});

// Get All Tasks
router.get("/", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.userId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Search Tasks
router.get("/search", auth, async (req, res) => {
  try {
    const { q, sort, category, priority, completed } = req.query;
    const query = { user: req.userId };

    // Search text
    if (q) {
      query.$text = { $search: q };
    }

    // Filters
    if (category) query.category = category;
    if (priority) query.priority = priority;
    if (completed !== undefined) query.completed = completed === "true";

    // Create sort object
    let sortObj = {};
    if (sort) {
      switch (sort) {
        case "deadline":
          sortObj.deadline = 1;
          break;
        case "priority":
          sortObj.priority = -1;
          break;
        case "created":
          sortObj.createdAt = -1;
          break;
        default:
          sortObj.createdAt = -1;
      }
    }

    const tasks = await Task.find(query).sort(sortObj);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Task (support both PUT and PATCH)
router.patch("/:id", [auth, validateObjectId], async (req, res) => {
  try {
    const updates = req.body;
    console.log("Updating task:", { taskId: req.params.id, updates });

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(task);
  } catch (err) {
    console.error("Task update error:", err);
    res.status(400).json({ error: err.message });
  }
});

// Get upcoming deadlines
router.get("/deadlines", auth, async (req, res) => {
  try {
    const now = new Date();
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const tasks = await Task.find({
      user: req.userId,
      completed: false,
      deadline: { $gte: now, $lte: weekFromNow },
    }).sort({ deadline: 1 });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Toggle Task Completion
router.patch("/:id/complete", [auth, validateObjectId], async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    task.completed = !task.completed;
    if (task.completed) {
      task.completedAt = new Date();
    } else {
      task.completedAt = null;
    }
    await task.save();

    res.json(task);
  } catch (err) {
    console.error("Error toggling task completion:", err);
    res.status(500).json({ error: err.message });
  }
});

// Delete Task
router.delete("/:id", [auth, validateObjectId], async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ message: "Task deleted successfully", taskId: req.params.id });
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
