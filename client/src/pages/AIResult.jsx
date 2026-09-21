import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AlertCircle, FileImage } from "lucide-react";

import MobileHeader from "../components/layout/MobileHeader";
import AIStatusBadge from "../components/analyzing/AIStatusBadge";
import DetectedWaste from "../components/result/DetectedWaste";
import DisposalStatus from "../components/result/DisposalStatus";
import ConfidenceIndicator from "../components/result/ConfidenceIndicator";
import ResultActions from "../components/result/ResultActions";
import DeleteScanDialog from "../components/history/DeleteScanDialog";
import FeedbackForm from "../components/result/FeedbackForm";
import ExplainabilityBox from "../components/result/ExplainabilityBox";
import { getScanById, deleteScan } from "../services/scanService";
import { toast } from "react-hot-toast";

function AIResult() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [scan, setScan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    const loadScan = async () => {
      try {
        const data = await getScanById(id);
        if (!data.success) {
          throw new Error(data.message || "Unable to load scan.");
        }
        setScan(data.scan);
        // Trigger confetti for portfolio gamification if window.confetti is available
        if (window.confetti) {
          window.confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      } catch (error) {
        console.error(error);
        setError(
          error.response?.data?.message || "Unable to load scan."
        );
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      loadScan();
    }
  }, [id]);

  const handleViewGuide = () => {
    if (scan?._id) {
      navigate(`/disposal-guide/${scan._id}`);
    }
  };

  const handleScanAgain = () => {
    navigate("/scan");
  };

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true);
      await deleteScan(id);
      toast.success("Scan deleted successfully");
      setShowDeleteDialog(false);
      navigate("/history");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete scan");
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-card flex items-center justify-center">
        <p className="text-text-muted">Loading result...</p>
      </div>
    );
  }

  const result = scan;
  if (!result || error) {
    return (
      <div className="min-h-screen bg-surface-card">
        <MobileHeader />
        <main className="px-5 py-8 lg:py-16 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-error-bg rounded-full flex items-center justify-center mb-6">
            <AlertCircle size={32} className="text-error-text" />
          </div>
          <h1 className="text-2xl font-semibold text-text-primary mb-2">Couldn't load AI result</h1>
          <p className="text-sm text-text-muted mb-8 max-w-[320px]">
            Please try again.
          </p>
          <div className="flex flex-col gap-3 w-full max-w-[320px]">
            <button 
              onClick={() => window.location.reload()}
              className="h-12 w-full text-base font-semibold bg-brand text-white rounded-xl shadow-sm hover:bg-brand-hover transition-colors"
            >
              Try Again
            </button>
            <button 
              onClick={handleScanAgain} 
              className="h-12 w-full text-base font-semibold text-text-muted hover:bg-surface-page rounded-xl transition-colors"
            >
              Scan Another Item
            </button>
          </div>
        </main>
      </div>
    );
  }

  const previewUrl = result.imageUrl || null;

  if (result.disposalStatus === "unknown") {
    return (
      <div className="min-h-screen bg-surface-card">
        <MobileHeader />
        <main className="px-5 py-6 lg:py-12">
          <div className="mx-auto max-w-[600px] flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-300">
            <AIStatusBadge />
            <h1 className="mt-6 text-2xl font-semibold text-text-primary lg:text-[32px] mb-4">
              Unable to confidently identify this waste item.
            </h1>
            <p className="text-sm text-text-muted max-w-[340px] leading-relaxed mb-8">
              Try a clearer photo with the item fully visible.
            </p>
            <div className="w-full max-w-[320px]">
              <ResultActions isUncertain={true} onScanAgain={handleScanAgain} />
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-card pb-10">
      <MobileHeader />

      <main className="px-5 py-6 lg:px-12 lg:py-10">
        <div className="mx-auto max-w-[1000px]">

          {/* Desktop Only Header */}
          <header className="hidden lg:flex flex-col items-start mb-8 animate-in fade-in">
            <AIStatusBadge />
            <h1 className="mt-4 text-3xl font-semibold text-text-primary">
              AI Result
            </h1>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6 lg:gap-12 items-start animate-in fade-in zoom-in-95 duration-300">
            
            {/* Left: Image */}
            <div className="flex flex-col gap-4">
              {/* Mobile Only Header */}
              <div className="lg:hidden mb-2">
                <AIStatusBadge />
              </div>

              <div className="w-full aspect-4/3 bg-black/5 rounded-[24px] border border-border-default overflow-hidden relative shadow-sm">
                {previewUrl ? (
                  <img 
                    src={previewUrl} 
                    alt={`Uploaded image of a ${result.wasteName}`}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-text-muted">
                    <FileImage size={48} className="opacity-20 mb-4" />
                    <p className="text-sm font-medium opacity-50">WASTE IMAGE</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Result Details */}
            <div className="flex flex-col w-full">
              
              <div className="flex flex-col gap-6 bg-surface-card lg:bg-surface-page lg:border border-border-default lg:p-8 lg:rounded-[24px] lg:shadow-sm">
                
                <DetectedWaste 
                  wasteName={result.wasteName} 
                  material={result.material} 
                />

                <div className="w-full h-[1px] bg-success-bg lg:hidden" />

                <DisposalStatus status={result.disposalStatus} />

                <div className="w-full h-[1px] bg-success-bg lg:hidden" />

                <ConfidenceIndicator confidence={result.confidence} />

                <ExplainabilityBox evidence={result.evidence} />
                
                <FeedbackForm scanId={result._id} />

                <ResultActions 
                  onViewGuide={handleViewGuide} 
                  onScanAgain={handleScanAgain} 
                />

                <div className="mt-2 text-center">
                  <button 
                    onClick={() => setShowDeleteDialog(true)}
                    className="text-sm font-semibold text-error-text hover:underline"
                  >
                    Delete Scan
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      </main>

      <DeleteScanDialog 
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
        scanName={result.wasteName}
      />
    </div>
  );
}

export default AIResult;
