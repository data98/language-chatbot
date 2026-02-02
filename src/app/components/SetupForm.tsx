'use client';

import { useState } from 'react';
import { Difficulty, Session } from '@/lib/types';

interface SetupFormProps {
    onStart: (session: Session) => void;
}

export default function SetupForm({ onStart }: SetupFormProps) {
    const [native, setNative] = useState('English');
    const [target, setTarget] = useState('Deutsch');
    const [difficulty, setDifficulty] = useState<Difficulty>('beginner');
    const [scenario, setScenario] = useState('Ordering coffee at a cafe');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newSession: Session = {
            nativeLanguage: native,
            targetLanguage: target,
            difficulty,
            scenario,
            currentPrompt: null,
            lastAnswer: null,
            lastFeedback: null,
            history: [],
        };
        onStart(newSession);
    };

    return (
        <div className="space-y-6 md:space-y-8 py-4">
            <div className="text-center space-y-2">
                <div className="inline-block px-3 py-1 rounded-full bg-brand-lime text-brand-dark text-xs font-bold tracking-wide uppercase">
                    New Session
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-brand-dark">
                    What do you want to <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-peach to-orange-500">practice?</span>
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="block text-xs font-bold text-gray-900 ml-2">Native Language</label>
                        <input
                            type="text"
                            required
                            value={native}
                            onChange={(e) => setNative(e.target.value)}
                            className="block w-full rounded-2xl border-0 bg-gray-100 p-3 text-gray-900 font-medium placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-black transition-all"
                            placeholder="English"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-xs font-bold text-gray-900 ml-2">Target Language</label>
                        <input
                            type="text"
                            required
                            value={target}
                            onChange={(e) => setTarget(e.target.value)}
                            className="block w-full rounded-2xl border-0 bg-gray-100 p-3 text-gray-900 font-medium placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-black transition-all"
                            placeholder="Deutsch"
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="block text-xs font-bold text-gray-900 ml-2">Difficulty</label>
                    <div className="relative">
                        <select
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                            className="block w-full appearance-none rounded-2xl border-0 bg-gray-100 p-3 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-black transition-all"
                        >
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                            <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                        </div>
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="block text-xs font-bold text-gray-900 ml-2">Scenario</label>
                    <input
                        type="text"
                        required
                        value={scenario}
                        onChange={(e) => setScenario(e.target.value)}
                        className="block w-full rounded-2xl border-0 bg-gray-100 p-3 text-gray-900 font-medium placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black transition-all"
                        placeholder="e.g. Ordering cafe"
                    />
                </div>

                <button
                    type="submit"
                    className="cursor-pointer w-full py-3.5 px-6 rounded-full bg-black text-white text-lg font-bold hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 transition-all transform hover:-translate-y-0.5"
                >
                    Start Session
                </button>
            </form>
        </div>
    );
}
