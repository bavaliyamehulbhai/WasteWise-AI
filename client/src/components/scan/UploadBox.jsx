import { useEffect, useRef, useState } from "react";
import {
  Camera,
  ImagePlus,
  Upload,
  X,
  Sparkles,
  LoaderCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import Button from "../common/Button";
import Card from "../common/Card";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

function UploadBox() {
  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileSelect = (file) => {
    if (!file) return;

    setError("");

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Please select a JPG, PNG, or WebP image.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("Image size must be less than 10 MB.");
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleInputChange = (event) => {
    const file = event.target.files?.[0];
    handleFileSelect(file);
    
    // Reset input so the same file can be selected again
    event.target.value = "";
  };

  const handleRemove = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl("");
    setError("");
  };

  const handleAnalyze = () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    
    const reader = new FileReader();

    reader.onload = () => {
      sessionStorage.setItem(
        "wastewise_scan_image",
        reader.result
      );

      navigate("/analyzing");
    };

    reader.readAsDataURL(selectedFile);
  };

  return (
    <Card className="p-5 lg:p-8">
      <div>
        <h2 className="text-lg font-semibold text-text-primary">
          Place your waste item in the frame
        </h2>

        <p className="mt-2 text-sm text-text-muted">
          Use a clear photo with good lighting for better results.
        </p>
      </div>

      {error && (
        <div className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-xs font-medium text-[#C94F4F]">
          {error}
        </div>
      )}

      {/* Upload area */}
      <div className="mt-6">
        {!previewUrl ? (
          <EmptyUploadState
            onSelect={() => cameraInputRef.current?.click()}
          />
        ) : (
          <ImagePreview
            previewUrl={previewUrl}
            file={selectedFile}
            onRemove={handleRemove}
          />
        )}
      </div>

      {/* Hidden file inputs */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleInputChange}
        className="hidden"
      />
      
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Actions */}
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        {!previewUrl && (
          <>
            <Button
              className="w-full sm:w-auto"
              onClick={() => cameraInputRef.current?.click()}
            >
              <Camera size={18} className="mr-2" />
              Capture Photo
            </Button>

            <Button
              variant="secondary"
              className="w-full sm:w-auto"
              onClick={() => galleryInputRef.current?.click()}
            >
              <ImagePlus size={18} className="mr-2" />
              Upload from Gallery
            </Button>
          </>
        )}

        {previewUrl && (
          <>
            <Button
              className="w-full sm:flex-1"
              disabled={isAnalyzing}
              onClick={handleAnalyze}
            >
              {isAnalyzing ? (
                <>
                  <LoaderCircle
                    size={18}
                    className="mr-2 animate-spin"
                  />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles size={18} className="mr-2" />
                  Analyze Waste
                </>
              )}
            </Button>

            <Button
              variant="secondary"
              className="w-full sm:w-auto"
              onClick={() => galleryInputRef.current?.click()}
            >
              Change Image
            </Button>
          </>
        )}
      </div>

      <p className="mt-4 text-center text-xs text-text-muted">
        JPG, PNG or WebP • Max 10 MB
      </p>
    </Card>
  );
}

function EmptyUploadState({ onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="
        group
        flex
        min-h-[300px]
        w-full
        flex-col
        items-center
        justify-center
        rounded-[22px]
        border
        border-dashed
        border-[#C9DED0]
        bg-success-bg
        px-5
        text-center
        transition
        hover:border-brand
        hover:bg-[#E3F2E8]
        lg:min-h-[390px]
      "
    >
      <div
        className="
          flex
          h-20
          w-20
          items-center
          justify-center
          rounded-full
          bg-surface-card
          shadow-sm
        "
      >
        <Upload
          size={30}
          className="
            text-brand
            transition
            group-hover:scale-110
          "
        />
      </div>

      <h3 className="mt-5 text-base font-semibold text-success-text">
        Upload a waste photo
      </h3>

      <p className="mt-2 max-w-[360px] text-sm leading-6 text-text-muted">
        Choose a clear image of the waste item you want WasteWise AI
        to identify.
      </p>
    </button>
  );
}

function ImagePreview({ previewUrl, file, onRemove }) {
  return (
    <div
      className="
        relative
        overflow-hidden
        rounded-[22px]
        border
        border-border-default
        bg-success-bg
      "
    >
      <img
        src={previewUrl}
        alt="Selected waste item"
        className="
          h-[300px]
          w-full
          object-contain
          lg:h-[390px]
        "
      />

      <button
        type="button"
        onClick={onRemove}
        aria-label="Remove selected image"
        className="
          absolute
          right-4
          top-4
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-full
          bg-surface-card
          text-[#C94F4F]
          shadow-md
          transition
          hover:bg-red-50
        "
      >
        <X size={18} />
      </button>

      <div
        className="
          absolute
          bottom-4
          left-4
          right-4
          rounded-xl
          bg-black/60
          px-4
          py-3
          backdrop-blur-sm
        "
      >
        <p className="truncate text-xs font-medium text-white">
          {file?.name}
        </p>

        <p className="mt-1 text-[10px] text-white/70">
          {file ? (file.size / 1024 / 1024).toFixed(2) : "0.00"} MB
        </p>
      </div>
    </div>
  );
}

export default UploadBox;
