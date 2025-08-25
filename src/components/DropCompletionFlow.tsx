import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, 
  Clock, 
  Play, 
  Video, 
  Mic, 
  Camera,
  Gift,
  Share2,
  Trophy,
  Timer,
  ArrowLeft,
  Users
} from "lucide-react";
import { toast } from "sonner";
import RewardClaimModal from "@/components/RewardClaimModal";

interface DropCompletionFlowProps {
  isUpgraded: boolean;
  onComplete: () => void;
  onBrowseDrops: () => void;
}

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

const mockQuizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "What is the best way to ask AI about how rainbows form?",
    options: [
      "Write my rainbow paragraph for me.",
      "Can you explain how rainbows happen, using simple words for a 2nd grader?",
      "Give me a colorful picture of a rainbow.",
      "Tell me a story with a rainbow and a unicorn."
    ],
    correctAnswer: 1
  },
  {
    id: 2,
    question: "When working with AI, what should you do first?",
    options: [
      "Ask it to do all your homework",
      "Be clear about what you want to learn",
      "Copy everything it says",
      "Ask for the answers only"
    ],
    correctAnswer: 1
  },
  {
    id: 3,
    question: "What makes a good AI prompt?",
    options: [
      "Very short and simple",
      "Specific and clear about your goal",
      "Asking for multiple things at once",
      "Using complicated words"
    ],
    correctAnswer: 1
  },
  {
    id: 4,
    question: "How should you check AI-generated information?",
    options: [
      "Always trust it completely",
      "Never use it at all",
      "Verify important facts with other sources",
      "Only use it for fun"
    ],
    correctAnswer: 2
  },
  {
    id: 5,
    question: "What's the best way to learn with AI?",
    options: [
      "Let it do all the work",
      "Ask questions and think about the answers",
      "Copy its responses word for word",
      "Avoid asking follow-up questions"
    ],
    correctAnswer: 1
  },
  {
    id: 6,
    question: "When AI gives you an answer, what should you do?",
    options: [
      "Use it immediately without reading",
      "Think about whether it makes sense",
      "Share it with everyone right away",
      "Ignore it completely"
    ],
    correctAnswer: 1
  },
  {
    id: 7,
    question: "What's important about AI and creativity?",
    options: [
      "AI replaces all human creativity",
      "AI can help spark ideas, but you add the personal touch",
      "Never use AI for creative projects",
      "AI creativity is always better than human creativity"
    ],
    correctAnswer: 1
  },
  {
    id: 8,
    question: "How should you approach AI responses you don't understand?",
    options: [
      "Pretend you understand",
      "Ask for clarification or simpler explanation",
      "Just move on to something else",
      "Assume it's wrong"
    ],
    correctAnswer: 1
  },
  {
    id: 9,
    question: "What's the best mindset when learning with AI?",
    options: [
      "Be lazy and let AI do everything",
      "Be curious and ask follow-up questions",
      "Be suspicious of everything",
      "Be passive and just accept answers"
    ],
    correctAnswer: 1
  },
  {
    id: 10,
    question: "How can AI best help with problem-solving?",
    options: [
      "By giving you the final answer immediately",
      "By helping you break down the problem into steps",
      "By solving everything for you",
      "By making the problem more complicated"
    ],
    correctAnswer: 1
  }
];

const surpriseRewards = [
  {
    type: "giftcard",
    title: "Amazon eGift Card",
    value: "$25",
    icon: "🎁",
    data: {
      title: "Amazon eGift Card - $25",
      image: "/lovable-uploads/0b9303a1-6f07-4ff4-b2eb-b443246e2d3e.png",
      website: "amazon.com",
      message: "Congratulations on Redeeming Your Gift Card!",
      details: "Your reward is on its way, NO CAP! Please allow 1-48 hours for delivery.",
      contactInfo: "test@gmail.com"
    }
  },
  {
    type: "event",
    title: "Nike Store Event",
    value: "VIP Access",
    icon: "🎟️",
    data: {
      title: "Nike Store VIP Event",
      image: "/lovable-uploads/15e58f96-66d6-4e51-86ea-92c50ff126fb.png",
      message: "You've earned VIP access!",
      details: "Join us for an exclusive Nike event with special discounts and early access to new releases.",
      contactInfo: "Events team will contact you within 24 hours"
    }
  },
  {
    type: "tokens",
    title: "Bonus Tokens",
    value: "500 tokens",
    icon: "💎",
    data: {
      title: "Bonus Token Reward",
      message: "Amazing work!",
      details: "You've earned bonus tokens for completing this drop with excellence.",
      amount: "500"
    }
  },
  {
    type: "giftcard",
    title: "Sephora eGift Card",
    value: "$20",
    icon: "💄",
    data: {
      title: "Sephora eGift Card - $20",
      image: "/lovable-uploads/b48e28eb-6539-4c15-a300-34fc4de09d61.png",
      website: "sephora.com",
      message: "Beauty rewards await!",
      details: "Your Sephora gift card will be delivered soon. Get ready to explore amazing beauty products!",
      contactInfo: "test@gmail.com"
    }
  }
];

