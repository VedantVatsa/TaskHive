import {
  requestNotificationPermission,
  sendPushNotification,
} from "./pushNotifications";

class NotificationService {
  constructor() {
    this.permission = null;
    this.supported = "Notification" in window;
    this.worker = null;
    this.icons = {
      task: `data:image/svg+xml,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" stroke-width="2">
          <path d="M9 11l3 3L22 4"/>
          <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
        </svg>
      `)}`,
      notification: `data:image/svg+xml,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" stroke-width="2">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 01-3.46 0"/>
        </svg>
      `)}`,
    };
  }

  async init() {
    if (!this.supported) {
      console.warn("Notifications not supported in this browser");
      return;
    }

    try {
      this.permission = await Notification.requestPermission();
      if (this.permission === "granted") {
        await this.registerServiceWorker();
      }
    } catch (error) {
      console.error("Notification initialization failed:", error);
    }
  }

  async registerServiceWorker() {
    if (!("serviceWorker" in navigator)) return;

    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
        type: "module",
      });
      this.worker = registration;
      console.log("Service Worker registered successfully");
    } catch (error) {
      console.error("Service Worker registration failed:", error);
    }
  }

  startChecking() {
    if (this.checkInterval) return;

    this.checkInterval = setInterval(() => {
      this.checkDeadlines();
    }, 60000); // Check every minute
  }

  async checkDeadlines() {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/tasks/deadlines", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch deadlines");

      const tasks = await response.json();
      tasks.forEach((task) => this.scheduleReminders(task));
    } catch (error) {
      console.error("Error checking deadlines:", error);
    }
  }

  async scheduleNotification(task, timeBeforeDeadline) {
    if (this.permission !== "granted") return;

    const notificationTime = new Date(task.deadline);
    notificationTime.setMinutes(
      notificationTime.getMinutes() - timeBeforeDeadline
    );

    const now = new Date();
    const timeUntilNotification = notificationTime - now;

    if (timeUntilNotification > 0) {
      setTimeout(() => {
        this.showNotification(task);
      }, timeUntilNotification);
    }
  }

  async showNotification(task) {
    if (this.permission !== "granted") return;

    const options = {
      body: `Deadline: ${new Date(task.deadline).toLocaleString()}`,
      icon: this.icons.task,
      badge: this.icons.notification,
      tag: task._id,
      renotify: true,
      requireInteraction: true,
      image: this.icons.notification,
      actions: [
        {
          action: "view",
          title: "View Task",
          icon: this.icons.notification,
        },
        {
          action: "snooze",
          title: "Snooze",
          icon: this.icons.notification,
        },
      ],
      vibrate: [100, 50, 100],
      silent: false,
      data: {
        taskId: task._id,
        url: `/tasks/${task._id}`,
      },
    };

    try {
      if (this.worker?.active) {
        await this.worker.showNotification(task.title, options);
      } else {
        new Notification(task.title, options);
      }
    } catch (error) {
      console.error("Error showing notification:", error);
    }
  }

  async scheduleReminders(task) {
    if (!task.alarm?.enabled) return;

    const reminders = [
      { minutes: 30, message: "30 minutes remaining" },
      { minutes: 60, message: "1 hour remaining" },
      { minutes: 24 * 60, message: "24 hours remaining" },
    ];

    reminders.forEach((reminder) => {
      this.scheduleNotification(task, reminder.minutes);
    });
  }

  stop() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    this.initialized = false;
  }

  // ...additional notification methods...
}

export default new NotificationService();
