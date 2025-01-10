import React, { useState, useCallback, useEffect, useMemo } from "react";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { BiError } from "react-icons/bi";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import "./VoiceAssistant.css";

const VoiceAssistant = ({ onCommand }) => {
  const [messages, setMessages] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const addMessage = useCallback((type, text) => {
    setMessages((prev) => [
      ...prev.slice(-4),
      {
        type,
        text,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  }, []);

  const handleResult = useCallback(
    (transcript) => {
      const command = transcript.toLowerCase().trim();
      addMessage("user", command);

      if (command.includes("add task")) {
        onCommand("add_task");
        addMessage("ai", "Opening task form...");
      } else if (command.includes("show tasks")) {
        onCommand("show_tasks");
        addMessage("ai", "Showing all tasks...");
      } else if (command.includes("complete task")) {
        onCommand("complete_task");
        addMessage("ai", "Showing pending tasks...");
      } else {
        addMessage(
          "ai",
          "Try saying: 'add task', 'show tasks', or 'complete task'"
        );
      }
    },
    [onCommand, addMessage]
  );

  const { isListening, error, startListening, stopListening } =
    useSpeechRecognition(handleResult);

  const handleOnline = useCallback(() => setIsOnline(true), []);
  const handleOffline = useCallback(() => {
    setIsOnline(false);
    stopListening();
    addMessage("error", "Internet connection lost");
  }, [stopListening, addMessage]);

  // Network status effect
  useEffect(() => {
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [handleOnline, handleOffline]);

  // Status message effect
  useEffect(() => {
    if (error) {
      addMessage("error", error);
    }
  }, [error, addMessage]);

  // Listening status effect
  useEffect(() => {
    if (isListening) {
      addMessage("ai", "Listening... Speak now!");
    }
  }, [isListening, addMessage]);

  const toggleListening = useCallback(() => {
    if (!isOnline) {
      addMessage("error", "No internet connection");
      return;
    }
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, isOnline, startListening, stopListening, addMessage]);

  const buttonTitle = useMemo(() => {
    if (!isOnline) return "No internet connection";
    return isListening ? "Stop listening" : "Start listening";
  }, [isOnline, isListening]);

  return (
    <div className="voice-assistant">
      <div className="chat-container">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.type}`}>
            {message.type === "error" && <BiError className="error-icon" />}
            <div className="message-content">
              <span>{message.text}</span>
              <small className="message-time">{message.timestamp}</small>
            </div>
          </div>
        ))}
      </div>
      <button
        className={`mic-button ${isListening ? "recording" : ""} ${
          !isOnline ? "offline" : ""
        }`}
        onClick={toggleListening}
        disabled={!isOnline}
        title={buttonTitle}
      >
        {isListening ? <FaMicrophoneSlash /> : <FaMicrophone />}
      </button>
    </div>
  );
};

export default VoiceAssistant;
