import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Clock, 
  Flame, 
  Trophy, 
  BookOpen, 
  Code, 
  Heart, 
  Star,
  Gift,
  Bell,
  Play,
  Users
} from 'lucide-react';

const StudentDropsMain = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [countdown, setCountdown] = useState({ hours: 2, minutes: 35, seconds: 18 });
  const [nextDropCountdown, setNextDropCountdown] = useState({ hours: 4, minutes: 23, seconds: 45 });
  
  // Check if user just completed a drop (from navigation state)
  const justCompletedDrop = location.state?.dropCompleted;
  
  // Default user state - this would typically come from actual user data/API
  const [userState] = useState({
    isFirstTime: false,
    hasCompletedDrop: justCompletedDrop || false,
    tokens: justCompletedDrop ? 470 : 320,
    streak: justCompletedDrop ? 4 : 3,
    freeDropsLeft: justCompletedDrop ? 1 : 2,
    totalFreeDrops: 3,
    isLiveDropAvailable: !justCompletedDrop,
    dropCompleted: justCompletedDrop || false
  });

  // Countdown timer effects
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const nextDropTimer = setInterval(() => {
      setNextDropCountdown(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(nextDropTimer);
  }, []);

  const formatTime = (time: number) => time.toString().padStart(2, '0');

  const featuredCategories = [
    {
      id: 'math-logic',
      name: 'Math & Logic',
      description: 'Sharpen your math skills',
      icon: '🔢',
      color: 'bg-g3ms-blue',
      freeDrops: 2
    },
    {
      id: 'code-creation',
      name: 'Code Creation',
      description: 'Build apps and games',
      icon: '💻',
      color: 'bg-g3ms-green',
      freeDrops: 2
    },
    {
      id: 'science-curiosity',
      name: 'Science & Curiosity',
      description: 'Explore the wonders of science',
      icon: '💡',
      color: 'bg-g3ms-yellow',
      freeDrops: 2
    },
    {
      id: 'test-prep',
      name: 'Test Prep',
      description: 'Prepare for standardized tests',
      icon: '🧠',
      color: 'bg-g3ms-purple',
      freeDrops: 2
    }
  ];

  const allCategories = [
    ...featuredCategories,
    {
      id: 'reading-writing',
      name: 'Reading & Writing',
      description: 'Improve literacy',
      icon: '📖',
      color: 'bg-g3ms-purple',
      freeDrops: 2
    },
    {
      id: 'arts-creativity',
      name: 'Arts & Creativity',
      description: 'Express yourself',
      icon: '🎭',
      color: 'bg-g3ms-green',
      freeDrops: 2
    },
    {
      id: 'social-studies',
      name: 'Social Studies',
      description: 'Learn about society',
      icon: '📚',
      color: 'bg-g3ms-blue',
      freeDrops: 2
    },
    {
      id: 'life-career',
      name: 'Life & Career',
      description: 'Essential life skills',
      icon: '🌱',
      color: 'bg-g3ms-yellow',
      freeDrops: 2
    },
    {
      id: 'communication',
      name: 'Communication',
      description: 'Master communication',
      icon: '💬',
      color: 'bg-g3ms-purple',
      freeDrops: 2
    },
    {
      id: 'financial-literacy',
      name: 'Financial Literacy',
      description: 'Money management',
      icon: '🧮',
      color: 'bg-g3ms-green',
      freeDrops: 2
    },
    {
      id: 'workforce-skills',
      name: 'Workforce Skills',
      description: 'Career preparation',
      icon: '🧰',
      color: 'bg-g3ms-blue',
      freeDrops: 2
    },
    {
      id: 'mental-health',
      name: 'Mental Health',
      description: 'Support wellbeing',
      icon: '❤️',
      color: 'bg-g3ms-yellow',
      freeDrops: 2
    },
    {
      id: 'social-emotional',
      name: 'Social-Emotional',
      description: 'Emotional intelligence',
      icon: '👥',
      color: 'bg-g3ms-purple',
      freeDrops: 2
    },
    {
      id: 'global-citizenship',
      name: 'Global Citizenship',
      description: 'Interconnected world',
      icon: '🌍',
      color: 'bg-g3ms-green',
      freeDrops: 2
    }
  ];

  const [showAllCategories, setShowAllCategories] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50">
      {/* Header - Mobile Only */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b px-4 py-3 lg:hidden">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <img src="/lovable-uploads/7588041f-8987-4a29-bd33-41e667d9b54a.png" alt="G3MS" className="w-8 h-8" />
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/notifications')}
              className="p-1.5"
            >
              <Bell className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/rewards')}
              className="flex items-center gap-1 px-2 py-1 rounded-full bg-g3ms-blue/20 border border-g3ms-blue/30 text-xs"
            >
              <span className="text-sm text-g3ms-blue">💎</span>
              <span className="font-semibold text-g3ms-blue">${userState.tokens}</span>
            </Button>
            
            <div className="flex items-center gap-1">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-xs font-medium">{userState.streak}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Desktop Layout */}
      <div className="lg:flex lg:h-screen">
        {/* Left Sidebar - Desktop Only */}
        <aside className="hidden lg:block lg:w-80 lg:border-r lg:bg-white/95 backdrop-blur-sm">
          <div className="h-full flex flex-col">
            {/* Desktop Header */}
            <div className="border-b px-6 py-4">
              <div className="flex items-center justify-between">
                <img src="/lovable-uploads/7588041f-8987-4a29-bd33-41e667d9b54a.png" alt="G3MS" className="w-10 h-10" />
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/notifications')}
                    className="p-2"
                  >
                    <Bell className="w-5 h-5" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/rewards')}
                    className="flex items-center gap-1 px-3 py-1 rounded-full bg-g3ms-blue/20 border border-g3ms-blue/30"
                  >
                    <span className="text-lg text-g3ms-blue">💎</span>
                    <span className="font-semibold text-g3ms-blue">${userState.tokens}</span>
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    <Flame className="w-5 h-5 text-orange-500" />
                    <span className="text-sm font-medium">{userState.streak}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Categories List */}
            <div className="flex-1 overflow-y-auto p-6">
              <h2 className="text-lg font-semibold mb-4">Categories</h2>
              <div className="space-y-2">
                {allCategories.map((category) => (
                  <Card 
                    key={category.id} 
                    className="cursor-pointer hover:shadow-md transition-all duration-200 hover-scale"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 ${category.color} rounded-lg flex items-center justify-center text-white text-lg`}>
                          {category.icon}
                        </div>
                        
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm">{category.name}</h4>
                          <p className="text-xs text-muted-foreground">{category.description}</p>
                          <p className="text-xs text-primary font-medium mt-1">
                            {category.freeDrops}/3 left
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:overflow-y-auto">
          <div className="w-full max-w-md mx-auto lg:max-w-2xl px-4 pb-6 space-y-6 lg:px-8 lg:py-8">
        {/* First-Time User State */}
        {userState.isFirstTime && (
          <Card className="mt-4 border-primary bg-primary/5">
            <CardContent className="p-4">
              <div className="text-center space-y-3">
                <p className="text-lg">🎉 Welcome to G3MS!</p>
                <p className="text-sm text-muted-foreground">
                  Complete your first Drop and start earning rewards.
                </p>
                <Button 
                  onClick={() => navigate('/drops/first')}
                  className="w-full"
                  size="lg"
                >
                  Start My First Drop →
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Post-Drop Celebration - Show when drop is completed */}
        {userState.hasCompletedDrop && !userState.isFirstTime && (
          <Card className="mt-4 border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
            <CardContent className="p-4 space-y-4">
              <div className="text-center">
                <p className="text-lg font-semibold">🎉 You earned {userState.dropCompleted ? '150' : '200'} tokens!</p>
                <p className="text-sm text-muted-foreground">
                  🔥 You just kicked off your streak! Complete tomorrow's Drop to keep it alive and earn bonus tokens.
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Free Drops this month</span>
                  <span>{userState.freeDropsLeft}/{userState.totalFreeDrops}</span>
                </div>
                <Progress value={(userState.freeDropsLeft / userState.totalFreeDrops) * 100} />
              </div>

              {userState.dropCompleted && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800 font-medium text-center">
                    🏆 Live Drop Completed! You also earned a $25 Amazon Gift Card!
                  </p>
                </div>
              )}

              <p className="text-sm text-center text-muted-foreground">
                This Drop improved your {userState.dropCompleted ? 'AI literacy and critical thinking' : 'SAT vocab and problem-solving'} portfolio.
              </p>

              <div className="flex justify-center">
                <Button variant="outline" size="sm" onClick={() => navigate('/ayo')} className="flex items-center gap-2">
                  <img src="/lovable-uploads/7588041f-8987-4a29-bd33-41e667d9b54a.png" alt="Ayo" className="w-4 h-4" />
                  Boost with Ayo →
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Live Drop Hero Section */}
        <Card className="overflow-hidden">
          {userState.isLiveDropAvailable ? (
            <>
              {/* Live Drop Header */}
              <div className="relative">
                <div style={{ background: 'linear-gradient(135deg, #aa1b83 0%, #3ec7ac 100%)' }} className="h-32 flex items-center justify-center">
                  <div className="text-center space-y-1">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                      <Gift className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-xs text-white/80">Live Drop Prize</p>
                  </div>
                </div>
                
                <Badge className="absolute top-3 left-3 text-white animate-pulse" style={{ backgroundColor: '#aa1b83' }}>
                  🔴 LIVE
                </Badge>
                
                <Badge className="absolute top-3 right-3 text-black" style={{ backgroundColor: '#ffc240' }}>
                  {formatTime(countdown.hours)}:{formatTime(countdown.minutes)}:{formatTime(countdown.seconds)}
                </Badge>
              </div>

              {/* Live Drop Content */}
              <CardContent className="p-4 space-y-4">
                <div className="text-center space-y-2">
                  <h2 className="text-xl font-bold" style={{ color: '#aa1b83' }}>🎯 The Drop</h2>
                  <p className="text-sm text-muted-foreground">
                    Where every Drop is a surprise and every win counts—gift cards, merch, or real world experiences from brands you love.
                  </p>
                </div>

                {/* Enhanced Step Indicator */}
                <div className="flex items-center justify-center py-4 px-2">
                  <div className="flex items-center justify-between w-full max-w-xs">
                    {/* Step 1: Watch */}
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mb-1" style={{ backgroundColor: '#aa1b83' }}>
                        <Play className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      </div>
                      <span className="text-xs font-medium text-gray-700">Watch</span>
                    </div>
                    
                    {/* Connector */}
                    <div className="flex-1 h-0.5 mx-1 rounded-full" style={{ backgroundColor: '#aa1b83' }}></div>
                    
                    {/* Step 2: Respond */}
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-full flex items-center justify-center mb-1">
                        <Users className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                      </div>
                      <span className="text-xs font-medium text-gray-500">Respond</span>
                    </div>
                    
                    {/* Connector */}
                    <div className="flex-1 h-0.5 mx-1 bg-gray-200 rounded-full"></div>
                    
                    {/* Step 3: Quiz */}
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-full flex items-center justify-center mb-1">
                        <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                      </div>
                      <span className="text-xs font-medium text-gray-500">Quiz</span>
                    </div>
                    
                    {/* Connector */}
                    <div className="flex-1 h-0.5 mx-1 bg-gray-200 rounded-full"></div>
                    
                    {/* Step 4: Win */}
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-full flex items-center justify-center mb-1">
                        <Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                      </div>
                      <span className="text-xs font-medium text-gray-500">Win</span>
                    </div>
                  </div>
                </div>

                {/* Rewards Preview */}
                <div className="rounded-lg p-3 border" style={{ background: 'linear-gradient(135deg, #ffc240 0%, #3ec7ac 100%)', borderColor: '#ffc240' }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Trophy className="w-5 h-5 text-black" />
                      <div>
                        <p className="font-semibold text-sm text-black">Possible Rewards</p>
                        <p className="text-xs text-gray-800">50-150 tokens + bonus prizes</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-800">Mystery rewards</p>
                      <p className="text-xs text-gray-800">Complete to find out!</p>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <Button 
                  onClick={() => navigate('/drops/live/current')}
                  className="w-full text-white font-semibold py-3 rounded-lg shadow-lg hover:opacity-90 transition-opacity"
                  style={{ background: 'linear-gradient(135deg, #aa1b83 0%, #3ec7ac 100%)' }}
                  size="lg"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Live Drop Challenge
                </Button>

                {/* Additional Info */}
                <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>~15 min</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-3 h-3" />
                    <span>1,247 participating</span>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <>
              {/* Next Drop Coming */}
              <div className="relative">
                {/* Video Teaser Background */}
                <div className="h-48 bg-gray-100 rounded-t-lg overflow-hidden relative">
                  <video
                    src="/videos/ai-drop-1.mp4"
                    className="w-full h-full object-cover"
                    muted
                    loop
                    autoPlay
                    playsInline
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto">
                        <Clock className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-sm text-white/90 font-medium">Next Live Drop</p>
                    </div>
                  </div>
                  
                  {/* Countdown Badge */}
                  <div className="absolute top-4 right-4">
                    <Badge className="text-white font-mono text-sm" style={{ backgroundColor: '#aa1b83' }}>
                      {formatTime(nextDropCountdown.hours)}:{formatTime(nextDropCountdown.minutes)}:{formatTime(nextDropCountdown.seconds)}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-4 space-y-4">
                <div className="text-center space-y-2">
                  <h2 className="text-lg font-bold">⏳ Next Live Drop unlocks at 4:00 PM</h2>
                  <p className="text-sm text-muted-foreground">
                    Set a reminder and complete other Drops while you wait
                  </p>
                </div>
                
                {/* Countdown Timer Display */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-2">Time until next drop</p>
                    <div className="flex items-center justify-center gap-2 text-xl font-mono font-bold" style={{ color: '#aa1b83' }}>
                      <div className="flex flex-col items-center">
                        <span>{formatTime(nextDropCountdown.hours)}</span>
                        <span className="text-xs text-muted-foreground">Hours</span>
                      </div>
                      <span>:</span>
                      <div className="flex flex-col items-center">
                        <span>{formatTime(nextDropCountdown.minutes)}</span>
                        <span className="text-xs text-muted-foreground">Min</span>
                      </div>
                      <span>:</span>
                      <div className="flex flex-col items-center">
                        <span>{formatTime(nextDropCountdown.seconds)}</span>
                        <span className="text-xs text-muted-foreground">Sec</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </>
          )}
        </Card>

        {/* Category Drops Section - Mobile Only */}
        <div className="space-y-4 lg:hidden">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Popular Categories</h3>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="text-primary"
            >
              {showAllCategories ? 'Show Less' : 'View All'}
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {(showAllCategories ? allCategories : featuredCategories).map((category, index) => (
              <Card 
                key={category.id} 
                className="cursor-pointer hover:shadow-md transition-all duration-200 hover-scale"
              >
                <CardContent className="p-2 sm:p-3">
                  <div className="text-center space-y-2">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 ${category.color} rounded-lg flex items-center justify-center text-white text-sm sm:text-lg mx-auto`}>
                      {category.icon}
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-xs sm:text-sm">{category.name}</h4>
                      <p className="text-xs text-muted-foreground hidden sm:block">{category.description}</p>
                      <p className="text-xs text-primary font-medium mt-1">
                        {category.freeDrops}/3 left
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {showAllCategories && (
            <div className="animate-fade-in">
              <p className="text-center text-sm text-muted-foreground mt-4">
                Tap any category to explore available Drops
              </p>
            </div>
          )}
        </div>

        {/* Additional CTA Tiles */}
        <div className="space-y-3">

          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate('/rewards')}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: '#3ec7ac' }}>
                  <Trophy className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">150 Tokens Away From Your Next Reward!</h4>
                  <p className="text-sm text-muted-foreground">
                    View rewards & leaderboard
                  </p>
                </div>
                <Button variant="ghost" size="sm">→</Button>
              </div>
            </CardContent>
          </Card>
        </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDropsMain;