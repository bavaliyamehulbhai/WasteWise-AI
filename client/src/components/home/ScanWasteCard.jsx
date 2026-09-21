import { ScanLine } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../ui/Button";

function ScanWasteCard() {
  return (
    <div className="w-full bg-brand rounded-[24px] p-6 lg:p-8 flex flex-col items-center text-center shadow-sm relative overflow-hidden group">
      
      {/* Decorative background elements */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-surface-card/10 rounded-full blur-2xl pointer-events-none transition-transform duration-700 group-hover:scale-110"></div>
      <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-black/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-14 h-14 bg-surface-card/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 border border-white/20 z-10">
        <ScanLine className="w-7 h-7 text-white" />
      </div>

      <h2 className="text-xl md:text-2xl font-semibold text-white mb-2 z-10">
        Scan Waste
      </h2>
      
      <p className="text-sm md:text-base text-[#D8E6DD] mb-6 max-w-[280px] z-10">
        Identify waste with AI and get instant disposal guidance.
      </p>

      <Link to="/scan" className="w-full sm:max-w-[240px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#2F8F5B] rounded-xl z-10">
        <Button 
          variant="secondary" 
          className="w-full h-12 bg-surface-card text-text-primary hover:bg-surface-page border-none font-semibold shadow-sm"
        >
          Scan Waste
        </Button>
      </Link>
      
    </div>
  );
}

export default ScanWasteCard;
