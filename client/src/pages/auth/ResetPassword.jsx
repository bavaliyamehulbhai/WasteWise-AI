import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import AuthLayout from "../../components/auth/AuthLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

function ResetPassword() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [fieldErrors, setFieldErrors] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let hasError = false;
    const newErrors = { password: "", confirmPassword: "" };
    setError(null);

    if (!formData.password) {
      newErrors.password = "Please create a new password.";
      hasError = true;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
      hasError = true;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
      hasError = true;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match.";
      hasError = true;
    }

    setFieldErrors(newErrors);

    if (hasError) return;

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate expired token error
      if (formData.password === "expired123") {
        throw new Error("This password reset link is no longer valid. Please request a new reset link.");
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AuthLayout>
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-success-bg rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-8 h-8 text-brand" />
          </div>
          
          <h1 className="text-2xl md:text-[28px] font-semibold text-text-primary">
            Password updated
          </h1>
          <p className="mt-4 text-sm text-text-muted leading-relaxed max-w-[320px]">
            Your password has been changed successfully. You can now login with your new password.
          </p>

          <div className="mt-8 w-full">
            <Link to="/login" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-xl">
              <Button type="button" className="w-full h-12 text-[15px]">
                Back to Login
              </Button>
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="mb-6">
        <Link 
          to="/login" 
          className="inline-flex items-center gap-2 text-sm font-semibold text-text-muted hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </Link>
      </div>

      <div className="flex flex-col mb-8">
        <h1 className="text-2xl md:text-[28px] font-semibold text-text-primary">
          Create a new password
        </h1>
        <p className="mt-2 text-sm text-text-muted leading-relaxed">
          Your new password must be at least 8 characters long.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-error-bg border border-error-text flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <div className="text-error-text font-semibold shrink-0">!</div>
            <p className="text-sm text-error-text font-medium leading-relaxed">{error}</p>
          </div>
          <Link to="/forgot-password">
            <Button variant="outline" className="w-full mt-2 h-10 border-error-text text-error-text hover:bg-error-bg">
              Request New Link
            </Button>
          </Link>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Input
          id="password"
          type="password"
          label="New password"
          placeholder="Create a new password"
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

        <div className="mt-2">
          <Button 
            type="submit" 
            className="w-full h-12 text-[15px]" 
            isLoading={loading}
            loadingText="Resetting..."
            disabled={loading}
          >
            Reset Password
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}

export default ResetPassword;
