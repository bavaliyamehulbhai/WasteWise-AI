import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FileImage } from "lucide-react";

import MobileHeader from "../components/layout/MobileHeader";
import RecommendedActionCard from "../components/disposal/RecommendedActionCard";
import LocalGuidanceCard from "../components/disposal/LocalGuidanceCard";
import Button from "../components/ui/Button";
import { getScanById } from "../services/scanService";

function DisposalGuide() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [scan, setScan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadScan = async () => {
      try {
        const data = await getScanById(id);
        if (!data.success) {
          throw new Error(data.message || "Unable to load scan.");
        }
        setScan(data.scan);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-card flex items-center justify-center">
        <p className="text-text-muted">Loading guide...</p>
      </div>
    );
  }

  if (!scan || error) return (
    <div className="min-h-screen bg-surface-card flex items-center justify-center">
      <p className="text-error-text">{error || "Scan not found"}</p>
    </div>
  );

  const previewUrl = scan.imageUrl || null;
  const isUnknown = scan.disposalStatus === "unknown";

  const handleScanAnother = () => {
    navigate("/scan");
  };

  const handleBackToResult = () => {
    navigate(`/result/${scan._id}`);
  };

  return (
    <div className="min-h-screen bg-surface-card pb-10">
      
      <div className="sticky top-0 z-30 bg-surface-card border-b border-border-default px-5 py-4 flex items-center gap-3 lg:hidden">
        <button 
          onClick={handleBackToResult} 
          className="text-text-muted hover:text-text-primary p-1 -ml-1 rounded transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <span className="font-semibold text-text-primary">Disposal Guide</span>
      </div>

      <main className="px-5 py-6 lg:px-12 lg:py-10">
        <div className="mx-auto max-w-[1000px]">

          <header className="hidden lg:flex items-center gap-4 mb-8">
            <button 
              onClick={handleBackToResult} 
              className="text-text-muted hover:text-text-primary bg-surface-page hover:bg-success-bg p-2 rounded-full transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
            <h1 className="text-3xl font-semibold text-text-primary">
              Disposal Guide
            </h1>
          </header>

          <div className="flex flex-col gap-8 animate-in fade-in zoom-in-95 duration-300">
            
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-6 lg:gap-10">
              
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-brand text-xs font-semibold tracking-wide uppercase">
                  <span>✦</span>
                  <span>Disposal Guide</span>
                </div>
                <h2 className="text-2xl font-bold text-text-primary mb-2">{scan.wasteName}</h2>
                
                <div className="w-full aspect-4/3 lg:aspect-square bg-black/5 rounded-[24px] border border-border-default overflow-hidden relative shadow-sm">
                  {previewUrl ? (
                    <img 
                      src={previewUrl} 
                      alt={`Uploaded image of a ${scan.wasteName}`}
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

              <div className="flex flex-col justify-end lg:pb-0">
                <RecommendedActionCard action={isUnknown ? "unknown" : scan.disposalStatus} />
              </div>
            </div>

            <div className="w-full h-[1px] bg-success-bg lg:hidden" />

            {!isUnknown && scan.disposalGuide && (
              <div className="flex flex-col gap-8 lg:bg-surface-page lg:border border-border-default p-6 lg:p-10 rounded-2xl lg:rounded-[32px] lg:shadow-sm">
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-4">How to dispose</h3>
                  <p className="text-[#3E5247] leading-relaxed whitespace-pre-line">
                    {scan.disposalGuide}
                  </p>
                </div>
              </div>
            )}

            <LocalGuidanceCard />

            <div className="mt-8 lg:mt-4 flex flex-col items-center">
              <Button 
                onClick={handleScanAnother} 
                className="w-full lg:w-auto lg:min-w-[320px] h-14 text-base rounded-xl shadow-sm"
              >
                Scan Another Item
              </Button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

export default DisposalGuide;