export const DropCompletionFlow = ({ isUpgraded, onComplete, onBrowseDrops }: DropCompletionFlowProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isStarted, setIsStarted] = useState(false);
  const [tokensEarned, setTokensEarned] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [answerFeedback, setAnswerFeedback] = useState<{correct: boolean, shown: boolean}[]>([]);
  const [wrongAnswers, setWrongAnswers] = useState<number[]>([]);
  const [showReward, setShowReward] = useState(false);
  const [claimedReward, setClaimedReward] = useState(false);
  const [selectedReward] = useState(surpriseRewards[Math.floor(Math.random() * surpriseRewards.length)]);
  const [showRewardModal, setShowRewardModal] = useState(false);

  const steps = [
    { id: 1, title: "Watch", icon: Play, color: "text-green-500", bgColor: "bg-green-500" },
    { id: 2, title: "Show", icon: Video, color: "text-pink-500", bgColor: "bg-pink-500" },
    { id: 3, title: "Quiz", icon: CheckCircle, color: "text-purple-500", bgColor: "bg-purple-500" },
    { id: 4, title: "Reward", icon: Gift, color: "text-orange-500", bgColor: "bg-orange-500" }
  ];

  const handleStepComplete = (stepId: number, tokens: number = 0) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
      setTokensEarned(prev => prev + tokens);
      if (tokens > 0) {
        toast.success(`+${tokens} tokens earned!`);
      }
    }
    
    if (stepId < 4) {
      setCurrentStep(stepId + 1);
    }
  };

  const handleQuizAnswer = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
    
    const isCorrect = answerIndex === mockQuizQuestions[currentQuestionIndex].correctAnswer;
    
    // Update feedback for this question
    const newFeedback = [...answerFeedback];
    newFeedback[currentQuestionIndex] = { correct: isCorrect, shown: true };
    setAnswerFeedback(newFeedback);
    
    if (isCorrect) {
      setQuizScore(prev => prev + 1);
      setTokensEarned(prev => prev + 10); // 10 tokens per correct answer
      toast.success("Correct! +10 tokens!");
    } else {
      setWrongAnswers(prev => [...prev, currentQuestionIndex]);
      toast.error("Incorrect. Keep going!");
    }
    
    setTimeout(() => {
      if (currentQuestionIndex < 9) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        // Quiz complete
        const finalScore = quizScore + (isCorrect ? 1 : 0);
        const percentage = (finalScore / 10) * 100;
        const bonusTokens = Math.floor(percentage / 10) * 5; // Bonus tokens based on performance
        setTokensEarned(prev => prev + bonusTokens);
        handleStepComplete(3, bonusTokens);
        toast.success(`Quiz complete! ${percentage}% score = +${bonusTokens} bonus tokens!`);
      }
    }, 2000);
  };

  const handleClaimReward = () => {
    setClaimedReward(true);
    setShowReward(true);
    setShowRewardModal(true);
    handleStepComplete(4, 100); // 100 bonus tokens for completion
  };

  const handleRewardModalClose = () => {
    setShowRewardModal(false);
    setTimeout(() => {
      onComplete();
    }, 500);
  };

  const handleTalkToAyo = () => {
    toast.success("Opening Ayo chat to review your mistakes!");
    setTokensEarned(prev => prev + 20);
    // Navigate to Ayo chat or open modal
  };

  const handleShare = () => {
    setTokensEarned(prev => prev + 50);
    toast.success("+50 bonus tokens for sharing!");
  };

  if (!isStarted) {
    return (
      <Card className="mb-6 w-full">
        <div className="p-6">
          {/* Header with timer */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-full">
                <Timer className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold">🏢 Brand Drop Ends in 17m</h2>
                <p className="text-muted-foreground">Complete 4 steps to earn rewards</p>
              </div>
            </div>
            {isUpgraded && (
              <Badge variant="secondary" className="bg-g3ms-yellow/20 text-g3ms-purple border-g3ms-yellow/30">
                Premium
              </Badge>
            )}
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-lg border">
              <h3 className="font-semibold text-lg mb-2">The Drop</h3>
              <p className="text-muted-foreground mb-4">Show Your Thinking</p>
              <p className="text-sm mb-4">Explain how you'd approach this problem even if you're not sure of the answer. What do you notice? What did you already know that might help? Walk us through your thinking, step by step.</p>

              <div className="flex gap-3 mb-4">
                {steps.map((step) => (
                  <div key={step.id} className="text-center p-3 bg-background/50 rounded-lg flex-1">
                    <div className={`w-8 h-8 rounded-full ${step.bgColor} mx-auto mb-2 flex items-center justify-center`}>
                      <step.icon className="h-4 w-4 text-white" />
                    </div>
                    <p className="text-xs font-medium">{step.title}</p>
                  </div>
                ))}
              </div>

              <Button onClick={() => setIsStarted(true)} size="lg" className="w-full">
                <Play className="h-4 w-4 mr-2" />
                Start The Drop
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  if (showReward && claimedReward) {
    return (
      <Card className="mb-6 w-full">
        <div className="p-6 text-center">
          <div className="mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl">
              {selectedReward.icon}
            </div>
            <h2 className="text-2xl font-bold mb-2">Congratulations on</h2>
            <h3 className="text-xl font-semibold mb-2">Redeeming Your Gift Card!</h3>
            <p className="text-muted-foreground mb-4">
              Your reward is on its way, NO CAP!<br/>
              Please allow 1-48 hours for delivery. We<br/>
              appreciate your patience and are excited<br/>
              for you to enjoy your gift card soon!
            </p>
            <div className="bg-gray-100 rounded-lg p-4 mb-4">
              <p className="font-semibold text-purple-500 mb-2">Your eGift card will be sent to:</p>
              <p className="text-sm">(773) 354 - 9066</p>
              <p className="text-sm">test@gmail.com</p>
            </div>
          </div>
          <Button onClick={onBrowseDrops} size="lg" className="w-full bg-purple-500 hover:bg-purple-600">
            Done
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="mb-6 w-full">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="sm" onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : setIsStarted(false)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="text-center">
            <div className="p-2 bg-blue-500/10 rounded-full inline-block mb-2">
              <Timer className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-sm font-medium text-blue-500">Brand Drop Ends in 17m</p>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-lg">💎</span>
            <span className="font-bold text-blue-500">{tokensEarned}</span>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-2">The Drop</h2>
        
        {/* Step Progress */}
        <div className="flex gap-3 mb-6">
          {steps.map((step) => (
            <div key={step.id} className="flex-1 text-center">
              <div className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center ${
                completedSteps.includes(step.id) 
                  ? 'bg-green-500' 
                  : step.id === currentStep 
                    ? step.bgColor 
                    : 'bg-gray-300'
              }`}>
                {completedSteps.includes(step.id) ? (
                  <CheckCircle className="h-5 w-5 text-white" />
                ) : (
                  <step.icon className="h-5 w-5 text-white" />
                )}
              </div>
              <p className="text-xs font-medium">{step.title}</p>
            </div>
          ))}
        </div>

        {/* Step Content */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Watch the Content</h3>
            <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
              <Play className="h-16 w-16 text-white" />
            </div>
            <Button onClick={() => handleStepComplete(1, 25)} size="lg" className="w-full">
              Continue to Show Your Thinking
            </Button>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Show Your Thinking</h3>
            <div className="bg-gray-900 text-white p-6 rounded-lg text-center">
              <h4 className="text-lg font-semibold mb-4">Use video, audio, or a photo to share your thinking whatever works best for you.</h4>
              <div className="flex justify-center gap-6">
                <button className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                  <Video className="h-8 w-8 text-white" />
                </button>
                <button className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
                  <Mic className="h-8 w-8 text-white" />
                </button>
                <button className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center">
                  <Camera className="h-8 w-8 text-white" />
                </button>
              </div>
            </div>
            <Button onClick={() => handleStepComplete(2, 30)} size="lg" className="w-full">
              Continue to Quiz
            </Button>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            {currentQuestionIndex < 10 ? (
              <>
                <h3 className="text-lg font-semibold">Take the Quiz & Stack G3MS!</h3>
                <div className="space-y-3">
                  <p className="font-medium">{mockQuizQuestions[currentQuestionIndex].question}</p>
                  {mockQuizQuestions[currentQuestionIndex].options.map((option, index) => {
                    const isSelected = selectedAnswers[currentQuestionIndex] === index;
                    const feedback = answerFeedback[currentQuestionIndex];
                    const showFeedback = feedback?.shown && isSelected;
                    
                    return (
                      <button
                        key={index}
                        onClick={() => handleQuizAnswer(index)}
                        disabled={feedback?.shown}
                        className={`w-full p-3 text-left rounded-lg border transition-colors ${
                          showFeedback
                            ? feedback.correct
                              ? 'border-green-500 bg-green-50 text-green-700'
                              : 'border-red-500 bg-red-50 text-red-700'
                            : 'hover:bg-gray-50'
                        } ${feedback?.shown ? 'cursor-not-allowed' : ''}`}
                      >
                        <div className="flex items-center justify-between">
                          <span>
                            <span className="font-medium mr-2">{String.fromCharCode(97 + index)}.</span>
                            {option}
                          </span>
                          {showFeedback && (
                            <span className="ml-2">
                              {feedback.correct ? '✅' : '❌'}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Question {currentQuestionIndex + 1} of 10
                </p>
              </>
            ) : (
              <div className="text-center space-y-4">
                <h3 className="text-lg font-semibold">Take the Quiz & Stack G3MS!</h3>
                <div className="text-6xl font-bold text-purple-500 mb-4">
                  {Math.floor((quizScore / 10) * 100)}%
                </div>
                <p className="text-muted-foreground">{quizScore} of 10 correct</p>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="text-2xl">💎</span>
                  <span className="text-2xl font-bold text-blue-500">{quizScore * 10}</span>
                </div>
                
                {wrongAnswers.length > 0 && (
                  <div className="p-4 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-lg mb-4">
                    <h4 className="font-semibold mb-2">💬 Need Some Help?</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      You got {wrongAnswers.length} question{wrongAnswers.length > 1 ? 's' : ''} wrong. 
                      Chat with Ayo to review your mistakes and earn bonus tokens!
                    </p>
                    <Button 
                      onClick={handleTalkToAyo} 
                      size="sm" 
                      className="w-full bg-pink-500 hover:bg-pink-600"
                    >
                      💬 Talk to Ayo (+20 bonus tokens)
                    </Button>
                  </div>
                )}
                
                <Button onClick={() => setCurrentStep(4)} size="lg" className="w-full bg-purple-500 hover:bg-purple-600">
                  Claim Rewards
                </Button>
              </div>
            )}
          </div>
        )}

        {currentStep === 4 && !claimedReward && (
          <div className="space-y-4 text-center">
            <h3 className="text-lg font-semibold">🎁 Surprise Reward!</h3>
            <div className="p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg">
              <Gift className="h-16 w-16 mx-auto mb-4 text-purple-500" />
              <p className="font-semibold mb-2">You've earned a surprise reward!</p>
              <p className="text-sm text-muted-foreground mb-4">
                Could be a gift card, event tickets, bonus tokens, or achievement badge
              </p>
            </div>
            <Button onClick={handleClaimReward} size="lg" className="w-full bg-g3ms-purple hover:bg-g3ms-purple/90 text-white">
              <Gift className="h-4 w-4 mr-2" />
              Claim Your {selectedReward.title}
            </Button>
            <div className="space-y-2">
              <Button variant="outline" className="w-full" onClick={handleShare}>
                <Users className="h-4 w-4 mr-2" />
                🔥 Bonus if Friend Joins 🔥
              </Button>
              <Button variant="outline" size="sm" className="w-full" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                👀 See how others are responding
              </Button>
            </div>
          </div>
        )}
        </div>
        
        {/* Reward Claim Modal */}
        <RewardClaimModal
          isOpen={showRewardModal}
          onClose={handleRewardModalClose}
          rewardType={selectedReward.type as 'giftcard' | 'event' | 'tokens'}
          rewardData={selectedReward.data}
        />
      </Card>
    );
  };