import Challenge from "../models/Challenge.js";
import UserChallenge from "../models/UserChallenge.js";

export const updateChallengesAfterScan = async (userId, scan) => {
  let earnedChallengeXP = 0;

  // Find all active challenges
  const activeChallenges = await Challenge.find({ active: true });

  for (const challenge of activeChallenges) {
    // Determine if this scan counts towards this challenge
    let countsTowardsChallenge = false;
    
    if (challenge.type === "scan_count") {
      countsTowardsChallenge = true;
    } else if (challenge.type === "category_scan" && challenge.category && scan.category.toLowerCase() === challenge.category.toLowerCase()) {
      countsTowardsChallenge = true;
    } else if (challenge.type === "daily_scan") {
      // Simplified daily scan logic
      countsTowardsChallenge = true;
    }

    if (countsTowardsChallenge) {
      // Find or create UserChallenge tracking record
      let userChallenge = await UserChallenge.findOne({ userId, challengeId: challenge._id });
      
      if (!userChallenge) {
        userChallenge = new UserChallenge({
          userId,
          challengeId: challenge._id,
          progress: 0,
        });
      }

      if (!userChallenge.completed) {
        userChallenge.progress += 1;
        
        if (userChallenge.progress >= challenge.target) {
          userChallenge.completed = true;
          userChallenge.completedAt = new Date();
          earnedChallengeXP += challenge.xpReward;
          
          // Send notification for newly completed challenge
          import("../services/notificationService.js").then(({ createNotification }) => {
            createNotification({
              userId,
              type: "challenge_completed",
              title: "Challenge completed",
              message: `You completed the ${challenge.title} challenge.`,
              link: "/rewards",
              metadata: {
                challengeId: challenge._id,
              },
            }).catch(err => console.error("Failed to create challenge notification:", err));
          });
        }
        
        await userChallenge.save();
      }
    }
  }

  return earnedChallengeXP;
};
