'use client';

import { useEffect, useState } from 'react';
import SetupForm from './components/SetupForm';
import PracticeView from './components/PracticeView';
import { Session } from '@/lib/types';
import { loadSession, saveSession, clearSession } from '@/lib/storage';

export default function Home() {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Hydrate from localStorage
        const saved = loadSession();
        if (saved) {
            setSession(saved);
        }
        setLoading(false);
    }, []);

    const handleStart = (newSession: Session) => {
        setSession(newSession);
        saveSession(newSession);
    };

    const handleUpdate = (updatedSession: Session) => {
        setSession(updatedSession);
        saveSession(updatedSession);
    };

    const handleReset = () => {
        clearSession();
        setSession(null);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div>
            {!session ? (
                <SetupForm onStart={handleStart} />
            ) : (
                <PracticeView
                    session={session}
                    onUpdate={handleUpdate}
                    onReset={handleReset}
                />
            )}
        </div>
    );
}
