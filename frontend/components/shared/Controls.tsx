"use client";

import React, { useState } from "react";
import { Mic, MicOff, Globe2 } from "lucide-react";

interface VoiceInputProps {
  onSpeechResult: (text: string) => void;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ onSpeechResult }) => {
  const [isListening, setIsListening] = useState(false);

  const toggleListening = () => {
    if (!isListening) {
      if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
        try {
          const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
          const recognition = new SpeechRecognition();
          recognition.lang = "en-IN";
          recognition.onstart = () => setIsListening(true);
          recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            onSpeechResult(transcript);
            setIsListening(false);
          };
          recognition.onerror = () => setIsListening(false);
          recognition.onend = () => setIsListening(false);
          recognition.start();
        } catch (e) {
          setIsListening(false);
          onSpeechResult("I manufacture stainless steel water bottles for everyday use.");
        }
      } else {
        // Fallback for UI demonstration
        setIsListening(true);
        setTimeout(() => {
          setIsListening(false);
          onSpeechResult("I manufacture stainless steel water bottles for everyday use.");
        }, 2000);
      }
    } else {
      setIsListening(false);
    }
  };

  return (
    <button
      type="button"
      onClick={toggleListening}
      className={`p-2 rounded-full border transition-all ${
        isListening
          ? "bg-rose-500 text-white border-rose-600 animate-pulse"
          : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300"
      }`}
      title="Speech Input (Web Speech API)"
    >
      {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
    </button>
  );
};
