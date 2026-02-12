'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLanguage } from '@/context/LanguageContext';

const WEBHOOK_URL = 'https://n8n-n8n.ukq6rz.easypanel.host/webhook/fd095693-99f0-472c-9d03-65426bd3fdb4';
const ELEVENLABS_API_KEY = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY ?? '';
const ELEVENLABS_VOICE_ID_EN = process.env.NEXT_PUBLIC_ELEVENLABS_VOICE_ID_EN ?? '';
const ELEVENLABS_VOICE_ID_ES = process.env.NEXT_PUBLIC_ELEVENLABS_VOICE_ID_ES ?? '';

interface ChatMessage {
    role: 'user' | 'lia';
    content: string;
}

const hardcodedKeys = [
    { role: 'user' as const, key: 'lia.chat.user1' },
    { role: 'lia' as const, key: 'lia.chat.lia1' },
    { role: 'user' as const, key: 'lia.chat.user2' },
    { role: 'lia' as const, key: 'lia.chat.lia2' },
    { role: 'user' as const, key: 'lia.chat.user3' },
    { role: 'lia' as const, key: 'lia.chat.lia3' },
];

function getOrCreateWaId(): string {
    if (typeof window === 'undefined') return '';
    const stored = localStorage.getItem('lia_wa_id');
    if (stored) return stored;
    const id = Date.now().toString() + Math.random().toString(36).slice(2, 8);
    localStorage.setItem('lia_wa_id', id);
    return id;
}

// SpeechRecognition types for browser API
interface SpeechRecognitionEvent {
    results: { [index: number]: { [index: number]: { transcript: string } }; length: number };
}

type SpeechRecognitionInstance = {
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    onresult: ((e: SpeechRecognitionEvent) => void) | null;
    onend: (() => void) | null;
    onerror: (() => void) | null;
    start: () => void;
    stop: () => void;
    abort: () => void;
};

function getSpeechRecognition(): (new () => SpeechRecognitionInstance) | null {
    if (typeof window === 'undefined') return null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

async function speakWithElevenLabs(text: string, lang: string): Promise<void> {
    const voiceId = lang === 'es' ? ELEVENLABS_VOICE_ID_ES : ELEVENLABS_VOICE_ID_EN;
    if (!ELEVENLABS_API_KEY || !voiceId) return;

    const res = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
        {
            method: 'POST',
            headers: {
                'xi-api-key': ELEVENLABS_API_KEY,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text,
                model_id: 'eleven_multilingual_v2',
                voice_settings: { stability: 0.5, similarity_boost: 0.75 },
            }),
        }
    );

    if (!res.ok) return;

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.onended = () => URL.revokeObjectURL(url);
    await audio.play();
}

const LiaChat = () => {
    const { t, lang } = useLanguage();
    const [isLive, setIsLive] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [voiceEnabled, setVoiceEnabled] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const waIdRef = useRef('');
    const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

    useEffect(() => {
        waIdRef.current = getOrCreateWaId();
    }, []);

    useEffect(() => {
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.onend = null;
                recognitionRef.current.onresult = null;
                recognitionRef.current.onerror = null;
                recognitionRef.current.abort();
            }
        };
    }, []);

    const scrollToBottom = useCallback(() => {
        const el = chatContainerRef.current;
        if (el) el.scrollTop = el.scrollHeight;
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading, scrollToBottom]);

    const sendMessage = useCallback(async (text: string) => {
        if (!text.trim() || loading) return;

        const waId = waIdRef.current;
        const timestamp = Date.now();

        if (!isLive) {
            setIsLive(true);
            setMessages([{ role: 'user', content: text.trim() }]);
        } else {
            setMessages(prev => [...prev, { role: 'user', content: text.trim() }]);
        }

        setInput('');
        setLoading(true);

        try {
            const payload = {
                message: {
                    id: timestamp.toString(),
                    content: text.trim(),
                    role: 'user',
                    timestamp,
                    wa_id: waId,
                    passaport: waId,
                    meta: {
                        uuid: crypto.randomUUID(),
                        ip: '',
                        userAgent: navigator.userAgent,
                        language: navigator.language,
                        platform: navigator.platform,
                        url: window.location.href,
                        referrer: document.referrer,
                        screen: {
                            width: window.screen.width,
                            height: window.screen.height,
                        },
                    },
                },
            };

            const res = await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            const item = Array.isArray(data) ? data[0] : data;
            const liaResponse =
                typeof item === 'string'
                    ? item
                    : item?.output ?? item?.response ?? item?.message ?? item?.content ?? item?.text ?? String(item);

            setMessages(prev => [...prev, { role: 'lia', content: liaResponse }]);

            // Speak response if voice is enabled
            if (voiceEnabled && liaResponse) {
                setIsSpeaking(true);
                speakWithElevenLabs(liaResponse, lang).finally(() => setIsSpeaking(false));
            }
        } catch {
            setMessages(prev => [
                ...prev,
                { role: 'lia', content: lang === 'es'
                    ? 'Lo siento, hubo un error de conexión. Intenta de nuevo.'
                    : 'Sorry, there was a connection error. Please try again.' },
            ]);
        } finally {
            setLoading(false);
        }
    }, [loading, isLive, lang, voiceEnabled]);

    const toggleVoice = useCallback(() => {
        if (isListening && recognitionRef.current) {
            recognitionRef.current.stop();
            return;
        }

        const SpeechRecognition = getSpeechRecognition();
        if (!SpeechRecognition) return;

        const recognition = new SpeechRecognition();
        recognition.lang = lang === 'es' ? 'es-ES' : 'en-US';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onresult = (e: SpeechRecognitionEvent) => {
            const transcript = e.results[0][0].transcript;
            if (transcript.trim()) {
                sendMessage(transcript.trim());
            }
        };

        recognition.onend = () => {
            setIsListening(false);
            recognitionRef.current = null;
        };

        recognition.onerror = () => {
            setIsListening(false);
            recognitionRef.current = null;
        };

        recognitionRef.current = recognition;
        setIsListening(true);
        recognition.start();
    }, [isListening, lang, sendMessage]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage(input);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage(input);
        }
    };

    const hardcodedMessages: ChatMessage[] = hardcodedKeys.map(m => ({
        role: m.role === 'user' ? 'user' : 'lia',
        content: t(m.key),
    }));

    const displayMessages = isLive ? messages : hardcodedMessages;
    const hasSpeech = typeof window !== 'undefined' && getSpeechRecognition() !== null;
    const hasTTS = !!ELEVENLABS_API_KEY && !!(ELEVENLABS_VOICE_ID_EN || ELEVENLABS_VOICE_ID_ES);

    return (
        <section className="bg-background-light dark:bg-background-dark py-24 px-6 md:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left: Info */}
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <span className="text-xs font-bold uppercase tracking-[0.3em] text-primary font-ui">
                                {t('lia.label')}
                            </span>
                            <h2 className="text-5xl md:text-6xl font-bold tracking-tighter uppercase font-display text-neutral-dark dark:text-white">
                                {t('lia.title')}<span className="text-primary">.</span>
                            </h2>
                        </div>
                        <p className="text-lg text-gray-500 dark:text-gray-400 font-light leading-relaxed font-ui max-w-lg">
                            {t('lia.desc')}
                        </p>
                        <div className="flex items-center gap-6 pt-4">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                <span className="text-xs font-bold uppercase tracking-widest text-gray-400 font-ui">{t('lia.status')}</span>
                            </div>
                            <div className="w-px h-4 bg-gray-300 dark:bg-gray-700"></div>
                            <span className="text-xs font-bold uppercase tracking-widest text-gray-400 font-ui">{t('lia.powered')}</span>
                        </div>
                    </div>

                    {/* Right: Chat Interface */}
                    <div className="relative">
                        <div className="bg-white dark:bg-stone-900/60 rounded-xl border border-gray-200 dark:border-white/10 shadow-2xl shadow-primary/5 overflow-hidden">
                            {/* Chat Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'wght' 300" }}>
                                            smart_toy
                                        </span>
                                    </div>
                                    <div>
                                        <span className="font-bold text-sm font-display text-neutral-dark dark:text-white">LIA</span>
                                        <span className="text-[10px] text-gray-400 font-ui block tracking-wider uppercase">{t('lia.chat.subtitle')}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    {/* Voice Response Toggle */}
                                    {hasTTS && (
                                        <button
                                            type="button"
                                            onClick={() => setVoiceEnabled(v => !v)}
                                            className="flex items-center gap-2 group"
                                            title={lang === 'es' ? 'Respuestas por voz' : 'Voice responses'}
                                        >
                                            <span className={`material-symbols-outlined text-sm transition-colors ${voiceEnabled ? 'text-primary' : 'text-gray-300 dark:text-gray-600'}`}>
                                                {isSpeaking ? 'volume_up' : 'volume_up'}
                                            </span>
                                            {/* Toggle track */}
                                            <div className={`relative w-8 h-[18px] rounded-full transition-colors ${voiceEnabled ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`}>
                                                <div className={`absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white shadow-sm transition-transform ${voiceEnabled ? 'translate-x-[16px]' : 'translate-x-[2px]'}`} />
                                            </div>
                                        </button>
                                    )}

                                    <div className="flex gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-primary/40"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Chat Messages */}
                            <div ref={chatContainerRef} className="px-6 py-6 space-y-4 max-h-[420px] overflow-y-auto scroll-smooth">
                                {displayMessages.map((msg, i) => (
                                    <div
                                        key={i}
                                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm font-ui leading-relaxed ${
                                                msg.role === 'user'
                                                    ? 'bg-primary text-white rounded-br-sm'
                                                    : 'bg-gray-100 dark:bg-white/5 text-neutral-dark dark:text-gray-300 rounded-bl-sm'
                                            }`}
                                        >
                                            {msg.content}
                                        </div>
                                    </div>
                                ))}

                                {/* Typing indicator */}
                                {loading && (
                                    <div className="flex justify-start">
                                        <div className="bg-gray-100 dark:bg-white/5 px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1.5">
                                            <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                            <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                            <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                        </div>
                                    </div>
                                )}

                                {/* Speaking indicator */}
                                {isSpeaking && (
                                    <div className="flex justify-start">
                                        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-primary/60 font-ui">
                                            <span className="material-symbols-outlined text-sm animate-pulse">graphic_eq</span>
                                            {lang === 'es' ? 'Hablando...' : 'Speaking...'}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Chat Input */}
                            <form onSubmit={handleSubmit} className="px-6 py-4 border-t border-gray-100 dark:border-white/5">
                                <div className="flex items-center gap-2 bg-gray-50 dark:bg-white/5 rounded-full px-5 py-2">
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={input}
                                        onChange={e => setInput(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder={isListening
                                            ? (lang === 'es' ? 'Escuchando...' : 'Listening...')
                                            : t('lia.chat.placeholder')
                                        }
                                        disabled={isListening}
                                        className="flex-1 bg-transparent text-sm font-ui text-neutral-dark dark:text-white placeholder:text-gray-400 outline-none py-1 disabled:opacity-50"
                                    />

                                    {/* Mic button */}
                                    {hasSpeech && (
                                        <button
                                            type="button"
                                            onClick={toggleVoice}
                                            disabled={loading}
                                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
                                                isListening
                                                    ? 'bg-primary text-white animate-pulse'
                                                    : 'bg-primary/10 hover:bg-primary/20 text-primary'
                                            }`}
                                        >
                                            <span className="material-symbols-outlined text-sm">
                                                {isListening ? 'mic' : 'mic_none'}
                                            </span>
                                        </button>
                                    )}

                                    {/* Send button */}
                                    <button
                                        type="submit"
                                        disabled={!input.trim() || loading || isListening}
                                        className="w-8 h-8 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        <span className="material-symbols-outlined text-primary text-sm">
                                            arrow_upward
                                        </span>
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Decorative glow */}
                        <div className="absolute -inset-4 bg-primary/5 rounded-2xl blur-2xl -z-10"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LiaChat;
