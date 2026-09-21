import { CheckCircle2, Loader2, Circle } from "lucide-react";

function AIProcessingSteps({ activeStep, steps }) {
  return (
    <div className="flex flex-col gap-4 mt-6">
      {steps.map((step, index) => {
        const isComplete = index < activeStep;
        const isActive = index === activeStep;
        const isPending = index > activeStep;

        return (
          <div 
            key={index} 
            className={`flex items-center gap-3 transition-opacity duration-300 ${
              isPending ? "opacity-40" : "opacity-100"
            }`}
          >
            {isComplete && (
              <CheckCircle2 size={20} className="text-brand shrink-0" />
            )}
            
            {isActive && (
              <Loader2 size={20} className="text-brand animate-spin shrink-0" />
            )}
            
            {isPending && (
              <Circle size={20} className="text-[#D8E6DD] shrink-0" />
            )}

            <span 
              className={`text-sm font-medium ${
                isComplete ? "text-text-primary" : isActive ? "text-text-primary font-semibold" : "text-text-muted"
              }`}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default AIProcessingSteps;
