import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DropCompletionFlow } from '@/components/DropCompletionFlow';
import { DropCompleteBanner } from '@/components/DropCompleteBanner';
import { DropFeedback } from '@/components/DropFeedback';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, Timer, Sparkles, Code, TrendingUp, Video, CheckCircle, Gift } from 'lucide-react';
import { toast } from 'sonner';

const DropsMain = () => {
  const navigate = useNavigate();
  
  const [timeUntilNextDrop, setTimeUntilNextDrop] = useState('5h 48m 30s');
  const [hasLiveDrop, setHasLiveDrop] = useState(false);
  const [showCompleteBanner, setShowCompleteBanner] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isUserPremium, setIsUserPremium] = useState(false);

  // Calculate next drop time (daily at 5 PM EST)
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      let nextDrop = new Date(today);
      nextDrop.setHours(17, 0, 0, 0); // 5 PM EST
      
      // If it's past 5 PM today, set for tomorrow
      if (now >= nextDrop) {
        nextDrop.setDate(nextDrop.getDate() + 1);
      }
      
      const timeDiff = nextDrop.getTime() - now.getTime();
      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
      
      setTimeUntilNextDrop(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleDropComplete = (dropId: number) => {
    toast.success("Drop completed! 🎉 +150 tokens earned!");
    setHasLiveDrop(false);
    setShowCompleteBanner(true);
    setShowFeedback(true);
  };

  const handleStartDrop = (dropId: number) => {
    navigate('/drops/live');
  };

  const handleSubmitFeedback = (feedback: { feeling: string; comment?: string }) => {
    toast.success("Thank you for your feedback!");
    setShowFeedback(false);
  };

  const drops = [
    {
      id: 1,
      title: "Show your thinking",
      subject: "Math",
      provider: "G3MS",
      isLive: true,
      tokens: 150,
      startTime: "11:10 AM"
    },
    {
      id: 2,
      title: "Study skills booster",
      subject: "History/Civics",
      provider: "SkillSpark",
      isLive: false,
      tokens: 200,
      startTime: "11:25 AM"
    },
    // Additional drops for upgraded users
    {
      id: 3,
      title: "Algebra mastery challenge",
      subject: "Math",
      provider: "G3MS",
      isLive: false,
      tokens: 175,
      startTime: "12:00 PM"
    },
    {
      id: 4,
      title: "Creative writing workshop",
      subject: "ELA",
      provider: "LitLab",
      isLive: true,
      tokens: 180,
      startTime: "12:15 PM"
    },
    {
      id: 5,
      title: "Chemistry lab simulation",
      subject: "Science",
      provider: "ScienceHub",
      isLive: false,
      tokens: 200,
      startTime: "12:30 PM"
    },
    {
      id: 6,
      title: "Constitution deep dive",
      subject: "History/Civics",
      provider: "CivicsCore",
      isLive: false,
      tokens: 165,
      startTime: "1:00 PM"
    },
    {
      id: 7,
      title: "SAT math practice",
      subject: "Test Prep",
      provider: "PrepMaster",
      isLive: true,
      tokens: 220,
      startTime: "1:15 PM"
    },
    {
      id: 8,
      title: "Reading comprehension boost",
      subject: "ELA",
      provider: "ReadSmart",
      isLive: false,
      tokens: 170,
      startTime: "1:45 PM"
    },
    {
      id: 9,
      title: "Physics fundamentals",
      subject: "Science",
      provider: "PhysicsFirst",
      isLive: false,
      tokens: 185,
      startTime: "2:00 PM"
    },
    {
      id: 10,
      title: "ISEE verbal prep",
      subject: "Test Prep",
      provider: "TestAce",
      isLive: false,
      tokens: 200,
      startTime: "2:30 PM"
    },
    {
      id: 11,
      title: "Geometry problem solving",
      subject: "Math",
      provider: "MathBoost",
      isLive: false,
      tokens: 160,
      startTime: "3:00 PM"
    },
    {
      id: 12,
      title: "Essay writing techniques",
      subject: "ELA",
      provider: "WriteWell",
      isLive: false,
      tokens: 175,
      startTime: "3:15 PM"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-6">

        {/* Post-Drop Banner */}
        {showCompleteBanner && (
          <div className="mb-8">
            <DropCompleteBanner
              isVisible={showCompleteBanner}
              dropTitle="Show your thinking"
              tokensEarned={150}
              skillProgress={{ skill: "Math", improvement: 12 }}
              dropReward={{
                type: "gift_card",
                value: "$10 Amazon Gift Card",
                description: "Surprise reward from this drop!"
              }}
              onViewLearningMap={() => toast.success("Learning Map expanded!")}
            />
          </div>
        )}
        {/* Header Section */}
        <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 rounded-xl p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-6 w-6 text-g3ms-purple" />
                <span className="text-sm font-medium text-gray-600">Drops</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Catch a drop and earn rewards
              </h1>
              <p className="text-gray-700 mb-6">
                Complete a drop, then keep the streak going with Ayo tutoring or the AI coding studio.
              </p>
              
              {/* Gift Card Earning Guide */}
              <div className="bg-gradient-to-r from-g3ms-purple/10 to-g3ms-green/10 rounded-lg p-4 mb-6 border border-g3ms-purple/20">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Gift className="h-5 w-5 text-g3ms-purple" />
                  How to Earn Gift Cards
                </h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-start gap-2">
                    <span className="text-g3ms-purple font-medium">1.</span>
                    <span><strong>Stack tokens:</strong> Collect 15,000 tokens = Gift card</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-g3ms-purple font-medium">2.</span>
                    <span><strong>Drop rewards:</strong> Every drop ends with a surprise reward (bonus tokens, gift cards, or event tickets)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-g3ms-purple font-medium">3.</span>
                    <span><strong>Weekly draws:</strong> Use 1,000 tokens to enter our weekly gift card giveaway</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>Free plan: 1 daily drop at 5pm Eastern. Upgraded: unlimited drops. Next window in {timeUntilNextDrop}.</span>
              </div>
            </div>
            <div className="flex flex-col gap-3 lg:w-80">
              <Button 
                onClick={() => navigate("/ayo")}
                className="w-full bg-g3ms-purple text-white hover:bg-g3ms-purple/90 font-medium rounded-full"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Keep learning with Ayo
              </Button>
              <Button 
                onClick={() => navigate("/code-creation")}
                variant="outline"
                className="w-full font-medium rounded-full border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <Code className="h-4 w-4 mr-2" />
                Build in the AI code studio
              </Button>
              <Button 
                onClick={() => navigate("/upgrade")}
                className="w-full bg-gradient-to-r from-g3ms-purple to-g3ms-green text-white hover:from-pink-600 hover:to-emerald-600 font-medium rounded-full"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Upgrade
              </Button>
            </div>
          </div>
        </div>

        {/* Token to Gift Card Progress */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Your Gift Card Progress</h3>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-g3ms-yellow" />
              <span className="text-sm font-medium text-gray-600">2,150 / 15,000 tokens</span>
            </div>
          </div>
          <Progress value={14.3} className="h-3 mb-4" />
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">12,850 tokens to go for your next gift card!</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-g3ms-purple border-g3ms-purple hover:bg-g3ms-purple/10"
              onClick={() => toast.success("Weekly draw entry available for 1,000 tokens!")}
            >
              <Gift className="h-4 w-4 mr-2" />
              Enter Weekly Draw (1,000 tokens)
            </Button>
          </div>
        </div>

        {/* Live and Upcoming Drops */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Live and upcoming drops</h2>
            <div className="text-sm text-gray-600">
              {isUserPremium ? "Unlimited drops available" : "1 daily drop available"}
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {drops.map((drop) => (
              <Card key={drop.id} className="border border-gray-200 hover:shadow-md transition-shadow bg-white">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {drop.isLive && (
                        <Badge variant="destructive" className="bg-red-500 text-white">
                          Live
                        </Badge>
                      )}
                      <Badge variant="secondary" className="bg-gray-100 text-gray-700">{drop.subject}</Badge>
                    </div>
                    <Video className="h-5 w-5 text-gray-500" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{drop.title}</h3>
                    <p className="text-sm text-gray-600">{drop.provider}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium text-gray-700">Earn {drop.tokens} tokens</span>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>Starts {drop.startTime}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        onClick={() => handleStartDrop(drop.id)}
                      >
                        <Video className="h-4 w-4 mr-1" />
                        Start the drop
                      </Button>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                      onClick={() => handleDropComplete(drop.id)}
                    >
                      <CheckCircle className="h-4 w-4" />
                      Mark complete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Feedback Section */}
        {showFeedback && (
          <div className="mt-8">
            <DropFeedback
              isVisible={showFeedback}
              dropTitle="Show your thinking"
              onSubmitFeedback={handleSubmitFeedback}
            />
          </div>
        )}

      </div>
    </div>
  );
};

export default DropsMain;