import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BookOpen, CheckCircle2, Clock, Sparkles, Play, Award } from "lucide-react";
import api from "../services/api";

export default function Learn() {
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await api.get("/learning");
        if (res.data?.success) {
          setCategories(res.data.modules || {});
        }
      } catch (error) {
        console.error("Failed to load learning modules", error);
      } finally {
        setLoading(false);
      }
    };
    fetchModules();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse pb-20 max-w-6xl mx-auto">
        <div className="h-48 w-full bg-surface-card rounded-3xl mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 bg-surface-card rounded-3xl border border-border-default"></div>
          ))}
        </div>
      </div>
    );
  }

  // Calculate some stats for the header
  let totalModules = 0;
  let completedModules = 0;
  Object.values(categories).forEach(catModules => {
    totalModules += catModules.length;
    completedModules += catModules.filter(m => m.completed).length;
  });

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500 pb-20 max-w-6xl mx-auto">
      
      {/* Premium Hero Banner */}
      <div className="relative rounded-[2.5rem] overflow-hidden mb-12 bg-gradient-to-br from-[#0B2117] via-[#113224] to-[#1A4532] border border-[#246D46]/30 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand/20 blur-[100px] rounded-full pointer-events-none -mt-20 -mr-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-500/10 blur-[80px] rounded-full pointer-events-none -mb-20 -ml-20"></div>
        
        <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-white text-xs font-bold uppercase tracking-wider mb-6 backdrop-blur-md">
              <Sparkles size={14} className="text-[#A2E3B9]" />
              WasteWise Academy
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight leading-tight">
              Master the Art of <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A2E3B9] to-white">Sustainable Living</span>
            </h1>
            <p className="text-[#A2E3B9]/80 text-lg md:text-xl font-medium max-w-xl mx-auto md:mx-0">
              Explore bite-sized interactive lessons, test your knowledge, and earn XP to level up your eco-impact.
            </p>
          </div>

          <div className="shrink-0 flex items-center justify-center">
            <div className="w-40 h-40 md:w-48 md:h-48 rounded-[2rem] bg-white/5 backdrop-blur-xl border border-white/10 flex flex-col items-center justify-center text-white shadow-inner relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-brand/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <Award size={48} className="text-[#A2E3B9] mb-2" />
              <div className="text-3xl font-black">{completedModules}<span className="text-white/40 text-xl">/{totalModules}</span></div>
              <div className="text-xs font-bold uppercase tracking-widest text-white/60 mt-1">Completed</div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-16">
        {Object.keys(categories).length === 0 ? (
          <div className="text-center py-24 bg-surface-card border border-border-default rounded-[2rem] shadow-sm">
            <div className="w-20 h-20 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen size={32} className="text-brand opacity-80" />
            </div>
            <h3 className="text-2xl font-bold text-text-primary mb-2">Check Back Soon</h3>
            <p className="text-text-muted font-medium max-w-sm mx-auto">New interactive learning modules are currently being developed. Stay tuned!</p>
          </div>
        ) : (
          Object.keys(categories).map((category, index) => (
            <section key={category} className="relative animate-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="flex items-center gap-4 mb-8 pl-2">
                <div className="w-1.5 h-8 bg-brand rounded-full"></div>
                <h2 className="text-3xl font-extrabold text-text-primary capitalize tracking-tight">
                  {category.replace("-", " ")}
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                {categories[category].map(module => (
                  <Link 
                    key={module._id}
                    to={`/learn/${module.slug}`}
                    className={`group block relative bg-surface-card border rounded-[2rem] p-6 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 overflow-hidden ${module.completed ? 'border-brand/30 hover:border-brand/60' : 'border-border-default hover:border-brand/40'}`}
                  >
                    {/* Background hover effects */}
                    <div className="absolute inset-0 bg-gradient-to-br from-brand/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute -right-20 -top-20 w-48 h-48 bg-brand/10 blur-[50px] rounded-full group-hover:bg-brand/20 transition-colors duration-500"></div>
                    
                    <div className="relative z-10 flex flex-col h-full">
                      {/* Top Bar */}
                      <div className="flex justify-between items-start mb-6">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner transition-transform duration-500 group-hover:scale-110 ${module.completed ? "bg-gradient-to-br from-green-400 to-green-600 text-white" : "bg-gradient-to-br from-brand/10 to-brand/5 text-brand"}`}>
                          {module.completed ? <CheckCircle2 size={28} /> : <BookOpen size={28} />}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-text-secondary bg-surface-page border border-border-default px-3 py-1.5 rounded-full shadow-sm">
                          <Clock size={14} className="text-brand" />
                          {module.estimatedTime} min
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="inline-block px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest text-text-muted bg-surface-page mb-3">
                          {module.difficulty}
                        </div>
                        <h3 className="font-extrabold text-text-primary text-xl mb-3 leading-tight group-hover:text-brand transition-colors duration-300">
                          {module.title}
                        </h3>
                        {/* Assuming we add a short description later, but spacing helps */}
                        <p className="text-sm text-text-secondary font-medium line-clamp-2">
                          Learn the essentials of properly disposing and recycling {category.replace("-", " ")} materials to maximize your environmental impact.
                        </p>
                      </div>

                      {/* Bottom Action */}
                      <div className="mt-8 pt-6 border-t border-border-default flex items-center justify-between">
                        {module.completed ? (
                          <div className="flex items-center gap-2 text-green-600 font-bold text-sm">
                            <CheckCircle2 size={18} />
                            Completed
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-brand font-bold text-sm group-hover:translate-x-2 transition-transform duration-300">
                            <Play size={18} />
                            Start Lesson
                          </div>
                        )}
                        <div className="text-xs font-extrabold text-text-muted bg-surface-page px-2 py-1 rounded-md border border-border-default">
                          +{module.xpReward || 50} XP
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
}
