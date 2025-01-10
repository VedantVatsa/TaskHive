import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import {
  FiUser,
  FiBell,
  FiMoon,
  FiLock,
  FiGlobe,
  FiSave,
  FiSun,
} from "react-icons/fi";
import Navbar from "../components/Navbar";
import Toast from "../components/Toast";
import { mockUserSettings, mockUserProfile } from "../utils/mockData";

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sound: true,
    },
    theme: "light",
    language: "en",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

  const [profile, setProfile] = useState({
    name: "",
    email: localStorage.getItem("userEmail") || "",
    avatar: "",
  });

  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    // Fetch user email from localStorage or JWT token
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setProfile((prev) => ({ ...prev, email: payload.email }));
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }

    fetchSettings();
    fetchProfile();
  }, []);

  // Add theme toggle functionality
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSettings(mockUserSettings);
    } catch (error) {
      setError("Failed to load settings");
      setNotification({ type: "error", message: "Failed to load settings" });
    }
  };

  const fetchProfile = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setProfile(mockUserProfile);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
  };

  const handleSave = async (section, data) => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`${API_BASE_URL}/settings/${section}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update local state based on section
      switch (section) {
        case "profile":
          setProfile((prev) => ({ ...prev, ...data }));
          break;
        case "notifications":
          setSettings((prev) => ({
            ...prev,
            notifications: data.notifications,
          }));
          break;
        case "region":
          setSettings((prev) => ({ ...prev, ...data }));
          break;
        case "appearance":
          setSettings((prev) => ({ ...prev, theme: data.theme }));
          break;
      }

      showNotification(
        `${
          section.charAt(0).toUpperCase() + section.slice(1)
        } settings updated successfully!`,
        "success"
      );
    } catch (error) {
      showNotification(
        error.response?.data?.message || `Failed to update ${section} settings`,
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (password.new !== password.confirm) {
      showNotification("New passwords don't match", "error");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE_URL}/user/change-password`,
        {
          currentPassword: password.current,
          newPassword: password.new,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      showNotification("Password updated successfully", "success");
      setPassword({ current: "", new: "", confirm: "" });
    } catch (error) {
      showNotification(
        error.response?.data?.message || "Failed to update password",
        "error"
      );
    }
  };

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
    handleSave("appearance", { theme: theme === "light" ? "dark" : "light" });
  };

  const handleNotificationToggle = (key) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key],
      },
    }));
    // Save immediately when toggled
    handleSave("notifications", {
      notifications: {
        ...settings.notifications,
        [key]: !settings.notifications[key],
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-10">
        <h1 className="text-3xl gradient-text mb-8">Settings</h1>

        <div className="space-y-6">
          {/* Theme Settings */}
          <div className="glass-morphism p-6 rounded-2xl">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <FiMoon className="text-indigo-600 dark:text-indigo-400" />
              <span className="gradient-text">Appearance</span>
            </h2>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">
                Theme Mode
              </span>
              <button
                onClick={handleToggleTheme}
                className="theme-toggle flex items-center gap-2 px-4 py-2 rounded-xl"
              >
                {theme === "light" ? (
                  <>
                    <FiSun className="text-yellow-500" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <FiMoon className="text-indigo-400" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Profile Settings */}
          <div className="glass-morphism p-6 rounded-2xl">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <FiUser /> Profile Settings
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Display Name"
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                className="input-field"
              />
              <input
                type="email"
                placeholder="Email"
                value={profile.email}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
                className="input-field"
                disabled
              />
              <button
                onClick={() => handleSave("profile", profile)}
                className="btn btn-primary w-full"
                disabled={saving}
              >
                <FiSave className="mr-2" /> Save Profile
              </button>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="glass-morphism p-6 rounded-2xl">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <FiBell /> Notification Settings
            </h2>
            <div className="space-y-4">
              {Object.entries(settings.notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="capitalize">{key} Notifications</span>
                  <label className="alarm-switch">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={() => handleNotificationToggle(key)}
                      className="sr-only"
                    />
                    <span
                      className={`alarm-switch-base ${
                        value ? "alarm-active" : ""
                      }`}
                    />
                  </label>
                </div>
              ))}
              <button
                onClick={() =>
                  handleSave("notifications", {
                    notifications: settings.notifications,
                  })
                }
                className="btn btn-primary w-full"
                disabled={saving}
              >
                <FiSave className="mr-2" /> Save Notification Settings
              </button>
            </div>
          </div>

          {/* Password Change Section */}
          <div className="glass-morphism p-6 rounded-2xl">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <FiLock /> Change Password
            </h2>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <input
                type="password"
                placeholder="Current Password"
                value={password.current}
                onChange={(e) =>
                  setPassword({ ...password, current: e.target.value })
                }
                className="input-field"
                required
              />
              <input
                type="password"
                placeholder="New Password"
                value={password.new}
                onChange={(e) =>
                  setPassword({ ...password, new: e.target.value })
                }
                className="input-field"
                required
                minLength={6}
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={password.confirm}
                onChange={(e) =>
                  setPassword({ ...password, confirm: e.target.value })
                }
                className="input-field"
                required
              />
              <button type="submit" className="btn btn-primary w-full">
                <FiSave className="mr-2" /> Update Password
              </button>
            </form>
          </div>

          {/* Language and Timezone Settings */}
          <div className="glass-morphism p-6 rounded-2xl">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <FiGlobe /> Language & Region
            </h2>
            <div className="space-y-4">
              <select
                value={settings.language}
                onChange={(e) => {
                  const newLanguage = e.target.value;
                  setSettings((prev) => ({ ...prev, language: newLanguage }));
                  handleSave("region", {
                    language: newLanguage,
                    timezone: settings.timezone,
                  });
                }}
                className="input-field"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </select>
              <select
                value={settings.timezone}
                onChange={(e) => {
                  const newTimezone = e.target.value;
                  setSettings((prev) => ({ ...prev, timezone: newTimezone }));
                  handleSave("region", {
                    language: settings.language,
                    timezone: newTimezone,
                  });
                }}
                className="input-field"
              >
                {Intl.supportedValuesOf("timeZone").map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      {notification && (
        <Toast {...notification} onClose={() => setNotification(null)} />
      )}
    </div>
  );
};

export default Settings;
