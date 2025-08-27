import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CreateDropForm } from "@/components/CreateDropForm";
import { InviteStudentsStep } from "@/components/InviteStudentsStep";
import { MonitorProgressStep } from "@/components/MonitorProgressStep";
import { CelebrateSuccessStep } from "@/components/CelebrateSuccessStep";
import { useEducatorDropStore } from "@/stores/educatorDropStore";
import { apiService } from "@/services/api";
import { getMuxThumbnailUrl, getPlaybackIdFromVideo } from "@/utils/mux";
import { toast } from "sonner";
import { DropCompletionFlow } from "@/components/DropCompletionFlow";
import {
  Plus,
  Users,
  BookOpen,
  Trophy,
  Sparkles,
  CheckCircle,
  ArrowRight,
  PlayCircle,
  Target,
  Lightbulb,
  Rocket,
  Heart,
  User,
  Settings,
  CreditCard,
  LogOut,
  Coins,
  BarChart3,
  UsersIcon,
  Calendar,
  Filter,
  Search,
  Eye,
  Edit,
  MoreHorizontal,
  Clock,
  BarChart,
} from "lucide-react";

const EducatorDashboard = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showInviteStudents, setShowInviteStudents] = useState(false);
  const [showMonitorProgress, setShowMonitorProgress] = useState(false);
  const [showCelebrateSuccess, setShowCelebrateSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [hasCreatedDrop, setHasCreatedDrop] = useState(false);
  const [dropTitle, setDropTitle] = useState("");
  const [selectedDrop, setSelectedDrop] = useState<any>(null);
  
  const navigate = useNavigate();

  // Get drops data and actions from store
  const {
    drops,
    isLoading: isLoadingDrops,
    error,
    setDrops,
    updateDrop,
    setLoading,
    setError,
  } = useEducatorDropStore();

  // Create test drop for development
  const createTestDrop = () => {
    const testDrop = {
      id: "test-drop-1",
      title: "Math Challenge: Absolute Value Adventure",
      dropType: "Math Challenge",
      status: "DRAFT" as const,
      scheduledAt: new Date().toISOString(),
      isPublished: false,
      subject: "Mathematics",
      rtiTier: "Tier 1",
      learningGoal: "Master absolute value concepts through interactive challenges",
      video: {
        id: "video-1",
        title: "Understanding Absolute Value",
        playbackId: "sample-playback-id"
      },
      template: {
        id: "template-1",
        title: "Math Challenge Template",
        type: "Interactive"
      },
      schools: [{
        school: {
          id: "school-1",
          name: "Lincoln High School",
          city: "Metro City",
          state: "CA"
        }
      }],
      grades: [{
        grade: {
          id: "grade-8",
          name: "8th Grade",
          order: 8
        }
      }],
      reward: {
        rewardType: "G3MS" as const,
        g3msAmount: 100,
        winnersCount: 5,
        eligibilityText: "Complete all challenges to earn G3MS tokens"
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setDrops([testDrop]);
    setHasCreatedDrop(true);
    setDropTitle(testDrop.title);
    setCurrentStep(2);
    toast.success("Test drop created! You can now work on step 2 - assigning it to students.");
  };

  // Fetch drops when component mounts
  useEffect(() => {
    const fetchDrops = async () => {
      setLoading(true);
      try {
        const response = await apiService.getEducatorDrops();
        if (response.data && response.data.length > 0) {
          setDrops(response.data);
        } else {
          // If no drops exist, create a test drop
          createTestDrop();
        }
      } catch (error) {
        console.error("Failed to fetch drops:", error);
        // If API fails, create test drop for development
        createTestDrop();
        setError(null); // Clear error since we're providing test data
      } finally {
        setLoading(false);
      }
    };

    fetchDrops();
  }, [setDrops, setLoading, setError]);

  // Handle drop actions
  const handleViewDrop = (drop: any) => {
    // Navigate to drop view page - using live drop page for now
    navigate(`/drops/live?dropId=${drop.id}`);
  };

  const handleEditDrop = (drop: any) => {
    // For now, show a toast - could open edit form or navigate to edit page
    toast.info(`Edit functionality for "${drop.title}" coming soon!`);
  };

  const handleViewResults = (drop: any) => {
    // Use the monitor progress modal to show results
    setSelectedDrop(drop);
    setShowMonitorProgress(true);
  };

  const handleDuplicateDrop = (drop: any) => {
    toast.success(`Created duplicate of "${drop.title}"!`);
    // Would typically make API call to duplicate the drop
  };

  const handleShareDrop = (drop: any) => {
    const shareUrl = `${window.location.origin}/drops/join/${drop.id}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Drop sharing link copied to clipboard!");
  };

  const handleDeleteDrop = (drop: any) => {
    // Show confirmation and delete
    if (confirm(`Are you sure you want to delete "${drop.title}"?`)) {
      // Would typically call removeDrop from store and API
      toast.success(`Deleted "${drop.title}"`);
    }
  };

  // Handle publish/unpublish drop
  const handlePublishDrop = useCallback(
    async (dropId: string, isPublished: boolean) => {
      try {
        await apiService.publishDrop(dropId, isPublished);

        // Update the drop in the store
        updateDrop(dropId, { isPublished });

        toast.success(
          isPublished
            ? "Drop published successfully! Students can now access it."
            : "Drop unpublished. Students can no longer access it."
        );
      } catch (error) {
        console.error("Failed to update drop publish status:", error);
        toast.error(
          `Failed to ${
            isPublished ? "publish" : "unpublish"
          } drop. Please try again.`
        );
      }
    },
    [updateDrop]
  );

  const handleDropCreated = (title: string) => {
    setDropTitle(title);
    setHasCreatedDrop(true);
    setCurrentStep(2);
    setShowCreateForm(false);
    // Auto-open invite students after creating drop
    setTimeout(() => setShowInviteStudents(true), 500);
  };


  // Mock user data - replace with real data
  const user = {
    name: "accounting",
    role: "District Leader", // Can be: "Educator", "School Leader", "District Leader"
    school: "Lincoln High School",
    district: "Metro School District",
    tokens: 0,
    tokensNeeded: 15000,
    giftCardValue: 15000,
  };


  // Use real drops from store - no role-based filtering for now since 
  // the API doesn't return creator/school information needed for filtering
  const filteredDrops = drops;

  const gettingStartedSteps = [
    {
      id: 1,
      title: "Create Your First Drop",
      description: "Design an engaging educational challenge",
      icon: Plus,
      completed: currentStep > 1,
      primary: currentStep === 1,
    },
    {
      id: 2,
      title: "Invite Students",
      description: "Share your drop with your classroom",
      icon: Users,
      completed: currentStep > 2,
      primary: currentStep === 2,
    },
    {
      id: 3,
      title: "Monitor Progress",
      description: "Track student engagement and completion",
      icon: Target,
      completed: currentStep > 3,
      primary: currentStep === 3,
    },
    {
      id: 4,
      title: "Celebrate Success",
      description: "Review results and celebrate achievements",
      icon: Trophy,
      completed: currentStep > 4,
      primary: currentStep === 4,
    },
  ];

  const dropIdeas = [
    {
      title: "Math Challenge Quest",
      description: "Interactive problem-solving adventure",
      category: "Math & Logic",
      time: "15-20 min",
      difficulty: "Beginner",
    },
    {
      title: "Code Your First App",
      description: "Build a simple calculator or game",
      category: "Code Creation",
      time: "25-30 min",
      difficulty: "Intermediate",
    },
    {
      title: "Science Discovery Lab",
      description: "Virtual experiments and observations",
      category: "Science & Curiosity",
      time: "20-25 min",
      difficulty: "Beginner",
    },
    {
      title: "Creative Writing Workshop",
      description: "Story prompts and character development",
      category: "Reading & Writing",
      time: "30-35 min",
      difficulty: "All Levels",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-g3ms-purple/5 to-g3ms-green/5">
      {/* Top Navigation */}
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">G3MS</h1>
            </div>

            {/* Tokens Display & Profile */}
            <div className="flex items-center gap-4">
              {/* Tokens Display */}
              <div className="flex items-center gap-2 text-sm">
                <span className="text-blue-500">
                  ${user.tokensNeeded.toLocaleString()} tokens to go • $
                  {user.giftCardValue.toLocaleString()} = Gift card
                </span>
                <div className="flex items-center gap-1">
                  <Coins className="h-4 w-4 text-blue-500" />
                  <span className="font-semibold">${user.tokens}</span>
                </div>
              </div>

              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 p-2"
                  >
                    <div className="text-right text-sm">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-muted-foreground">
                        {user.role} • {user.school}
                      </div>
                    </div>
                    <Avatar className="h-8 w-8 bg-pink-500">
                      <AvatarFallback className="bg-pink-500 text-white text-sm">
                        {user.name.charAt(0).toLowerCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/settings")}>
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/billing")}>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Billing
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => navigate("/login")}
                  >
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
              <h1 className="text-4xl font-bold">Welcome to G3MS Educator!</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              You're about to create your first drop! Let's build an engaging
              learning experience that your students will love.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-g3ms-green font-medium">
              <CheckCircle className="h-4 w-4" />
              <span>Account setup complete</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Success Banner after creating drop */}
        {hasCreatedDrop && currentStep === 2 && (
          <Card className="border-2 border-g3ms-green bg-gradient-to-r from-g3ms-green/10 to-g3ms-blue/10 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-g3ms-green rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-g3ms-green">
                      Drop Created Successfully!
                    </h3>
                    <p className="text-muted-foreground">
                      "{dropTitle}" is ready. Now let's invite your students.
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => setShowInviteStudents(true)}
                  className="bg-g3ms-green hover:bg-g3ms-green/90"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Invite Students
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
                <Rocket className="h-5 w-5 text-g3ms-purple" />
              </div>
              <div>
                <CardTitle className="text-xl">Getting Started</CardTitle>
                <CardDescription>
                  Follow these steps to launch your first drop
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {gettingStartedSteps.map((step, index) => (
                <div key={step.id} className="relative">
                  <Card
                    className={`transition-all duration-200 hover:shadow-md ${
                      step.primary
                        ? "ring-2 ring-g3ms-purple shadow-lg"
                        : "hover:shadow-sm"
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className={`h-8 w-8 rounded-full flex items-center justify-center ${
                            step.completed
                              ? "bg-g3ms-green text-white"
                              : step.primary
                              ? "bg-g3ms-purple text-white"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {step.completed ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <step.icon className="h-4 w-4" />
                          )}
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">
                          Step {step.id}
                        </span>
                      </div>
                      <h3 className="font-semibold mb-2">{step.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {step.description}
                      </p>
                      {step.primary && (
                        <Button
                          onClick={() => {
                            if (step.id === 1) {
                              setShowCreateForm(true);
                            } else if (step.id === 2) {
                              setShowInviteStudents(true);
                            } else if (step.id === 3) {
                              // For step 3, use the most recent drop or first available drop
                              const dropToMonitor = drops[0];
                              if (dropToMonitor) {
                                setSelectedDrop(dropToMonitor);
                                setShowMonitorProgress(true);
                              } else {
                                toast.info("Please create a drop first before monitoring progress.");
                              }
                            } else if (step.id === 4) {
                              // For step 4, use the most recent drop or first available drop
                              const dropToCelebrate = drops[0];
                              if (dropToCelebrate) {
                                setSelectedDrop(dropToCelebrate);
                                setShowCelebrateSuccess(true);
                              } else {
                                toast.info("Please create a drop first before celebrating success.");
                              }
                            }
                          }}
                          className="w-full bg-g3ms-purple hover:bg-g3ms-purple/90"
                          size="sm"
                          disabled={step.id === 2 && !hasCreatedDrop}
                        >
                          {step.id === 1
                            ? "Create Drop"
                            : step.id === 2
                            ? "Invite Students"
                            : "Continue"}
                          <ArrowRight className="h-3 w-3 ml-2" />
                        </Button>
                      )}
                      {step.id === 2 && !hasCreatedDrop && (
                        <p className="text-xs text-muted-foreground mt-2 text-center">
                          Complete step 1 first
                        </p>
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

        {/* My Drops Section */}
        {filteredDrops.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-g3ms-blue/10 rounded-lg flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-g3ms-blue" />
                  </div>
                  <div>
                    <CardTitle>
                      {user.role === "District Leader"
                        ? "All District Drops"
                        : user.role === "School Leader"
                        ? "School Drops"
                        : "My Drops"}
                    </CardTitle>
                    <CardDescription>
                      {user.role === "District Leader"
                        ? `Viewing all drops across ${user.district}`
                        : user.role === "School Leader"
                        ? `Drops from ${user.school}`
                        : "Your created assignments and activities"}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
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
                <div className="space-y-4">
                  {filteredDrops.map((drop) => (
                    <Card
                      key={drop.id}
                      className="border-l-4 border-l-g3ms-blue/30 hover:shadow-md transition-shadow"
                    >
                      {/* Video Preview Image */}
                      {drop.video?.playbackId && (
                        <div className="aspect-video w-full h-32 overflow-hidden rounded-t-lg">
                          <img
                            src={getMuxThumbnailUrl(drop.video.playbackId, 'jpg', { width: 400, height: 225 })}
                            alt={`${drop.title} preview`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                            onError={(e) => {
                              // Fallback to a placeholder if thumbnail fails to load
                              e.currentTarget.src = '/placeholder.svg';
                            }}
                          />
                        </div>
                      )}
                      <CardContent className="p-4">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                          {/* Drop Info */}
                          <div className="lg:col-span-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-lg">
                                  {drop.title}
                                </h3>
                                <Badge
                                  variant={
                                    drop.status === "LIVE"
                                      ? "default"
                                      : drop.status === "ENDED"
                                      ? "secondary"
                                      : "outline"
                                  }
                                  className={
                                    drop.status === "LIVE"
                                      ? "bg-g3ms-green text-white"
                                      : drop.status === "ENDED"
                                      ? "bg-g3ms-blue text-white"
                                      : ""
                                  }
                                >
                                  {drop.status}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="bg-g3ms-purple/10 text-g3ms-purple px-2 py-1 rounded-full text-xs font-medium">
                                  {drop.dropType}
                                </span>
                                <span>
                                  {drop.subject} • {drop.grades?.[0]?.grade?.name || 'N/A'}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Created {new Date(drop.createdAt).toLocaleDateString()} • {drop.schools?.[0]?.school?.name || 'N/A'}
                              </p>
                            </div>
                          </div>

                          {/* Progress Stats - Not available in current API */}
                          <div className="lg:col-span-3">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">
                                  Status
                                </span>
                                <span className="font-medium">
                                  {drop.status}
                                </span>
                              </div>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {drop.isPublished ? 'Published' : 'Draft'}
                                </span>
                              </div>
                            </div>
                          </div>

                           {/* Dates */}
                          <div className="lg:col-span-3">
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                <span>
                                  Created{" "}
                                  {new Date(
                                    drop.createdAt
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                              {drop.scheduledAt && (
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  <span>
                                    Scheduled{" "}
                                    {new Date(
                                      drop.scheduledAt
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="lg:col-span-2">
                            <div className="flex items-center justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleViewDrop(drop)}
                                title="View Drop"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleEditDrop(drop)}
                                title="Edit Drop"
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
                                  <DropdownMenuItem onClick={() => handleViewResults(drop)}>
                                    View Results
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleDuplicateDrop(drop)}>
                                    Duplicate
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleShareDrop(drop)}>
                                    Share
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    className="text-red-600"
                                    onClick={() => handleDeleteDrop(drop)}
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

                {/* Stats Summary */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-g3ms-blue/5 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-g3ms-blue">
                      {filteredDrops.length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Drops
                    </div>
                  </div>
                  <div className="bg-g3ms-green/5 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-g3ms-green">
                      {
                        filteredDrops.filter((d) => d.status === "LIVE")
                          .length
                      }
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Live Drops
                    </div>
                  </div>
                  <div className="bg-g3ms-purple/5 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-g3ms-purple">
                      {
                        filteredDrops.filter((d) => d.isPublished).length
                      }
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Published Drops
                    </div>
                  </div>
                  <div className="bg-g3ms-yellow/5 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-g3ms-yellow">
                      {
                        filteredDrops.filter((d) => d.status === "ENDED").length
                      }
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Completed Drops
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Drop Ideas Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Drop Ideas */}
          <div>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-g3ms-yellow/10 rounded-lg flex items-center justify-center">
                    <Lightbulb className="h-5 w-5 text-g3ms-yellow" />
                  </div>
                  <div>
                    <CardTitle>Drop Ideas to Get You Started</CardTitle>
                    <CardDescription>
                      Popular templates loved by educators
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dropIdeas.map((idea, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold">{idea.title}</h3>
                            <Badge variant="outline" className="text-xs">
                              {idea.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {idea.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <PlayCircle className="h-3 w-3" />
                              {idea.time}
                            </span>
                            <span>{idea.difficulty}</span>
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

          {/* Created Drops List */}
          <div className="space-y-6">
            {/* Tips & Support */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-g3ms-green/10 rounded-lg flex items-center justify-center">
                    <Heart className="h-5 w-5 text-g3ms-green" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Quick Tips</CardTitle>
                    <CardDescription>
                      Make your first drop amazing
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="h-2 w-2 bg-g3ms-purple rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm">
                      Start with a clear learning objective
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <div className="h-2 w-2 bg-g3ms-green rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm">
                      Keep challenges engaging but achievable
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <div className="h-2 w-2 bg-g3ms-yellow rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm">
                      Include interactive elements when possible
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <div className="h-2 w-2 bg-g3ms-blue rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm">
                      Test your drop before sharing with students
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>


            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Your Dashboard Preview
                </CardTitle>
                <CardDescription>
                  What you'll see after creating drops
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total Drops</span>
                    <span className="font-semibold">0</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Active Students
                    </span>
                    <span className="font-semibold">0</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Completions</span>
                    <span className="font-semibold">0</span>
                  </div>
                </div>
                <div className="pt-2">
                  <p className="text-xs text-muted-foreground text-center">
                    These stats will populate as you create drops and students
                    participate!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-g3ms-purple/10 to-g3ms-green/10 border-2 border-dashed border-g3ms-purple/30">
          <CardContent className="p-8 text-center">
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <div className="h-16 w-16 bg-g3ms-purple rounded-full flex items-center justify-center">
                  <Plus className="h-8 w-8 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  Ready to Create Your First Drop?
                </h2>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Transform your lesson into an interactive learning experience
                  that students will remember.
                </p>
              </div>
              <Button
                onClick={() => setShowCreateForm(true)}
                size="lg"
                className="bg-g3ms-purple hover:bg-g3ms-purple/90 px-8"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create My First Drop
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Drop Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-g3ms-purple" />
                    Create Your First Drop
                  </CardTitle>
                  <CardDescription>
                    Let's build something amazing for your students!
                  </CardDescription>
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


      {/* Invite Students Modal */}
      {showInviteStudents && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-g3ms-green" />
                    Invite Students to Your Drop
                  </CardTitle>
                  <CardDescription>
                    Choose how you want students to access your drop
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowInviteStudents(false)}
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <InviteStudentsStep
                dropTitle={dropTitle || "My Amazing Drop"}
                userSchool={user.school} // Pass the user's school
                onComplete={() => {
                  setShowInviteStudents(false);
                  setCurrentStep(3);
                }}
                onBack={() => {
                  setShowInviteStudents(false);
                  setCurrentStep(hasCreatedDrop ? 2 : 1);
                }}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Monitor Progress Modal */}
      {showMonitorProgress && selectedDrop && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-g3ms-blue" />
                    Monitor Drop Progress
                  </CardTitle>
                  <CardDescription>
                    Track student participation and engagement
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMonitorProgress(false)}
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <MonitorProgressStep
                drop={selectedDrop}
                onNext={() => {
                  setShowMonitorProgress(false);
                  setCurrentStep(4);
                  setShowCelebrateSuccess(true);
                }}
                onBack={() => {
                  setShowMonitorProgress(false);
                  setCurrentStep(2);
                }}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Celebrate Success Modal */}
      {showCelebrateSuccess && selectedDrop && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-g3ms-yellow" />
                    Celebrate Success
                  </CardTitle>
                  <CardDescription>
                    Review results and celebrate achievements
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCelebrateSuccess(false)}
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <CelebrateSuccessStep
                drop={selectedDrop}
                onBack={() => {
                  setShowCelebrateSuccess(false);
                  setCurrentStep(3);
                  setShowMonitorProgress(true);
                }}
                onCreateAnother={() => {
                  setShowCelebrateSuccess(false);
                  setCurrentStep(1);
                  setShowCreateForm(true);
                }}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default EducatorDashboard;
