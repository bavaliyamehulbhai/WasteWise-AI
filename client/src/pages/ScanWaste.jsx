import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, FileImage, Loader2 } from "lucide-react";

import WasteUploadCard from "../components/scan/WasteUploadCard";
import ImagePreviewCard from "../components/scan/ImagePreviewCard";
import { useAuth } from "../context/AuthContext";
import { useScan } from "../context/ScanContext";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import { savePendingScan } from "../services/offlineDb";
import { toast } from "react-hot-toast";

const MAX_FILE_SIZE_MB = 5;
const VALID_TYPES = ["image/jpeg", "image/png", "image/webp"];

function ScanWaste() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const isOnline = useOnlineStatus();
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // No cleanup needed — we use data URLs (base64) which don't need revocation

  const handleFileSelect = (file) => {
    setError("");

    if (!file) return;

    // Validate type
    if (!VALID_TYPES.includes(file.type)) {
      setError("Please upload a JPG, PNG, or WEBP image.");
      return;
    }

    // Validate size
    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB > MAX_FILE_SIZE_MB) {
      setError(`Image size must be less than ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }

    // Set file and generate data URL preview (survives component unmount)
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setPreviewUrl(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleClearImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError("");
  };

  const { startScan, scanError, clearScan } = useScan();

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError("Please select an image first.");
      return;
    }

    if (!isAuthenticated) {
      setError("Please login to scan waste.");
      return;
    }

    if (!previewUrl) {
      setError("Image is still loading. Please wait a moment.");
      return;
    }

    if (!isOnline) {
      try {
        await savePendingScan(selectedFile, previewUrl);
        toast.success("Scan saved. We'll analyze it when you're back online!");
        navigate("/history");
      } catch (err) {
        console.error("Failed to save offline scan:", err);
        setError("Failed to save image. Please try again.");
      }
      return;
    }

    // Navigate to Analyzing page immediately (shows progress UI)
    navigate("/analyzing", { state: { previewUrl } });

    // When scan completes, navigate directly to result — regardless of which component is mounted
    startScan(selectedFile)
      .then((scan) => {
        console.log("[ScanWaste] Scan complete, navigating to result:", scan._id);
        navigate(`/result/${scan._id}`, { replace: true });
      })
      .catch((err) => {
        console.error("[ScanWaste] Scan failed:", err);
        // ScanContext already sets scanError — Analyzing.jsx will redirect to /scan
      });
  };

  return (
    <div className="h-full bg-surface-card rounded-2xl border border-border-default overflow-hidden">
      <div className="px-5 py-6 lg:px-12 lg:py-10">
        <div className="mx-auto max-w-[1000px]">

          {!loading && (
            <header className="mb-8">
              <h1 className="text-2xl font-semibold text-text-primary lg:text-[32px]">
                {selectedFile ? "Your image" : "Scan your waste"}
              </h1>
              <p className="mt-2 text-sm text-text-muted max-w-[500px]">
                {selectedFile 
                  ? "Review your image and proceed to AI analysis."
                  : "Take or upload a clear photo to identify your waste with AI."
                }
              </p>
            </header>
          )}

          {/* Global Error State */}
          {(error || scanError) && !loading && (
            <div className="mb-6 p-4 rounded-xl bg-error-bg border border-error-text flex flex-col items-start gap-3 animate-in fade-in">
              <div className="flex gap-3 items-start">
                <AlertCircle className="text-error-text shrink-0 mt-0.5" size={20} />
                <p className="text-sm text-error-text font-medium leading-relaxed">{error || scanError}</p>
              </div>
              {selectedFile && (
                <button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="mt-1 ml-8 px-4 py-2 bg-white text-error-text border border-error-text rounded-lg text-sm font-semibold hover:bg-error-bg transition-colors"
                >
                  Try Again
                </button>
              )}
            </div>
          )}

          {loading ? (
            /* Analyzing State */
            <div className="flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in-95 duration-300 rounded-3xl border border-border-default bg-surface-page">
              <div className="relative mb-8">
                <div className="absolute inset-0 rounded-full bg-brand/20 animate-ping"></div>
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-success-bg shadow-sm border-4 border-white">
                  <div className="h-10 w-10 overflow-hidden relative">
                    <div className="absolute inset-0 bg-brand/10" />
                    <div className="absolute inset-x-0 h-1 bg-brand animate-[scan_2s_ease-in-out_infinite]" />
                    <Loader2 size={40} className="text-brand opacity-20" />
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-semibold text-text-primary text-center">
                Analyzing your waste...
              </h2>
              <p className="mt-3 text-sm text-text-muted text-center max-w-[280px] leading-relaxed">
                Our AI is identifying the material and waste category. Please wait.
              </p>
            </div>
          ) : selectedFile ? (
            /* Selected State: Image Preview */
            <div className="animate-in fade-in zoom-in-95 duration-300">
              <ImagePreviewCard 
                file={selectedFile}
                previewUrl={previewUrl}
                onAnalyze={handleAnalyze}
                onChangeImage={handleClearImage}
                isUploading={loading}
                isOnline={isOnline}
              />
            </div>
          ) : (
            /* Default State: Upload Card & Instructions */
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px] lg:gap-12 animate-in fade-in">
              
              <div className="flex-1">
                <WasteUploadCard onFileSelect={handleFileSelect} />
              </div>

              {/* Desktop/Tablet: How it works side panel */}
              <div className="hidden lg:flex flex-col gap-6 pt-2">
                <h2 className="text-lg font-semibold text-text-primary">
                  How it works
                </h2>
                
                <div className="flex flex-col gap-6 relative before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-[2px] before:bg-success-bg">
                  
                  <div className="flex gap-4 relative z-10">
                    <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm border-4 border-white">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-primary text-sm mb-1">Upload a photo</h3>
                      <p className="text-xs text-text-muted leading-relaxed">Ensure the waste item is clearly visible and well-lit.</p>
                    </div>
                  </div>

                  <div className="flex gap-4 relative z-10">
                    <div className="w-8 h-8 rounded-full bg-surface-card text-text-muted border-2 border-border-default flex items-center justify-center font-bold text-sm shrink-0 bg-clip-padding">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-primary text-sm mb-1">AI identifies waste</h3>
                      <p className="text-xs text-text-muted leading-relaxed">Our model analyzes the image to classify the material.</p>
                    </div>
                  </div>

                  <div className="flex gap-4 relative z-10">
                    <div className="w-8 h-8 rounded-full bg-surface-card text-text-muted border-2 border-border-default flex items-center justify-center font-bold text-sm shrink-0 bg-clip-padding">
                      3
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-primary text-sm mb-1">Get disposal guidance</h3>
                      <p className="text-xs text-text-muted leading-relaxed">Follow instant steps to dispose of it correctly.</p>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default ScanWaste;
