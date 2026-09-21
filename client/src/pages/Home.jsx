import { Link, useNavigate } from "react-router-dom";
import { 
  Recycle, 
  Camera, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  BarChart3, 
  Award, 
  ShieldCheck, 
  Leaf, 
  Smartphone, 
  Globe, 
  Zap,
  ChevronRight,
  TrendingUp
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";

function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const features = [
    {
      icon: <Camera className="w-6 h-6 text-brand" />,
      title: "AI Vision Scanner",
      description: "Snap or upload any waste photo. Our intelligent AI models instantly identify materials and classification in seconds.",
    },
    {
      icon: <Recycle className="w-6 h-6 text-brand" />,
      title: "Smart Disposal Guidance",
      description: "Receive clear, actionable disposal recommendations—whether to recycle, compost, reuse, or dispose responsibly.",
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-brand" />,
      title: "Carbon & Impact Analytics",
      description: "Monitor your diverted landfill waste, estimated carbon offset (kg CO₂e), and category breakdown over time.",
    },
    {
      icon: <Award className="w-6 h-6 text-brand" />,
      title: "Gamification & Badges",
      description: "Earn XP for every scan, level up your sustainability profile, unlock achievement badges, and climb the leaderboard.",
    },
    {
      icon: <Smartphone className="w-6 h-6 text-brand" />,
      title: "Offline-First PWA",
      description: "Scan waste even without an active internet connection. Your scans sync automatically once you are back online.",
    },
    {
      icon: <Zap className="w-6 h-6 text-brand" />,
      title: "Interactive AI Eco-Assistant",
      description: "Have questions about tricky materials? Chat directly with our built-in sustainability AI assistant anytime.",
    },
  ];

  const steps = [
    {
      step: "01",
      title: "Capture or Upload",
      desc: "Take a picture of the waste item using your phone camera or upload an image file from your device.",
    },
    {
      step: "02",
      title: "AI Analysis",
      desc: "Our vision model processes the visual features and matches them against certified waste categories.",
    },
    {
      step: "03",
      title: "Dispose with Confidence",
      desc: "Follow the itemized preparation steps, earn sustainability XP, and record your environmental impact.",
    },
  ];

  const stats = [
    { value: "98%+", label: "Classification Confidence" },
    { value: "7+", label: "Waste Categories Covered" },
    { value: "< 2s", label: "Average Response Time" },
    { value: "100%", label: "Free & Open to Communities" },
  ];

  return (
    <div className="min-h-screen bg-surface-page text-text-primary flex flex-col selection:bg-brand/20">
      
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-surface-page/80 border-b border-border-default">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-brand flex items-center justify-center text-white shadow-sm shadow-brand/30 group-hover:scale-105 transition-transform">
              <Recycle className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg sm:text-xl tracking-tight text-text-primary">
                WasteWise <span className="text-brand">AI</span>
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-text-muted hidden sm:block">
                Smart Waste Classification
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-text-muted">
            <a href="#features" className="hover:text-brand transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-brand transition-colors">How It Works</a>
            <a href="#impact" className="hover:text-brand transition-colors">Impact</a>
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
                  className="hidden sm:inline-flex text-sm py-2 px-4"
                >
                  Dashboard
                </Button>
                <Button 
                  onClick={() => navigate("/scan")}
                  className="text-sm py-2 px-4 gap-2 shadow-sm shadow-brand/20"
                >
                  <Camera size={16} /> Scan Waste
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  onClick={() => navigate("/login")}
                  className="text-sm py-2 px-4 text-text-muted hover:text-text-primary"
                >
                  Sign In
                </Button>
                <Button 
                  onClick={() => navigate("/register")}
                  className="text-sm py-2 px-4 gap-2 shadow-sm shadow-brand/20"
                >
                  Get Started <ArrowRight size={15} />
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">
        {/* Subtle Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-success-bg border border-brand/20 text-brand text-xs sm:text-sm font-semibold mb-6 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-700">
            <Sparkles size={14} className="animate-pulse text-brand" />
            <span>Next-Gen Sustainability AI Powered by IBM & Cloud Computing</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-text-primary tracking-tight leading-[1.1] mb-6 animate-in fade-in slide-in-from-bottom-3 duration-700">
            Scan waste in seconds. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-[#1B5E3C]">
              Dispose with confidence.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-text-muted mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700">
            WasteWise AI uses cutting-edge machine learning vision to detect waste types, prevent recycling contamination, and guide everyday citizens toward a zero-waste lifestyle.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-14 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <Button
              onClick={() => navigate(isAuthenticated ? "/scan" : "/register")}
              className="w-full sm:w-auto min-h-[52px] px-8 text-base font-semibold shadow-md shadow-brand/25 gap-2"
            >
              <Camera size={18} /> {isAuthenticated ? "Start Scanning" : "Try Free Scanner"}
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate(isAuthenticated ? "/dashboard" : "/login")}
              className="w-full sm:w-auto min-h-[52px] px-8 text-base font-semibold gap-2 border-border-default hover:border-brand/40"
            >
              {isAuthenticated ? "Go to Dashboard" : "Sign In to Account"} <ChevronRight size={18} />
            </Button>
          </div>

          {/* Trust Highlights */}
          <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs sm:text-sm text-text-muted">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-brand" /> Instant Identification
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-brand" /> Zero Equipment Needed
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-brand" /> Works 100% Offline
            </span>
          </div>

        </div>
      </section>

      {/* Stats Counter Ribbon */}
      <section id="impact" className="border-y border-border-default bg-surface-card/60 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col p-2">
                <span className="text-2xl sm:text-4xl font-extrabold text-brand tracking-tight">
                  {stat.value}
                </span>
                <span className="text-xs sm:text-sm text-text-muted mt-1 font-medium">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-brand">Simple 3-Step Process</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mt-2">
            How WasteWise AI Works
          </h2>
          <p className="text-text-muted mt-3 text-sm sm:text-base">
            Turn waste confusion into environmental action in three intuitive steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((item, index) => (
            <div 
              key={index}
              className="bg-surface-card rounded-2xl p-8 border border-border-default shadow-sm hover:shadow-md hover:border-brand/30 transition-all flex flex-col relative"
            >
              <span className="text-4xl font-black text-brand/20 mb-4">{item.step}</span>
              <h3 className="text-xl font-bold text-text-primary mb-2">{item.title}</h3>
              <p className="text-sm text-text-muted leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Core Features Grid */}
      <section id="features" className="py-20 sm:py-28 bg-surface-card/40 border-t border-border-default">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-brand">Intelligent Capabilities</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mt-2">
              Everything you need for sustainable waste management
            </h2>
            <p className="text-text-muted mt-3 text-sm sm:text-base">
              Built for households, educational institutions, businesses, and municipal recycling programs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feat, idx) => (
              <div 
                key={idx}
                className="bg-surface-card rounded-2xl p-7 border border-border-default shadow-sm hover:border-brand/40 hover:-translate-y-1 transition-all flex flex-col"
              >
                <div className="w-12 h-12 rounded-xl bg-success-bg flex items-center justify-center mb-5 border border-brand/10">
                  {feat.icon}
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-2">
                  {feat.title}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  {feat.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 sm:py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="relative rounded-3xl bg-gradient-to-br from-brand to-[#1B5E3C] p-8 sm:p-14 text-white overflow-hidden shadow-xl shadow-brand/20 text-center flex flex-col items-center">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold mb-6 border border-white/20">
            <Leaf size={14} /> Ready to make an impact?
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 max-w-2xl">
            Start classifying your waste with AI today.
          </h2>
          
          <p className="text-white/80 max-w-xl text-sm sm:text-base mb-8 leading-relaxed">
            Join conscious citizens and teams worldwide using WasteWise AI to reduce landfill burden and recycle accurately.
          </p>

          <button
            type="button"
            onClick={() => navigate(isAuthenticated ? "/scan" : "/register")}
            className="inline-flex items-center justify-center gap-2.5 bg-white text-[#166534] hover:bg-white/95 hover:scale-[1.02] active:scale-[0.98] min-h-[52px] px-8 py-3.5 rounded-xl text-base font-bold shadow-lg shadow-black/15 transition-all cursor-pointer border-0"
          >
            <Camera size={20} className="text-[#166534]" />
            <span className="text-[#166534] font-bold tracking-tight">
              {isAuthenticated ? "Open Camera Scanner" : "Create Free Account"}
            </span>
          </button>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border-default bg-surface-card py-12 text-sm text-text-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center text-white">
              <Recycle size={18} />
            </div>
            <span className="font-bold text-text-primary">WasteWise AI</span>
            <span className="text-xs">© 2026 • Built for IBM Internship</span>
          </div>

          <div className="flex items-center gap-6 text-xs sm:text-sm font-medium">
            <Link to="/login" className="hover:text-brand transition-colors">Sign In</Link>
            <Link to="/register" className="hover:text-brand transition-colors">Register</Link>
            <Link to="/dashboard" className="hover:text-brand transition-colors">Dashboard</Link>
            <Link to="/scan" className="hover:text-brand transition-colors">Scanner</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default Home;
