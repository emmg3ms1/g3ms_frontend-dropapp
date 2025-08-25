import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CreateDropForm } from '@/components/CreateDropForm';
import { 
  Plus, 
  TrendingUp, 
  Users, 
  Target,
  Trophy,
  Sparkles,
  CheckCircle,
  ArrowRight,
  BarChart3,
  Eye,
  Heart,
  Share2,
  Calendar,
  DollarSign,
  Package,
  Star,
  Activity,
  Settings,
  CreditCard,
  LogOut,
  Building,
  Zap,
  Gift,
  MessageSquare
} from 'lucide-react';

const BrandsDashboard = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [hasCreatedDrop, setHasCreatedDrop] = useState(false); // New user hasn't created anything
  const [dropTitle, setDropTitle] = useState('');
  const navigate = useNavigate();

  const handleDropCreated = (title: string) => {
    setDropTitle(title);
    setHasCreatedDrop(true);
    setCurrentStep(2);
    setShowCreateForm(false);
  };

  // Mock brand data for new user
  const brand = {
    name: "Nike",
    industry: "Athletic Wear", 
    tier: "Premium Partner",
    logo: "N",
    campaignBudget: 50000,
    budgetUsed: 0,
    totalReach: 0,
    totalEngagement: 0,
    activeCampaigns: 0,
    completedCampaigns: 0
  };

  // Campaign ideas for new users
  const campaignIdeas = [
    {
      title: "Product Launch Challenge",
      description: "Introduce your new product through interactive challenges",
      category: "Product Launch",
      estimatedReach: "1,000-2,500 students",
      estimatedBudget: "$10,000-$15,000",
      duration: "2-3 weeks"
    },
    {
      title: "Brand Values Campaign",
      description: "Share your brand story and connect with student values",
      category: "Brand Awareness", 
      estimatedReach: "1,500-3,000 students",
      estimatedBudget: "$8,000-$12,000",
      duration: "3-4 weeks"
    },
    {
      title: "Sustainability Initiative",
      description: "Engage students in your environmental responsibility efforts",
      category: "CSR Initiative",
      estimatedReach: "2,000-4,000 students", 
      estimatedBudget: "$12,000-$18,000",
      duration: "4-6 weeks"
    },
    {
      title: "Skills Development Workshop",
      description: "Educational content that aligns with your brand expertise",
      category: "Educational",
      estimatedReach: "800-1,500 students",
      estimatedBudget: "$6,000-$10,000", 
      duration: "1-2 weeks"
    }
  ];

  // Analytics data for new user (empty state)
  const analytics = {
    impressions: 0,
    clicks: 0,
    conversions: 0,
    ctr: 0,
    conversionRate: 0,
    avgEngagementTime: "0m 0s"
  };

  const gettingStartedSteps = [
    {
      id: 1,
      title: "Create Brand Campaign",
      description: "Launch your first branded drop",
      icon: Plus,
      completed: hasCreatedDrop,
      primary: !hasCreatedDrop
    },
    {
      id: 2,
      title: "Set Target Audience",
      description: "Define your student demographics",
      icon: Target,
      completed: false,
      primary: hasCreatedDrop && currentStep === 2
    },
    {
      id: 3,
      title: "Track Performance",
      description: "Monitor engagement and ROI",
      icon: BarChart3,
      completed: false,
      primary: currentStep === 3
    },
    {
      id: 4,
      title: "Optimize Results",
      description: "Improve based on data insights",
      icon: TrendingUp,
      completed: false,
      primary: currentStep === 4
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-g3ms-purple/5 to-g3ms-blue/5">
      {/* Top Navigation */}
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">G3MS</h1>
              <Badge variant="outline" className="ml-3 text-g3ms-purple border-g3ms-purple">
                Brand Partner
              </Badge>
            </div>

            {/* Budget Display & Profile */}
            <div className="flex items-center gap-4">
              {/* Budget Display */}
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-g3ms-green" />
                  <span className="text-muted-foreground">Budget:</span>
                  <span className="font-semibold">${brand.budgetUsed.toLocaleString()} / ${brand.campaignBudget.toLocaleString()}</span>
                </div>
                <Progress 
                  value={(brand.budgetUsed / brand.campaignBudget) * 100} 
                  className="w-20" 
                />
              </div>

              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 p-2">
                    <div className="text-right text-sm">
                      <div className="font-medium">{brand.name}</div>
                      <div className="text-muted-foreground">{brand.tier}</div>
                    </div>
                    <Avatar className="h-8 w-8 bg-g3ms-purple">
                      <AvatarFallback className="bg-g3ms-purple text-white text-sm">
                        {brand.logo}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <Building className="h-4 w-4 mr-2" />
                    Brand Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/billing')}>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Billing
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600" onClick={() => navigate('/login')}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-g3ms-purple">
              <Sparkles className="h-8 w-8" />
              <h1 className="text-4xl font-bold">Welcome, {brand.name}!</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              You're about to launch your first brand campaign! Let's create an engaging student experience that drives real results.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-g3ms-green font-medium">
              <CheckCircle className="h-4 w-4" />
              <span>Account setup complete - Ready to launch</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Active CTA Banner */}
        {!hasCreatedDrop && (
          <Card className="border-2 border-g3ms-purple bg-gradient-to-r from-g3ms-purple/10 via-g3ms-blue/10 to-g3ms-green/10 shadow-lg">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-center">
                    <div className="h-16 w-16 bg-g3ms-purple rounded-full flex items-center justify-center animate-pulse">
                      <Sparkles className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold text-g3ms-purple">Launch Your First Brand Campaign</h2>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Connect with thousands of engaged students and create memorable brand experiences that drive real impact. Your campaign can be live in minutes!
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button 
                    onClick={() => setShowCreateForm(true)}
                    size="lg"
                    className="bg-g3ms-purple hover:bg-g3ms-purple/90 px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    <Plus className="h-6 w-6 mr-2" />
                    Create First Campaign
                  </Button>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Reach 1,000+ students →</span>
                    <Users className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Success Banner after creating campaign */}
        {hasCreatedDrop && currentStep === 2 && (
          <Card className="border-2 border-g3ms-green bg-gradient-to-r from-g3ms-green/10 to-g3ms-blue/10 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-g3ms-green rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-g3ms-green">Campaign Created Successfully!</h3>
                    <p className="text-muted-foreground">"{dropTitle}" is now live and reaching students.</p>
                  </div>
                </div>
                <Button 
                  onClick={() => setCurrentStep(3)}
                  className="bg-g3ms-green hover:bg-g3ms-green/90"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Getting Started Steps */}
        <Card className="border-2 border-g3ms-purple/20 bg-gradient-to-r from-g3ms-purple/5 to-g3ms-green/5">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-g3ms-purple/10 rounded-lg flex items-center justify-center">
                <Zap className="h-5 w-5 text-g3ms-purple" />
              </div>
              <div>
                <CardTitle className="text-xl">Getting Started</CardTitle>
                <CardDescription>Follow these steps to launch your first successful campaign</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {gettingStartedSteps.map((step, index) => (
                <div key={step.id} className="relative">
                  <Card 
                    className={`transition-all duration-200 hover:shadow-md ${
                      step.primary ? 'ring-2 ring-g3ms-purple shadow-lg' : 'hover:shadow-sm'
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                          step.completed 
                            ? 'bg-g3ms-green text-white' 
                            : step.primary 
                              ? 'bg-g3ms-purple text-white' 
                              : 'bg-muted text-muted-foreground'
                        }`}>
                          {step.completed ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <step.icon className="h-4 w-4" />
                          )}
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">Step {step.id}</span>
                      </div>
                      <h3 className="font-semibold mb-2">{step.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{step.description}</p>
                      {step.primary && (
                        <Button 
                          onClick={() => {
                            if (step.id === 1) {
                              setShowCreateForm(true);
                            }
                          }}
                          className="w-full bg-g3ms-purple hover:bg-g3ms-purple/90"
                          size="sm"
                        >
                          {step.id === 1 ? 'Create Campaign' : 'Continue'}
                          <ArrowRight className="h-3 w-3 ml-2" />
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                  {index < gettingStartedSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Campaign Ideas Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Campaign Ideas */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-g3ms-yellow/10 rounded-lg flex items-center justify-center">
                    <Gift className="h-5 w-5 text-g3ms-yellow" />
                  </div>
                  <div>
                    <CardTitle>Campaign Ideas to Get You Started</CardTitle>
                    <CardDescription>Proven campaign templates that drive engagement</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {campaignIdeas.map((idea, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold">{idea.title}</h3>
                            <Badge variant="outline" className="text-xs">
                              {idea.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{idea.description}</p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              <span>{idea.estimatedReach}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              <span>{idea.estimatedBudget}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{idea.duration}</span>
                            </div>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setShowCreateForm(true)}
                          className="text-g3ms-purple hover:text-g3ms-purple hover:bg-g3ms-purple/10"
                        >
                          Use Template
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Success Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Star className="h-5 w-5 text-g3ms-yellow" />
                  Campaign Success Tips
                </CardTitle>
                <CardDescription>Best practices from top-performing brands</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="h-2 w-2 bg-g3ms-green rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm">Start with clear objectives and success metrics</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-2 w-2 bg-g3ms-blue rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm">Interactive content gets 3x higher engagement</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-2 w-2 bg-g3ms-purple rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm">Offer meaningful rewards students actually want</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-2 w-2 bg-g3ms-yellow rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm">Launch campaigns during school hours for peak engagement</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dashboard Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Dashboard Preview</CardTitle>
                <CardDescription>What you'll see after launching campaigns</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Active Campaigns</span>
                    <span className="font-semibold">0</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Student Reach</span>
                    <span className="font-semibold">0</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total Engagement</span>
                    <span className="font-semibold">0%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Campaign ROI</span>
                    <span className="font-semibold">0x</span>
                  </div>
                </div>
                <div className="pt-2">
                  <p className="text-xs text-muted-foreground text-center">
                    These metrics will populate as your campaigns go live and students engage!
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Support */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-g3ms-blue" />
                  Need Help?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Our brand success team is here to help you create winning campaigns.
                  </p>
                  <Button variant="outline" className="w-full" size="sm">
                    Contact Support
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Create Campaign Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-g3ms-purple" />
                    Create New Brand Campaign
                  </CardTitle>
                  <CardDescription>Launch an engaging brand experience for students</CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowCreateForm(false)}
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <CreateDropForm onDropCreated={handleDropCreated} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default BrandsDashboard;