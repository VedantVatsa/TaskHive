importScripts("./assets/notification-icon.js");

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener("push", (event) => {
  const data = event.data?.json() ?? {};

  const options = {
    body: data.body || "",
    icon: self.icons.task,
    badge: self.icons.badge,
    image: self.icons.default,
    vibrate: [100, 50, 100],
    data: data.data || {},
    actions: [
      {
        action: "complete",
        title: "Mark Complete",
        icon: self.icons.badge,
      },
      {
        action: "snooze",
        title: "Snooze",
        icon: self.icons.default,
      },
    ],
    tag: data.tag || "default",
    renotify: true,
    requireInteraction: true,
  };

  event.waitUntil(
    self.registration.showNotification(data.title || "Task Reminder", options)
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "complete") {
    // Handle complete action
    clients.openWindow(`/tasks/${event.notification.data.taskId}/complete`);
  } else if (event.action === "snooze") {
    // Handle snooze action
    clients.openWindow(`/tasks/${event.notification.data.taskId}/snooze`);
  } else {
    // Default action
    clients.openWindow(`/tasks/${event.notification.data.taskId}`);
  }
});
