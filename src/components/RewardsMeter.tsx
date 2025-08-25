import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Gift, Coins, Trophy, ExternalLink } from "lucide-react";

interface RewardsMeterProps {
  currentTokens: number;
  nextRewardThreshold: number;
  totalEarned: number;
  recentAchievements: string[];
  onEnterGiveaway: () => void;
  onVisitRewards: () => void;
}

export const RewardsMeter = ({
  currentTokens,
  nextRewardThreshold,
  totalEarned,
  recentAchievements,
  onEnterGiveaway,
  onVisitRewards
}: RewardsMeterProps) => {
  const progressPercentage = (currentTokens / nextRewardThreshold) * 100;
  const tokensNeeded = nextRewardThreshold - currentTokens;

  return (
    <Card className="mb-6">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-full">
            <Gift className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold">🎁 Your Rewards + Progress</h2>
            <p className="text-muted-foreground">Track your learning achievements</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Token Progress */}
          <div className="space-y-4">
            <div className="text-center p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Coins className="h-6 w-6 text-primary" />
                <span className="text-2xl font-bold text-primary">{currentTokens.toLocaleString()}</span>
              </div>
              <p className="text-sm text-muted-foreground">Current Tokens</p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Progress to Free Merch</span>
                <span className="text-sm text-muted-foreground">
                  {tokensNeeded.toLocaleString()} tokens to go
                </span>
              </div>
              <Progress value={Math.min(progressPercentage, 100)} className="h-3" />
              <p className="text-xs text-muted-foreground mt-1">
                {nextRewardThreshold.toLocaleString()} tokens = Free G3MS merch
              </p>
            </div>

            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-sm">
                <strong>Total Earned:</strong> ${totalEarned.toLocaleString()} tokens
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Keep learning to unlock amazing rewards!
              </p>
            </div>
          </div>

          {/* Recent Achievements & Actions */}
          <div className="space-y-4">
            {/* Recent Achievements */}
            {recentAchievements.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  Recent Achievements
                </h3>
                <div className="space-y-2">
                  {recentAchievements.map((achievement, index) => (
                    <Badge key={index} variant="secondary" className="w-full justify-start">
                      🏆 {achievement}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={onEnterGiveaway}
                className="w-full"
                variant="default"
              >
                <Gift className="h-4 w-4 mr-2" />
                Enter Weekly Giveaway
              </Button>
              
              <Button 
                onClick={onVisitRewards}
                variant="outline"
                className="w-full"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Visit Ayo Rewards Store
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};