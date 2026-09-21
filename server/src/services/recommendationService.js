import { generateBehaviorProfile } from "./behaviorService.js";
import RecommendationFeedback from "../models/RecommendationFeedback.js";
import Challenge from "../models/Challenge.js";

const BASE_LEARNING_MODULES = [
  { id: "learn-pet-plastic", type: "learning", title: "Learn about PET plastic", reason: "You frequently scan PET items.", priority: 3, categoryTarget: "pet-plastic" },
  { id: "learn-general-recycling", type: "learning", title: "Master the Basics", reason: "Perfect for getting started.", priority: 1, categoryTarget: "general-recycling" },
  { id: "learn-e-waste", type: "learning", title: "E-Waste Disposal Guide", reason: "Expand your knowledge on electronics.", priority: 2, categoryTarget: "e-waste" },
];

export const generateRecommendations = async (userId) => {
  // 1. Get Behavior Profile
  const profile = await generateBehaviorProfile(userId);
  
  // 2. Fetch past feedback to avoid showing dismissed/not helpful recommendations
  const pastFeedback = await RecommendationFeedback.find({ userId });
  const excludedIds = pastFeedback
    .filter(f => f.feedback === "dismissed" || f.feedback === "not_helpful")
    .map(f => f.recommendationId);

  let recommendations = [];

  // 3. Match learning needs to base modules
  profile.learningAreas.forEach((need) => {
    const matchedModule = BASE_LEARNING_MODULES.find(m => m.categoryTarget === need);
    if (matchedModule && !excludedIds.includes(matchedModule.id)) {
      recommendations.push(matchedModule);
    }
  });

  // 4. If trend is decreasing, recommend a challenge to re-engage
  if (profile.recentTrend === "decreasing") {
    // In a real app, query active challenges not yet completed
    const reEngagementChallenge = {
      id: "challenge-daily-streak",
      type: "challenge",
      title: "Start a 3-Day Scanning Streak",
      reason: "We've missed you! Get back on track.",
      priority: 5,
    };
    if (!excludedIds.includes(reEngagementChallenge.id)) {
      recommendations.push(reEngagementChallenge);
    }
  }

  // 5. Rank by priority (highest first)
  recommendations.sort((a, b) => b.priority - a.priority);

  // Return top 3 recommendations
  return recommendations.slice(0, 3);
};
