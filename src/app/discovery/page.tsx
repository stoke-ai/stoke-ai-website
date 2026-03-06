'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Suspense } from 'react';
import { useConversation } from '@11labs/react';

function DiscoveryContent() {
  const searchParams = useSearchParams();
  const leadName = searchParams.get('name') || '';
  const leadBusiness = searchParams.get('business') || '';
  const leadPainPoint = searchParams.get('painPoint') || '';
  const leadEmail = searchParams.get('email') || '';
  const leadPhone = searchParams.get('phone') || '';

  // Redirect to home if no opt-in (no name = didn't come through the form)
  useEffect(() => {
    if (!leadName) {
      window.location.href = '/#contact';
    }
  }, [leadName]);

  const [transcript, setTranscript] = useState<Array<{role: 'user' | 'assistant', text: string}>>([]);
  const [currentAgentText, setCurrentAgentText] = useState('');
  const [conversationSaved, setConversationSaved] = useState(false);
  const [showReschedule, setShowReschedule] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleHour, setRescheduleHour] = useState('12');
  const [rescheduleMinute, setRescheduleMinute] = useState('00');
  const [rescheduleAmPm, setRescheduleAmPm] = useState('PM');
  const [rescheduled, setRescheduled] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const [micError, setMicError] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const transcriptRef = useRef(transcript);
  transcriptRef.current = transcript;

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript, currentAgentText]);

  const conversation = useConversation({
    onConnect: () => {
      console.log('ElevenLabs connected');
      setConnectionError(false);
    },
    onDisconnect: () => {
      console.log('ElevenLabs disconnected');
      // Save transcript on disconnect
      if (transcriptRef.current.length > 0 && !conversationSaved) {
        saveTranscript(transcriptRef.current);
      }
    },
    onMessage: (message: { source: string; message: string }) => {
      console.log('ElevenLabs message:', message);
      if (message.source === 'ai') {
        setTranscript(prev => [...prev, { role: 'assistant', text: message.message }]);
        setCurrentAgentText('');
      } else if (message.source === 'user') {
        setTranscript(prev => [...prev, { role: 'user', text: message.message }]);
      }
    },
    onError: (error: unknown) => {
      console.error('ElevenLabs error:', error);
      setConnectionError(true);
    },
  });

  const startConversation = useCallback(async () => {
    try {
      setConnectionError(false);

      // Get signed URL and overrides from our API
      const response = await fetch('/api/elevenlabs/signed-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: leadName,
          business: leadBusiness,
          painPoint: leadPainPoint,
          email: leadEmail,
          phone: leadPhone,
        }),
      });

      if (!response.ok) throw new Error('Failed to get session');
      const { signedUrl, overrides } = await response.json();

      // Start ElevenLabs conversation (SDK handles mic permission internally)
      await conversation.startSession({
        signedUrl,
        overrides,
      });
    } catch (error: unknown) {
      console.error('Connection error:', error);
      const msg = error instanceof Error ? error.message : String(error);
      if (msg.includes('NotFound') || msg.includes('Permission') || msg.includes('NotAllowed')) {
        setMicError(true);
      }
      setConnectionError(true);
    }
  }, [conversation, leadName, leadBusiness, leadPainPoint, leadEmail, leadPhone]);

  const saveTranscript = async (finalTranscript: Array<{role: string, text: string}>) => {
    try {
      await fetch('/api/discovery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: leadName,
          email: leadEmail,
          phone: leadPhone,
          business: leadBusiness,
          painPoint: leadPainPoint,
          transcript: finalTranscript,
        }),
      });
      setConversationSaved(true);
    } catch (err) {
      console.error('Failed to save transcript:', err);
    }
  };

  const endConversation = async () => {
    if (transcriptRef.current.length > 0) {
      saveTranscript(transcriptRef.current);
    }
    await conversation.endSession();
  };

  const handleReschedule = async () => {
    if (!rescheduleDate) return;
    let h = parseInt(rescheduleHour);
    if (rescheduleAmPm === 'PM' && h !== 12) h += 12;
    if (rescheduleAmPm === 'AM' && h === 12) h = 0;
    const time24 = `${h.toString().padStart(2, '0')}:${rescheduleMinute}`;

    if (transcriptRef.current.length > 0) {
      saveTranscript(transcriptRef.current);
    }
    await conversation.endSession();

    try {
      await fetch('/api/lead-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: leadName,
          email: leadEmail,
          phone: leadPhone,
          business: leadBusiness,
          painPoint: leadPainPoint,
          action: 'schedule',
          scheduleDate: rescheduleDate,
          scheduleTime: time24,
          scheduleTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }),
      });
      setRescheduled(true);
    } catch {
      setRescheduled(true);
    }
  };

  const isConnected = conversation.status === 'connected';
  const isConnecting = conversation.status === 'connecting';
  const isIdle = conversation.status === 'disconnected' && !connectionError;
  const isSpeaking = conversation.isSpeaking;

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="Stoke-AI" width={120} height={40} />
          </a>
          <div className="text-sm text-gray-400">
            Voice Chat with <span className="text-orange-400 font-medium">Spark</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 max-w-3xl flex flex-col">
        {/* Welcome Section - only show when idle */}
        {isIdle && transcript.length === 0 && (
          <div className="text-center mb-8 space-y-4">
            <h1 className="text-3xl font-bold text-white">
              Welcome to Your Free Assessment
            </h1>
            <div className="max-w-2xl mx-auto space-y-3 text-gray-300">
              <p>
                I&apos;m Spark, the AI that helps business owners identify where they&apos;re losing time and money to busywork.
              </p>
              <p>
                This conversation takes about <strong className="text-orange-400">5 minutes</strong>. I&apos;ll ask you a few questions about how your business runs day-to-day, and show you exactly where an operating system could free up your time.
              </p>
              <p className="text-sm text-gray-400">
                No sales pitch. No pressure. Just an honest assessment of whether we can actually help.
              </p>
            </div>
          </div>
        )}

        {/* Transcript Area */}
        <div className="flex-1 overflow-y-auto space-y-4 pb-4 min-h-[300px]">
          {transcript.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shrink-0">
                  <span className="text-lg">⚡</span>
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.role === 'user' ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-100'
              }`}>
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
              {msg.role === 'user' && (
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>
          ))}
          {currentAgentText && (
            <div className="flex gap-3 justify-start">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shrink-0">
                <span className="text-lg">⚡</span>
              </div>
              <div className="bg-gray-800 rounded-2xl px-4 py-3 text-gray-100">
                <p className="whitespace-pre-wrap">{currentAgentText}</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Control Area */}
        <div className="border-t border-gray-800 pt-6 pb-4">
          <div className="flex flex-col items-center gap-4">
            {isIdle && transcript.length === 0 && (
              <button
                onClick={startConversation}
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-full text-lg font-semibold transition-all transform hover:scale-105"
              >
                Start Conversation
              </button>
            )}

            {isConnecting && (
              <div className="flex items-center gap-3 text-gray-400">
                <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                Connecting...
              </div>
            )}

            {isConnected && (
              <div className="flex flex-col items-center gap-4">
                {/* Animated orb */}
                <div className={`relative w-32 h-32 ${isSpeaking ? 'scale-110' : ''} transition-transform`}>
                  <div className={`absolute inset-0 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 ${
                    isSpeaking ? 'animate-pulse' : 'opacity-80'
                  }`} />
                  <div className={`absolute inset-2 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 ${
                    isSpeaking ? 'animate-ping' : ''
                  }`} style={{ animationDuration: '1.5s' }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl">⚡</span>
                  </div>
                </div>

                <div className="text-center">
                  {isSpeaking ? (
                    <span className="text-orange-400">Spark is speaking...</span>
                  ) : (
                    <span className="text-green-400">Listening...</span>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowReschedule(true)}
                    className="px-6 py-2 border border-orange-500/30 hover:border-orange-500 text-orange-400 rounded-full text-sm transition-all"
                  >
                    Finish Later
                  </button>
                  <button
                    onClick={endConversation}
                    className="px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-full text-sm transition-all"
                  >
                    End Conversation
                  </button>
                </div>

                {showReschedule && !rescheduled && (
                  <div className="bg-gray-800/80 border border-orange-500/20 rounded-xl p-4 w-full max-w-sm">
                    <p className="text-sm text-gray-300 mb-3">No worries! Pick a time and Spark will text you a link to finish.</p>
                    <div className="space-y-2">
                      <input
                        type="date"
                        className="w-full px-3 py-2 bg-black/50 border border-orange-500/30 rounded-lg focus:outline-none focus:border-orange-500 text-white text-sm [color-scheme:dark]"
                        min={new Date(Date.now() - 86400000).toISOString().split('T')[0]}
                        value={rescheduleDate}
                        onChange={(e) => setRescheduleDate(e.target.value)}
                      />
                      <div className="flex gap-1">
                        <select className="flex-1 px-2 py-2 bg-black/50 border border-orange-500/30 rounded-lg text-white text-sm" value={rescheduleHour} onChange={(e) => setRescheduleHour(e.target.value)}>
                          {['12','1','2','3','4','5','6','7','8','9','10','11'].map(h => <option key={h} value={h}>{h}</option>)}
                        </select>
                        <select className="px-2 py-2 bg-black/50 border border-orange-500/30 rounded-lg text-white text-sm" value={rescheduleMinute} onChange={(e) => setRescheduleMinute(e.target.value)}>
                          <option value="00">:00</option><option value="15">:15</option><option value="30">:30</option><option value="45">:45</option>
                        </select>
                        <select className="px-2 py-2 bg-black/50 border border-orange-500/30 rounded-lg text-white text-sm" value={rescheduleAmPm} onChange={(e) => setRescheduleAmPm(e.target.value)}>
                          <option value="AM">AM</option><option value="PM">PM</option>
                        </select>
                      </div>
                      <button
                        onClick={handleReschedule}
                        disabled={!rescheduleDate}
                        className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 text-black font-bold py-2 rounded-lg text-sm transition-all"
                      >
                        Schedule & Save Progress
                      </button>
                    </div>
                  </div>
                )}

                {rescheduled && (
                  <div className="bg-gray-800/80 border border-green-500/20 rounded-xl p-4 text-center">
                    <p className="text-green-400 font-medium">✓ Scheduled!</p>
                    <p className="text-gray-400 text-sm mt-1">Spark will text you a link to finish your assessment. Your progress is saved.</p>
                  </div>
                )}
              </div>
            )}

            {(connectionError || (isIdle && transcript.length > 0 && !conversationSaved)) && (
              <div className="flex flex-col items-center gap-3">
                {micError ? (
                  <>
                    <span className="text-red-400 text-center">
                      🎙️ Microphone access is required for the voice assessment.
                    </span>
                    <span className="text-gray-400 text-sm text-center max-w-md">
                      Please allow microphone access in your browser settings and try again. On mobile, make sure your browser has microphone permission in your phone&apos;s settings.
                    </span>
                  </>
                ) : (
                  <span className="text-red-400">Connection failed. Please try again.</span>
                )}
                <button
                  onClick={() => { setConnectionError(false); setMicError(false); startConversation(); }}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-full transition-all"
                >
                  Retry
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-3 text-center text-xs text-gray-500">
        {conversationSaved ? (
          <div className="space-y-2">
            <div className="text-orange-400 font-medium">✓ Assessment Complete!</div>
            <div>We&apos;ll analyze your responses and follow up within 24 hours with a custom recommendation for your business.</div>
          </div>
        ) : isConnected ? (
          'Speak naturally — Spark understands conversational language.'
        ) : (
          'This conversation helps us understand your needs. No commitment required.'
        )}
      </footer>
    </div>
  );
}

export default function Discovery() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0d0d0d] text-white flex items-center justify-center">Loading...</div>}>
      <DiscoveryContent />
    </Suspense>
  );
}
