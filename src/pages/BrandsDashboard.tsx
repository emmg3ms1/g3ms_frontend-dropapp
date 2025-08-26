import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CreateDropForm } from '@/components/CreateDropForm';
import { toast } from 'sonner';
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
  MessageSquare,
  Edit,
  MoreHorizontal,
  Clock,
  Filter,
  Search
} from 'lucide-react';

const BrandsDashboard = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [hasCreatedDrop, setHasCreatedDrop] = useState(true); // Start with a sample drop created
  const [dropTitle, setDropTitle] = useState('Nike Air Max Student Challenge');
  const navigate = useNavigate();

  const handleDropCreated = (title: string) => {
    setDropTitle(title);
    setHasCreatedDrop(true);
    setShowCreateForm(false);
  };

  // Handle campaign actions
  const handleViewCampaign = (campaign: any) => {
    // Navigate to campaign analytics/view page
    navigate(`/campaigns/${campaign.id}/analytics`);
  };

  const handleEditCampaign = (campaign: any) => {
    // For now, show a toast - could open edit form or navigate to edit page
    toast.info(`Edit functionality for "${campaign.title}" coming soon!`);
  };

  const handleViewAnalytics = (campaign: any) => {
    // Navigate to detailed analytics
    navigate(`/campaigns/${campaign.id}/analytics`);
  };

  const handleDuplicateCampaign = (campaign: any) => {
    toast.success(`Created duplicate of "${campaign.title}"!`);
    // Would typically make API call to duplicate the campaign
  };

  const handleShareCampaign = (campaign: any) => {
    const shareUrl = `${window.location.origin}/campaigns/join/${campaign.id}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Campaign sharing link copied to clipboard!");
  };

  const handleDeleteCampaign = (campaign: any) => {
    // Show confirmation and delete
    if (confirm(`Are you sure you want to delete "${campaign.title}"?`)) {
      toast.success(`Deleted "${campaign.title}"`);
    }
  };

  // Mock campaign data - would come from API
  const mockCampaigns = hasCreatedDrop ? [
    {
      id: "camp-1",
      title: "Nike Air Max Challenge",
      campaignType: "Product Launch",
      status: "LIVE",
      createdAt: new Date().toISOString(),
      scheduledAt: new Date().toISOString(),
      flatFee: 250,
      inKindGoods: 1000,
      totalBudget: 1250,
      reach: 2400,
      engagement: 85,
      conversions: 142,
      brand: "Nike",
      category: "Athletic Wear"
    }
  ] : [];

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


        {/* My Campaigns Section - Always show */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-g3ms-blue/10 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-g3ms-blue" />
                </div>
                <div>
                  <CardTitle>My Campaigns</CardTitle>
                  <CardDescription>
                    {mockCampaigns.length > 0 
                      ? "Manage and monitor your brand campaigns" 
                      : "Your created campaigns will appear here"
                    }
                  </CardDescription>
                </div>
              </div>
                <div className="flex items-center gap-2">
                  <Button 
                    onClick={() => setShowCreateForm(true)}
                    className="bg-g3ms-purple hover:bg-g3ms-purple/90"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Campaign
                  </Button>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
              {mockCampaigns.length > 0 ? (
                <div className="space-y-4">
                  {mockCampaigns.map((campaign) => (
                    <Card
                      key={campaign.id}
                      className="border-l-4 border-l-g3ms-purple/30 hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-4">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                          {/* Campaign Info */}
                          <div className="lg:col-span-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-lg">{campaign.title}</h3>
                                <Badge
                                  variant={campaign.status === "LIVE" ? "default" : "outline"}
                                  className={campaign.status === "LIVE" ? "bg-g3ms-green text-white" : ""}
                                >
                                  {campaign.status}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="bg-g3ms-purple/10 text-g3ms-purple px-2 py-1 rounded-full text-xs font-medium">
                                  {campaign.campaignType}
                                </span>
                                <span>{campaign.category}</span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Created {new Date(campaign.createdAt).toLocaleDateString()} • {campaign.brand}
                              </p>
                            </div>
                          </div>

                          {/* Performance Stats */}
                          <div className="lg:col-span-3">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Reach</span>
                                <span className="font-medium">{campaign.reach.toLocaleString()}</span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Engagement</span>
                                <span className="font-medium">{campaign.engagement}%</span>
                              </div>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Trophy className="h-3 w-3" />
                                  {campaign.conversions} conversions
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Budget & Pricing Structure */}
                          <div className="lg:col-span-3">
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <DollarSign className="h-3 w-3" />
                                <span>Campaign Fee: $250</span>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Package className="h-3 w-3" />
                                <span>In-Kind Goods: $1,000</span>
                              </div>
                              <div className="flex items-center gap-2 font-medium text-foreground">
                                <span>Total Value: ${campaign.totalBudget.toLocaleString()}</span>
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                Gift cards • Event tickets • Merchandise
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                <span>
                                  Started {new Date(campaign.scheduledAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="lg:col-span-2">
                            <div className="flex items-center justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleViewCampaign(campaign)}
                                title="View Campaign Analytics"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleEditCampaign(campaign)}
                                title="Edit Campaign"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    title="More Options"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleViewAnalytics(campaign)}>
                                    View Analytics
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleDuplicateCampaign(campaign)}>
                                    Duplicate
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleShareCampaign(campaign)}>
                                    Share
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    className="text-red-600"
                                    onClick={() => handleDeleteCampaign(campaign)}
                                  >
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="mx-auto h-24 w-24 bg-g3ms-purple/10 rounded-full flex items-center justify-center mb-4">
                    <Package className="h-12 w-12 text-g3ms-purple/30" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No campaigns yet</h3>
                  <p className="text-muted-foreground mb-4 max-w-sm mx-auto">
                    Create your first brand campaign to start engaging with students and see your results here.
                  </p>
                  <Button 
                    onClick={() => setShowCreateForm(true)}
                    className="bg-g3ms-purple hover:bg-g3ms-purple/90"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Campaign
                  </Button>
                </div>
              )}

              {/* Stats Summary */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-g3ms-purple/5 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-g3ms-purple">
                    {mockCampaigns.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Campaigns</div>
                </div>
                <div className="bg-g3ms-green/5 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-g3ms-green">
                    {mockCampaigns.filter((c) => c.status === "LIVE").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Live Campaigns</div>
                </div>
                <div className="bg-g3ms-blue/5 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-g3ms-blue">
                    {mockCampaigns.reduce((acc, c) => acc + c.reach, 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Reach</div>
                </div>
                <div className="bg-g3ms-yellow/5 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-g3ms-yellow">
                    {mockCampaigns.reduce((acc, c) => acc + c.conversions, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Conversions</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Analytics - Always visible if campaigns exist */}
        {hasCreatedDrop && (
          <Card className="border-2 border-g3ms-blue/20 bg-gradient-to-r from-g3ms-blue/5 to-g3ms-green/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-g3ms-blue/10 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-g3ms-blue" />
                </div>
                <div>
                  <CardTitle className="text-xl">Campaign Performance</CardTitle>
                  <CardDescription>Real-time analytics for "Nike Air Max Student Challenge"</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4 border">
                  <div className="flex items-center gap-3 mb-2">
                    <Eye className="h-5 w-5 text-g3ms-blue" />
                    <span className="text-sm font-medium">Impressions</span>
                  </div>
                  <div className="text-2xl font-bold text-g3ms-blue">24.5K</div>
                  <div className="text-xs text-g3ms-green">↑ 12% vs yesterday</div>
                </div>
                <div className="bg-white rounded-lg p-4 border">
                  <div className="flex items-center gap-3 mb-2">
                    <Heart className="h-5 w-5 text-g3ms-purple" />
                    <span className="text-sm font-medium">Engagement</span>
                  </div>
                  <div className="text-2xl font-bold text-g3ms-purple">8.7%</div>
                  <div className="text-xs text-g3ms-green">↑ 3.2% vs yesterday</div>
                </div>
                <div className="bg-white rounded-lg p-4 border">
                  <div className="flex items-center gap-3 mb-2">
                    <Trophy className="h-5 w-5 text-g3ms-yellow" />
                    <span className="text-sm font-medium">Conversions</span>
                  </div>
                  <div className="text-2xl font-bold text-g3ms-yellow">142</div>
                  <div className="text-xs text-g3ms-green">↑ 8 new today</div>
                </div>
                <div className="bg-white rounded-lg p-4 border">
                  <div className="flex items-center gap-3 mb-2">
                    <DollarSign className="h-5 w-5 text-g3ms-green" />
                    <span className="text-sm font-medium">ROI</span>
                  </div>
                  <div className="text-2xl font-bold text-g3ms-green">3.4x</div>
                  <div className="text-xs text-g3ms-green">Above target</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Top Performing Content</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm p-2 bg-g3ms-green/10 rounded">
                    <span>🎬 Nike Innovation Video</span>
                    <span className="font-medium">94% completion</span>
                  </div>
                  <div className="flex items-center justify-between text-sm p-2 bg-g3ms-blue/10 rounded">
                    <span>🏃 Athletic Challenge Quiz</span>
                    <span className="font-medium">87% engagement</span>
                  </div>
                  <div className="flex items-center justify-between text-sm p-2 bg-g3ms-purple/10 rounded">
                    <span>👟 Product Design Activity</span>
                    <span className="font-medium">76% completion</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

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