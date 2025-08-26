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
        return <Gift className="h-5 w-5 text-pink-500 mt-0.5" />;
      case 'event_ticket':
        return <Calendar className="h-5 w-5 text-g3ms-green" />;
      default:
        return <Gift className="h-5 w-5 text-g3ms-purple" />;
    }
  };

  if (!isVisible) return null;

  return (
    <div className="mb-8 bg-white rounded-xl border border-gray-200 p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gray-100 rounded-full">
          <Trophy className="h-6 w-6 text-gray-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            🎉 You completed {dropTitle}!
          </h2>
          <p className="text-gray-600">Amazing work! Here's what you achieved:</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <Sparkles className="h-5 w-5 text-yellow-500 mt-0.5" />
          <div>
            <p className="font-semibold text-gray-900">You earned +{tokensEarned} tokens</p>
            <p className="text-sm text-gray-600">Keep building your rewards!</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
          <TrendingUp className="h-5 w-5 text-green-500 mt-0.5" />
          <div>
            <p className="font-semibold text-gray-900">Skill Progress: +{skillProgress.improvement}% in {skillProgress.skill}</p>
            <p className="text-sm text-gray-600">You're getting stronger!</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 bg-pink-50 rounded-lg border border-pink-200">
          {getRewardIcon()}
          <div>
            <p className="font-semibold text-gray-900">🎁 Drop Reward: {dropReward.value}</p>
            <p className="text-sm text-gray-600">{dropReward.description}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Button 
          onClick={() => window.location.href = '/ayo'}
          className="bg-g3ms-purple text-white hover:bg-g3ms-purple/90 rounded-full px-8 py-3 font-medium text-base"
        >
          Continue to Train and Earn with Ayo
        </Button>
      </div>
    </div>
  );
};