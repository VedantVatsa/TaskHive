const mongoose = require("mongoose");

const alarmSchema = new mongoose.Schema({
  enabled: { type: Boolean, default: false },
  time: { type: Date },
  voiceEnabled: { type: Boolean, default: false },
  snoozeTime: { type: Number, default: 5 },
  notifications: [
    {
      type: {
        type: String,
        enum: ["email", "browser", "voice"],
        default: "browser",
      },
      time: Date,
      sent: { type: Boolean, default: false },
    },
  ],
  repeatInterval: {
    type: String,
    enum: ["none", "daily", "weekly", "monthly"],
  },
});

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    category: {
      type: String,
      enum: [
        "work",
        "personal",
        "health",
        "shopping",
        "education",
        "finance",
        "family",
        "other",
      ],
      default: "personal",
    },
    tags: [String],
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    deadline: { type: Date },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    alarm: alarmSchema,
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Add index for search
taskSchema.index({ title: "text", description: "text", tags: "text" });

module.exports = mongoose.model("Task", taskSchema);
