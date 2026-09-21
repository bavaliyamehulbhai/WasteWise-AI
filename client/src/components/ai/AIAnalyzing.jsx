import { Sparkles } from "lucide-react";

function AIAnalyzing({ stage = 0 }) {
  const stages = [
    "Analyzing image...",
    "Identifying material...",
    "Preparing guidance..."
  ];

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center" aria-live="polite">
      <div className="relative mb-6">
        <div className="absolute inset-0 animate-ping rounded-full bg-success-bg opacity-75"></div>
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-success-bg text-brand">
          <Sparkles size={28} className="animate-pulse" />
        </div>
      </div>
      
      <h3 className="mb-2 text-lg font-semibold text-text-primary">
        AI Analyzing...
      </h3>
      
      <div className="mb-6 h-1.5 w-48 overflow-hidden rounded-full bg-[#EEF3F0]">
        <div 
          className="h-full w-1/2 rounded-full bg-brand" 
          style={{ 
            animation: "slideRight 1.5s infinite ease-in-out",
          }} 
        />
        <style>{`
          @keyframes slideRight {
            0% { transform: translateX(-100%); }
            50% { transform: translateX(100%); }
            100% { transform: translateX(200%); }
          }
        `}</style>
      </div>

      <div className="flex flex-col items-start gap-3 text-sm text-text-muted">
        {stages.map((text, index) => (
          <div key={text} className="flex items-center gap-3">
            {index < stage ? (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand text-white text-[10px]">✓</span>
            ) : index === stage ? (
              <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-brand text-transparent text-[10px]">●</span>
            ) : (
              <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-border-default text-transparent text-[10px]">○</span>
            )}
            <span className={index === stage ? "font-medium text-text-primary" : ""}>{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AIAnalyzing;
