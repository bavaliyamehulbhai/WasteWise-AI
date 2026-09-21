import Button from "../ui/Button";

function ResultActions({ onViewGuide, onScanAgain, isUncertain }) {
  return (
    <div className="flex flex-col gap-3 mt-6">
      {!isUncertain && (
        <Button onClick={onViewGuide} className="w-full h-14 text-base rounded-xl shadow-sm">
          View Disposal Guide
        </Button>
      )}
      
      <Button 
        variant="outline" 
        onClick={onScanAgain} 
        className={`w-full h-14 text-base rounded-xl ${
          isUncertain 
            ? "bg-surface-card border-border-default text-text-primary" 
            : "border-transparent text-text-muted hover:bg-surface-page"
        }`}
      >
        {isUncertain ? "Scan Again" : "Scan Another Item"}
      </Button>
    </div>
  );
}

export default ResultActions;
