import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, MailCheck } from "lucide-react";
import AuthLayout from "../../components/auth/AuthLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setError(null);
    setEmailError("");

    if (!email) {
      setEmailError("Please enter your email address.");
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (email === "error@example.com") {
        throw new Error("We couldn't connect. Please check your connection and try again.");
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
            <MailCheck className="w-8 h-8 text-brand" />
          </div>
          
          <h1 className="text-2xl md:text-[28px] font-semibold text-text-primary">
            Check your email
          </h1>
          <p className="mt-4 text-sm text-text-muted leading-relaxed max-w-[320px]">
            If an account exists for that email, you'll receive instructions to reset your password.
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
          Forgot your password?
        </h1>
        <p className="mt-2 text-sm text-text-muted leading-relaxed">
          Enter your email and we'll send you instructions to reset it.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-error-bg border border-error-text flex items-start gap-3">
          <div className="text-error-text font-semibold shrink-0">!</div>
          <p className="text-sm text-error-text font-medium leading-relaxed">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <Input
          id="email"
          type="email"
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={emailError}
          disabled={loading}
          autoComplete="email"
        />

        <Button 
          type="submit" 
          className="w-full h-12 text-[15px]" 
          isLoading={loading}
          loadingText="Sending..."
          disabled={loading}
        >
          Send Reset Link
        </Button>
      </form>

      <div className="mt-8 text-center text-sm text-text-muted">
        Remember your password?{" "}
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

export default ForgotPassword;
