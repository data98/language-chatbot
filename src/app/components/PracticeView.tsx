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
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false);
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
                    onClick={() => setShowResetModal(true)}
                    className="cursor-pointer text-sm font-semibold text-gray-500 hover:text-red-500 transition-colors"
                >
                    Reset
                </button>
            </div>

            <div className="flex-1 lg:grid lg:grid-cols-2 lg:gap-10 items-stretch lg:overflow-hidden">
                {/* Left Column (Desktop): Current Task & Input */}
                <div className="flex flex-col space-y-4 mb-8 lg:mb-0 lg:px-1">
                    <div className="bg-brand-dark rounded-3xl p-6 md:p-8 text-white relative shadow-lg shadow-brand-lime/10
                    ">
                        <span className="absolute top-6 right-6 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-lime opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-lime"></span>
                        </span>
                        <span className="text-brand-lime text-xs font-bold uppercase tracking-wider mb-2 block">Your Turn</span>
                        <p className="text-xl md:text-2xl font-bold leading-tight">{session.currentPrompt}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="relative flex-1 flex flex-col min-h-[200px] lg:min-h-0">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="w-full flex-1 bg-gray-100 rounded-3xl p-6 pb-20 text-lg font-medium text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-dark focus:bg-white transition-all resize-none overflow-y-auto"
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
                                className="cursor-pointer flex items-center gap-2 bg-brand-lime text-brand-dark px-6 py-3 rounded-full font-bold hover:bg-[#bfff00] disabled:opacity-50 disabled:cursor-not-allowed transition-transform transform active:scale-95 shadow-sm"
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
                <div className="flex flex-col space-y-6 lg:overflow-hidden min-h-0">
                    {session.lastFeedback && session.lastAnswer && session.lastFeedback.corrected !== 'N/A' ? (
                        <div className="flex-shrink-0 animate-fade-in bg-gray-50 rounded-3xl p-6 space-y-4 border border-gray-100 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-2 h-full bg-brand-lime"></div>

                            <div className="space-y-1">
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">You said</span>
                                <p className="text-base text-gray-600 lg:line-clamp-2">{session.lastAnswer}</p>
                            </div>

                            <div className="space-y-1">
                                <span className="text-xs font-bold text-brand-lime uppercase tracking-wide bg-black px-2 py-0.5 rounded-md">Correction</span>
                                <p className="text-lg font-bold text-gray-900 lg:line-clamp-2">{session.lastFeedback.corrected}</p>
                            </div>

                            <div className="bg-white rounded-2xl p-4 text-sm text-gray-600 leading-relaxed lg:overflow-y-auto lg:max-h-32 scrollbar-thin scrollbar-thumb-gray-200">
                                <span className="font-bold text-gray-900">Explanation:</span> {session.lastFeedback.explanation}
                            </div>

                            {session.lastFeedback.alternatives && session.lastFeedback.alternatives.length > 0 && (
                                <div className="space-y-2">
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Alternatives</span>
                                    <div className="flex flex-wrap overflow-x-auto pb-1 gap-2 scrollbar-hide">
                                        {session.lastFeedback.alternatives.map((alt, i) => (
                                            <span key={i} className="flex-shrink-0 px-3 py-1 bg-brand-lime/20 text-brand-dark text-xs font-medium rounded-lg border border-brand-lime/30 whitespace-nowrap">
                                                {alt}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Placeholder for empty state on desktop spread */
                        <div className="hidden lg:h-full lg:flex flex-shrink-0 items-center justify-center bg-gray-50 rounded-3xl border border-dashed border-gray-200 text-gray-400 font-medium p-8 text-center">
                            Feedback will appear here.
                        </div>
                    )}

                    {/* History Visuals */}
                    {session.history.length > 0 && (
                        <div className="flex-1 flex flex-col min-h-0 border-t border-gray-100 pt-4">
                            <div className="flex justify-between items-center mb-3">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Previous entries</p>
                                {session.history.length > 1 && (
                                    <button
                                        onClick={() => setIsHistoryOpen(true)}
                                        className="cursor-pointer text-xs font-bold text-brand-lime bg-brand-dark px-2 py-1 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-1.5"
                                    >
                                        <span>+{session.history.length - 1} more</span>
                                    </button>
                                )}
                            </div>
                            <div className="lg:flex-1 lg:overflow-y-auto pr-2 space-y-3 lg:scrollbar-thin lg:scrollbar-thumb-gray-200">
                                {session.history.slice(0, 1).map((item, idx) => (
                                    <div key={idx} className="bg-gray-50 rounded-2xl p-4 text-xs border border-gray-100 hover:bg-white transition-colors cursor-default">
                                        <p className="text-gray-500 line-clamp-1 mb-1">{item.prompt}</p>
                                        <p className="font-bold text-gray-900 line-clamp-2">{item.corrected}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div ref={scrollRef} />
            </div>

            {/* History Modal */}
            {isHistoryOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-brand-dark/60 backdrop-blur-sm"
                        onClick={() => setIsHistoryOpen(false)}
                    />
                    <div className="relative w-full max-w-2xl bg-white rounded-4xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-brand-gray/50">
                            <div>
                                <h3 className="text-xl font-bold text-brand-dark">Session History</h3>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">All previous entries</p>
                            </div>
                            <button
                                onClick={() => setIsHistoryOpen(false)}
                                className="cursor-pointer p-2 hover:bg-gray-200 rounded-full transition-colors"
                            >
                                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-gray-200">
                            {session.history.map((item, idx) => (
                                <div key={idx} className="bg-gray-50 rounded-3xl p-6 border border-gray-100 hover:border-brand-lime transition-colors">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Prompt</span>
                                            <p className="text-sm text-gray-600 font-medium leading-relaxed">{item.prompt}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-bold text-brand-peach uppercase tracking-widest">Correction</span>
                                            <p className="text-sm text-brand-dark font-bold leading-relaxed">{item.corrected}</p>
                                        </div>
                                    </div>
                                    <div className="mt-3 pt-3 border-t border-gray-100">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Your Answer</span>
                                        <p className="text-sm text-gray-500 italic">"{item.answer}"</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
                            <button
                                onClick={() => setIsHistoryOpen(false)}
                                className="cursor-pointer px-6 py-2 bg-brand-dark text-white font-bold rounded-full hover:bg-gray-800 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Reset Confirmation Modal */}
            {showResetModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-brand-dark/40 backdrop-blur-[2px]"
                        onClick={() => setShowResetModal(false)}
                    />
                    <div className="relative w-full max-w-sm bg-white rounded-4xl shadow-2xl overflow-hidden p-8 text-center animate-in fade-in zoom-in duration-200">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        </div>
                        <h3 className="text-2xl font-bold text-brand-dark mb-2">Reset Progress?</h3>
                        <p className="text-gray-500 mb-8 leading-relaxed">
                            This will clear your current session and history. This action cannot be undone.
                        </p>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={onReset}
                                className="cursor-pointer w-full py-4 bg-brand-dark text-white font-bold rounded-full hover:bg-gray-800 transition-colors"
                            >
                                Yes, Reset Session
                            </button>
                            <button
                                onClick={() => setShowResetModal(false)}
                                className="cursor-pointer w-full py-3 text-gray-500 font-bold rounded-full hover:bg-gray-100 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
