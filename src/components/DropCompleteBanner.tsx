import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trophy, Sparkles, TrendingUp, Gift, Calendar, CreditCard } from "lucide-react";

interface DropReward {
  type: 'bonus_tokens' | 'gift_card' | 'event_ticket';
  value: string;
  description: string;
}

interface DropCompleteBannerProps {
  isVisible: boolean;
  dropTitle: string;
  tokensEarned: number;
  skillProgress: { skill: string; improvement: number };
  dropReward: DropReward;
  onViewLearningMap: () => void;
}

export const DropCompleteBanner = ({
  isVisible,
  dropTitle,
  tokensEarned,
  skillProgress,
  dropReward,
  onViewLearningMap
}: DropCompleteBannerProps) => {
  
  const getRewardIcon = () => {
    switch (dropReward.type) {
      case 'bonus_tokens':
        return <Sparkles className="h-5 w-5 text-g3ms-yellow" />;
      case 'gift_card':
        return <CreditCard className="h-5 w-5 text-g3ms-purple" />;
      case 'event_ticket':
        return <Calendar className="h-5 w-5 text-g3ms-green" />;
      default:
        return <Gift className="h-5 w-5 text-g3ms-purple" />;
    }
  };

  if (!isVisible) return null;

  return (
    <Card className="mb-8 bg-accent/30 border-border/50">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-background rounded-full">
            <Trophy className="h-6 w-6 text-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">
              🎉 You completed {dropTitle}!
            </h2>
            <p className="text-muted-foreground">Amazing work! Here's what you achieved:</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center gap-3 p-4 bg-background rounded-lg border border-border">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            <div>
              <p className="font-semibold text-foreground">You earned +{tokensEarned} tokens</p>
              <p className="text-sm text-muted-foreground">Keep building your rewards!</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-background rounded-lg border border-border">
            <TrendingUp className="h-5 w-5 text-green-500" />
            <div>
              <p className="font-semibold text-foreground">Skill Progress: +{skillProgress.improvement}% in {skillProgress.skill}</p>
              <p className="text-sm text-muted-foreground">You're getting stronger!</p>
            </div>
          </div>

          {/* Drop Reward - What was won */}
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-g3ms-purple/10 to-g3ms-green/10 rounded-lg border border-g3ms-purple/20">
            {getRewardIcon()}
            <div>
              <p className="font-semibold text-foreground">🎁 Drop Reward: {dropReward.value}</p>
              <p className="text-sm text-muted-foreground">{dropReward.description}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <Button 
            onClick={() => window.location.href = '/ayo'}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 py-2.5 font-medium"
          >
            Continue to Train and Earn with Ayo
          </Button>
        </div>
      </div>
    </Card>
  );
};