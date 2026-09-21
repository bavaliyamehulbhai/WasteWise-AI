import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, CheckCircle2, Award, ArrowRight, Clock, Sparkles } from "lucide-react";
import api from "../services/api";
import Button from "../components/ui/Button";

function MarkdownRenderer({ content = "" }) {
  if (!content) return null;

  const paragraphs = content.split(/\n\n+/);

  return (
    <div className="space-y-4 leading-relaxed">
      {paragraphs.map((p, idx) => {
        const trimmed = p.trim();
        if (trimmed.startsWith("### ")) {
          return <h3 key={idx} className="text-xl font-bold text-text-primary mt-6 mb-2">{trimmed.slice(4)}</h3>;
        }
        if (trimmed.startsWith("## ")) {
          return <h2 key={idx} className="text-2xl font-bold text-text-primary mt-8 mb-3">{trimmed.slice(3)}</h2>;
        }
        if (trimmed.startsWith("# ")) {
          return <h1 key={idx} className="text-3xl font-extrabold text-text-primary mt-8 mb-4">{trimmed.slice(2)}</h1>;
        }
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          const lines = trimmed.split(/\n/).filter(line => line.trim());
          return (
            <ul key={idx} className="list-disc list-inside space-y-1.5 my-3">
              {lines.map((l, lIdx) => (
                <li key={lIdx} className="text-text-muted">{l.replace(/^[-*]\s+/, "")}</li>
              ))}
            </ul>
          );
        }
        return <p key={idx} className="text-base text-text-muted leading-relaxed">{trimmed}</p>;
      })}
    </div>
  );
}

