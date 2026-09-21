import { FileImage, Loader2 } from "lucide-react";
import Button from "../ui/Button";

function ImagePreviewCard({ 
  file, 
  previewUrl, 
  onAnalyze, 
  onChangeImage, 
  isUploading,
  isOnline = true
}) {
  
  // Format file size (bytes to MB)
  const fileSizeMB = file ? (file.size / (1024 * 1024)).toFixed(2) : "0";
  // Format filename extension
  const fileExt = file?.name.split('.').pop().toUpperCase() || "IMG";
  // Truncate filename if too long
  const filename = file?.name || "waste_image.jpg";
  const displayFilename = filename.length > 25 
    ? filename.substring(0, 15) + "..." + filename.slice(-8)
    : filename;

  return (
    <div className="flex flex-col gap-6">
      
      <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-10">
        
        {/* Left: Image Container (4:3 Aspect Ratio) */}
        <div className="w-full md:w-3/5 lg:w-1/2 aspect-4/3 bg-black/5 rounded-[24px] border border-border-default overflow-hidden relative shadow-sm">
          {previewUrl ? (
            <img 
              src={previewUrl} 
              alt="Selected waste" 
              className={`w-full h-full object-contain transition-opacity duration-300 ${isUploading ? 'opacity-50' : 'opacity-100'}`}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-text-muted">
              <FileImage size={48} className="opacity-20 mb-4" />
              <p className="text-sm font-medium">Image Preview</p>
            </div>
          )}

          {/* Uploading Overlay */}
          {isUploading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 backdrop-blur-sm">
              <Loader2 className="w-10 h-10 text-brand animate-spin mb-4" />
              <p className="text-text-primary font-semibold bg-surface-card/80 px-4 py-1.5 rounded-full shadow-sm text-sm">
                Preparing analysis...
              </p>
            </div>
          )}
        </div>

        {/* Right: File Metadata & Actions */}
        <div className="flex flex-col w-full md:w-2/5 lg:flex-1 pt-2">
          
          <h2 className="text-xl font-semibold text-text-primary mb-6 hidden md:block">
            Image Details
          </h2>

          <div className="flex items-center gap-4 bg-surface-page p-4 rounded-xl border border-border-default mb-8">
            <div className="w-12 h-12 bg-surface-card rounded-lg flex items-center justify-center shrink-0 border border-border-default/50">
              <FileImage size={24} className="text-brand" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-text-primary truncate" title={filename}>
                {displayFilename}
              </p>
              <p className="text-xs text-text-muted mt-1">
                {fileSizeMB} MB • {fileExt}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-auto">
            <Button 
              onClick={onAnalyze} 
              disabled={!file || isUploading}
              isLoading={isUploading}
              loadingText="Analyzing..."
              className="w-full h-14 text-base rounded-xl shadow-sm"
            >
              {isOnline ? "Analyze Waste" : "Save for Later"}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={onChangeImage}
              disabled={isUploading}
              className="w-full h-14 text-base rounded-xl border-border-default text-text-primary hover:bg-surface-page"
            >
              Change Image
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ImagePreviewCard;
