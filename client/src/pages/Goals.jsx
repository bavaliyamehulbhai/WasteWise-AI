import { useState, useEffect } from "react";
import { Target, CheckCircle2, Plus, Zap } from "lucide-react";
import api from "../services/api";
import Button from "../components/ui/Button";

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: "", goalType: "scan_count", target: 10 });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const res = await api.get("/goals");
      if (res.data?.success) {
        setGoals(res.data.data);
      }
    } catch (error) {
      console.error("Failed to load goals", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const xpReward = newGoal.target * 5; // dynamic XP reward
      const res = await api.post("/goals", { ...newGoal, xpReward });
      if (res.data?.success) {
        setGoals([res.data.data, ...goals]);
        setCreating(false);
        setNewGoal({ title: "", goalType: "scan_count", target: 10 });
      }
    } catch (error) {
      console.error("Failed to create goal", error);
    }
  };

  return (
    <div className="animate-in fade-in zoom-in-95 duration-300 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">My Goals</h1>
          <p className="text-text-muted mt-2 font-medium">Set targets and earn XP for staying committed.</p>
        </div>
        <Button onClick={() => setCreating(!creating)}>
          {creating ? "Cancel" : <><Plus size={18} className="mr-2" /> New Goal</>}
        </Button>
      </div>

      {creating && (
        <form onSubmit={handleCreate} className="bg-surface-card border border-border-default p-6 rounded-2xl mb-8 slide-in-from-top-4 animate-in duration-300">
          <h3 className="font-bold text-text-primary mb-4 text-lg">Create a New Goal</h3>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-text-muted mb-2">Goal Title</label>
              <input 
                required
                type="text" 
                value={newGoal.title}
                onChange={e => setNewGoal({...newGoal, title: e.target.value})}
                placeholder="e.g. Scan 20 items"
                className="w-full bg-surface-page border border-border-default rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-brand"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-muted mb-2">Goal Type</label>
              <select 
                value={newGoal.goalType}
                onChange={e => setNewGoal({...newGoal, goalType: e.target.value})}
                className="w-full bg-surface-page border border-border-default rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-brand"
              >
                <option value="scan_count">Scan Items</option>
                <option value="learn_categories">Complete Learning Modules</option>
                <option value="streak">Daily Streak</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-muted mb-2">Target Number</label>
              <input 
                required
                type="number" 
                min="1"
                value={newGoal.target}
                onChange={e => setNewGoal({...newGoal, target: parseInt(e.target.value) || 1})}
                className="w-full bg-surface-page border border-border-default rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-brand"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button type="submit">Create Goal</Button>
            <span className="text-sm text-text-muted flex items-center gap-1">
              Rewards: <Zap size={14} className="text-brand" /> {newGoal.target * 5} XP
            </span>
          </div>
        </form>
      )}

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1,2].map(i => <div key={i} className="h-32 bg-surface-card rounded-2xl"></div>)}
        </div>
      ) : goals.length === 0 ? (
        <div className="text-center py-20 bg-surface-card border border-border-default rounded-2xl">
          <Target className="mx-auto text-brand opacity-50 mb-4" size={48} />
          <h3 className="text-lg font-bold text-text-primary">No Active Goals</h3>
          <p className="text-text-muted mt-2">Create a goal to start earning bonus XP!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {goals.map(goal => {
            const isCompleted = goal.status === "completed";
            const percent = Math.min(100, Math.round((goal.progress / goal.target) * 100));
            
            return (
              <div key={goal._id} className="bg-surface-card border border-border-default p-6 rounded-2xl relative overflow-hidden group">
                <div className={`absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 rounded-full blur-xl ${isCompleted ? 'bg-green-500/10' : 'bg-brand/10'}`}></div>
                
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isCompleted ? 'bg-green-500/20 text-green-500' : 'bg-brand/20 text-brand'}`}>
                    {isCompleted ? <CheckCircle2 size={24} /> : <Target size={24} />}
                  </div>
                  <div className="flex items-center gap-1 text-sm font-bold text-brand bg-brand/10 px-3 py-1 rounded-lg">
                    <Zap size={14} /> {goal.xpReward} XP
                  </div>
                </div>

                <h3 className="font-semibold text-text-primary text-xl mb-1">{goal.title}</h3>
                <p className="text-sm font-medium text-text-muted capitalize mb-6">{goal.goalType.replace("_", " ")}</p>

                <div className="space-y-2 relative z-10">
                  <div className="flex justify-between text-sm font-semibold">
                    <span className="text-text-primary">{goal.progress} / {goal.target}</span>
                    <span className={isCompleted ? "text-green-500" : "text-brand"}>{percent}%</span>
                  </div>
                  <div className="w-full h-2 bg-surface-page rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${isCompleted ? "bg-green-500" : "bg-brand"}`}
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
