import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Code, Users, Gift, Clock, Trophy, Play, Eye, Plus, ArrowLeft } from 'lucide-react';

const CodeCreation = () => {
  const navigate = useNavigate();

  // Smart back navigation - get referrer from browser history or default to main
  const getBackPath = () => {
    const referrer = document.referrer;
    console.log('CodeCreation Referrer:', referrer);
    
    // If coming from a live drop, go back to live drop
    if (referrer.includes('/drops/main/live/')) {
      const pathMatch = referrer.match(/\/drops\/main\/live\/([^/?]+)/);
      if (pathMatch) {
        return `/drops/main/live/${pathMatch[1]}`;
      }
    }
    
    // If coming from main drops page
    if (referrer.includes('/drops/main')) {
      return '/drops/main';
    }
    
    // Default fallback
    return '/drops/main';
  };

  const challenges = [
    {
      id: 1,
      title: "Build Your First App with Ayo",
      description: "Learn the fundamentals of app development through guided tutorials and interactive coding challenges.",
      duration: "45 min",
      completedCount: 856,
      totalParticipants: 1200,
      difficulty: "Beginner",
      rewards: 100,
      status: "live"
    },
    {
      id: 2,
      title: "Web Game Development Challenge",
      description: "Create an interactive web game using HTML5, CSS, and JavaScript. Show off your creativity!",
      duration: "60 min",
      completedCount: 0,
      totalParticipants: 0,
      difficulty: "Intermediate",
      rewards: 150,
      status: "coming-soon"
    },
    {
      id: 3,
      title: "AI-Powered Chatbot Creator",
      description: "Build an intelligent chatbot that can answer questions and help users solve problems.",
      duration: "75 min",
      completedCount: 234,
      totalParticipants: 450,
      difficulty: "Advanced",
      rewards: 200,
      status: "completed"
    },
    {
      id: 4,
      title: "Mobile App Design & Code",
      description: "Design and code a mobile app that solves a real-world problem in your community.",
      duration: "90 min",
      completedCount: 89,
      totalParticipants: 120,
      difficulty: "Advanced",
      rewards: 250,
      status: "live"
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCompletionRate = (completed: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center mb-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate(getBackPath())}
              className="mr-4 p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center space-x-3">
              <span className="text-3xl">💻</span>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Code Creation</h1>
                <p className="text-gray-600 mt-1">Build apps and games step-by-step with Ayo. Publish your drops, earn tokens, and share them with other learners.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Drops Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {challenges.map((challenge) => (
            <Card key={challenge.id} className="hover:shadow-lg transition-shadow flex flex-col h-full">
              <CardHeader className="pb-4 flex-shrink-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                      {challenge.title}
                    </CardTitle>
                    <div className="flex flex-wrap items-center gap-2 min-h-[28px]">
                      <Badge 
                        variant="secondary" 
                        className={`${getDifficultyColor(challenge.difficulty)} flex items-center h-6 text-xs px-2 flex-shrink-0`}
                      >
                        {challenge.difficulty}
                      </Badge>
                      {challenge.status === 'live' && (
                        <Badge variant="destructive" className="bg-red-500 text-white flex items-center h-6 text-xs px-2 flex-shrink-0">
                          <span className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></span>
                          Live
                        </Badge>
                      )}
                      <Badge variant="outline" className="bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-400 text-yellow-800 flex items-center h-6 text-xs px-2 flex-shrink-0">
                        <Gift className="w-3 h-3 mr-1" />
                        <span className="text-xs">❓</span>
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-500 flex-shrink-0">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {challenge.duration}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col p-6 pt-0">
                <div className="flex-1 space-y-4 mb-4">
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                    {challenge.description}
                  </p>
                  
                  {/* Completion Stats */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-600">
                        <Users className="w-4 h-4 mr-1" />
                        {challenge.completedCount.toLocaleString()} completed
                      </div>
                      <span className="text-gray-500">
                        {getCompletionRate(challenge.completedCount, challenge.totalParticipants)}%
                      </span>
                    </div>
                    <Progress 
                      value={getCompletionRate(challenge.completedCount, challenge.totalParticipants)} 
                      className="h-2"
                    />
                    <p className="text-xs text-gray-500">
                      {challenge.totalParticipants.toLocaleString()} total participants
                    </p>
                  </div>

                  {/* Rewards */}
                  <div className="flex items-center">
                    <div className="flex items-center text-sm text-gray-600">
                      <Trophy className="w-4 h-4 mr-1 text-yellow-500" />
                      {challenge.rewards} G3MS tokens
                    </div>
                  </div>
                </div>

                {/* Action Buttons - always at bottom */}
                <div className="flex space-x-2 mt-auto">
                  {challenge.status === 'completed' && (
                    <Button 
                      className="flex-1 h-10"
                      onClick={() => navigate('/drops/main')}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Progress
                    </Button>
                  )}
                  {challenge.status === 'live' && (
                    <Button 
                      className="flex-1 h-10"
                      onClick={() => navigate('/drops/main')}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Complete Drop
                    </Button>
                  )}
                  {challenge.status === 'coming-soon' && (
                    <Button 
                      className="flex-1 h-10"
                      variant="outline"
                      onClick={() => {
                        console.log('Register for drop:', challenge.id);
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Register for Drop
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CodeCreation;