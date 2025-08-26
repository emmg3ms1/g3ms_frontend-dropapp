import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Clock, Sparkles, Code, TrendingUp, Video, Lock, Shield, Info, Mail } from 'lucide-react';
import { toast } from 'sonner';

const DropsMainRestricted = () => {
  const navigate = useNavigate();
  
  const [timeUntilNextDrop, setTimeUntilNextDrop] = useState('5h 48m 30s');

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

  const handleRestrictedAction = () => {
    toast.error("Parental approval required to participate in drops");
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
    }
  ];

  return (
    <div className="min-h-screen bg-white relative">
      {/* Approval Required Banner */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200">
        <div className="max-w-7xl mx-auto p-4">
          <Alert className="border-amber-200 bg-amber-50">
            <Shield className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <strong>Parental Approval Required:</strong> Your parent or guardian needs to approve your account before you can participate in drops. Check your messages or ask your parent to look for our text message.
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-3 w-3" />
                  <span>Need help? Email help@getg3ms.com</span>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 rounded-xl p-8 mb-8 relative">
          <div className="absolute inset-0 bg-white/60 rounded-xl backdrop-blur-sm"></div>
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-6 w-6 text-g3ms-purple opacity-60" />
                  <span className="text-sm font-medium text-gray-500">Drops (Preview)</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-700 mb-4">
                  Catch a drop and earn rewards
                </h1>
                <p className="text-gray-600 mb-6">
                  Complete a drop, then keep the streak going with Ayo tutoring or the AI coding studio.
                </p>
                
                {/* Approval Status Card */}
                <div className="bg-white/80 rounded-lg p-4 mb-6 border border-amber-200">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Lock className="h-5 w-5 text-amber-600" />
                    Account Status: Pending Approval
                  </h3>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex items-start gap-2">
                      <span className="text-amber-600 font-medium">•</span>
                      <span>We've sent an approval request to your parent/guardian</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-amber-600 font-medium">•</span>
                      <span>Once approved, you can participate in all drops and earn rewards</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-amber-600 font-medium">•</span>
                      <span>This keeps you safe and follows important privacy laws</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>Next drop window in {timeUntilNextDrop} (approval required to participate)</span>
                </div>
              </div>
              <div className="flex flex-col gap-3 lg:w-80 opacity-50">
                <Button 
                  onClick={handleRestrictedAction}
                  disabled
                  className="w-full bg-g3ms-purple text-white font-medium rounded-full"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Keep learning with Ayo
                </Button>
                <Button 
                  onClick={handleRestrictedAction}
                  disabled
                  variant="outline"
                  className="w-full font-medium rounded-full border-gray-300 text-gray-500"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Build in the AI code studio
                </Button>
                <Button 
                  onClick={handleRestrictedAction}
                  disabled
                  className="w-full bg-gradient-to-r from-g3ms-purple to-g3ms-green text-white font-medium rounded-full"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Upgrade
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Token Progress (Disabled) */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8 opacity-60">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Your Gift Card Progress</h3>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-500">0 / 15,000 tokens</span>
            </div>
          </div>
          <Progress value={0} className="h-3 mb-4" />
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">Earn tokens after parental approval!</p>
            <Button 
              disabled
              variant="outline" 
              size="sm" 
              className="text-gray-400 border-gray-300"
            >
              <Lock className="h-4 w-4 mr-2" />
              Locked
            </Button>
          </div>
        </div>

        {/* Live and Upcoming Drops (Preview) */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-700">Live and upcoming drops (Preview)</h2>
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span>Approval required to participate</span>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {drops.map((drop) => (
              <Card key={drop.id} className="border border-gray-200 bg-white relative overflow-hidden">
                <div className="absolute inset-0 bg-white/70 z-10 flex items-center justify-center">
                  <div className="text-center">
                    <Lock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-600">Parental Approval Required</p>
                    <p className="text-xs text-gray-500">Contact support for help</p>
                  </div>
                </div>
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {drop.isLive && (
                        <Badge variant="destructive" className="bg-red-500 text-white opacity-60">
                          Live
                        </Badge>
                      )}
                      <Badge variant="secondary" className="bg-gray-100 text-gray-600 opacity-60">{drop.subject}</Badge>
                    </div>
                    <Video className="h-5 w-5 text-gray-400" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-1">{drop.title}</h3>
                    <p className="text-sm text-gray-500">{drop.provider}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-500">Earn {drop.tokens} tokens</span>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>Starts {drop.startTime}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8">
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <h3 className="font-semibold text-blue-900 flex items-center gap-2">
                <Info className="h-5 w-5" />
                Need Help Getting Approved?
              </h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-blue-800">
                If your parent or guardian hasn't received the approval message, or if you need help with the approval process:
              </p>
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-2 text-blue-700">
                  <Mail className="h-4 w-4" />
                  <a href="mailto:help@getg3ms.com" className="underline">
                    help@getg3ms.com
                  </a>
                </div>
              </div>
              <Alert className="border-blue-200 bg-blue-100">
                <Shield className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <strong>Why do we need approval?</strong> We follow COPPA laws to keep students under 13 safe online. Your parent's approval helps us protect your privacy and ensure a safe learning environment.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DropsMainRestricted;