import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sparkles, FileImage } from "lucide-react";

import MobileHeader from "../components/layout/MobileHeader";
import AIStatusBadge from "../components/analyzing/AIStatusBadge";
import AIProcessingSteps from "../components/analyzing/AIProcessingSteps";
import { useScan } from "../context/ScanContext";

const ANALYSIS_STEPS = [
  { label: "Image received" },
  { label: "Identifying waste" },
  { label: "Preparing guidance" }
];

function Analyzing() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    isAnalyzing,
    scanResult,
    scanError,
    clearScan,
  } = useScan();

  const [activeStep, setActiveStep] = useState(0);
  const [isSlow, setIsSlow] = useState(false);
  const [isVeryLong, setIsVeryLong] = useState(false);

  // Track if we already navigated (prevent double-navigation)
  const hasNavigated = useRef(false);

  // Get preview URL from router state
  const { previewUrl } = location.state || {};

  // ✅ Navigate to result page when scan completes
  useEffect(() => {
    if (scanResult && !isAnalyzing && !hasNavigated.current) {
      hasNavigated.current = true;
      console.log("[Analyzing] Scan complete, navigating to result:", scanResult._id);
      navigate(`/result/${scanResult._id}`, { replace: true });
    }
  }, [scanResult, isAnalyzing, navigate]);

  // ✅ Navigate back to scan on error
  useEffect(() => {
    if (scanError && !isAnalyzing && !hasNavigated.current) {
      hasNavigated.current = true;
      console.log("[Analyzing] Scan error, going back to scan page:", scanError);
      navigate("/scan", { replace: true });
    }
  }, [scanError, isAnalyzing, navigate]);

  // ✅ Guard: if user lands here directly without a scan running, go back
  useEffect(() => {
    if (!previewUrl && !isAnalyzing && !scanResult && !scanError) {
      navigate("/scan", { replace: true });
    }
  }, [previewUrl, isAnalyzing, scanResult, scanError, navigate]);

  // Progress step animation
  useEffect(() => {
    const timers = [];
    timers.push(setTimeout(() => setActiveStep(1), 2000));
    timers.push(setTimeout(() => setActiveStep(2), 5000));
    timers.push(setTimeout(() => setIsSlow(true), 12000));
    timers.push(setTimeout(() => setIsVeryLong(true), 28000));
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleCancel = () => {
    clearScan();
    navigate("/scan");
  };

  return (
    <div className="min-h-screen bg-surface-card">
      <MobileHeader />

      <main className="px-5 py-6 lg:py-12">
        <div className="mx-auto max-w-[600px] flex flex-col items-center">
          
          <AIStatusBadge />

          <h1 className="mt-6 text-2xl font-semibold text-text-primary lg:text-[32px] text-center">
            Analyzing your waste
          </h1>

          <p className="mt-2 text-sm text-text-muted text-center max-w-[340px] leading-relaxed">
            AI is identifying the waste in your image.
          </p>

          {/* Image Container */}
          <div className="w-full max-w-[480px] aspect-4/3 bg-black/5 rounded-[24px] border border-border-default overflow-hidden relative shadow-sm mt-8 mb-8">
            {previewUrl ? (
              <img 
                src={previewUrl} 
                alt="Waste being analyzed" 
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-text-muted">
                <FileImage size={48} className="opacity-20 mb-4" />
                <p className="text-sm font-medium opacity-50">Waste Image</p>
              </div>
            )}
            <div className="absolute inset-0 bg-brand/5 animate-pulse"></div>
          </div>

          <div className="w-full max-w-[480px] bg-surface-page border border-border-default rounded-[24px] p-6 lg:p-8 flex flex-col">
            <div className="flex items-center gap-3">
              <Sparkles size={24} className="text-brand animate-pulse shrink-0" />
              <div>
                <p className="font-semibold text-text-primary text-lg">Analyzing...</p>
                {isVeryLong && (
                  <p className="text-xs text-amber-600 font-medium mt-0.5 animate-in fade-in">
                    Almost done — finalizing results...
                  </p>
                )}
                {isSlow && !isVeryLong && (
                  <p className="text-xs text-text-muted font-medium mt-0.5 animate-in fade-in">
                    Taking a little longer than usual...
                  </p>
                )}
              </div>
            </div>

            <AIProcessingSteps 
              activeStep={activeStep} 
              steps={ANALYSIS_STEPS} 
            />
          </div>

          <button 
            onClick={handleCancel}
            className="mt-8 text-sm font-semibold text-text-muted hover:text-error-text transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E54D4D] rounded px-2 py-1"
          >
            Cancel Analysis
          </button>

        </div>
      </main>
    </div>
  );
}

export default Analyzing;
