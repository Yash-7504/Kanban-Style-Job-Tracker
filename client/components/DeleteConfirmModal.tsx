'use client';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  jobTitle: string;
  companyName: string;
}

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, jobTitle, companyName }: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 w-full max-w-md mx-2 sm:mx-4 shadow-2xl">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
            <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Delete Job Application
          </h3>
          
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-6">
            Are you sure you want to delete the <span className="font-medium text-gray-700 dark:text-gray-300">{jobTitle}</span> position at <span className="font-medium text-gray-700 dark:text-gray-300">{companyName}</span>? This action cannot be undone.
          </p>
          
          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-3 sm:px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-3 sm:px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}