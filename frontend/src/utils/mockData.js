export const mockDashboardStats = {
  totalTasks: 24,
  completedTasks: 18,
  pendingTasks: 6,
  categoryDistribution: {
    work: 8,
    personal: 6,
    health: 4,
    shopping: 2,
    education: 2,
    finance: 1,
    family: 1,
  },
  priorityDistribution: {
    high: 5,
    medium: 12,
    low: 7,
  },
  weeklyProgress: [
    { date: "2024-01-01", completed: 3 },
    { date: "2024-01-02", completed: 5 },
    { date: "2024-01-03", completed: 2 },
    { date: "2024-01-04", completed: 4 },
    { date: "2024-01-05", completed: 6 },
    { date: "2024-01-06", completed: 3 },
    { date: "2024-01-07", completed: 4 },
  ],
};

export const mockAnalyticsData = {
  productivityScore: 85,
  timelineData: {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Tasks Completed",
        data: [12, 15, 10, 18],
        borderColor: "#10B981",
      },
    ],
  },
  categoryPerformance: {
    labels: ["Work", "Personal", "Health", "Shopping", "Education"],
    datasets: [
      {
        label: "Completion Rate",
        data: [90, 75, 85, 95, 70],
        backgroundColor: "rgba(99, 102, 241, 0.5)",
      },
    ],
  },
  insights: [
    "Most productive day: Wednesday",
    "Best performing category: Shopping",
    "Average task completion time: 2.5 days",
  ],
};

export const mockUserSettings = {
  notifications: {
    email: true,
    push: true,
    sound: false,
  },
  theme: "light",
  language: "en",
};

export const mockUserProfile = {
  name: "John Doe",
  email: "john@example.com",
  avatar: "https://ui-avatars.com/api/?name=John+Doe",
};