export default function LearningDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const [module, setModule] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Quiz State
  const [takingQuiz, setTakingQuiz] = useState(false);
  const [answers, setAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchModule = async () => {
      try {
        const res = await api.get(`/learning/${slug}`);
        if (res.data?.success) {
          setModule(res.data.module);
          setQuiz(res.data.quiz);
          setCompleted(res.data.completed);
        }
      } catch (error) {
        console.error("Failed to load module", error);
      } finally {
        setLoading(false);
      }
    };
    fetchModule();
  }, [slug]);

  const handleOptionSelect = (qIndex, oIndex) => {
    setAnswers(prev => ({ ...prev, [qIndex]: oIndex }));
  };

  const submitQuiz = async () => {
    if (Object.keys(answers).length !== quiz.questions.length) return;
    
    setSubmitting(true);
    try {
      const answerArray = quiz.questions.map((_, i) => answers[i]);
      const res = await api.post(`/learning/${slug}/quiz`, { answers: answerArray });
      
      if (res.data?.success) {
        setQuizResult(res.data);
        if (res.data.passed) {
          setCompleted(true);
        }
      }
    } catch (error) {
      console.error("Failed to submit quiz", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-8 animate-pulse">
        <div className="h-64 bg-surface-card rounded-[2.5rem] mb-12"></div>
        <div className="space-y-4">
          <div className="h-6 bg-surface-card rounded-md w-3/4"></div>
          <div className="h-6 bg-surface-card rounded-md w-full"></div>
          <div className="h-6 bg-surface-card rounded-md w-5/6"></div>
        </div>
      </div>
    );
  }

  if (!module) {
    return <div className="p-12 text-center text-text-muted text-lg font-medium">Module not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto pb-24 animate-in fade-in zoom-in-95 duration-500">
      <button 
        onClick={() => navigate("/learn")}
        className="flex items-center gap-2 text-text-muted hover:text-brand font-bold mb-8 transition-colors group"
      >
        <div className="w-8 h-8 rounded-full bg-surface-card border border-border-default flex items-center justify-center group-hover:bg-brand group-hover:text-white transition-colors">
          <ChevronLeft size={16} />
        </div>
        Back to Academy
      </button>

      <div className="bg-surface-page rounded-[2.5rem] shadow-sm border border-border-default overflow-hidden relative">
        {/* Premium Header */}
        <div className="bg-gradient-to-br from-[#0B2117] via-[#113224] to-[#1A4532] p-10 md:p-16 relative overflow-hidden text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand/20 blur-[80px] rounded-full"></div>
          
          <div className="relative z-10 flex-1">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#A2E3B9] bg-white/10 px-4 py-1.5 rounded-full border border-white/10 flex items-center gap-1.5 backdrop-blur-md">
                <Sparkles size={12} />
                {module.category}
              </span>
              <span className="text-sm font-bold text-white/60 flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-full">
                <Clock size={14} />
                {module.estimatedTime} min read
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4 tracking-tight">
              {module.title}
            </h1>
            
            {completed && !takingQuiz && (
              <div className="inline-flex items-center gap-2 text-sm font-bold text-[#A2E3B9] bg-green-500/20 px-4 py-2 rounded-xl border border-green-500/30">
                <CheckCircle2 size={18} /> Lesson Completed
              </div>
            )}
          </div>
        </div>

        {/* Content Body */}
        {!takingQuiz ? (
          <div className="p-10 md:p-16">
            <div className="max-w-none text-text-secondary leading-relaxed">
              <MarkdownRenderer content={module.content} />
            </div>

            <div className="mt-16 pt-16 border-t border-border-default">
              {quiz && (
                <div className="bg-gradient-to-br from-brand/10 to-brand/5 p-10 md:p-12 rounded-[2rem] border border-brand/20 text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-brand"></div>
                  <div className="w-20 h-20 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Award size={40} className="text-brand" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-text-primary mb-3 tracking-tight">Ready to test your knowledge?</h3>
                  <p className="text-text-secondary text-lg font-medium mb-8 max-w-lg mx-auto">
                    Take a quick interactive quiz to earn <span className="font-bold text-brand">{quiz.xpReward} XP</span> and officially master this module.
                  </p>
                  
                  <Button onClick={() => setTakingQuiz(true)} className="px-8 py-4 text-lg rounded-2xl shadow-xl shadow-brand/20">
                    Start Knowledge Check <ArrowRight size={20} className="ml-2" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Quiz View */
          <div className="p-10 md:p-16 bg-surface-page">
            {!quizResult ? (
              <div className="max-w-2xl mx-auto space-y-10 animate-in slide-in-from-right-16 duration-700">
                <div className="text-center mb-12">
                  <div className="inline-block px-4 py-1.5 bg-brand/10 text-brand text-xs font-bold uppercase tracking-widest rounded-full mb-4">
                    Knowledge Check
                  </div>
                  <h3 className="text-3xl font-extrabold text-text-primary">Let's see what you learned</h3>
                </div>
                
                {quiz.questions.map((q, qIndex) => (
                  <div key={q._id} className="bg-surface-card p-8 rounded-[2rem] border border-border-default shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-brand/50"></div>
                    <p className="font-bold text-text-primary mb-6 text-xl leading-snug">
                      <span className="text-brand mr-2">{qIndex + 1}.</span> {q.questionText}
                    </p>
                    <div className="space-y-4">
                      {q.options.map((opt, oIndex) => {
                        const isSelected = answers[qIndex] === oIndex;
                        return (
                          <button
                            key={oIndex}
                            onClick={() => handleOptionSelect(qIndex, oIndex)}
                            className={`w-full text-left px-6 py-4 rounded-xl border-2 transition-all duration-300 font-medium ${
                              isSelected ? "border-brand bg-brand/5 text-brand shadow-inner transform scale-[1.01]" : "border-border-default hover:border-brand/40 text-text-secondary bg-surface-page"
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
                
                <div className="pt-8 flex justify-center border-t border-border-default">
                  <Button 
                    onClick={submitQuiz} 
                    isLoading={submitting}
                    disabled={Object.keys(answers).length !== quiz.questions.length}
                    className="px-12 py-4 text-lg rounded-2xl"
                  >
                    Submit Answers
                  </Button>
                </div>
              </div>
            ) : (
              /* Quiz Results */
              <div className="text-center animate-in zoom-in duration-700 py-12 max-w-2xl mx-auto">
                <div className="relative mb-8 inline-block">
                  <div className="absolute inset-0 bg-brand/20 blur-2xl rounded-full"></div>
                  {quizResult.passed ? (
                    <div className="w-28 h-28 bg-gradient-to-br from-green-400 to-green-600 text-white rounded-full flex items-center justify-center relative z-10 shadow-xl border-4 border-white/10">
                      <CheckCircle2 size={56} />
                    </div>
                  ) : (
                    <div className="w-28 h-28 bg-gradient-to-br from-orange-400 to-orange-600 text-white rounded-full flex items-center justify-center relative z-10 shadow-xl border-4 border-white/10">
                      <Award size={56} />
                    </div>
                  )}
                </div>
                
                <h2 className="text-4xl font-extrabold text-text-primary mb-4 tracking-tight">
                  {quizResult.passed ? "Outstanding Job!" : "Keep Learning!"}
                </h2>
                <p className="text-text-secondary text-xl font-medium mb-10">
                  You scored <span className={`font-extrabold ${quizResult.passed ? 'text-green-500' : 'text-orange-500'}`}>{quizResult.score}%</span> on this module.
                </p>

                {quizResult.xpAwarded > 0 && (
                  <div className="inline-flex items-center gap-3 bg-gradient-to-r from-brand to-brand-dark text-white font-extrabold text-2xl px-8 py-4 rounded-2xl mb-12 shadow-lg shadow-brand/20 transform hover:scale-105 transition-transform">
                    <Sparkles size={28} />
                    + {quizResult.xpAwarded} XP Earned!
                  </div>
                )}

                {/* Explanations */}
                <div className="text-left space-y-6 mb-12">
                  <h4 className="font-bold text-text-primary text-xl px-2">Review your answers</h4>
                  {quizResult.results.map((res, i) => (
                    <div key={i} className={`p-6 rounded-[1.5rem] border ${res.isCorrect ? "bg-green-500/5 border-green-500/20" : "bg-red-500/5 border-red-500/20"}`}>
                      <div className="flex items-start gap-4">
                        <div className="mt-1 shrink-0 bg-surface-card rounded-full p-1 shadow-sm">
                          {res.isCorrect ? <CheckCircle2 className="text-green-500" size={24} /> : <div className="w-6 h-6 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center"><div className="w-2 h-2 bg-red-500 rounded-full"></div></div>}
                        </div>
                        <div>
                          <p className="font-extrabold text-text-primary mb-2 text-lg">Question {i + 1}</p>
                          <p className="font-medium text-text-secondary leading-relaxed">{res.explanation}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Button onClick={() => navigate("/learn")} variant="outline" className="px-10 py-4 text-lg rounded-2xl">
                  Back to Academy
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
