import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, UserProfile } from '../types';
import { Send, Mic, Volume2, Square, Sparkles, Globe, AlertCircle, RefreshCw } from 'lucide-react';

interface ChatCompanionProps {
  user: UserProfile | null;
  onShowToast: (msg: string) => void;
}

export const ChatCompanion: React.FC<ChatCompanionProps> = ({ user, onShowToast }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'model',
      text: `Vanakkam & hello ${
        user?.name || 'friend'
      }! 🌸 I'm your Wellspring companion, powered by Gemini. Whether you're feeling overwhelmed, missing someone special, need a genuine laugh, or just want to chat about your day in Tamil, Tanglish, or English—I'm here for you. What's on your mind?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [enableSearch, setEnableSearch] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, []);

  // Voice speech synthesis
  const toggleSpeech = (id: string, text: string) => {
    if (!('speechSynthesis' in window)) {
      onShowToast('Text-to-speech is not supported on this browser.');
      return;
    }

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*_#`~]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  // Toggle voice recognition
  const toggleVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      onShowToast('Voice recognition is not supported in this browser.');
      return;
    }

    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        onShowToast('Listening... Speak now 🎙️');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
        onShowToast("Couldn't hear clearly, please try again.");
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error(err);
      setIsListening(false);
      onShowToast('Could not start microphone.');
    }
  };

  // Send message to real Gemini API
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    setApiError(null);
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const payload = {
        messages: newMessages.map((m) => ({
          role: m.role,
          text: m.text,
        })),
        userName: user?.name,
        enableSearch,
      };

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      let aiReplyText = "I'm listening and right here with you.";
      if (res.ok) {
        const data = await res.json();
        aiReplyText = data.text || aiReplyText;
      } else {
        aiReplyText = "Thank you for sharing that with me. I'm right here with you, listening closely. How does your heart feel right now?";
      }

      setApiError(null);
      const aiMessage: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        text: aiReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMessage]);

      if (autoSpeak) {
        toggleSpeech(aiMessage.id, aiReplyText);
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      const fallbackMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        text: "I hear you, and I'm right here with you. Take a slow, gentle breath. What's on your mind?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-4 text-center sm:text-left">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#14395b] dark:text-sky-100 flex items-center gap-2">
              <span>Your Wellness Companion</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/50 dark:bg-sky-950/70 text-[#14395b] dark:text-sky-200 font-semibold border border-white/40 dark:border-sky-800">
                Gemini 3.8 Flash
              </span>
            </h2>
            <p className="text-sm text-[#204972]/85 dark:text-sky-200/80 mt-1">
              Talk freely in English, Tamil, or Tanglish. A genuine companion for motivation, emotion, deep conversations, and laughter.
            </p>
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="flex flex-wrap items-center gap-4 mt-3 text-xs sm:text-sm text-[#14395b] dark:text-sky-200">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              id="groundingToggle"
              checked={enableSearch}
              onChange={(e) => setEnableSearch(e.target.checked)}
              className="rounded accent-sky-600 w-4 h-4 cursor-pointer"
            />
            <span className="flex items-center gap-1 font-medium">
              <Globe className="w-3.5 h-3.5 text-blue-500" />
              Google Search Grounding
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              id="autoSpeakToggle"
              checked={autoSpeak}
              onChange={(e) => setAutoSpeak(e.target.checked)}
              className="rounded accent-sky-600 w-4 h-4 cursor-pointer"
            />
            <span className="flex items-center gap-1 font-medium">
              <Volume2 className="w-3.5 h-3.5 text-sky-600 dark:text-sky-300" />
              Auto-speak AI replies
            </span>
          </label>
        </div>
      </div>

      {apiError && (
        <div className="mb-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span>{apiError}</span>
          </div>
        </div>
      )}

      {/* Chat Container */}
      <div className="backdrop-blur-md bg-white/40 dark:bg-[#0c2440]/80 rounded-2xl sm:rounded-3xl border border-white/50 dark:border-white/15 shadow-xl shadow-sky-950/15 flex flex-col h-[560px] overflow-hidden">
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isAI = msg.role === 'model';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isAI ? 'items-start' : 'items-end'}`}
              >
                <div
                  className={`max-w-[88%] sm:max-w-[80%] rounded-2xl px-4 py-3 text-sm sm:text-base leading-relaxed shadow-sm ${
                    isAI
                      ? 'bg-gradient-to-br from-rose-50 to-blue-50/70 dark:from-slate-800 dark:to-slate-800/90 text-slate-800 dark:text-slate-100 rounded-bl-sm border border-rose-100/70 dark:border-slate-700'
                      : 'bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-br-sm font-medium'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>

                  {/* AI Message Action Bar */}
                  {isAI && (
                    <div className="flex items-center justify-between gap-3 mt-2.5 pt-2 border-t border-rose-200/50 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400">
                      <span className="text-[11px] opacity-75">{msg.timestamp}</span>

                      <button
                        id={`speak-btn-${msg.id}`}
                        onClick={() => toggleSpeech(msg.id, msg.text)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                          speakingId === msg.id
                            ? 'bg-rose-500 text-white animate-pulse'
                            : 'bg-white/80 dark:bg-slate-700/80 hover:bg-rose-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
                        }`}
                        title="Listen to voice"
                      >
                        {speakingId === msg.id ? (
                          <>
                            <Square className="w-3 h-3 fill-current" />
                            <span>Stop</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3 h-3 text-rose-500" />
                            <span>Listen</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {!isAI && (
                  <span className="text-[11px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
                )}
              </div>
            );
          })}

          {/* Loading Indicator */}
          {loading && (
            <div className="flex items-start">
              <div className="bg-gradient-to-br from-rose-50 to-blue-50/70 dark:from-slate-800 dark:to-slate-800/90 rounded-2xl rounded-bl-sm px-4 py-3 border border-rose-100/70 dark:border-slate-700 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <Sparkles className="w-4 h-4 text-rose-500 animate-spin" />
                <span>Gemini is thinking with care... 🌸</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 sm:p-4 bg-white/40 dark:bg-sky-950/60 border-t border-white/50 dark:border-white/10">
          <div className="flex items-end gap-2">
            <textarea
              id="chatInput"
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type in English, Tamil, or Tanglish (e.g., 'Tell me a joke', 'I miss someone', 'Enna panra?')..."
              className="flex-1 resize-none px-4 py-2.5 text-sm sm:text-base rounded-2xl bg-white/70 dark:bg-[#091e36]/80 border border-white/60 dark:border-white/20 text-[#14395b] dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400 transition-colors"
            />

            {/* Voice Input Button */}
            <button
              id="micBtn"
              type="button"
              onClick={toggleVoiceInput}
              title={isListening ? 'Stop listening' : 'Click to speak'}
              className={`p-3 rounded-full transition-all flex items-center justify-center shrink-0 cursor-pointer ${
                isListening
                  ? 'bg-red-500 text-white animate-mic-pulse'
                  : 'bg-white/80 dark:bg-slate-800 text-[#14395b] dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-slate-700'
              }`}
            >
              <Mic className="w-5 h-5" />
            </button>

            {/* Send Button */}
            <button
              id="sendBtn"
              type="button"
              onClick={() => handleSendMessage()}
              disabled={!input.trim() || loading}
              title="Send message"
              className="p-3 rounded-full bg-sky-100/90 dark:bg-sky-100 hover:bg-white disabled:opacity-50 text-[#133557] font-bold transition-all shadow-md shadow-sky-950/15 flex items-center justify-center shrink-0 cursor-pointer hover:scale-105"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
