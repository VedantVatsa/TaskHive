import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie, Bar, Line } from "react-chartjs-2"; // Fixed imports
import axios from "axios";
import { API_BASE_URL } from "../config";
import Navbar from "../components/Navbar"; // Add Navbar
import Toast from "../components/Toast"; // Add Toast component
import { mockDashboardStats } from "../utils/mockData";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    categoryDistribution: {},
    priorityDistribution: {},
    weeklyProgress: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStats(mockDashboardStats);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to load dashboard data");
      setNotification({
        type: "error",
        message: "Failed to load dashboard data",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-gradient min-h-screen">
      <Navbar />
      <div className="page-container">
        <h1 className="page-title">Dashboard Overview</h1>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 dark:border-indigo-400"></div>
          </div>
        ) : error ? (
          <div className="glass-morphism p-6 rounded-2xl text-center text-red-500">
            {error}
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[
                {
                  label: "Total Tasks",
                  value: stats.totalTasks,
                  color: "blue",
                },
                {
                  label: "Completed",
                  value: stats.completedTasks,
                  color: "green",
                },
                {
                  label: "Pending",
                  value: stats.pendingTasks,
                  color: "yellow",
                },
              ].map((stat, idx) => (
                <div key={idx} className="stat-card">
                  <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                    {stat.label}
                  </h3>
                  <p
                    className={`text-4xl font-bold text-${stat.color}-600 dark:text-${stat.color}-400 mt-2`}
                  >
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Category Distribution */}
              <div className="glass-morphism p-6 rounded-2xl chart-card">
                <h3 className="text-lg font-semibold mb-4">
                  Tasks by Category
                </h3>
                <div className="h-64">
                  <Pie // Using Pie instead of PieChart
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "bottom",
                        },
                      },
                    }}
                    data={{
                      labels: Object.keys(stats.categoryDistribution),
                      datasets: [
                        {
                          data: Object.values(stats.categoryDistribution),
                          backgroundColor: [
                            "#3B82F6",
                            "#10B981",
                            "#F59E0B",
                            "#EF4444",
                            "#6366F1",
                            "#8B5CF6",
                            "#EC4899",
                          ],
                        },
                      ],
                    }}
                  />
                </div>
              </div>

              {/* Priority Distribution */}
              <div className="glass-morphism p-6 rounded-2xl chart-card">
                <h3 className="text-lg font-semibold mb-4">
                  Tasks by Priority
                </h3>
                <div className="h-64">
                  <Bar // Using Bar instead of BarChart
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                    }}
                    data={{
                      labels: Object.keys(stats.priorityDistribution),
                      datasets: [
                        {
                          label: "Tasks",
                          data: Object.values(stats.priorityDistribution),
                          backgroundColor: "#6366F1",
                        },
                      ],
                    }}
                  />
                </div>
              </div>

              {/* Weekly Progress */}
              <div className="glass-morphism p-6 rounded-2xl lg:col-span-2 chart-card">
                <h3 className="text-lg font-semibold mb-4">Weekly Progress</h3>
                <div className="h-72">
                  <Line // Using Line instead of LineChart
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                        },
                      },
                    }}
                    data={{
                      labels: stats.weeklyProgress.map((wp) => wp.date),
                      datasets: [
                        {
                          label: "Completed Tasks",
                          data: stats.weeklyProgress.map((wp) => wp.completed),
                          borderColor: "#10B981",
                          tension: 0.4,
                        },
                      ],
                    }}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      {notification && (
        <Toast
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;
