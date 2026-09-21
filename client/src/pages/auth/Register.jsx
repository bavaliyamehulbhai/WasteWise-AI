import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { Check } from "lucide-react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsError, setTermsError] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    let hasError = false;
    const newErrors = { name: "", email: "", password: "", confirmPassword: "" };
    setError(null);
    setTermsError(false);

    if (!formData.name.trim()) {
      newErrors.name = "Please enter your name.";
      hasError = true;
    }

    if (!formData.email) {
      newErrors.email = "Please enter your email address.";
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
      hasError = true;
    }

    if (!formData.password) {
      newErrors.password = "Please create a password.";
      hasError = true;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
      hasError = true;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
      hasError = true;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match.";
      hasError = true;
    }

    if (!termsAccepted) {
      setTermsError(true);
      hasError = true;
    }

    setFieldErrors(newErrors);

    if (hasError) return;

    // Call real API
    setLoading(true);
    try {
      const response = await api.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      const data = response.data;

      if (!data.success) {
        throw new Error(data.message || "Registration failed");
      }

      login(data.token, data.user);
      
      // Navigate to dashboard after successful registration
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message || "We couldn't create your account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="flex flex-col mb-8">
        <h1 className="text-2xl md:text-[28px] font-semibold text-text-primary">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-text-muted">
          Start tracking and improving your waste habits.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-error-bg border border-error-text flex items-start gap-3">
          <div className="text-error-text font-semibold shrink-0">!</div>
          <p className="text-sm text-error-text font-medium leading-relaxed">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        
        <Input
          id="name"
          type="text"
          label="Full name"
          placeholder="Enter your name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          error={fieldErrors.name}
          disabled={loading}
          autoComplete="name"
        />

        <Input
          id="email"
          type="email"
          label="Email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          error={fieldErrors.email}
          disabled={loading}
          autoComplete="email"
        />

        <Input
          id="password"
          type="password"
          label="Password"
          placeholder="Create a password"
          value={formData.password}
          onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
          error={fieldErrors.password}
          disabled={loading}
          autoComplete="new-password"
        />

        <Input
          id="confirmPassword"
          type="password"
          label="Confirm password"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
          error={fieldErrors.confirmPassword}
          disabled={loading}
          autoComplete="new-password"
        />

        {/* Terms Checkbox */}
        <div className="mt-2 flex items-start gap-3">
          <div className="flex items-center h-5 mt-0.5">
            <button
              type="button"
              role="checkbox"
              aria-checked={termsAccepted}
              onClick={() => {
                setTermsAccepted(!termsAccepted);
                if (termsError) setTermsError(false);
              }}
              className={`
                w-5 h-5 rounded flex items-center justify-center border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2
                ${termsAccepted 
                  ? "bg-brand border-brand" 
                  : termsError
                    ? "bg-surface-card border-[#E54D4D]"
                    : "bg-surface-card border-border-default hover:border-brand"
                }
              `}
              aria-label="I agree to the Terms & Privacy Policy"
            >
              {termsAccepted && <Check size={14} className="text-white" />}
            </button>
          </div>
          <div className="text-sm">
            <label onClick={() => {
                setTermsAccepted(!termsAccepted);
                if (termsError) setTermsError(false);
              }} 
              className="text-text-primary cursor-pointer"
            >
              I agree to the{" "}
              <Link to="/terms" className="font-semibold text-brand hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded" onClick={(e) => e.stopPropagation()}>
                Terms
              </Link>{" "}
              &{" "}
              <Link to="/privacy" className="font-semibold text-brand hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded" onClick={(e) => e.stopPropagation()}>
                Privacy Policy
              </Link>
            </label>
            {termsError && (
              <p className="text-xs text-error-text font-medium mt-1">You must accept the terms to continue.</p>
            )}
          </div>
        </div>

        <div className="mt-4">
          <Button 
            type="submit" 
            className="w-full h-12 text-[15px]" 
            isLoading={loading}
            loadingText="Creating account..."
            disabled={loading}
          >
            Create Account
          </Button>
        </div>
      </form>

      <div className="mt-8 text-center text-sm text-text-muted">
        Already have an account?{" "}
        <Link 
          to="/login" 
          className="font-semibold text-brand hover:text-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded transition-colors"
        >
          Login
        </Link>
      </div>
    </AuthLayout>
  );
}

export default Register;
