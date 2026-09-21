import { UserRound } from "lucide-react";
import Button from "../ui/Button";

function ProfileCard({ name, email, avatar, onEditClick }) {
  // Extract initial for avatar fallback
  const initial = name ? name.charAt(0).toUpperCase() : "U";

  return (
    <div className="flex flex-col items-center bg-surface-card border border-border-default rounded-[24px] p-8 shadow-sm">
      
      {/* Avatar */}
      <div className="w-20 h-20 rounded-full bg-success-bg border-4 border-white shadow-sm flex items-center justify-center text-brand text-2xl font-bold mb-4 overflow-hidden relative">
        {avatar ? (
          <img src={avatar} alt={name} className="w-full h-full object-cover" />
        ) : (
          <>{initial}</>
        )}
      </div>

      {/* Info */}
      <h2 className="text-xl font-bold text-text-primary mb-1 text-center">
        {name || "User Name"}
      </h2>
      <p className="text-sm font-medium text-text-muted mb-6 text-center">
        {email || "user@example.com"}
      </p>

      {/* Action */}
      <Button 
        variant="outline" 
        onClick={onEditClick}
        className="w-full sm:w-auto min-w-[200px]"
      >
        Edit Profile
      </Button>
      
    </div>
  );
}

export default ProfileCard;
