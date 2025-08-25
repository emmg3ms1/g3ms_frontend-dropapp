import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  CheckCircle, 
  FileText, 
  Calculator, 
  BookOpen, 
  Code, 
  Edit3, 
  Diamond,
  Send,
  Home,
  User,
  ChevronDown,
  ChevronUp,
  Gamepad2,
  ArrowLeft
} from 'lucide-react';

const Ayo = () => {
  const navigate = useNavigate();
  const [isQuickActionsExpanded, setIsQuickActionsExpanded] = React.useState(false);
  const [isRecentActivityExpanded, setIsRecentActivityExpanded] = React.useState(false);
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Back to Drops Button */}
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/drops/main')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Drops
          </Button>
        </div>
        {/* Hero Card */}
        <Card className="p-6 bg-white border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Stack G3MS by getting tutoring help from Ayo, for every 30 minutes you earn $150 tokens!
              </h2>
            </div>
            <div className="flex-shrink-0 ml-4">
              <img 
                src="/lovable-uploads/59e4c837-9483-4600-b7ed-f83a4b71b87c.png"
                alt="Ayo character"
                className="w-16 h-16 object-contain"
              />
            </div>
          </div>
        </Card>

        {/* CTA Banner */}
        <Card className="p-6 bg-gradient-to-r from-g3ms-green to-emerald-400 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-sm font-bold">💧</span>
              </div>
              <p className="font-medium">Catch Drops, earn tokens, and score rewards from your fave brands!</p>
            </div>
            <Button asChild variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
              <Link to="/drops/main">Hey Ayo!</Link>
            </Button>
          </div>
        </Card>

        {/* Chat Input */}
        <Card className="p-4 bg-white border border-gray-200">
          <div className="flex items-center gap-3">
            <input 
              type="text"
              placeholder="Ask Ayo anything to get started or click below..."
              className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-g3ms-purple/20 focus:border-g3ms-purple"
            />
            <Button className="bg-g3ms-purple hover:bg-g3ms-purple/90 text-white rounded-lg p-3">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </Card>

        {/* Quick Actions */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            <button 
              onClick={() => setIsQuickActionsExpanded(!isQuickActionsExpanded)}
              className="md:hidden flex items-center gap-1 text-gray-500"
            >
              {isQuickActionsExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
          
          {/* Learning Activities - Top Row */}
          <div className={`mb-6 ${!isQuickActionsExpanded ? 'hidden md:block' : ''}`}>
            <h4 className="text-sm font-medium text-gray-600 mb-3 uppercase tracking-wide">Learning Activities</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Start Bellwork */}
              <Card className="p-6 bg-white border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Bell className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 mb-1">Start Bellwork</h4>
                    <p className="text-sm text-gray-600 mb-3">Kick off class with a brain boost & stack those G3MS 💎!</p>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">Math</Badge>
                      <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">ELA</Badge>
                      <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs">Science</Badge>
                      <Badge variant="secondary" className="bg-orange-100 text-orange-700 text-xs">History</Badge>
                      <Badge variant="secondary" className="bg-red-100 text-red-700 text-xs">Test Prep</Badge>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Complete Exit Ticket */}
              <Card className="p-6 bg-white border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 mb-1">Complete your Exit Ticket</h4>
                    <p className="text-sm text-gray-600 mb-3">Lock in what you learned. Stack G3MS 💎 for what didn't click.</p>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">Math</Badge>
                      <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">ELA</Badge>
                      <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs">Science</Badge>
                      <Badge variant="secondary" className="bg-orange-100 text-orange-700 text-xs">History</Badge>
                      <Badge variant="secondary" className="bg-red-100 text-red-700 text-xs">Test Prep</Badge>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Complete Assignment */}
              <Card className="p-6 bg-white border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 mb-1">Complete an Assignment</h4>
                    <p className="text-sm text-gray-600 mb-3">Crush your dailies & stack G3MS 💎</p>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">Math</Badge>
                      <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">ELA</Badge>
                      <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs">Science</Badge>
                      <Badge variant="secondary" className="bg-orange-100 text-orange-700 text-xs">History</Badge>
                      <Badge variant="secondary" className="bg-red-100 text-red-700 text-xs">Test Prep</Badge>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Subject Help - Bottom Row */}
          <div className={`${!isQuickActionsExpanded ? 'hidden md:block' : ''}`}>
            <h4 className="text-sm font-medium text-gray-600 mb-3 uppercase tracking-wide">Subject Help & Activities</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Math Problems */}
              <Card className="p-6 bg-white border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calculator className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 mb-1">Ace Your Math Problems</h4>
                    <p className="text-sm text-gray-600">Stuck on a math problem? Get hints and learn step-by-step without just getting the answer.</p>
                  </div>
                </div>
              </Card>

              {/* Reading/Writing Help */}
              <Card className="p-6 bg-white border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Edit3 className="w-5 h-5 text-pink-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 mb-1">Need Help with Reading or Writing?</h4>
                    <p className="text-sm text-gray-600">Ayo supports writing, reading comprehension, and vocabulary without doing it for you.</p>
                  </div>
                </div>
              </Card>

              {/* Coding Help */}
              <Card className="p-6 bg-white border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Code className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 mb-1">Code Like a Pro</h4>
                    <p className="text-sm text-gray-600">Looking for coding help? Copy code snippets to use in our editor, just like on CodePen.</p>
                  </div>
                </div>
              </Card>

              {/* Play Coding Games */}
              <Card className="p-6 bg-white border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Gamepad2 className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 mb-1">Play Coding Games</h4>
                    <p className="text-sm text-gray-600">Play a coding game created by learners just like you. Design a dress or sneaker, or play a quiz game, or tic tac toe.</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <button 
              onClick={() => setIsRecentActivityExpanded(!isRecentActivityExpanded)}
              className="md:hidden flex items-center gap-1 text-gray-500"
            >
              {isRecentActivityExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
          <div className={`space-y-3 ${!isRecentActivityExpanded ? 'hidden md:block' : ''}`}>
            <Card className="p-4 bg-white border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-yellow-600 font-bold text-sm">✓</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Completed Math Quiz</p>
                    <p className="text-sm text-gray-500">2 hours ago • Score: 85%</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-blue-600">
                  <span className="text-sm font-medium">+</span>
                  <Diamond className="w-4 h-4" />
                  <span className="font-semibold">$90</span>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-white border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-yellow-600 font-bold text-sm">✓</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Completed Math Quiz</p>
                    <p className="text-sm text-gray-500">2 hours ago • Score: 85%</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-blue-600">
                  <span className="text-sm font-medium">+</span>
                  <Diamond className="w-4 h-4" />
                  <span className="font-semibold">$90</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Ayo;