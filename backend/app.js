const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);
const taskRoutes = require("./routes/task");
app.use("/api/tasks", taskRoutes);
