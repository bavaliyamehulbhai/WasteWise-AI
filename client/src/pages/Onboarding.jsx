import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Leaf, Target, MapPin, Globe, CheckCircle2 } from "lucide-react";
import Button from "../components/ui/Button";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Onboarding() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    preferredLanguage: "en",
    goals: [],
    country: "",
    city: "",
  });

  const goalsList = [
    { id: "understand-waste", label: "Understand my waste better", icon: <Leaf size={18} /> },
    { id: "improve-sorting", label: "Improve sorting habits", icon: <Target size={18} /> },
    { id: "local-rules", label: "Learn local disposal rules", icon: <MapPin size={18} /> },
    { id: "sustainability", label: "Live more sustainably", icon: <Globe size={18} /> },
  ];

  const handleGoalToggle = (goalId) => {
    setFormData((prev) => {
      if (prev.goals.includes(goalId)) {
        return { ...prev, goals: prev.goals.filter(g => g !== goalId) };
      } else {
        return { ...prev, goals: [...prev.goals, goalId] };
      }
    });
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      await api.put("/profile", {
        ...formData,
        onboardingCompleted: true,
      });
      
      // Update local context so ProtectedRoute doesn't trap them
      updateUser({ ...user, onboardingCompleted: true });
      
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Failed to save onboarding data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-background flex flex-col md:flex-row">
      {/* Left side (Visual/Branding) */}
      <div className="hidden md:flex w-1/3 bg-[#0B2117] flex-col p-10 justify-between text-white">
        <div>
          <div className="w-10 h-10 rounded-xl bg-brand flex items-center justify-center font-bold text-xl mb-6">W</div>
          <h1 className="text-3xl font-semibold leading-tight tracking-tight mt-12">
            Let's personalize your WasteWise experience.
          </h1>
          <p className="mt-4 text-white/60">
            Tell us a bit about your goals so we can tailor our AI recommendations.
          </p>
        </div>
        
        {/* Progress indicators */}
        <div className="flex gap-2">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-1 flex-1 rounded-full ${step >= i ? 'bg-brand' : 'bg-white/20'}`} />
          ))}
        </div>
      </div>

      {/* Right side (Wizard content) */}
      <div className="flex-1 flex flex-col p-6 md:p-12 lg:p-24 overflow-y-auto">
        <div className="md:hidden flex justify-between items-center mb-8">
          <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center font-bold text-white">W</div>
          <div className="text-sm font-medium text-text-muted">Step {step} of 3</div>
        </div>

        <div className="max-w-md w-full mx-auto flex-1 flex flex-col justify-center">
          
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-semibold text-text-primary mb-2">What brings you here?</h2>
              <p className="text-text-muted mb-8">Select all the goals that apply to you.</p>
              
              <div className="space-y-3">
                {goalsList.map(goal => {
                  const isSelected = formData.goals.includes(goal.id);
                  return (
                    <button
                      key={goal.id}
                      onClick={() => handleGoalToggle(goal.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                        isSelected 
                          ? "border-brand bg-brand/5 text-brand" 
                          : "border-border-default hover:border-brand/30 text-text-primary"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? "bg-brand/10" : "bg-surface-page"}`}>
                        {goal.icon}
                      </div>
                      <span className="font-medium flex-1">{goal.label}</span>
                      {isSelected && <CheckCircle2 className="text-brand shrink-0" size={20} />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-semibold text-text-primary mb-2">Choose your language</h2>
              <p className="text-text-muted mb-8">Which language do you prefer for disposal guides?</p>
              
              <div className="space-y-3">
                {[
                  { id: "en", label: "English" },
                  { id: "hi", label: "हिन्दी (Hindi)" },
                  { id: "gu", label: "ગુજરાતી (Gujarati)" }
                ].map(lang => (
                  <button
                    key={lang.id}
                    onClick={() => setFormData(prev => ({ ...prev, preferredLanguage: lang.id }))}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                      formData.preferredLanguage === lang.id
                        ? "border-brand bg-brand/5 text-brand" 
                        : "border-border-default hover:border-brand/30 text-text-primary"
                    }`}
                  >
                    <span className="font-medium">{lang.label}</span>
                    {formData.preferredLanguage === lang.id && <CheckCircle2 className="text-brand shrink-0" size={20} />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-semibold text-text-primary mb-2">Where are you scanning?</h2>
              <p className="text-text-muted mb-8">Your location helps us find local recycling resources. (Optional)</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Country</label>
                  <input 
                    type="text" 
                    placeholder="e.g. India"
                    value={formData.country}
                    onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                    className="w-full px-4 py-3 bg-surface-page border border-border-default rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-colors text-[15px]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">City / Region</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Ahmedabad"
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full px-4 py-3 bg-surface-page border border-border-default rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-colors text-[15px]"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="mt-12 flex items-center justify-between">
            {step > 1 ? (
              <button 
                onClick={() => setStep(s => s - 1)}
                className="text-text-muted hover:text-text-primary font-medium px-4 py-2 transition-colors"
              >
                Back
              </button>
            ) : <div />}
            
            {step < 3 ? (
              <Button onClick={() => setStep(s => s + 1)}>
                Continue
              </Button>
            ) : (
              <Button 
                onClick={handleComplete} 
                isLoading={loading}
                loadingText="Setting up..."
              >
                Complete Setup
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
