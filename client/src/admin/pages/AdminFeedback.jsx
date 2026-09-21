import { useState, useEffect } from "react";
import { MessageSquare, Check, X, FileImage, ShieldAlert } from "lucide-react";
import api from "../../services/api";
import { toast } from "react-hot-toast";

export default function AdminFeedback() {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchFeedback = async (pageNumber = 1) => {
    try {
      setLoading(true);
      const { data } = await api.get(`/admin/feedback?page=${pageNumber}&limit=10`);
      if (data.success) {
        setFeedback(data.feedback);
        setTotalPages(data.pages);
        setPage(data.page);
      }
    } catch (error) {
      toast.error("Failed to load AI feedback");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const handleReview = async (id, action) => {
    try {
      const { data } = await api.put(`/admin/feedback/${id}/review`, { status: action });
      if (data.success) {
        toast.success(`Feedback ${action}`);
        setFeedback(feedback.map(f => f._id === id ? { ...f, reviewStatus: action } : f));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update review status");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">AI Evaluation Queue</h1>
        <p className="text-sm text-text-muted mt-1">Review user corrections to improve model accuracy.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="bg-surface-card p-8 text-center text-text-muted rounded-xl border border-border-default">
            Loading feedback queue...
          </div>
        ) : feedback.length === 0 ? (
          <div className="bg-surface-card p-8 text-center text-text-muted rounded-xl border border-border-default flex flex-col items-center">
            <ShieldAlert size={48} className="opacity-20 mb-4" />
            <p>No pending feedback to review.</p>
          </div>
        ) : (
          feedback.map((item) => (
            <div key={item._id} className="bg-surface-card border border-border-default rounded-xl p-5 shadow-sm flex flex-col md:flex-row gap-6">
              
              <div className="w-full md:w-48 h-48 bg-black/5 rounded-lg border border-border-default overflow-hidden flex-shrink-0">
                {item.scanId?.imageUrl ? (
                  <img src={item.scanId.imageUrl} alt="Scanned item" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-text-muted opacity-50">
                    <FileImage size={32} />
                  </div>
                )}
              </div>
              
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-text-muted">Model: {item.scanId?.aiModel || "Unknown"}</span>
                    <span className="text-xs text-text-muted">{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 bg-surface-background p-4 rounded-lg border border-border-default mb-4">
                    <div>
                      <h4 className="text-xs font-medium text-text-muted uppercase mb-1">AI Classification</h4>
                      <p className="text-sm font-semibold text-error-text line-through opacity-75">{item.scanId?.category}</p>
                      <p className="text-xs text-text-muted mt-0.5">Confidence: {item.scanId?.confidence}%</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-text-muted uppercase mb-1">User Correction</h4>
                      <p className="text-sm font-semibold text-success-text">{item.correctedCategory}</p>
                      <p className="text-xs text-text-muted mt-0.5">By: {item.userId?.email}</p>
                    </div>
                  </div>
                  
                  {item.comment && (
                    <div className="bg-warning-bg/30 text-warning-text p-3 rounded-lg text-sm border border-warning-bg/50">
                      <strong>Comment:</strong> {item.comment}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border-default justify-end">
                  {item.reviewStatus === "pending" ? (
                    <>
                      <button 
                        onClick={() => handleReview(item._id, "rejected")}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-error-text bg-error-bg hover:opacity-80 transition-opacity"
                      >
                        <X size={16} /> Reject Correction
                      </button>
                      <button 
                        onClick={() => handleReview(item._id, "accepted")}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-brand hover:bg-brand-hover transition-colors"
                      >
                        <Check size={16} /> Verify & Accept
                      </button>
                    </>
                  ) : (
                    <span className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${
                      item.reviewStatus === 'accepted' ? 'bg-success-bg text-success-text' : 'bg-error-bg text-error-text'
                    }`}>
                      {item.reviewStatus.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>

            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-4">
          <button 
            onClick={() => fetchFeedback(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 text-sm font-medium border border-border-default rounded-lg hover:bg-surface-card disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-text-muted">Page {page} of {totalPages}</span>
          <button 
            onClick={() => fetchFeedback(page + 1)}
            disabled={page === totalPages}
            className="px-4 py-2 text-sm font-medium border border-border-default rounded-lg hover:bg-surface-card disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
