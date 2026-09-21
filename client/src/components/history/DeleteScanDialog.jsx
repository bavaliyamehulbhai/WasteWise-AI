import { Trash2, AlertTriangle } from "lucide-react";
import Button from "../ui/Button";

function DeleteScanDialog({ isOpen, onClose, onConfirm, isDeleting, scanName }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
        className="bg-surface-card w-full max-w-sm rounded-[24px] overflow-hidden shadow-xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 pb-0 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-error-bg rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="text-error-text w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-text-primary mb-2">Delete Scan?</h3>
          <p className="text-sm text-text-muted leading-relaxed mb-6">
            This <span className="font-semibold text-text-primary">{scanName}</span> scan will be permanently removed from your WasteWise history. This action cannot be undone.
          </p>
        </div>

        <div className="p-4 bg-surface-page border-t border-border-default flex gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 py-3 text-sm font-semibold text-text-primary bg-white border border-border-default rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 py-3 text-sm font-semibold text-white bg-error-text rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : (
              <>
                <Trash2 size={16} /> Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteScanDialog;
