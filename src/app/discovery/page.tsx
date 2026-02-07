'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';

export default function Discovery() {
  const [status, setStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState<Array<{role: 'user' | 'assistant', text: string}>>([]);
  const [currentText, setCurrentText] = useState('');
  
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript, currentText]);

  const startConversation = useCallback(async () => {
    try {
      setStatus('connecting');
      
      // Get ephemeral token
      const tokenResponse = await fetch('/api/realtime/session', { method: 'POST' });
      if (!tokenResponse.ok) throw new Error('Failed to get session token');
      const { client_secret } = await tokenResponse.json();
      
      // Create peer connection
      const pc = new RTCPeerConnection();
      peerConnectionRef.current = pc;
      
      // Set up audio playback
      const audioEl = document.createElement('audio');
      audioEl.autoplay = true;
      audioElementRef.current = audioEl;
      
      pc.ontrack = (e) => {
        audioEl.srcObject = e.streams[0];
      };
      
      // Get microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => pc.addTrack(track, stream));
      
      // Set up data channel for events
      const dc = pc.createDataChannel('oai-events');
      dataChannelRef.current = dc;
      
      dc.onmessage = (e) => {
        const event = JSON.parse(e.data);
        handleRealtimeEvent(event);
      };
      
      dc.onopen = () => {
        setStatus('connected');
        setIsListening(true);
        // Trigger initial response
        dc.send(JSON.stringify({ type: 'response.create' }));
      };
      
      // Create and set local description
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      
      // Connect to OpenAI Realtime
      const sdpResponse = await fetch('https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${client_secret.value}`,
          'Content-Type': 'application/sdp'
        },
        body: offer.sdp
      });
      
      if (!sdpResponse.ok) throw new Error('Failed to connect to OpenAI');
      
      const answer: RTCSessionDescriptionInit = {
        type: 'answer',
        sdp: await sdpResponse.text()
      };
      await pc.setRemoteDescription(answer);
      
    } catch (error) {
      console.error('Connection error:', error);
      setStatus('error');
    }
  }, []);

  const handleRealtimeEvent = (event: Record<string, unknown>) => {
    switch (event.type) {
      case 'response.audio_transcript.delta':
        setCurrentText(prev => prev + (event.delta as string || ''));
        setIsSpeaking(true);
        break;
      case 'response.audio_transcript.done':
        if (currentText || event.transcript) {
          setTranscript(prev => [...prev, { role: 'assistant', text: (event.transcript as string) || currentText }]);
        }
        setCurrentText('');
        setIsSpeaking(false);
        break;
      case 'conversation.item.input_audio_transcription.completed':
        if (event.transcript) {
          setTranscript(prev => [...prev, { role: 'user', text: event.transcript as string }]);
        }
        break;
      case 'input_audio_buffer.speech_started':
        setIsListening(true);
        break;
      case 'input_audio_buffer.speech_stopped':
        setIsListening(false);
        break;
    }
  };

  const endConversation = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (dataChannelRef.current) {
      dataChannelRef.current.close();
      dataChannelRef.current = null;
    }
    setStatus('idle');
    setIsListening(false);
    setIsSpeaking(false);
  };

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
          {currentText && (
            <div className="flex gap-3 justify-start">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shrink-0">
                <span className="text-lg">⚡</span>
              </div>
              <div className="bg-gray-800 rounded-2xl px-4 py-3 text-gray-100">
                <p className="whitespace-pre-wrap">{currentText}</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Control Area */}
        <div className="border-t border-gray-800 pt-6 pb-4">
          <div className="flex flex-col items-center gap-4">
            {status === 'idle' && (
              <button
                onClick={startConversation}
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-full text-lg font-semibold transition-all transform hover:scale-105"
              >
                Start Conversation
              </button>
            )}
            
            {status === 'connecting' && (
              <div className="flex items-center gap-3 text-gray-400">
                <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                Connecting...
              </div>
            )}
            
            {status === 'connected' && (
              <div className="flex flex-col items-center gap-4">
                {/* Animated orb */}
                <div className={`relative w-32 h-32 ${isSpeaking ? 'scale-110' : ''} transition-transform`}>
                  <div className={`absolute inset-0 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 ${
                    isSpeaking ? 'animate-pulse' : isListening ? 'opacity-80' : 'opacity-60'
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
                  ) : isListening ? (
                    <span className="text-green-400">Listening...</span>
                  ) : (
                    <span className="text-gray-400">Just start talking</span>
                  )}
                </div>
                
                <button
                  onClick={endConversation}
                  className="px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-full text-sm transition-all"
                >
                  End Conversation
                </button>
              </div>
            )}
            
            {status === 'error' && (
              <div className="flex flex-col items-center gap-3">
                <span className="text-red-400">Connection failed. Please try again.</span>
                <button
                  onClick={startConversation}
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
        This conversation helps us understand your needs. No commitment required.
      </footer>
    </div>
  );
}
