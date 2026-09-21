import { useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, ThumbsUp, ThumbsDown, X } from "lucide-react";
import api from "../../services/api";

export default function RecommendationCard({ recommendation, onDismiss }) {
  const [feedbackState, setFeedbackState] = useState(null); // 'helpful', 'not_helpful'

  const handleFeedback = async (type) => {
    try {
      setFeedbackState(type);
      await api.post(`/recommendations/${recommendation.id}/feedback`, {
        feedback: type,
      });
      if (type === "dismissed") {
        onDismiss(recommendation.id);
      }
    } catch (error) {
      console.error("Failed to submit feedback", error);
      setFeedbackState(null); // revert on error
    }
  };

  return (
    <div className="bg-gradient-to-br from-brand/10 to-surface-card border border-brand/20 p-5 rounded-2xl relative overflow-hidden group transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 rounded-full bg-brand/10 blur-xl group-hover:bg-brand/20 transition-all duration-500"></div>
      
      <div className="relative z-10 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-brand/20 flex items-center justify-center shrink-0">
          <Sparkles className="text-brand" size={20} />
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-text-primary text-[15px] truncate">
            {recommendation.title}
          </h4>
          <p className="text-sm text-text-muted mt-1 leading-relaxed line-clamp-2">
            {recommendation.reason}
          </p>

          <div className="mt-4 flex items-center gap-3">
            {recommendation.type === "learning" ? (
              <Link 
                to={`/learn/${recommendation.id.replace("learn-", "")}`}
                className="text-sm font-medium text-brand hover:text-brand-dark px-4 py-2 bg-brand/10 rounded-lg transition-colors inline-flex"
              >
                Start Module
              </Link>
            ) : (
              <button className="text-sm font-medium text-brand hover:text-brand-dark px-4 py-2 bg-brand/10 rounded-lg transition-colors">
                View Goal
              </button>
            )}
            
            <div className="ml-auto flex items-center gap-2">
              <button 
                onClick={() => handleFeedback("helpful")}
                disabled={!!feedbackState}
                className={`p-2 rounded-lg transition-colors ${feedbackState === "helpful" ? "text-green-500 bg-green-50" : "text-text-muted hover:text-text-primary hover:bg-surface-page"}`}
                title="Helpful"
              >
                <ThumbsUp size={16} />
              </button>
              <button 
                onClick={() => handleFeedback("not_helpful")}
                disabled={!!feedbackState}
                className={`p-2 rounded-lg transition-colors ${feedbackState === "not_helpful" ? "text-red-500 bg-red-50" : "text-text-muted hover:text-text-primary hover:bg-surface-page"}`}
                title="Not Helpful"
              >
                <ThumbsDown size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <button 
        onClick={() => handleFeedback("dismissed")}
        className="absolute top-3 right-3 text-text-muted opacity-0 group-hover:opacity-100 hover:text-text-primary transition-opacity"
        title="Dismiss"
      >
        <X size={16} />
      </button>
    </div>
  );
}
