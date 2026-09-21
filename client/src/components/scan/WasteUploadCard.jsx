import { useRef, useState } from "react";
import { Camera, UploadCloud, Image as ImageIcon } from "lucide-react";
import Button from "../ui/Button";

function WasteUploadCard({ onFileSelect }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Hidden Inputs */}
      <input 
        type="file" 
        accept="image/jpeg, image/png, image/webp" 
        className="hidden" 
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <input 
        type="file" 
        accept="image/*" 
        capture="environment"
        className="hidden" 
        ref={cameraInputRef}
        onChange={handleFileChange}
      />

      {/* Mobile View: Stacked Action Card */}
      <div className="md:hidden flex flex-col gap-4">
        <div className="w-full bg-surface-page border border-border-default rounded-[24px] p-8 flex flex-col items-center text-center shadow-sm">
          <div className="w-16 h-16 bg-success-bg rounded-2xl flex items-center justify-center mb-6 text-brand">
            <Camera size={32} />
          </div>
          
          <h2 className="text-xl font-semibold text-text-primary mb-2">
            Take a Photo
          </h2>
          <p className="text-sm text-text-muted mb-6">
            or choose from gallery
          </p>

          <div className="flex flex-col w-full gap-3">
            <Button 
              onClick={() => cameraInputRef.current?.click()}
              className="w-full h-14 text-base rounded-xl"
            >
              Take a Photo
            </Button>
            <Button 
              variant="outline" 
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-14 text-base rounded-xl bg-surface-card border-border-default hover:bg-surface-page text-text-primary"
            >
              <ImageIcon size={20} className="mr-2" />
              Choose Image
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop View: Drag & Drop Zone */}
      <div className="hidden md:block">
        <div 
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            w-full border-2 border-dashed rounded-[24px] p-12 flex flex-col items-center text-center transition-all duration-200
            ${isDragOver 
              ? "border-brand bg-success-bg" 
              : "border-border-default bg-surface-page hover:border-brand/50 hover:bg-surface-page"
            }
          `}
        >
          <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-200 ${isDragOver ? "bg-brand text-white" : "bg-surface-card text-brand shadow-sm"}`}>
            {isDragOver ? <UploadCloud size={40} /> : <Camera size={40} />}
          </div>
          
          <h2 className="text-2xl font-semibold text-text-primary mb-3">
            {isDragOver ? "Drop image to upload" : "Upload an Image"}
          </h2>
          <p className="text-base text-text-muted mb-8 max-w-[300px]">
            Drag & drop your image here, or browse your files.
          </p>

          <Button 
            onClick={() => fileInputRef.current?.click()}
            className="h-12 px-8 text-base rounded-xl shadow-sm"
          >
            Browse Image
          </Button>
        </div>
      </div>

      {/* Supported Formats info */}
      <div className="text-center md:text-left">
        <p className="text-sm font-medium text-text-primary">Supported formats</p>
        <p className="text-xs text-text-muted mt-1">JPG, PNG, WEBP (Max 5MB)</p>
      </div>

    </div>
  );
}

export default WasteUploadCard;
