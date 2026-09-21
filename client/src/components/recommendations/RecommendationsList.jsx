import { useState, useEffect } from "react";
import RecommendationCard from "./RecommendationCard";
import api from "../../services/api";

export default function RecommendationsList() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await api.get("/recommendations");
        if (res.data?.success) {
          setRecommendations(res.data.recommendations || []);
        }
      } catch (error) {
        console.error("Failed to fetch recommendations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, []);

  const handleDismiss = (id) => {
    setRecommendations((prev) => prev.filter((r) => r.id !== id));
  };

  if (loading) {
    return (
      <div className="bg-surface-card rounded-2xl border border-border-default p-6 space-y-4 animate-pulse">
        <div className="h-6 w-1/3 bg-border-default rounded"></div>
        <div className="h-24 bg-border-default rounded-xl"></div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null; // Hide completely if no recommendations
  }

  return (
    <div className="bg-surface-card rounded-2xl border border-border-default p-6 flex flex-col gap-5">
      <div>
        <h3 className="text-lg font-bold text-text-primary">Recommended for You</h3>
        <p className="text-sm font-medium text-text-muted mt-1">
          Based on your scanning behavior
        </p>
      </div>

      <div className="grid gap-4">
        {recommendations.map((rec) => (
          <RecommendationCard 
            key={rec.id} 
            recommendation={rec} 
            onDismiss={handleDismiss} 
          />
        ))}
      </div>
    </div>
  );
}
