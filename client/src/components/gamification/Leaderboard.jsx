import { useAuth } from "../../context/AuthContext";
import { Trophy, Medal, Award, Crown } from "lucide-react";

export default function Leaderboard({ currentUserXP = 0 }) {
  const { user } = useAuth();

  // Generate realistic mocked data
  const baseLeaderboard = [
    { id: 1, name: "EcoWarrior99", xp: 12450, avatar: "🌍" },
    { id: 2, name: "GreenQueen", xp: 11200, avatar: "🌱" },
    { id: 3, name: "RecycleKing", xp: 9800, avatar: "♻️" },
    { id: 4, name: "NatureLover", xp: 8500, avatar: "🌳" },
    { id: 5, name: "CaptainCompost", xp: 7200, avatar: "🍂" },
    { id: 6, name: "SaveTheTurtles", xp: 6100, avatar: "🐢" },
    { id: 7, name: "OceanDefender", xp: 5400, avatar: "🌊" },
    { id: 8, name: "ZeroWasteHero", xp: 4800, avatar: "🦸" },
    { id: 9, name: "EarthGuardian", xp: 3900, avatar: "🛡️" },
  ];

  // Insert current user into the leaderboard
  const currentUserEntry = {
    id: "current",
    name: user?.name || "You",
    xp: currentUserXP || user?.xp || 0,
    avatar: "👤",
    isCurrentUser: true,
  };

  const combinedLeaderboard = [...baseLeaderboard, currentUserEntry].sort((a, b) => b.xp - a.xp);

  // Take top 10
  const top10 = combinedLeaderboard.slice(0, 10);

  const getRankStyle = (index) => {
    switch (index) {
      case 0:
        return "bg-[#FFF9E6] border-[#FDE047] dark:bg-[#423812] dark:border-[#EAB308]"; // Gold
      case 1:
        return "bg-[#F1F5F9] border-[#CBD5E1] dark:bg-[#1E293B] dark:border-[#94A3B8]"; // Silver
      case 2:
        return "bg-[#FFF7ED] border-[#FDBA74] dark:bg-[#432313] dark:border-[#D97706]"; // Bronze
      default:
        return "bg-surface-card border-border-default"; // Default
    }
  };

  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return <Crown className="text-[#EAB308]" size={24} />;
      case 1:
        return <Medal className="text-[#94A3B8]" size={24} />;
      case 2:
        return <Award className="text-[#D97706]" size={24} />;
      default:
        return <div className="w-6 h-6 flex items-center justify-center font-bold text-text-muted">{index + 1}</div>;
    }
  };

  return (
    <div className="mt-8 bg-surface-card border border-border-default rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-brand/20 flex items-center justify-center text-brand">
          <Trophy size={20} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-text-primary">Top Recyclers of the Week</h2>
          <p className="text-sm text-text-muted">See how you stack up against the community</p>
        </div>
      </div>

      <div className="space-y-3">
        {top10.map((entry, index) => (
          <div
            key={entry.id}
            className={`flex items-center justify-between p-4 rounded-xl border transition-all ${getRankStyle(index)} ${entry.isCurrentUser ? 'ring-2 ring-brand shadow-md relative overflow-hidden' : ''}`}
          >
            {/* Current user highlight effect */}
            {entry.isCurrentUser && (
              <div className="absolute top-0 left-0 w-1 h-full bg-brand"></div>
            )}
            
            <div className="flex items-center gap-4">
              <div className="shrink-0 w-8 flex justify-center">
                {getRankIcon(index)}
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-page border border-border-default flex items-center justify-center text-xl">
                  {entry.avatar}
                </div>
                <div>
                  <h3 className={`font-semibold ${entry.isCurrentUser ? 'text-brand' : 'text-text-primary'}`}>
                    {entry.name} {entry.isCurrentUser && "(You)"}
                  </h3>
                  <p className="text-xs text-text-muted">Rank #{index + 1}</p>
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="font-bold text-text-primary">{entry.xp.toLocaleString()}</span>
              <span className="text-xs text-text-muted ml-1">XP</span>
            </div>
          </div>
        ))}
      </div>
      
      {!top10.some(entry => entry.isCurrentUser) && (
        <div className="mt-4 p-4 border border-dashed border-border-default rounded-xl bg-surface-page flex items-center justify-between opacity-70">
          <div className="flex items-center gap-4">
            <div className="shrink-0 w-8 flex justify-center font-bold text-text-muted">
              {combinedLeaderboard.findIndex(e => e.isCurrentUser) + 1}
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-surface-page border border-border-default flex items-center justify-center text-xl">
                👤
              </div>
              <div>
                <h3 className="font-semibold text-brand">You</h3>
                <p className="text-xs text-text-muted">Keep scanning to climb up!</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="font-bold text-text-primary">{currentUserEntry.xp.toLocaleString()}</span>
            <span className="text-xs text-text-muted ml-1">XP</span>
          </div>
        </div>
      )}
    </div>
  );
}
