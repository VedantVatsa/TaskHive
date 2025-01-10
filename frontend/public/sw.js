self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener("push", (event) => {
  const options = {
    body: event.data.text(),
    icon: "/icons/notification.svg",
    badge: "/icons/task.svg",
  };

  event.waitUntil(self.registration.showNotification("TaskHive", options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow("/"));
});
