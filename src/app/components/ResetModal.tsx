'use client';

interface ResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ResetModal({ isOpen, onClose, onConfirm }: ResetModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-brand-dark/40 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="relative w-full max-w-sm bg-white rounded-4xl shadow-2xl overflow-hidden p-8 text-center animate-in fade-in zoom-in duration-200">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-brand-dark mb-2">Reset Progress?</h3>
        <p className="text-gray-500 mb-8 leading-relaxed">
          This will clear your current session and history. This action cannot be undone.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={onConfirm}
            className="cursor-pointer w-full py-4 bg-brand-dark text-white font-bold rounded-full hover:bg-gray-800 transition-colors"
          >
            Yes, Reset Session
          </button>
          <button
            onClick={onClose}
            className="cursor-pointer w-full py-3 text-gray-500 font-bold rounded-full hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
