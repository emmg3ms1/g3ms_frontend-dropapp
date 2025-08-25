import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, Target, MessageCircle, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";

interface LearningMapCardProps {
  strengths: string[];
  gaps: string[];
  ayoActivity: { count: number; period: string };
  suggestions: { skill: string; action: string }[];
}

export const LearningMapCard = ({
  strengths,
  gaps,
  ayoActivity,
  suggestions
}: LearningMapCardProps) => {
  const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const suggestionRef = useRef<HTMLDivElement>(null);

  // Create all suggestion items (Try Drop + Ask Ayo items)
  const allSuggestions = [
    // Try Drop suggestions
    ...suggestions.map((suggestion, index) => ({
      type: 'tryDrop' as const,
      skill: suggestion.skill,
      action: suggestion.action,
      id: `try-${index}`
    })),
    // Ask Ayo suggestions
    {
      type: 'askAyo' as const,
      skill: 'Fractions',
      action: 'Get personalized reteaching videos and practice quizzes from Ayo.',
      id: 'ayo-1'
    },
    {
      type: 'askAyo' as const,
      skill: 'AI workforce skills',
      action: 'Ayo can guide you through coding games and AI tools.',
      id: 'ayo-2'
    }
  ];

  // Handle swipe gestures
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
    setDragOffset({
      x: e.clientX - startPos.x,
      y: e.clientY - startPos.y
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    setDragOffset({
      x: e.touches[0].clientX - startPos.x,
      y: e.touches[0].clientY - startPos.y
    });
  };

  const handleSwipeEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const swipeThreshold = 50;
    if (Math.abs(dragOffset.x) > swipeThreshold) {
      if (dragOffset.x > 0) {
        // Swipe right - previous suggestion
        handlePrevSuggestion();
      } else {
        // Swipe left - next suggestion
        handleNextSuggestion();
      }
    }
    
    setDragOffset({ x: 0, y: 0 });
  };

  const handleNextSuggestion = () => {
    if (currentSuggestionIndex < allSuggestions.length - 1) {
      setCurrentSuggestionIndex(currentSuggestionIndex + 1);
    } else {
      setCurrentSuggestionIndex(0); // Loop to first
    }
  };

  const handlePrevSuggestion = () => {
    if (currentSuggestionIndex > 0) {
      setCurrentSuggestionIndex(currentSuggestionIndex - 1);
    } else {
      setCurrentSuggestionIndex(allSuggestions.length - 1); // Loop to last
    }
  };

  const currentSuggestion = allSuggestions[currentSuggestionIndex];
  if (!currentSuggestion) return null;
  return (
    <Card className="mb-6">
      <div className="p-4 sm:p-6">
        <div className="flex items-start gap-3 mb-4 sm:mb-6">
          <div className="p-2 bg-primary/10 rounded-full shrink-0">
            <Brain className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg sm:text-xl font-bold">📚 My Learning Map</h2>
            <p className="text-muted-foreground text-sm sm:text-base">Your personalized learning insights</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Strengths */}
          <div className="bg-green-50/50 p-4 rounded-lg border border-green-200">
            <h3 className="font-semibold text-green-600 mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Strengths
            </h3>
            <div className="space-y-2">
              {strengths.map((strength, index) => (
                <Badge key={index} variant="secondary" className="bg-green-100 text-green-800 border-green-300 w-full justify-start">
                  ✨ {strength}
                </Badge>
              ))}
            </div>
          </div>

          {/* Areas to Improve */}
          <div className="bg-amber-50/50 p-4 rounded-lg border border-amber-200">
            <h3 className="font-semibold text-amber-600 mb-3 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Work On
            </h3>
            <div className="space-y-2">
              {gaps.map((gap, index) => (
                <Badge key={index} variant="outline" className="border-amber-300 text-amber-800 bg-amber-50 w-full justify-start">
                  🎯 {gap}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Swipeable Suggestions */}
        {allSuggestions.length > 0 && (
          <div className="mt-4 sm:mt-6 p-4 sm:p-6 bg-gradient-to-br from-g3ms-purple/5 via-g3ms-green/5 to-g3ms-blue/5 rounded-xl border border-g3ms-purple/20">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="font-semibold text-sm sm:text-base lg:text-lg">💡 Personalized Suggestions</h3>
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {currentSuggestionIndex + 1} of {allSuggestions.length}
                </span>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handlePrevSuggestion}
                    className="h-6 w-6 p-0 hover:bg-gray-100"
                  >
                    <ChevronLeft className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleNextSuggestion}
                    className="h-6 w-6 p-0 hover:bg-gray-100"
                  >
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Progress dots */}
            <div className="flex justify-center gap-1 mb-4">
              {allSuggestions.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentSuggestionIndex ? 'bg-g3ms-purple' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {/* Swipeable suggestion container */}
            <div 
              ref={suggestionRef}
              className="relative overflow-hidden cursor-grab active:cursor-grabbing touch-manipulation"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleSwipeEnd}
              onMouseLeave={handleSwipeEnd}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleSwipeEnd}
            >
              <div 
                className="transition-transform duration-300 ease-out"
                style={{
                  transform: isDragging 
                    ? `translateX(${dragOffset.x}px)` 
                    : 'translateX(0px)'
                }}
              >
                <div className="p-3 sm:p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
                  <div className="text-xs sm:text-sm mb-3 leading-relaxed">
                    {currentSuggestion.type === 'tryDrop' ? (
                      <>
                        Want to level up <strong className="text-g3ms-purple">{currentSuggestion.skill}</strong>? {currentSuggestion.action}
                      </>
                    ) : (
                      <>
                        {currentSuggestion.skill === 'Fractions' ? 'Struggling with' : 'Ready to build'} <strong className="text-g3ms-purple">{currentSuggestion.skill}</strong>? {currentSuggestion.action}
                      </>
                    )}
                  </div>
                  <Button 
                    size="sm" 
                    variant={currentSuggestion.type === 'tryDrop' ? 'outline' : 'default'}
                    className={currentSuggestion.type === 'tryDrop' 
                      ? "w-full border-g3ms-purple text-g3ms-purple hover:bg-g3ms-purple hover:text-white h-9 text-xs sm:text-sm touch-manipulation"
                      : "w-full bg-g3ms-purple text-white hover:bg-g3ms-purple/90 rounded-full h-9 text-xs sm:text-sm touch-manipulation"
                    }
                    onClick={() => currentSuggestion.type === 'askAyo' ? window.location.href = '/ayo' : undefined}
                  >
                    {currentSuggestion.type === 'tryDrop' ? 'Try Drop' : 'Ask Ayo'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};