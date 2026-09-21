import { useState } from "react";
import { Recycle } from "lucide-react";
import Input from "../components/forms/Input";
import PasswordInput from "../components/forms/PasswordInput";
import Button from "../components/ui/Button"; // Or from common/Button if it's there

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // mock login logic
    window.location.href = "/home";
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-[400px] rounded-[24px] border border-border-default bg-surface-card p-6 shadow-sm md:p-8">
        <div className="mb-8 flex flex-col items-center justify-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-success-bg">
            <Recycle className="h-6 w-6 text-brand" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary">Welcome back</h1>
          <p className="mt-2 text-sm text-text-muted">
            Sign in to your WasteWise account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <PasswordInput
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded border-border-default text-brand focus:ring-brand" />
              <span className="text-text-muted">Remember me</span>
            </label>
            <a href="#" className="font-semibold text-brand hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="mt-2 w-full rounded-xl bg-brand py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-hover focus:outline-none focus:ring-4 focus:ring-brand/20"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-text-muted">
          Don't have an account?{" "}
          <a href="#" className="font-semibold text-brand hover:underline">
            Create account
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
