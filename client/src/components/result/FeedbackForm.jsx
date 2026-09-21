import { useState } from "react";
import { ThumbsUp, ThumbsDown, CheckCircle } from "lucide-react";
import api from "../../services/api";
import { toast } from "react-hot-toast";

const allowedCategories = [
  "Plastic",
  "Paper",
  "Glass",
  "Metal",
  "Organic",
  "E-Waste",
  "General Waste",
  "Other",
];

export default function FeedbackForm({ scanId, onFeedbackSubmitted }) {
  const [step, setStep] = useState(0); // 0: initial, 1: negative feedback form, 2: success
  const [loading, setLoading] = useState(false);
  const [correctedCategory, setCorrectedCategory] = useState("");
  const [correctedMaterial, setCorrectedMaterial] = useState("");

  const handlePositive = async () => {
    setLoading(true);
    try {
      await api.post("/feedback", {
        scanId,
        correct: true,
      });
      setStep(2);
      onFeedbackSubmitted && onFeedbackSubmitted();
      toast.success("Thank you for your feedback!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit feedback");
    } finally {
      setLoading(false);
    }
  };

  const handleNegativeSubmit = async (e) => {
    e.preventDefault();
    if (!correctedCategory) {
      toast.error("Please select the correct category");
      return;
    }
    
    setLoading(true);
    try {
      await api.post("/feedback", {
        scanId,
        correct: false,
        correctedCategory,
        correctedMaterial,
      });
      setStep(2);
      onFeedbackSubmitted && onFeedbackSubmitted();
      toast.success("Thank you for correcting the AI!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit feedback");
    } finally {
      setLoading(false);
    }
  };

  if (step === 2) {
    return (
      <div className="bg-surface-page rounded-xl p-4 flex items-center justify-center gap-2 text-success-text border border-success-bg mt-4">
        <CheckCircle size={20} />
        <p className="text-sm font-semibold">Feedback submitted. Thank you!</p>
      </div>
    );
  }

  if (step === 1) {
    return (
      <form onSubmit={handleNegativeSubmit} className="bg-surface-page rounded-xl p-4 mt-4 border border-border-default animate-in fade-in slide-in-from-top-2">
        <h3 className="text-sm font-semibold text-text-primary mb-3">Help us improve</h3>
        
        <div className="flex flex-col gap-3 mb-4">
          <label className="text-xs font-medium text-text-muted">What is the correct category?</label>
          <select 
            value={correctedCategory}
            onChange={(e) => setCorrectedCategory(e.target.value)}
            className="w-full h-10 px-3 rounded-lg border border-border-default bg-surface-card text-sm focus:outline-brand"
            disabled={loading}
          >
            <option value="">Select category...</option>
            {allowedCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-3 mb-4">
          <label className="text-xs font-medium text-text-muted">Material (optional)</label>
          <input 
            type="text"
            value={correctedMaterial}
            onChange={(e) => setCorrectedMaterial(e.target.value)}
            placeholder="e.g. PET, Cardboard"
            className="w-full h-10 px-3 rounded-lg border border-border-default bg-surface-card text-sm focus:outline-brand"
            disabled={loading}
          />
        </div>

        <div className="flex gap-2">
          <button 
            type="button"
            onClick={() => setStep(0)}
            className="flex-1 h-10 rounded-lg font-semibold text-sm text-text-muted hover:bg-surface-card transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="flex-1 h-10 rounded-lg font-semibold text-sm bg-brand text-white hover:bg-brand-hover transition-colors flex items-center justify-center disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Correction"}
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="bg-surface-page rounded-xl p-4 mt-4 border border-border-default">
      <h3 className="text-sm font-semibold text-text-primary text-center mb-3">Was this classification correct?</h3>
      <div className="flex items-center gap-2 justify-center">
        <button 
          onClick={handlePositive}
          disabled={loading}
          className="flex-1 h-10 rounded-lg flex items-center justify-center gap-2 border border-border-default hover:bg-success-bg hover:text-success-text hover:border-success-bg transition-colors disabled:opacity-50"
        >
          <ThumbsUp size={18} />
          <span className="text-sm font-semibold">Yes</span>
        </button>
        <button 
          onClick={() => setStep(1)}
          disabled={loading}
          className="flex-1 h-10 rounded-lg flex items-center justify-center gap-2 border border-border-default hover:bg-error-bg hover:text-error-text hover:border-error-bg transition-colors disabled:opacity-50"
        >
          <ThumbsDown size={18} />
          <span className="text-sm font-semibold">No</span>
        </button>
      </div>
    </div>
  );
}
