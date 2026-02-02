'use client';

import { useState, useEffect, useRef } from 'react';
import { Session, Feedback, HistoryItem } from '@/lib/types';

interface PracticeViewProps {
    session: Session;
    onUpdate: (session: Session) => void;
    onReset: () => void;
}

export default function PracticeView({ session, onUpdate, onReset }: PracticeViewProps) {
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const initialized = useRef(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!session.currentPrompt && !loading && !initialized.current) {
            initialized.current = true;
            fetchFeedback();
        }
    }, [session.currentPrompt]);

    // Auto-scroll to bottom of history for better UX
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [session.history, loading]);

    const fetchFeedback = async (userAnswer?: string) => {
        setLoading(true);
        try {
            const res = await fetch('/api/practice', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ session, userAnswer }),
            });
            const data: Feedback = await res.json();

            let newHistory = [...session.history];
            if (userAnswer && session.currentPrompt) {
                const historyItem: HistoryItem = {
                    prompt: session.currentPrompt,
                    answer: userAnswer,
                    corrected: data.corrected,
                };
                newHistory = [historyItem, ...newHistory].slice(0, 5); // Keep last 5
            }

            const updatedSession: Session = {
                ...session,
                currentPrompt: data.next_prompt,
                lastAnswer: userAnswer || null,
                lastFeedback: data,
                history: newHistory,
            };

            onUpdate(updatedSession);
            setInput('');
        } catch (error) {
            console.error('Error fetching feedback:', error);
            alert('Failed to get response. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        fetchFeedback(input);
    };

    if (!session.currentPrompt && loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <div className="w-12 h-12 border-4 border-brand-lime border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500 font-medium">Generating session...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start pb-4 border-b border-gray-100">
                <div>
                    <span className="inline-block px-3 py-1 rounded-full bg-gray-100 text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                        Current Scenario
                    </span>
                    <h2 className="text-xl font-bold text-brand-dark leading-tight">{session.scenario}</h2>
                </div>
                <button
                    onClick={onReset}
                    className="text-sm font-semibold text-gray-500 hover:text-red-500 transition-colors"
                >
                    Reset
                </button>
            </div>

            <div className="flex-1 lg:grid lg:grid-cols-2 lg:gap-10 lg:items-start lg:space-y-0 space-y-8">
                {/* Left Column (Desktop): Current Task & Input */}
                <div className="space-y-4 lg:sticky lg:top-4">
                    <div className="bg-brand-dark rounded-3xl p-6 md:p-8 text-white relative shadow-lg shadow-brand-lime/10">
                        <span className="absolute top-6 right-6 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-lime opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-lime"></span>
                        </span>
                        <span className="text-brand-lime text-xs font-bold uppercase tracking-wider mb-2 block">Your Turn</span>
                        <p className="text-2xl md:text-3xl font-bold leading-tight">{session.currentPrompt}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="relative">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="w-full bg-gray-100 rounded-3xl p-6 pb-20 text-lg font-medium text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-dark focus:bg-white transition-all resize-none min-h-[100px] lg:min-h-[100px] max-h-[150px] lg:max-h-[150px]"
                            placeholder={`Type your answer in ${session.targetLanguage}...`}
                            disabled={loading}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    if (input.trim()) fetchFeedback(input);
                                }
                            }}
                        />
                        <div className="absolute bottom-4 right-2">
                            <button
                                type="submit"
                                disabled={loading || !input.trim()}
                                className="flex items-center gap-2 bg-brand-lime text-brand-dark px-6 py-3 rounded-full font-bold hover:bg-[#bfff00] disabled:opacity-50 disabled:cursor-not-allowed transition-transform transform active:scale-95 shadow-sm"
                            >
                                {loading ? 'Sending...' : 'Send Answer'}
                                {!loading && (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Right Column (Desktop): Feedback & History */}
                <div className="space-y-8 lg:h-[600px]">
                    {session.lastFeedback && session.lastAnswer && session.lastFeedback.corrected !== 'N/A' ? (
                        <div className="animate-fade-in bg-gray-50 rounded-3xl p-6 md:p-8 space-y-5 border border-gray-100 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-2 h-full bg-brand-lime"></div>

                            <div className="space-y-1">
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">You said</span>
                                <p className="text-lg text-gray-600">{session.lastAnswer}</p>
                            </div>

                            <div className="space-y-1">
                                <span className="text-xs font-bold text-brand-lime uppercase tracking-wide bg-black px-2 py-0.5 rounded-md">Correction</span>
                                <p className="text-lg font-bold text-gray-900">{session.lastFeedback.corrected}</p>
                            </div>

                            <div className="bg-white rounded-2xl p-4 text-sm text-gray-600 leading-relaxed">
                                <span className="font-bold text-gray-900">Explanation:</span> {session.lastFeedback.explanation}
                            </div>

                            {session.lastFeedback.alternatives?.length > 0 && (
                                <div className="space-y-2">
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Try saying</span>
                                    <div className="flex flex-wrap gap-2">
                                        {session.lastFeedback.alternatives.map((alt, i) => (
                                            <span key={i} className="px-3 py-1.5 bg-brand-lime/20 text-brand-dark text-sm font-medium rounded-lg border border-brand-lime/30">
                                                {alt}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Placeholder for empty state on desktop spread */
                        <div className="hidden lg:flex h-full items-center justify-center bg-gray-50 rounded-3xl border border-dashed border-gray-200 text-gray-400 font-medium p-8 text-center">
                            Your feedback and corrections will appear here after you submit an answer.
                        </div>
                    )}

                    {/* History Visuals */}
                    {session.history.length > 0 && (
                        <div className="lg:border-t-0 border-t border-gray-100 pt-6 lg:pt-0">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-4 text-center lg:text-left">Previous entries</p>
                            {/* Vertical list on Desktop, Horizontal on Mobile */}
                            <div className="flex lg:flex-col gap-3 overflow-x-auto- lg:overflow-visible- pb-2 lg:pb-0 scrollbar-hide- lg:opacity-100 opacity-80 transition-opacity h-[150px] lg:overflow-y-auto lg:pr-4 lg:scrollbar-thin lg:scrollbar-thumb-gray-200">
                                {session.history.map((item, idx) => (
                                    <div key={idx} className="flex-shrink-0 w-64 lg:w-full bg-gray-50 rounded-2xl p-4 text-xs border border-gray-100 hover:bg-white transition-colors cursor-default">
                                        <p className="text-gray-500 line-clamp-2 mb-1">{item.prompt}</p>
                                        <p className="font-bold text-gray-900 line-clamp-2">{item.corrected}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div ref={scrollRef} />
            </div>
        </div>
    );
}
