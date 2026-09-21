import { useNavigate } from "react-router-dom";
import { Camera } from "lucide-react";
import Button from "../ui/Button";

function ScanCTA() {
  const navigate = useNavigate();

  return (
    <div className="bg-success-bg border border-border-default rounded-[24px] p-6 lg:p-8 flex flex-col items-start gap-4">
      <h2 className="text-xl lg:text-2xl font-bold text-text-primary">
        ♻ Ready to scan?
      </h2>
      <p className="text-success-text text-sm lg:text-base leading-relaxed max-w-[280px]">
        Identify waste with AI and get instant disposal guidance.
      </p>
      
      <Button 
        onClick={() => navigate("/scan")} 
        className="mt-2 w-full lg:w-auto h-12 lg:h-14 px-8 text-base rounded-xl shadow-sm flex items-center justify-center gap-2"
      >
        <Camera size={20} />
        Scan Waste
      </Button>
    </div>
  );
}

export default ScanCTA;
