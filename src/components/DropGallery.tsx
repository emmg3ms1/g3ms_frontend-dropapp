import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Lock, CheckCircle, Star, Crown, Eye, Users, Trophy, Gift } from "lucide-react";

interface Drop {
  id: string;
  title: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  isCompleted: boolean;
  isLocked: boolean;
  progressStars: number;
  description: string;
  image: string;
  status: "Live" | "Done" | "Upcoming";
  completedCount: number;
  totalParticipants: number;
  completionPercentage: number;
  tokensEarned: number;
  actualReward?: string;
  requiresRegistration?: boolean;
}

interface DropGalleryProps {
  isUpgraded: boolean;
  onDropSelect: (dropId: string) => void;
  onUpgrade: () => void;
}

export const DropGallery = ({ isUpgraded, onDropSelect, onUpgrade }: DropGalleryProps) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const mockDrops: Drop[] = [
    {
      id: "1",
      title: "Algebra Basics: Solving for X",
      category: "Math",
      difficulty: "Beginner",
      duration: "15 min",
      isCompleted: false,
      isLocked: false,
      progressStars: 0,
      description: "Master the fundamentals of algebraic equations through interactive problem-solving.",
      image: "/lovable-uploads/4128de70-8e18-4fe8-b052-8183fa64b359.png",
      status: "Live",
      completedCount: 1247,
      totalParticipants: 1680,
      completionPercentage: 74,
      tokensEarned: 50
    },
    {
      id: "2", 
      title: "Geometry in Real Life",
      category: "Math",
      difficulty: "Intermediate",
      duration: "20 min",
      isCompleted: false,
      isLocked: !isUpgraded,
      progressStars: 0,
      description: "Discover how geometric principles apply to architecture, art, and everyday objects.",
      image: "/lovable-uploads/47b5fd56-1608-44a1-9bd0-7602a09520e9.png",
      status: "Live",
      completedCount: 892,
      totalParticipants: 1200,
      completionPercentage: 74,
      tokensEarned: 75
    },
    {
      id: "3",
      title: "Logic Puzzles & Critical Thinking",
      category: "Logic",
      difficulty: "Advanced", 
      duration: "12 min",
      isCompleted: true,
      isLocked: false,
      progressStars: 3,
      description: "Challenge your mind with brain teasers and logical reasoning problems.",
      image: "/lovable-uploads/57d57095-fa71-4fa2-a950-ec47039d434a.png",
      status: "Done",
      completedCount: 534,
      totalParticipants: 890,
      completionPercentage: 60,
      tokensEarned: 100,
      actualReward: "$50 Amazon Gift Card"
    },
    {
      id: "4",
      title: "JavaScript Fundamentals",
      category: "Coding",
      difficulty: "Beginner",
      duration: "18 min",
      isCompleted: false,
      isLocked: false,
      progressStars: 0,
      description: "Learn the basics of JavaScript programming through hands-on coding exercises.",
      image: "/lovable-uploads/4a30b6ae-bf46-45a9-b040-0ea3498c911e.png",
      status: "Live",
      completedCount: 645,
      totalParticipants: 980,
      completionPercentage: 66,
      tokensEarned: 80
    },
    {
      id: "5",
      title: "Python for Beginners",
      category: "Coding",
      difficulty: "Beginner",
      duration: "22 min",
      isCompleted: false,
      isLocked: !isUpgraded,
      progressStars: 0,
      description: "Start your coding journey with Python through interactive lessons and projects.",
      image: "/lovable-uploads/57d57095-fa71-4fa2-a950-ec47039d434a.png",
      status: "Live",
      completedCount: 423,
      totalParticipants: 720,
      completionPercentage: 59,
      tokensEarned: 90
    },
    {
      id: "6",
      title: "Creative Writing Workshop",
      category: "English",
      difficulty: "Intermediate",
      duration: "16 min",
      isCompleted: false,
      isLocked: false,
      progressStars: 0,
      description: "Enhance your writing skills through creative exercises and storytelling techniques.",
      image: "/lovable-uploads/47b5fd56-1608-44a1-9bd0-7602a09520e9.png",
      status: "Live",
      completedCount: 312,
      totalParticipants: 550,
      completionPercentage: 57,
      tokensEarned: 70
    },
    {
      id: "7",
      title: "Mathematical Modeling Workshop",
      category: "Math",
      difficulty: "Advanced",
      duration: "25 min", 
      isCompleted: false,
      isLocked: !isUpgraded,
      progressStars: 0,
      description: "Apply mathematical concepts to solve real-world problems through modeling.",
      image: "/lovable-uploads/4a30b6ae-bf46-45a9-b040-0ea3498c911e.png",
      status: "Upcoming",
      completedCount: 0,
      totalParticipants: 0,
      completionPercentage: 0,
      tokensEarned: 120,
      requiresRegistration: true
    },
    {
      id: "8",
      title: "Introduction to Physics",
      category: "Science",
      difficulty: "Intermediate",
      duration: "20 min",
      isCompleted: false,
      isLocked: false,
      progressStars: 0,
      description: "Explore fundamental physics concepts through interactive experiments.",
      image: "/lovable-uploads/4a30b6ae-bf46-45a9-b040-0ea3498c911e.png",
      status: "Live",
      completedCount: 234,
      totalParticipants: 450,
      completionPercentage: 52,
      tokensEarned: 85
    },
    {
      id: "9",
      title: "SAT Math Prep",
      category: "Test Prep",
      difficulty: "Advanced",
      duration: "30 min",
      isCompleted: false,
      isLocked: !isUpgraded,
      progressStars: 0,
      description: "Master SAT math questions with proven strategies and practice tests.",
      image: "/lovable-uploads/57d57095-fa71-4fa2-a950-ec47039d434a.png",
      status: "Live",
      completedCount: 189,
      totalParticipants: 340,
      completionPercentage: 56,
      tokensEarned: 100
    },
    {
      id: "10",
      title: "Digital Art Basics",
      category: "Arts",
      difficulty: "Beginner",
      duration: "25 min",
      isCompleted: false,
      isLocked: false,
      progressStars: 0,
      description: "Learn digital art fundamentals and create your first masterpiece.",
      image: "/lovable-uploads/47b5fd56-1608-44a1-9bd0-7602a09520e9.png",
      status: "Live",
      completedCount: 145,
      totalParticipants: 280,
      completionPercentage: 52,
      tokensEarned: 75
    }
  ];

  const categories = [
    "all",
    "🔢 Math & Logic",
    "💻 Code Creation", 
    "📖 Reading & Writing",
    "💡 Science & Curiosity",
    "🧠 Test Prep",
    "🎭 Arts & Creativity",
    "📚 Social Studies & Civics",
    "🌱 Life & Career",
    "💬 Communication Skills",
    "🧮 Financial Literacy",
    "🧰 Career & Workforce Skills",
    "❤️ Mental Health & Wellness",
    "👥 Social-Emotional Learning",
    "🌍 Global Citizenship"
  ];

  const filteredDrops = mockDrops.filter(drop => {
    const matchesSearch = drop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         drop.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Handle category matching with both old and new category formats
    let matchesCategory = selectedCategory === "all";
    if (!matchesCategory) {
      if (selectedCategory === "🔢 Math & Logic") {
        matchesCategory = drop.category === "Math" || drop.category === "Logic";
      } else if (selectedCategory === "💻 Code Creation") {
        matchesCategory = drop.category === "Coding";
      } else if (selectedCategory === "📖 Reading & Writing") {
        matchesCategory = drop.category === "English";
      } else if (selectedCategory === "💡 Science & Curiosity") {
        matchesCategory = drop.category === "Science";
      } else if (selectedCategory === "🧠 Test Prep") {
        matchesCategory = drop.category === "Test Prep";
      } else if (selectedCategory === "🎭 Arts & Creativity") {
        matchesCategory = drop.category === "Arts";
      } else {
        // For categories without drops, show a default "Math" drop so section doesn't disappear
        matchesCategory = drop.category === "Math";
      }
    }
    
    return matchesSearch && matchesCategory;
  });

  // Ensure we always have at least one drop to show (prevent empty section)
  const displayDrops = filteredDrops.length > 0 ? filteredDrops : mockDrops.slice(0, 1);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-50 text-green-700 border-green-200";
      case "Intermediate": return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "Advanced": return "bg-red-50 text-red-700 border-red-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };


  // Handle category selection change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  // Swipe functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartPos({ x: e.clientX, y: e.clientY });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const x = e.clientX - startPos.x;
    const y = e.clientY - startPos.y;
    setDragOffset({ x, y });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const x = e.touches[0].clientX - startPos.x;
    const y = e.touches[0].clientY - startPos.y;
    setDragOffset({ x, y });
  };

  const handleSwipeEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const threshold = 100;
    if (Math.abs(dragOffset.x) > threshold) {
      if (dragOffset.x > 0) {
        // Swipe right - skip/next
        handleNextCard();
      } else {
        // Swipe left - skip/next  
        handleNextCard();
      }
    }
    setDragOffset({ x: 0, y: 0 });
  };

  const handleNextCard = () => {
    if (currentCardIndex < displayDrops.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      setCurrentCardIndex(0); // Loop back to first card
    }
  };

  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    } else {
      setCurrentCardIndex(displayDrops.length - 1); // Loop to last card
    }
  };

  const currentDrop = displayDrops[currentCardIndex];
  if (!currentDrop) return null;

  const shouldBeLocked = currentDrop.isLocked || (currentDrop.status === "Live" && currentDrop.isCompleted && !isUpgraded);
  
  return (
    <Card className="mb-6">
      <div className="p-4 sm:p-6">
        <div className="flex items-start gap-3 mb-4 sm:mb-6">
          <div className="p-2 bg-primary/10 rounded-full shrink-0">
            <Search className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg sm:text-xl font-bold">📦 Drops Gallery</h2>
            <p className="text-muted-foreground text-sm sm:text-base">Swipe through drops. Win surprise tokens, gift cards, and real-life rewards.</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search drops..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Card Stack Container */}
        <div className="relative h-[600px] md:h-[500px] w-full max-w-md mx-auto">
          {/* Progress indicator */}
          <div className="absolute top-0 left-0 right-0 flex gap-1 z-20 mb-4">
            {displayDrops.map((_, index) => (
              <div
                key={index}
                className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                  index === currentCardIndex ? 'bg-g3ms-purple' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {/* Background cards (next card preview) */}
          {displayDrops.slice(currentCardIndex + 1, currentCardIndex + 3).map((drop, index) => (
            <div
              key={drop.id}
              className={`absolute inset-0 top-8 transition-all duration-300 ${
                index === 0 ? 'scale-95 z-10' : 'scale-90 z-0'
              }`}
              style={{
                transform: `scale(${0.95 - index * 0.05}) translateY(${10 + index * 10}px)`,
                opacity: 0.5 - index * 0.2
              }}
            >
              <Card className="h-full w-full border border-gray-200 bg-white shadow-lg" />
            </div>
          ))}

          {/* Current card */}
          <div
            ref={cardRef}
            className="absolute inset-0 top-8 z-30 cursor-grab active:cursor-grabbing"
            style={{
              transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${dragOffset.x * 0.1}deg)`,
              transition: isDragging ? 'none' : 'transform 0.3s ease-out'
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleSwipeEnd}
            onMouseLeave={handleSwipeEnd}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleSwipeEnd}
          >
            <Card className="h-full w-full overflow-hidden border border-gray-200 bg-white shadow-xl hover:shadow-2xl transition-shadow duration-300">
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-10"
                style={{ backgroundImage: `url(${currentDrop.image})` }}
              />
              
              <div className="relative h-full p-6 flex flex-col">
                {/* Header with title and duration */}
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-bold text-xl text-gray-900 flex-1 pr-4 leading-tight">{currentDrop.title}</h3>
                  <div className="flex items-center gap-1 text-gray-500 shrink-0">
                    <span className="text-sm font-medium">{currentDrop.duration}</span>
                  </div>
                </div>

                {/* Status badges */}
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <Badge className={`${getDifficultyColor(currentDrop.difficulty)} shadow-sm`}>
                    {currentDrop.difficulty}
                  </Badge>
                  {currentDrop.status === "Live" && (
                    <Badge className="bg-g3ms-green text-white">
                      • Live
                    </Badge>
                  )}
                  {currentDrop.status === "Done" && (
                    <Badge className="bg-gray-500 text-white">
                      Done
                    </Badge>
                  )}
                  {currentDrop.actualReward && (
                    <Badge className="bg-g3ms-yellow/10 text-g3ms-yellow border border-g3ms-yellow/20">
                      <Gift className="h-3 w-3 mr-1" />
                      Reward
                    </Badge>
                  )}
                </div>

                {/* Description */}
                <p className="text-gray-600 mb-6 leading-relaxed flex-1">{currentDrop.description}</p>

                {/* Stats section */}
                {currentDrop.totalParticipants > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <Users className="h-4 w-4 shrink-0" />
                      <span>{currentDrop.completedCount.toLocaleString()} completed</span>
                      <span className="ml-auto font-semibold">{currentDrop.completionPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div 
                        className="bg-g3ms-purple h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${currentDrop.completionPercentage}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Rewards section */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 text-sm mb-2">
                    <Trophy className="h-4 w-4 text-g3ms-yellow shrink-0" />
                    <span className="font-semibold text-g3ms-yellow">{currentDrop.tokensEarned} G3MS tokens</span>
                  </div>
                  {currentDrop.actualReward ? (
                    <p className="text-sm text-gray-600">Reward: {currentDrop.actualReward}</p>
                  ) : (
                    <p className="text-sm text-gray-500">+ Surprise Reward when completed</p>
                  )}
                </div>

                {/* Action buttons */}
                <div className="mt-auto space-y-3">
                  {shouldBeLocked ? (
                    <Button 
                      onClick={onUpgrade}
                      variant="outline" 
                      className="w-full h-12 border-2 border-g3ms-purple text-g3ms-purple hover:bg-g3ms-purple hover:text-white font-semibold rounded-lg transition-all duration-200"
                    >
                      <Crown className="h-4 w-4 mr-2 shrink-0" />
                      Upgrade to Unlock
                    </Button>
                  ) : currentDrop.status === "Done" ? (
                    <Button 
                      onClick={() => onDropSelect(currentDrop.id)}
                      className="w-full h-12 bg-gray-900 text-white hover:bg-gray-800 font-semibold rounded-lg transition-all duration-200"
                    >
                      <Eye className="h-4 w-4 mr-2 shrink-0" />
                      View Progress
                    </Button>
                  ) : currentDrop.requiresRegistration ? (
                    <Button 
                      onClick={() => onDropSelect(currentDrop.id)}
                      variant="outline"
                      className="w-full h-12 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold rounded-lg transition-all duration-200"
                    >
                      + Register for Drop
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => onDropSelect(currentDrop.id)}
                      className="w-full h-12 bg-g3ms-green text-white hover:bg-g3ms-green/90 font-semibold rounded-lg transition-all duration-200"
                    >
                      Complete Drop
                    </Button>
                  )}
                  
                  {/* Navigation buttons */}
                  <div className="flex gap-3">
                    <Button 
                      onClick={handlePrevCard}
                      variant="outline"
                      className="flex-1 h-10"
                    >
                      Previous
                    </Button>
                    <Button 
                      onClick={handleNextCard}
                      variant="outline"
                      className="flex-1 h-10"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Swipe instructions */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            👆 Tap and swipe cards or use navigation buttons
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {currentCardIndex + 1} of {displayDrops.length} drops
          </p>
        </div>
      </div>
    </Card>
  );
};