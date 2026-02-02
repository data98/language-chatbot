'use client';

import { HistoryItem } from '@/lib/types';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
}

export default function HistoryModal({ isOpen, onClose, history }: HistoryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-brand-dark/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl bg-white rounded-4xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-brand-gray/50">
          <div>
            <h3 className="text-xl font-bold text-brand-dark">Session History</h3>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">All previous entries</p>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-gray-200">
          {history.map((item, idx) => {
            const isCorrect = item.answer.trim().toLowerCase() === item.corrected.trim().toLowerCase();
            return (
              <div key={idx} className={`bg-gray-50 rounded-3xl p-6 border transition-colors ${isCorrect ? 'hover:border-green-500 border-green-50' : 'hover:border-brand-lime border-gray-100'}`}>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Entry #{history.length - idx}</span>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${isCorrect ? 'bg-green-500 text-white' : 'bg-black text-brand-lime'}`}>
                    {isCorrect ? 'Perfect!' : 'Correction'}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Prompt</span>
                    <p className="text-sm text-gray-600 font-medium leading-relaxed">{item.prompt}</p>
                  </div>
                  <div className="space-y-1">
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${isCorrect ? 'text-green-600' : 'text-brand-peach'}`}>
                      {isCorrect ? 'Your Answer' : 'Correction'}
                    </span>
                    <p className={`text-sm font-bold leading-relaxed ${isCorrect ? 'text-green-700' : 'text-brand-dark'}`}>{item.corrected}</p>
                  </div>
                </div>
                {!isCorrect && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Your Attempt</span>
                    <p className="text-sm text-gray-500 italic">"{item.answer}"</p>
                  </div>
                )}
                <div className={`mt-4 p-4 rounded-2xl text-xs leading-relaxed ${isCorrect ? 'bg-green-100/50 text-green-800' : 'bg-white text-gray-600'}`}>
                  <span className="font-bold">Explanation:</span> {item.explanation}
                </div>
              </div>
            );
          })}
        </div>
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="cursor-pointer px-6 py-2 bg-brand-dark text-white font-bold rounded-full hover:bg-gray-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
