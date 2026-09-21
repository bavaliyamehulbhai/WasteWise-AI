import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    password: "",
  });

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic frontend validation
    let hasError = false;
    const newErrors = { email: "", password: "" };
    setError(null);

    if (!formData.email) {
      newErrors.email = "Please enter your email address.";
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
      hasError = true;
    }

    if (!formData.password) {
      newErrors.password = "Please enter your password.";
      hasError = true;
    }

    setFieldErrors(newErrors);

    if (hasError) return;

    // Call real API
    setLoading(true);
    try {
      const response = await api.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      const data = response.data;

      if (!data.success) {
        throw new Error(data.message || "Login failed");
      }

      login(data.token, data.user);
      
      // Success: redirect based on role
      if (data.user.role === "admin" || data.user.role === "reviewer") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "We couldn't sign you in. Check your email and password and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="flex flex-col mb-8">
        <h1 className="text-2xl md:text-[28px] font-semibold text-text-primary">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-text-muted">
          Sign in to continue managing your waste.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-error-bg border border-error-text flex items-start gap-3">
          <div className="text-error-text font-semibold shrink-0">!</div>
          <p className="text-sm text-error-text font-medium leading-relaxed">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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

        <div className="flex flex-col gap-2">
          <Input
            id="password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            error={fieldErrors.password}
            disabled={loading}
            autoComplete="current-password"
          />
          
          <div className="flex justify-end mt-1">
            <Link 
              to="/forgot-password" 
              className="text-sm font-semibold text-brand hover:text-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded transition-colors"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <div className="mt-2">
          <Button 
            type="submit" 
            className="w-full h-12 text-[15px]" 
            isLoading={loading}
            loadingText="Signing in..."
            disabled={loading}
          >
            Login
          </Button>
        </div>
      </form>

      <div className="mt-8 text-center text-sm text-text-muted">
        Don't have an account?{" "}
        <Link 
          to="/register" 
          className="font-semibold text-brand hover:text-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded transition-colors"
        >
          Create account
        </Link>
      </div>
    </AuthLayout>
  );
}

export default Login;
