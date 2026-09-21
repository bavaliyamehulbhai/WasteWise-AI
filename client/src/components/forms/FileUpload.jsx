import { UploadCloud, Image as ImageIcon, X } from "lucide-react";
import { useState, useRef } from "react";

function FileUpload({ accept = "image/jpeg, image/png, image/webp", onFileSelect, error }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file) => {
    if (file) {
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      if (onFileSelect) onFileSelect(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    setSelectedFile(null);
    setPreview(null);
    if (onFileSelect) onFileSelect(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="w-full">
      {!selectedFile ? (
        <div
          className={`
            relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed
            p-8 text-center transition-colors cursor-pointer
            ${dragActive ? "border-brand bg-success-bg" : error ? "border-[#C94F4F] bg-error-bg" : "border-border-default bg-surface-page hover:border-[#BFD2C7]"}
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleChange}
            className="hidden"
          />
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-surface-card shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
            <UploadCloud size={24} className={error ? "text-[#C94F4F]" : "text-brand"} />
          </div>
          <h4 className="mb-1 text-base font-semibold text-text-primary">
            Upload or drag image
          </h4>
          <p className="text-sm text-text-muted">
            JPG, PNG, WEBP up to 5MB
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="relative aspect-[4/3] sm:aspect-video w-full overflow-hidden rounded-2xl bg-black/5">
            <img src={preview} alt="Preview" className="h-full w-full object-contain" />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-black/60"
            >
              <X size={16} />
            </button>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-border-default bg-surface-card p-3">
            <ImageIcon size={20} className="text-[#94A39B]" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-text-primary">{selectedFile.name}</p>
              <p className="text-xs text-text-muted">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
            <button type="button" onClick={handleRemove} className="text-[13px] font-semibold text-[#C94F4F] hover:underline">
              Remove
            </button>
          </div>
        </div>
      )}
      {error && (
        <p className="mt-2 text-xs font-medium text-[#9B3838]">
          {error}
        </p>
      )}
    </div>
  );
}

export default FileUpload;
