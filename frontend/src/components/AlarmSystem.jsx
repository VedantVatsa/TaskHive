import { useState, useEffect } from "react";
import NotificationService from "../services/NotificationService";

const AlarmSystem = ({ deadline, taskTitle, onAlarmChange }) => {
  const [alarmEnabled, setAlarmEnabled] = useState(false);
  const [alarmTime, setAlarmTime] = useState(deadline || "");
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [snoozeTime, setSnoozeTime] = useState(5); // minutes
  const [notificationTypes, setNotificationTypes] = useState({
    browser: true,
    email: false,
    voice: false,
  });

  const [reminderTimes, setReminderTimes] = useState([
    { enabled: true, minutes: 30 },
    { enabled: false, minutes: 60 },
    { enabled: false, minutes: 1440 }, // 24 hours
  ]);

  const handleAlarmToggle = () => {
    setAlarmEnabled(!alarmEnabled);
    updateAlarmSettings();
  };

  const updateAlarmSettings = () => {
    const notifications = Object.entries(notificationTypes)
      .filter(([_, enabled]) => enabled)
      .map(([type]) => ({
        type,
        time: new Date(alarmTime),
        sent: false,
      }));

    const reminders = reminderTimes
      .filter((r) => r.enabled)
      .map((r) => ({
        type: "browser",
        time: new Date(new Date(alarmTime).getTime() - r.minutes * 60000),
        sent: false,
      }));

    onAlarmChange({
      enabled: alarmEnabled,
      time: alarmTime,
      voiceEnabled,
      snoozeTime,
      notifications: [...notifications, ...reminders],
      repeatInterval: "none",
    });
  };

  const playAlarmSound = () => {
    const audio = new Audio("/alarm-sound.mp3");
    audio.play();

    if (voiceEnabled) {
      const speech = new SpeechSynthesisUtterance(
        `Time for task: ${taskTitle}`
      );
      window.speechSynthesis.speak(speech);
    }
  };

  useEffect(() => {
    let timer;
    if (alarmEnabled && alarmTime) {
      const alarmDate = new Date(alarmTime);
      const now = new Date();

      if (alarmDate > now) {
        timer = setTimeout(() => {
          playAlarmSound();
        }, alarmDate - now);
      }
    }

    return () => clearTimeout(timer);
  }, [alarmEnabled, alarmTime, voiceEnabled, taskTitle]);

  useEffect(() => {
    if (alarmEnabled && deadline) {
      const task = {
        title: taskTitle,
        deadline,
        _id: Date.now().toString(), // Temporary ID for notifications
      };

      reminderTimes
        .filter((r) => r.enabled)
        .forEach((reminder) => {
          NotificationService.scheduleNotification(task, reminder.minutes);
        });
    }
  }, [alarmEnabled, deadline, taskTitle, reminderTimes]);

  return (
    <div className="glass-morphism p-4 rounded-xl space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Alarm Settings</h3>
        <label className="flex items-center cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              checked={alarmEnabled}
              onChange={handleAlarmToggle}
              className="sr-only"
            />
            <div className="w-10 h-6 bg-gray-300 rounded-full shadow-inner"></div>
            <div
              className={`absolute w-4 h-4 bg-white rounded-full shadow inset-y-1 left-1 transition-transform
              ${alarmEnabled ? "transform translate-x-4" : ""}`}
            ></div>
          </div>
        </label>
      </div>

      {alarmEnabled && (
        <div className="space-y-3 animate-slide-up">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Alarm Time
            </label>
            <input
              type="datetime-local"
              value={alarmTime}
              onChange={(e) => setAlarmTime(e.target.value)}
              className="input-field mt-1"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="voice-enabled"
              checked={voiceEnabled}
              onChange={(e) => setVoiceEnabled(e.target.checked)}
              className="rounded text-indigo-600"
            />
            <label htmlFor="voice-enabled" className="text-sm text-gray-700">
              Enable Voice Reminder
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Snooze Duration (minutes)
            </label>
            <select
              value={snoozeTime}
              onChange={(e) => setSnoozeTime(Number(e.target.value))}
              className="input-field mt-1"
            >
              <option value={5}>5 minutes</option>
              <option value={10}>10 minutes</option>
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Notification Types
            </label>
            {Object.entries(notificationTypes).map(([type, enabled]) => (
              <label key={type} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => {
                    setNotificationTypes((prev) => ({
                      ...prev,
                      [type]: e.target.checked,
                    }));
                    updateAlarmSettings();
                  }}
                  className="rounded text-indigo-600"
                />
                <span className="text-sm capitalize">{type}</span>
              </label>
            ))}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Reminder Times
            </label>
            {reminderTimes.map((reminder, index) => (
              <label key={index} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={reminder.enabled}
                  onChange={(e) => {
                    setReminderTimes((prev) =>
                      prev.map((r, i) =>
                        i === index ? { ...r, enabled: e.target.checked } : r
                      )
                    );
                    updateAlarmSettings();
                  }}
                  className="rounded text-indigo-600"
                />
                <span className="text-sm">
                  {reminder.minutes >= 60
                    ? `${reminder.minutes / 60} hour${
                        reminder.minutes === 60 ? "" : "s"
                      }`
                    : `${reminder.minutes} minutes`}{" "}
                  before
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AlarmSystem;
