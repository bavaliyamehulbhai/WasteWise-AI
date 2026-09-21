import { useState } from "react";
import { X, Eye, EyeOff, Lock, Loader2 } from "lucide-react";
import { updatePassword } from "../../services/userService";

function ChangePasswordForm({ onClose }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (newPassword.length < 6) {
      return setError("New password must be at least 6 characters");
    }

    if (newPassword !== confirmPassword) {
      return setError("New passwords do not match");
    }

    try {
      setLoading(true);
      await updatePassword({ currentPassword, newPassword });
      setSuccess(true);
      
      // Clear form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      // Auto close after 2 seconds
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (id, label, value, setValue, show, setShow, placeholder) => (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-text-primary">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#879A91]">
          <Lock size={18} />
        </div>
        <input
          type={show ? "text" : "password"}
          id={id}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          required
          className="w-full pl-10 pr-10 py-3 bg-surface-page border border-border-default rounded-xl text-text-primary placeholder:text-[#879A91] focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all text-sm"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#879A91] hover:text-text-primary transition-colors"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#0A1A14]/40 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-surface-card rounded-2xl shadow-xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border-default flex items-center justify-between shrink-0">
          <h2 className="text-lg font-bold text-text-primary">Change Password</h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:bg-surface-page hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-error-bg border border-error-text flex items-start gap-3">
              <div className="text-error-text font-semibold shrink-0">!</div>
              <p className="text-sm text-error-text font-medium leading-relaxed">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 rounded-xl bg-[#F0FAF4] border border-[#B8F5D0] flex items-start gap-3">
              <div className="text-brand font-semibold shrink-0">✓</div>
              <p className="text-sm text-brand font-medium leading-relaxed">Password updated successfully!</p>
            </div>
          )}

          <form id="password-form" onSubmit={handleSubmit} className="space-y-4">
            {renderInput("current", "Current Password", currentPassword, setCurrentPassword, showCurrent, setShowCurrent, "Enter current password")}
            
            <div className="pt-2">
              {renderInput("new", "New Password", newPassword, setNewPassword, showNew, setShowNew, "Create new password")}
              <p className="mt-1 text-xs text-text-muted">Must be at least 6 characters long.</p>
            </div>
            
            {renderInput("confirm", "Confirm New Password", confirmPassword, setConfirmPassword, showConfirm, setShowConfirm, "Type new password again")}
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border-default bg-surface-page flex justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-semibold text-text-muted hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-xl"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="password-form"
            disabled={loading || success}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-brand hover:bg-brand-hover transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 flex items-center justify-center min-w-[140px] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                <span>Updating...</span>
              </div>
            ) : success ? (
              "Updated!"
            ) : (
              "Update Password"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChangePasswordForm;
