import { Link } from "react-router-dom";

const RewardsCard = ({ gamification }) => {
  if (!gamification) {
    return (
      <section className="rounded-2xl border border-border-default bg-surface-card p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] h-full flex flex-col justify-center text-center">
        <h2 className="text-lg font-semibold text-text-primary mb-2">
          Your Sustainability Journey
        </h2>
        <div className="flex-1 flex flex-col items-center justify-center py-6">
          <p className="text-sm text-text-muted mb-4 max-w-[200px]">
            Loading your gamification data...
          </p>
          <div className="h-2 w-full max-w-[200px] bg-surface-page rounded-full overflow-hidden">
            <div className="h-full bg-brand/50 rounded-full w-1/2 animate-pulse" />
          </div>
        </div>
      </section>
    );
  }

  const earnedBadgesCount = gamification.badges?.length || 0;

  return (
    <section className="rounded-2xl border border-border-default bg-surface-card p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:-translate-y-1 hover:shadow-lg transition-all h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">
            Your Sustainability Journey
          </h2>
        </div>
        <div className="flex items-center gap-1 bg-surface-hover px-2.5 py-1 rounded-lg">
          <span className="text-sm font-bold text-text-primary">
            {earnedBadgesCount}
          </span>
          <span className="text-xs text-text-muted font-medium">Badges</span>
          <span className="ml-1 text-sm">🏆</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center mb-6">
        <div className="flex items-end justify-between mb-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">
              Current Level
            </p>
            <p className="text-3xl font-bold text-text-primary leading-none">
              Level {gamification.level}
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-brand leading-none">
              {gamification.xp.toLocaleString()} XP
            </p>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between text-xs font-medium text-text-muted mb-2">
            <span>{gamification.currentXP} XP</span>
            <span>{gamification.xpForNextLevel} XP</span>
          </div>
          
          <div 
            className="h-3 w-full bg-surface-hover rounded-full overflow-hidden" 
            role="progressbar" 
            aria-valuenow={gamification.progress} 
            aria-valuemin="0" 
            aria-valuemax="100" 
            aria-label="Level progress"
          >
            <div
              className="h-full bg-brand rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${Math.min(Math.max(gamification.progress, 0), 100)}%` }}
            />
          </div>
          
          <p className="text-xs text-text-muted text-center mt-3">
            <span className="font-semibold text-text-primary">{gamification.xpForNextLevel - gamification.currentXP} XP</span> to next level
          </p>
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-border-default">
        <Link
          to="/rewards"
          className="flex w-full items-center justify-center rounded-xl bg-surface-page border border-border-default px-4 py-2.5 text-sm font-medium text-text-primary hover:bg-surface-hover hover:text-brand transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          View Rewards <span aria-hidden="true" className="ml-1">&rarr;</span>
        </Link>
      </div>
    </section>
  );
};

export default RewardsCard;
