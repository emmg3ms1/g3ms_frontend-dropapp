import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Share2, Instagram, MessageCircle, Youtube, Trophy } from "lucide-react";
import { toast } from "sonner";

interface DropFeedbackProps {
  isVisible: boolean;
  dropTitle: string;
  onSubmitFeedback: (feedback: { feeling: string; comment?: string }) => void;
}

export const DropFeedback = ({ isVisible, dropTitle, onSubmitFeedback }: DropFeedbackProps) => {
  const [selectedFeeling, setSelectedFeeling] = useState<string>("");
  const [showSocialShare, setShowSocialShare] = useState(false);

  if (!isVisible) return null;

  const feelings = [
    { id: "nailed-it", label: "I nailed it", emoji: "😊" },
    { id: "kinda-tricky", label: "Kinda tricky", emoji: "😅" },
    { id: "still-learning", label: "Still learning", emoji: "😐" },
    { id: "try-again", label: "I want to try again", emoji: "💪" }
  ];

  const handleFeedbackSelect = (feelingId: string) => {
    setSelectedFeeling(feelingId);
    onSubmitFeedback({
      feeling: feelingId
    });
    setShowSocialShare(true);
  };

  const getBonusTokens = (platform: string) => {
    // TikTok and YouTube get double bonus tokens
    return platform === "TikTok" || platform === "YouTube" ? 200 : 100;
  };

  const handleSocialShare = (platform: string) => {
    const tokens = getBonusTokens(platform);
    toast.success(`Shared on ${platform}! +${tokens} bonus tokens earned`);
  };

  return (
    <Card className="mb-6 bg-gray-50 border-gray-200">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎯</span>
            <h2 className="text-lg font-semibold text-gray-900">How did it feel?</h2>
          </div>
          <div className="flex items-center gap-1 bg-green-100 px-3 py-1 rounded-full">
            <Sparkles className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">+50 tokens</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          {feelings.map((feeling) => (
            <Button
              key={feeling.id}
              variant="outline"
              className="flex items-center gap-2 bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors"
              onClick={() => handleFeedbackSelect(feeling.id)}
            >
              <span className="text-lg">{feeling.emoji}</span>
              <span className="text-sm font-medium text-gray-700">{feeling.label}</span>
            </Button>
          ))}
        </div>

        {/* Social Share Section */}
        {showSocialShare && (
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="mb-4">
              <h3 className="font-semibold mb-2 text-sm flex items-center gap-2">
                <Share2 className="h-4 w-4 text-blue-600" />
                📲 Share your progress for bonus tokens!
              </h3>
              <p className="text-gray-600 text-xs mb-4">
                Show off your learning achievement and earn extra tokens
              </p>
            </div>

            {/* Share Buttons */}
            <div className="space-y-3">
              <p className="font-medium text-xs text-gray-700">Share on:</p>
              
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: "Instagram", icon: Instagram, bonus: false },
                  { name: "TikTok", icon: Share2, bonus: true },
                  { name: "Snapchat", icon: Share2, bonus: false },
                  { name: "Discord", icon: MessageCircle, bonus: false },
                  { name: "YouTube", icon: Youtube, bonus: true },
                  { name: "Threads", icon: Share2, bonus: false },
                ].map((platform) => (
                  <Button
                    key={platform.name}
                    variant="outline"
                    size="sm"
                    className={`justify-start h-9 text-xs relative ${
                      platform.bonus ? 'border-yellow-400 bg-yellow-50' : ''
                    }`}
                    onClick={() => handleSocialShare(platform.name)}
                  >
                    <platform.icon className="h-3 w-3 mr-2 shrink-0" />
                    <span className="truncate">{platform.name}</span>
                    {platform.bonus && (
                      <Badge className="ml-auto bg-yellow-400 text-black text-xs">
                        2x
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>
              
              <div className="flex items-center gap-1 text-xs text-gray-600 bg-yellow-50 p-2 rounded-lg">
                <Trophy className="h-3 w-3 text-yellow-600 shrink-0" />
                <span>TikTok & YouTube get +200 tokens • Others get +100 tokens</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};