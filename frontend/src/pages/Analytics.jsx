import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
} from "chart.js";
import { Line, Radar } from "react-chartjs-2";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { format, startOfMonth, endOfMonth } from "date-fns";
import Navbar from "../components/Navbar";
import Toast from "../components/Toast";
import { mockAnalyticsData } from "../utils/mockData";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [dateRange, setDateRange] = useState({
    start: startOfMonth(new Date()),
    end: endOfMonth(new Date()),
  });
  const [analyticsData, setAnalyticsData] = useState({
    productivityScore: 0,
    timelineData: {
      labels: [],
      datasets: [],
    },
    categoryPerformance: {
      labels: [],
      datasets: [],
    },
    insights: [],
  });

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setAnalyticsData(mockAnalyticsData);
    } catch (error) {
      setError("Failed to load analytics");
      setNotification({ type: "error", message: "Failed to load analytics" });
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (type, value) => {
    setDateRange((prev) => ({
      ...prev,
      [type]: new Date(value),
    }));
  };

  return (
    <div className="page-gradient min-h-screen">
      <Navbar />
      <div className="page-container">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <h1 className="page-title">Task Analytics</h1>

          <div className="flex gap-4">
            <input
              type="date"
              value={format(dateRange.start, "yyyy-MM-dd")}
              onChange={(e) => handleDateChange("start", e.target.value)}
              className="input-field dark:bg-gray-800/50 dark:border-gray-700/30"
            />
            <input
              type="date"
              value={format(dateRange.end, "yyyy-MM-dd")}
              onChange={(e) => handleDateChange("end", e.target.value)}
              className="input-field dark:bg-gray-800/50 dark:border-gray-700/30"
            />
          </div>
        </div>

        {/* Analytics Content */}
        <div className="space-y-6">
          {/* Productivity Score */}
          <div className="chart-card">
            <h3 className="text-lg font-semibold mb-4">Productivity Score</h3>
            <div className="flex items-center gap-4">
              <div className="text-5xl font-bold text-indigo-600">
                {analyticsData.productivityScore}%
              </div>
              <div className="text-gray-600">
                Based on task completion rate and timeliness
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Task Completion Timeline */}
            <div className="chart-card">
              <h3 className="text-lg font-semibold mb-4">
                Task Completion Timeline
              </h3>
              <div className="h-80">
                <Line
                  data={analyticsData.timelineData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              </div>
            </div>

            {/* Category Performance */}
            <div className="chart-card">
              <h3 className="text-lg font-semibold mb-4">
                Category Performance
              </h3>
              <div className="h-80">
                <Radar
                  data={analyticsData.categoryPerformance}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Task Insights */}
          <div className="chart-card">
            <h3 className="text-lg font-semibold mb-4">Key Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {analyticsData.insights.map((insight, idx) => (
                <div key={idx} className="p-4 bg-white/50 rounded-xl">
                  <p className="text-gray-600">{insight}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
