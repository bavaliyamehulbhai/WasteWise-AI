import { useState } from "react";
import { LogOut } from "lucide-react";
import Button from "../ui/Button";

function LogoutButton({ onLogout }) {
  const [showConfirm, setShowConfirm] = useState(false);

  if (showConfirm) {
    return (
      <div className="bg-[#FFF4F4] border border-error-text rounded-[24px] p-6 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
        <h3 className="text-base font-bold text-[#A53E3E] text-center">Log out?</h3>
        <p className="text-sm text-[#A53E3E] text-center">Are you sure you want to log out of your account?</p>
        <div className="flex gap-3 mt-2">
          <Button 
            variant="outline" 
            className="flex-1 border-error-text text-[#A53E3E] hover:bg-[#FFEBEB]"
            onClick={() => setShowConfirm(false)}
          >
            Cancel
          </Button>
          <Button 
            className="flex-1 bg-error-text hover:bg-[#CC4444]"
            onClick={onLogout}
          >
            Log Out
          </Button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="flex items-center justify-center gap-2 w-full min-h-[56px] bg-surface-card border border-error-text rounded-[20px] text-base font-bold text-error-text hover:bg-[#FFF4F4] transition-colors shadow-sm"
    >
      <LogOut size={20} />
      Log Out
    </button>
  );
}

export default LogoutButton;
