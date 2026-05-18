'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [optedIn, setOptedIn] = useState(false);
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionIdRef = useRef(`chat_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`);
  const lastTranscriptKeyRef = useRef('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateIsMobile = () => setIsMobile(window.matchMedia('(max-width: 639px)').matches);
    updateIsMobile();
    window.addEventListener('resize', updateIsMobile);
    return () => window.removeEventListener('resize', updateIsMobile);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !isOpen) return;

    const updateKeyboardOffset = () => {
      const visualViewport = window.visualViewport;
      if (!visualViewport) {
        setKeyboardOffset(0);
        return;
      }

      const offset = Math.max(0, window.innerHeight - visualViewport.height - visualViewport.offsetTop);
      setKeyboardOffset(offset);
      setTimeout(scrollToBottom, 50);
      setTimeout(scrollToBottom, 250);
    };

    updateKeyboardOffset();
    window.visualViewport?.addEventListener('resize', updateKeyboardOffset);
    window.visualViewport?.addEventListener('scroll', updateKeyboardOffset);
    window.addEventListener('orientationchange', updateKeyboardOffset);

    return () => {
      window.visualViewport?.removeEventListener('resize', updateKeyboardOffset);
      window.visualViewport?.removeEventListener('scroll', updateKeyboardOffset);
      window.removeEventListener('orientationchange', updateKeyboardOffset);
      setKeyboardOffset(0);
    };
  }, [isOpen]);

  const transcriptPayload = (messagesToSend: Message[], reason: string) => ({
    name: leadName,
    phone: leadPhone,
    business: '',
    painPoint: '',
    source: `chat-widget:${reason}`,
    sessionId: sessionIdRef.current,
    transcript: messagesToSend.map(m => ({ role: m.role, text: m.content })),
  });

  const saveTranscript = (messagesToSend: Message[], reason: string, useBeacon = false) => {
    if (!optedIn || messagesToSend.length < 2) return;

    const transcriptKey = messagesToSend.map(m => `${m.role}:${m.content}`).join('|');
    if (transcriptKey === lastTranscriptKeyRef.current) return;
    lastTranscriptKeyRef.current = transcriptKey;

    const payload = JSON.stringify(transcriptPayload(messagesToSend, reason));
    if (useBeacon && typeof navigator !== 'undefined' && navigator.sendBeacon) {
      navigator.sendBeacon('/api/discovery', payload);
      return;
    }

    fetch('/api/discovery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
    }).catch(() => {});
  };

  // Save conversation to backend when window closes or they leave
  useEffect(() => {
    const saveOnExit = () => {
      saveTranscript(messages, 'exit', true);
    };
    window.addEventListener('beforeunload', saveOnExit);
    return () => window.removeEventListener('beforeunload', saveOnExit);
  }, [optedIn, messages]);

  const handleOptIn = () => {
    if (!leadName.trim() || !leadPhone.trim()) return;
    setOptedIn(true);
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: "Hey 👋 I'm Spark, Stoke's custom AI assistant. I help business owners figure out if custom automation can eliminate the manual data entry and busywork slowing down their daily operations. What kind of business do you run?",
        timestamp: new Date(),
      },
    ]);
  };

  const handleClose = () => {
    // Save final conversation when closing
    saveTranscript(messages, 'close');
    setIsOpen(false);
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages
        .filter((m) => m.id !== '1')
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage.content,
          history,
          leadName,
          leadPhone,
        }),
      });

      const data = await res.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || "I'm having trouble connecting right now. Fill out the form above and we'll get back to you!",
        timestamp: new Date(),
      };

      const nextMessages = [...messages, userMessage, assistantMessage];
      setMessages(nextMessages);
      saveTranscript(nextMessages, 'assistant-reply');
    } catch {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Connection issue — but don't worry! Fill out the form above and we'll reach out within 24 hours.",
        timestamp: new Date(),
      };
      const nextMessages = [...messages, userMessage, assistantMessage];
      setMessages(nextMessages);
      saveTranscript(nextMessages, 'assistant-error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{ bottom: isOpen ? undefined : `calc(1rem + ${keyboardOffset}px)` }}
        className={`${isOpen ? 'hidden sm:flex' : 'flex'} fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full shadow-lg shadow-orange-500/25 items-center justify-center text-xl sm:text-2xl hover:scale-110 transition-transform z-50`}
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          style={isMobile ? { height: `calc(100dvh - ${keyboardOffset}px)`, bottom: 'env(safe-area-inset-bottom)' } : undefined}
          className="fixed inset-x-0 top-0 bottom-0 sm:top-auto sm:left-auto sm:right-6 sm:bottom-24 sm:w-96 h-[100dvh] sm:h-[70vh] sm:max-h-[500px] bg-gray-900 border border-gray-800 rounded-none sm:rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black/20 rounded-full flex items-center justify-center text-xl">
                  ⚡
                </div>
                <div>
                  <div className="font-bold text-black">Spark</div>
                  <div className="text-xs text-black/70">AI Assistant • Online</div>
                </div>
              </div>
              <button onClick={handleClose} className="text-black/50 hover:text-black text-lg">✕</button>
            </div>
          </div>

          {!optedIn ? (
            /* Opt-in Form */
            <div className="flex-1 flex flex-col justify-center p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
              <div className="text-center mb-6">
                <div className="text-3xl mb-2">⚡</div>
                <h3 className="text-lg font-bold text-white mb-1">Chat with Spark</h3>
                <p className="text-gray-400 text-sm">Quick intro so Spark knows who you are</p>
              </div>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Your name"
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && leadName && leadPhone && handleOptIn()}
                  className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-xl focus:outline-none focus:border-orange-500 transition-colors placeholder-gray-600 text-white text-sm"
                />
                <input
                  type="tel"
                  placeholder="Phone number"
                  value={leadPhone}
                  onChange={(e) => setLeadPhone(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && leadName && leadPhone && handleOptIn()}
                  className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-xl focus:outline-none focus:border-orange-500 transition-colors placeholder-gray-600 text-white text-sm"
                />
                <button
                  onClick={handleOptIn}
                  disabled={!leadName.trim() || !leadPhone.trim()}
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 text-black font-bold py-3 rounded-xl transition-all"
                >
                  Start Chatting →
                </button>
              </div>
              <p className="text-gray-600 text-xs text-center mt-4">
                No spam. Spark just needs to know who it&apos;s talking to.
              </p>
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="min-h-full flex flex-col justify-end space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                        msg.role === 'user'
                          ? 'bg-orange-500 text-black'
                          : 'bg-gray-800 text-white'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-800 rounded-2xl px-4 py-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input */}
              <div className="p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] border-t border-gray-800 bg-gray-900">
                <div className="flex gap-2 max-w-xl mx-auto">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onFocus={() => {
                      setTimeout(scrollToBottom, 50);
                      setTimeout(scrollToBottom, 250);
                      setTimeout(scrollToBottom, 500);
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Ask me anything..."
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 sm:py-2 text-base sm:text-sm focus:outline-none focus:border-orange-500 text-white placeholder-gray-500"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={isLoading || !input.trim()}
                    className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-black font-bold px-5 sm:px-4 py-3 sm:py-2 rounded-xl transition-colors"
                  >
                    →
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
