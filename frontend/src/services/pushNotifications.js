export const requestNotificationPermission = async () => {
  if (!("Notification" in window)) {
    throw new Error("This browser does not support notifications");
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    throw new Error("Notification permission not granted");
  }

  return permission;
};

export const sendPushNotification = async ({ title, body, icon, data }) => {
  if (!("Notification" in window)) {
    console.warn("This browser does not support notifications");
    return;
  }

  try {
    if (Notification.permission === "granted") {
      return new Notification(title, {
        body,
        icon: icon || "/notification-icon.png",
        badge: "/badge.png",
        data,
        requireInteraction: true,
      });
    }
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};
