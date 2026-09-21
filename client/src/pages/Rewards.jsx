import { useEffect, useState } from "react";
import { getGamification } from "../services/gamificationService";
import { Trophy, Star, Shield, Lock } from "lucide-react";
import Leaderboard from "../components/gamification/Leaderboard";

const BADGE_ICONS = {
  first_scan: <Star className="text-brand" size={24} />,
  scan_starter: <Shield className="text-brand" size={24} />,
  waste_explorer: <Trophy className="text-brand" size={24} />,
  waste_warrior: <Trophy className="text-[#C8A042]" size={24} />, // Gold trophy
};

const ALL_BADGES = [
  { key: "first_scan", name: "First Scan", desc: "Completed your first waste scan", requiredScans: 1 },
  { key: "scan_starter", name: "Scan Starter", desc: "Completed 10 waste scans", requiredScans: 10 },
  { key: "waste_explorer", name: "Waste Explorer", desc: "Completed 25 waste scans", requiredScans: 25 },
  { key: "waste_warrior", name: "Waste Warrior", desc: "Completed 50 waste scans", requiredScans: 50 },
];

const Rewards = () => {
  const [gamification, setGamification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadRewards = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getGamification();
        if (data.success) {
          setGamification(data.gamification);
        } else {
          setError("Failed to load rewards");
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Unable to load rewards");
      } finally {
        setLoading(false);
      }
    };
    loadRewards();
  }, []);

  if (loading) {
    return (
      <div className="w-full space-y-6 animate-pulse p-6">
        <div className="h-48 rounded-2xl bg-surface-card border border-border-default" />
        <div className="h-64 rounded-2xl bg-surface-card border border-border-default" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <div className="rounded-2xl bg-error-bg border border-error-text p-8 text-center shadow-sm max-w-md w-full">
          <h2 className="text-lg font-semibold text-error-text">Unable to load rewards</h2>
          <p className="mt-2 text-sm font-medium text-error-text/80 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-error-text text-white font-semibold rounded-xl"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const earnedBadgeKeys = gamification?.badges?.map(b => b.badgeKey) || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-300">
      <h1 className="text-2xl font-bold text-text-primary px-1">Rewards & Achievements</h1>

      {/* Level Card */}
      <section className="rounded-2xl border border-border-default bg-surface-card p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="h-24 w-24 shrink-0 rounded-full bg-brand/10 border-[4px] border-brand flex flex-col items-center justify-center shadow-inner">
              <span className="text-xs font-semibold text-brand uppercase tracking-widest">Level</span>
              <span className="text-4xl font-bold text-brand leading-none">{gamification.level}</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-primary mb-1">Your Sustainability Journey</h2>
              <p className="text-text-muted font-medium mb-3">Keep scanning to level up and earn rewards.</p>
              <div className="inline-flex items-center gap-1.5 bg-surface-hover px-3 py-1.5 rounded-lg border border-border-default text-sm font-semibold text-text-primary">
                <span>{gamification.xp.toLocaleString()} Total XP</span>
                <span className="text-brand">✨</span>
              </div>
            </div>
          </div>

          <div className="flex-1 max-w-sm w-full bg-surface-page p-4 rounded-xl border border-border-default">
            <div className="flex justify-between text-sm font-semibold mb-2">
              <span className="text-text-primary">{gamification.currentXP} XP</span>
              <span className="text-text-muted">{gamification.xpForNextLevel} XP</span>
            </div>
            <div className="h-3 w-full bg-surface-hover rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full bg-brand rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${Math.min(Math.max(gamification.progress, 0), 100)}%` }}
              />
            </div>
            <p className="text-xs text-text-muted text-center mt-3 font-medium">
              Earn <span className="font-bold text-brand">{gamification.xpForNextLevel - gamification.currentXP} more XP</span> to reach Level {gamification.level + 1}
            </p>
          </div>
        </div>
      </section>

      {/* Badges Section */}
      <section className="rounded-2xl border border-border-default bg-surface-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-text-primary mb-6 flex items-center gap-2">
          Earned Badges <span className="bg-surface-page border border-border-default text-text-muted text-xs px-2 py-0.5 rounded-full">{earnedBadgeKeys.length} / {ALL_BADGES.length}</span>
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {ALL_BADGES.map(badge => {
            const isEarned = earnedBadgeKeys.includes(badge.key);
            return (
              <div 
                key={badge.key} 
                className={`relative p-5 rounded-2xl border flex flex-col items-center text-center transition-all ${
                  isEarned 
                    ? "bg-surface-page border-brand/30 shadow-sm" 
                    : "bg-surface-hover/50 border-border-default opacity-60 grayscale"
                }`}
              >
                {!isEarned && (
                  <div className="absolute top-3 right-3 text-text-muted">
                    <Lock size={14} />
                  </div>
                )}
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 shadow-inner ${
                  isEarned ? "bg-white border-2 border-brand/20" : "bg-surface-page border border-border-default"
                }`}>
                  {BADGE_ICONS[badge.key] || <Star size={24} />}
                </div>
                <h3 className="font-semibold text-text-primary text-sm mb-1">{badge.name}</h3>
                <p className="text-xs text-text-muted line-clamp-2">{badge.desc}</p>
                {isEarned && (
                  <span className="mt-3 text-[10px] uppercase font-bold tracking-wider text-brand">Earned</span>
                )}
              </div>
            );
          })}
        </div>
      </section>
      
      {/* Challenges Section - Premium Polish */}
      <section className="rounded-2xl border border-border-default bg-surface-card p-6 shadow-sm relative overflow-hidden">
        {/* Background ambient glow */}
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-brand/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex items-center justify-between mb-6 relative z-10">
          <h2 className="text-lg font-bold text-text-primary">Active Challenges</h2>
          <span className="flex items-center gap-1.5 text-xs font-bold text-text-muted bg-surface-page border border-border-default px-3 py-1.5 rounded-full shadow-sm">
            <Lock size={12} className="text-brand" />
            Unlocks at Level 10
          </span>
        </div>
        
        <div className="bg-gradient-to-br from-surface-page to-surface-card border border-border-default rounded-xl p-8 text-center relative z-10 group transition-all hover:border-brand/30">
          <div className="w-16 h-16 bg-surface-card border border-border-default rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300">
            <Trophy className="text-brand opacity-50" size={32} />
          </div>
          <h3 className="font-bold text-text-primary mb-2 text-lg">Weekly Eco-Warrior Challenge</h3>
          <p className="text-sm text-text-muted max-w-md mx-auto leading-relaxed">
            Scan 20 unique items and correctly sort 5 compostables to earn massive XP boosts and exclusive profile badges.
          </p>
          
          <div className="mt-6 flex justify-center gap-2 opacity-50">
            <div className="w-2 h-2 rounded-full bg-border-default"></div>
            <div className="w-2 h-2 rounded-full bg-border-default"></div>
            <div className="w-2 h-2 rounded-full bg-border-default"></div>
          </div>
        </div>
      </section>

      {/* Global Leaderboard */}
      <Leaderboard currentUserXP={gamification.xp} />

    </div>
  );
};

export default Rewards;
