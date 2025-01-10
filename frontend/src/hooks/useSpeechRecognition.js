import { useState, useRef, useCallback, useEffect } from "react";

export const useSpeechRecognition = (onResult) => {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);
  const timeoutRef = useRef(null);

  const cleanup = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const createRecognition = useCallback(() => {
    if (!window.webkitSpeechRecognition) {
      throw new Error("Speech recognition not supported");
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      cleanup();
      setIsListening(false);

      switch (event.error) {
        case "network":
          setError("Please check your internet connection");
          break;
        case "not-allowed":
          setError("Microphone access needed");
          break;
        case "no-speech":
          setError("No speech detected");
          break;
        default:
          setError("Error occurred, please try again");
      }
    };

    recognition.onresult = (event) => {
      const result = event.results[0][0].transcript;
      onResult(result);
    };

    return recognition;
  }, [onResult, cleanup]);

  const startListening = useCallback(() => {
    cleanup();
    try {
      recognitionRef.current = createRecognition();
      recognitionRef.current.start();
    } catch (err) {
      setError("Failed to start voice recognition");
      setIsListening(false);
    }
  }, [createRecognition, cleanup]);

  const stopListening = useCallback(() => {
    cleanup();
    setIsListening(false);
  }, [cleanup]);

  return {
    isListening,
    error,
    startListening,
    stopListening,
  };
};
