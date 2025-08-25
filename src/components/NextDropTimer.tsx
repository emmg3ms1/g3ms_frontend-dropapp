import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Crown, Zap } from "lucide-react";

interface NextDropTimerProps {
  isUpgraded: boolean;
  nextDropTime?: Date;
  onUpgrade: () => void;
  onBrowseDrops: () => void;
}

export const NextDropTimer = ({
  isUpgraded,
  nextDropTime,
  onUpgrade,
  onBrowseDrops
}: NextDropTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    if (!nextDropTime || isUpgraded) return;

    const updateTimer = () => {
      const now = new Date();
      const diff = nextDropTime.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeLeft("Available now!");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [nextDropTime, isUpgraded]);

  return (
    <Card className="mb-6 w-full">{/* Remove any width constraints */}
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-g3ms-purple/10 rounded-full">
            <Clock className="h-6 w-6 text-g3ms-purple" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold">⏱️ Next Available Drop</h2>
            {isUpgraded ? (
              <p className="text-muted-foreground">Pick your next adventure!</p>
            ) : (
              <p className="text-muted-foreground">Your next free drop is coming soon</p>
            )}
          </div>
          {isUpgraded && (
            <Badge variant="secondary" className="bg-g3ms-yellow/20 text-g3ms-purple border-g3ms-yellow/30">
              <Crown className="h-3 w-3 mr-1" />
              Premium
            </Badge>
          )}
        </div>

        {isUpgraded ? (
          <div className="text-center">
            <div className="p-4 bg-gradient-to-r from-g3ms-purple/10 to-g3ms-green/10 rounded-lg mb-4">
              <Zap className="h-8 w-8 text-g3ms-purple mx-auto mb-2" />
              <p className="font-semibold text-lg">Unlimited Access Unlocked!</p>
              <p className="text-muted-foreground">Choose any Drop, anytime</p>
            </div>
            <Button onClick={onBrowseDrops} size="lg" className="w-full">{/* Full width button */}
              Pick Your Next Drop
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <div className="p-4 bg-g3ms-blue/5 rounded-lg mb-4">
              <div className="text-3xl font-bold text-g3ms-purple mb-2">{timeLeft}</div>
              <p className="text-muted-foreground">Until your next free Drop unlocks</p>
            </div>
            <div className="space-y-3">
              <Button onClick={onUpgrade} size="lg" className="w-full">{/* Full width button */}
                <Crown className="h-4 w-4 mr-2" />
                Upgrade to Unlock All Drops
              </Button>
              <p className="text-sm text-muted-foreground">
                Or wait for your free Drop at 5pm EST
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};