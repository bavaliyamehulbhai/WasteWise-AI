import { useState, useRef } from "react";
import { X, Camera } from "lucide-react";
import Button from "../ui/Button";

function EditProfileForm({ initialName, initialEmail, initialAvatar, onClose, onSave, isSaving }) {
  const [name, setName] = useState(initialName || "");
  const [email, setEmail] = useState(initialEmail || "");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(initialAvatar || null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }
    onSave(formData);
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-[#16352A]/20 z-40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed bottom-0 left-0 right-0 lg:top-1/2 lg:left-1/2 lg:bottom-auto lg:right-auto lg:-translate-x-1/2 lg:-translate-y-1/2 z-50 bg-surface-card rounded-t-[32px] lg:rounded-[32px] p-6 lg:p-8 flex flex-col gap-6 animate-in slide-in-from-bottom lg:slide-in-from-bottom-0 lg:zoom-in-95 duration-300 w-full lg:w-[480px] max-h-[90vh] overflow-y-auto shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-text-primary">Edit Profile</h2>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-surface-page flex items-center justify-center text-text-muted hover:text-text-primary"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          
          {/* Avatar Edit */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-success-bg border-4 border-white shadow-sm flex items-center justify-center text-brand text-3xl font-bold overflow-hidden">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <>{name ? name.charAt(0).toUpperCase() : "U"}</>
                )}
              </div>
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept="image/*"
                onChange={handleFileChange}
              />
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-8 h-8 bg-surface-card border border-border-default rounded-full shadow-sm flex items-center justify-center text-text-primary hover:bg-surface-page transition-colors"
              >
                <Camera size={16} />
              </button>
            </div>
            <span className="text-xs font-semibold text-text-muted">Change Photo</span>
          </div>

          {/* Inputs */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-sm font-semibold text-text-primary">Full Name</label>
              <input 
                id="name"
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-[52px] px-4 bg-surface-page border border-border-default rounded-[16px] text-base text-text-primary focus:outline-none focus:border-brand focus:bg-surface-card transition-colors"
                placeholder="e.g. Mehul Bavaliya"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-semibold text-text-primary">Email Address</label>
              <input 
                id="email"
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-[52px] px-4 bg-surface-page border border-border-default rounded-[16px] text-base text-text-primary focus:outline-none focus:border-brand focus:bg-surface-card transition-colors"
                placeholder="e.g. mehul@example.com"
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full mt-2" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </div>
    </>
  );
}

export default EditProfileForm;
