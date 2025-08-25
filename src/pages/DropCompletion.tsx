import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from '@/components/ui/drawer';
import { ArrowLeft, Play, Video, Mic, Camera, Gift, Share2, Clock, Diamond, ChevronLeft, ChevronRight, Star, Trophy, Users, TrendingUp, Zap, X } from 'lucide-react';
import { UserProfile } from '@/components/UserProfile';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

// Temporary bypass for testing - remove in production
const BYPASS_AUTH = true;

type DropStep = 'watch' | 'respond' | 'quiz' | 'results' | 'reward' | 'no-drops';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface DropData {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  timeLimit: string;
  quiz: QuizQuestion[];
  rewards: {
    baseTokens: number;
    bonusTokens: number;
    prizes: string[];
  };
}

// Mock drop data - replace with API call
const mockDropData: DropData = {
  id: '1',
  title: 'The Drop',
  description: 'Where every Drop is a surprise and every win counts—gift cards, merch, or real world experiences from brands you love.',
  videoUrl: '/videos/ai-drop-1.mp4',
  timeLimit: '17m',
  quiz: [
    {
      id: '1',
      question: 'What is the best way to ask AI about how rainbows form?',
      options: [
        'Write my rainbow paragraph for me.',
        'Can you explain how rainbows happen, using simple words for a 2nd grader?',
        'Give me a colorful picture of a rainbow.',
        'Tell me a story with a rainbow and a unicorn.'
      ],
      correctAnswer: 1
    },
    {
      id: '2',
      question: 'When working with AI, what should you always do first?',
      options: [
        'Ask for the answer directly',
        'Be specific about what you need',
        'Request multiple examples',
        'Ask for images only'
      ],
      correctAnswer: 1
    }
  ],
  rewards: {
    baseTokens: 50,
    bonusTokens: 20,
    prizes: ['Amazon Gift Card', 'G3MS Merch', 'Bonus Tokens', 'Event Tickets']
  }
};

export default function DropCompletion() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const location = useLocation();
  
  // Mock user for testing when bypassing auth
  const displayUser = BYPASS_AUTH && !user ? { name: 'Test User', email: 'test@example.com' } : user;
  
  // Determine current state based on route
  const isLiveDrop = location.pathname.startsWith('/drops/live/');
  const dropCompleted = id === 'completed';
  
  // State variables
  const [dropFullyCompleted, setDropFullyCompleted] = useState(dropCompleted);
  const [currentStep, setCurrentStep] = useState<DropStep>(
    dropCompleted || dropFullyCompleted ? 'results' : 'watch'
  );
  const [timeUntilNextDrop, setTimeUntilNextDrop] = useState('42m 13s');
  const [videoWatched, setVideoWatched] = useState(false);
  const [studentResponse, setStudentResponse] = useState<File | null>(null);
  const [responseType, setResponseType] = useState<'video' | 'audio' | 'image' | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [score, setScore] = useState(0);
  const [tokensEarned, setTokensEarned] = useState(dropCompleted ? 150 : 0);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [selectedReward, setSelectedReward] = useState<string | null>(null);
  const [sharedVideo, setSharedVideo] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [socialVideo, setSocialVideo] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [showSuccessDrawer, setShowSuccessDrawer] = useState(false);
  const [showFailureDrawer, setShowFailureDrawer] = useState(false);
  const [questionTokens, setQuestionTokens] = useState(0);
  const [rewardClaimed, setRewardClaimed] = useState(false);

  const dropData = mockDropData; // Replace with actual API call
  
  // Countdown timer for next drop
  useEffect(() => {
    const interval = setInterval(() => {
      // Mock countdown logic - showing less than 1 hour
      const now = new Date();
      const minutes = String(Math.floor(Math.random() * 42) + 15).padStart(2, '0'); // 15-56 minutes
      const seconds = String(Math.floor(Math.random() * 60)).padStart(2, '0');
      setTimeUntilNextDrop(`${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getStepNumber = (step: DropStep): number => {
    const steps = { watch: 1, respond: 2, quiz: 3, results: 4, reward: 4, 'no-drops': 0 };
    return steps[step];
  };

  const getProgress = (): number => {
    const stepProgress = { watch: 25, respond: 50, quiz: 75, results: 100, reward: 100, 'no-drops': 0 };
    return stepProgress[currentStep];
  };

  const handleVideoEnd = () => {
    setVideoWatched(true);
    toast({
      title: "Video completed!",
      description: "Ready for the next step.",
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'video' | 'audio' | 'image') => {
    const file = event.target.files?.[0];
    if (file) {
      setStudentResponse(file);
      setResponseType(type);
      toast({
        title: "Response uploaded!",
        description: `Your ${type} response has been saved.`,
      });
    }
  };

  const handleQuizAnswer = (questionId: string, answerIndex: number) => {
    setQuizAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
    
    // Calculate tokens for this question immediately
    const question = dropData.quiz.find(q => q.id === questionId);
    const isCorrect = question && answerIndex === question.correctAnswer;
    const tokensPerQuestion = Math.round(dropData.rewards.baseTokens / dropData.quiz.length);
    
    setQuestionTokens(tokensPerQuestion);
    
    if (isCorrect) {
      setShowSuccessDrawer(true);
      // Auto-close drawer after 2 seconds and move to next question
      setTimeout(() => {
        setShowSuccessDrawer(false);
        if (currentQuestionIndex < dropData.quiz.length - 1) {
          nextQuestion();
        }
      }, 2000);
    } else {
      setShowFailureDrawer(true);
      // Auto-close drawer after 2 seconds and move to next question
      setTimeout(() => {
        setShowFailureDrawer(false);
        if (currentQuestionIndex < dropData.quiz.length - 1) {
          nextQuestion();
        }
      }, 2000);
    }
  };

  const submitQuiz = () => {
    let correctAnswers = 0;
    dropData.quiz.forEach(question => {
      if (quizAnswers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    const percentage = Math.round((correctAnswers / dropData.quiz.length) * 100);
    const tokens = Math.round((percentage / 100) * dropData.rewards.baseTokens);
    
    setScore(percentage);
    setTokensEarned(tokens);
    setCurrentStep('results');
  };

  const claimReward = () => {
    const randomReward = dropData.rewards.prizes[Math.floor(Math.random() * dropData.rewards.prizes.length)];
    setSelectedReward(randomReward);
    setRewardClaimed(true);
    setShowRewardModal(true);
  };

  const openVideoModal = () => {
    setShowVideoModal(true);
  };

  const handleSocialVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSocialVideo(file);
      toast({
        title: "Video ready!",
        description: "Your social share video has been uploaded.",
      });
    }
  };

  const shareOnSocial = () => {
    if (socialVideo) {
      // Simulate social sharing
      setSharedVideo(true);
      setTokensEarned(prev => prev + 100); // $100 bonus tokens
      setShowVideoModal(false);
      
      toast({
        title: "Bonus earned! 🎉",
        description: "+$100 G3MS tokens for sharing on social!",
      });
      
      // Mark drop as fully completed after all activities (reward claimed + video shared)
      if (rewardClaimed) {
        setTimeout(() => {
          setDropFullyCompleted(true);
          setCurrentStep('results'); // Show completed state
        }, 1000); // Small delay to show the completion flow
      }

      // Open native share sheet
      if (navigator.share) {
        navigator.share({
          title: 'Check out this amazing G3MS Drop!',
          text: 'I just completed an amazing learning challenge and earned tokens! Join me on G3MS!',
          url: window.location.origin
        }).catch(console.error);
      } else {
        // Fallback for desktop
        const shareText = 'I just completed an amazing G3MS Drop and earned tokens! Join me: ' + window.location.origin;
        navigator.clipboard.writeText(shareText);
        toast({
          title: "Share text copied!",
          description: "Share text has been copied to clipboard.",
        });
      }
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < dropData.quiz.length - 1) {
      setSlideDirection('right');
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setSlideDirection('left');
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const currentQuestion = dropData.quiz[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === dropData.quiz.length - 1;
  const canSubmitQuiz = Object.keys(quizAnswers).length === dropData.quiz.length;

  const renderNoDropsState = () => (
    <div className="space-y-4">
      {/* Next Drop Live Banner */}
      <Card className="bg-gradient-to-r from-g3ms-purple/20 to-g3ms-purple/10 border-g3ms-purple/40">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-g3ms-purple rounded-full flex items-center justify-center">
              <span className="text-white text-xs">🎯</span>
            </div>
            <div className="flex-1">
               <p className="text-sm font-medium text-gray-800">
                 <span className="font-bold text-g3ms-purple">Next Drop LIVE</span> in {timeUntilNextDrop}. Train now, stack tokens, get a gift card. 
                 <span className="font-medium text-g3ms-purple"> Tap for alert.</span>
               </p>
            </div>
          </div>
        </CardContent>
      </Card>


      {/* Train and Earn Section */}
      <Card className="bg-gradient-to-r from-gray-50 to-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Train and Earn</h3>
              <p className="text-base text-gray-600 mb-4">$15,000 G3MS tokens for an immediate gift card with Ayo while you wait.</p>
            </div>
            <div className="w-20 h-20 flex items-center justify-center ml-4">
              <img 
                src="/lovable-uploads/aaa0e430-824d-417a-b389-b89e33406fe2.png" 
                alt="Ayo mascot" 
                className="w-16 h-16 object-contain"
              />
            </div>
          </div>
          <Button className="w-full bg-g3ms-purple hover:bg-g3ms-purple/90 text-white font-medium py-3 rounded-xl">
            Hey Ayo!
          </Button>
        </CardContent>
      </Card>

      {/* Leaderboard Position */}
      <Card className="bg-gradient-to-r from-g3ms-yellow/20 to-g3ms-yellow/10 border-g3ms-yellow/40">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🎁</span>
              <div>
                <p className="font-bold text-gray-800">You're #33 — Climb to Top 5 for 🎁 gift cards!</p>
              </div>
            </div>
          </div>
          <Button className="w-full mt-3 bg-g3ms-blue hover:bg-g3ms-blue/90 text-white font-medium py-3 rounded-xl">
            👀 See Top 5
          </Button>
        </CardContent>
      </Card>

      {/* Bonus Friend Section */}
      <Card className="border-2 border-g3ms-green/40 bg-gradient-to-r from-g3ms-green/20 to-g3ms-green/10">
        <CardContent className="p-4 text-center">
          <p className="text-lg font-medium text-g3ms-green mb-3">🔥 Bonus if Friend Joins 🔥</p>
        </CardContent>
      </Card>

      {/* See Responses */}
      <Button 
        onClick={() => navigate('/drops/main')}
        className="w-full bg-g3ms-purple hover:bg-g3ms-purple/90 text-white font-medium py-4 rounded-xl text-lg"
      >
        👀 Back to Drops
      </Button>
    </div>
  );

  const renderDropCompletedState = () => (
    <div className="space-y-4">
      {/* Completion Header */}
      <Card className="bg-gradient-to-r from-g3ms-green/20 to-g3ms-green/10 border-g3ms-green/40">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <span className="text-2xl">🎉</span>
            <h3 className="text-xl font-bold text-g3ms-green">Drop Completed!</h3>
            <span className="text-2xl">🎉</span>
          </div>
          <p className="text-g3ms-green">You've earned ${tokensEarned} G3MS tokens!</p>
        </CardContent>
      </Card>

      {/* Next Drop Coming */}
      <Card className="bg-gradient-to-r from-pink-100 to-pink-50 border-pink-200">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">🎯</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">
                <span className="font-bold text-pink-600">Next Drop LIVE</span> in {timeUntilNextDrop}. Train now, stack tokens, get a gift card. 
                <span className="font-medium text-pink-600"> Tap for alert.</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Train and Earn Section */}
      <Card className="bg-gradient-to-r from-gray-50 to-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Train and Earn</h3>
              <p className="text-base text-gray-600 mb-4">$15,000 G3MS tokens for an immediate gift card with Ayo while you wait.</p>
            </div>
            <div className="w-20 h-20 flex items-center justify-center ml-4">
              <img 
                src="/lovable-uploads/aaa0e430-824d-417a-b389-b89e33406fe2.png" 
                alt="Ayo mascot" 
                className="w-16 h-16 object-contain"
              />
            </div>
          </div>
          <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 rounded-xl">
            Hey Ayo!
          </Button>
        </CardContent>
      </Card>

      {/* Updated Leaderboard Position */}
      <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🎁</span>
              <div>
                <p className="font-bold text-gray-800">You're #28 — Climb to Top 5 for 🎁 gift cards!</p>
              </div>
            </div>
          </div>
          <Button className="w-full mt-3 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-xl">
            👀 See Top 5
          </Button>
        </CardContent>
      </Card>

      {/* Bonus Friend Section */}
      <Card className="border-2 border-teal-200 bg-gradient-to-r from-teal-50 to-emerald-50">
        <CardContent className="p-4 text-center">
          <p className="text-lg font-medium text-teal-700 mb-3">🔥 Bonus if Friend Joins 🔥</p>
        </CardContent>
      </Card>

      {/* See Responses */}
      <Button 
        onClick={() => navigate('/drops/main')}
        className="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-4 rounded-xl text-lg"
      >
        👀 Back to Drops
      </Button>
    </div>
  );

  const renderWatchStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">{dropData.title}</h2>
        <p className="text-muted-foreground">{dropData.description}</p>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-4">
            <video
              src={dropData.videoUrl}
              controls
              className="w-full h-full rounded-lg"
              onEnded={handleVideoEnd}
            >
              <source src={dropData.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          
          <Button 
            onClick={() => setCurrentStep('respond')} 
            className="w-full bg-g3ms-blue hover:bg-g3ms-blue/90 text-white"
          >
            <Play className="w-4 h-4 mr-2" />
            STEP 1: Watch Drop Challenge
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderResponseStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">{dropData.title}</h2>
        <h3 className="text-xl font-semibold">Show Your Thinking</h3>
        <p className="text-muted-foreground">
          Explain how you'd approach this problem even if you're not sure of the answer. 
          What do you notice? What do you already know that might help? Walk us through your thinking, step by step.
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="bg-black text-white rounded-lg p-8 text-center space-y-4">
            {!studentResponse ? (
              <>
                <h3 className="text-xl font-bold">
                  Use video, audio, or a photo to share your thinking
                </h3>
                <p className="text-lg">whatever works best for you.</p>
                
                <div className="flex justify-center space-x-4 mt-6">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => handleFileUpload(e, 'video')}
                      className="hidden"
                    />
                     <div className="bg-g3ms-blue hover:bg-g3ms-blue/90 w-16 h-16 rounded-full flex items-center justify-center">
                      <Video className="w-8 h-8" />
                    </div>
                  </label>
                  
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(e) => handleFileUpload(e, 'audio')}
                      className="hidden"
                    />
                    <div className="bg-g3ms-purple hover:bg-g3ms-purple/90 w-16 h-16 rounded-full flex items-center justify-center">
                      <Mic className="w-8 h-8" />
                    </div>
                  </label>
                  
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'image')}
                      className="hidden"
                    />
                    <div className="bg-g3ms-yellow hover:bg-g3ms-yellow/90 w-16 h-16 rounded-full flex items-center justify-center">
                      <Camera className="w-8 h-8" />
                    </div>
                  </label>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="text-g3ms-green text-sm">
                  ✓ {responseType} response uploaded: {studentResponse.name}
                </div>
                
                {/* Preview within the same box */}
                <div className="bg-gray-900 rounded-lg p-4">
                  {responseType === 'video' && (
                    <div className="text-center">
                      <Video className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-300">Sample Video Response</p>
                      <p className="text-xs text-gray-500">Student explaining their thinking process</p>
                    </div>
                  )}
                  
                  {responseType === 'audio' && (
                    <div className="text-center">
                      <Mic className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-300">Sample Audio Response</p>
                      <div className="flex items-center justify-center mt-2 space-x-1">
                         <div className="w-1 h-4 bg-g3ms-blue rounded"></div>
                         <div className="w-1 h-6 bg-g3ms-blue rounded"></div>
                         <div className="w-1 h-3 bg-g3ms-blue rounded"></div>
                         <div className="w-1 h-8 bg-g3ms-blue rounded"></div>
                         <div className="w-1 h-2 bg-g3ms-blue rounded"></div>
                      </div>
                    </div>
                  )}
                  
                  {responseType === 'image' && (
                    <div className="text-center">
                      <Camera className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-300">Sample Image Response</p>
                      <p className="text-xs text-gray-500">Handwritten work or diagram</p>
                    </div>
                  )}
                </div>
                
                <Button 
                  onClick={() => setCurrentStep('quiz')} 
                  className="w-full bg-white text-black hover:bg-gray-100"
                >
                  Continue to Quiz
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderQuizStep = () => (
    <div className="space-y-4">
      {/* Quiz Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">{dropData.title}</h2>
        <h3 className="text-xl font-semibold">Take the Quiz & Stack G3MS!</h3>
      </div>

      {/* Question Progress */}
      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
        <span>Question {currentQuestionIndex + 1} of {dropData.quiz.length}</span>
        <div className="flex space-x-1">
          {dropData.quiz.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentQuestionIndex
                  ? 'bg-g3ms-blue'
                  : index < currentQuestionIndex || quizAnswers[dropData.quiz[index].id] !== undefined
                  ? 'bg-g3ms-green'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Question Card Container with slide animation */}
      <div className="relative overflow-hidden">
        <Card key={currentQuestion.id} className={`transform transition-all duration-300 ease-in-out ${
          slideDirection === 'right' ? 'animate-slide-in-right' : 'animate-slide-in-left'
        }`}>
          <CardContent className="p-6">
            {/* Question */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold leading-relaxed mb-4">
                {currentQuestion.question}
              </h4>
            </div>

            {/* Answer Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, optionIndex) => {
                const isSelected = quizAnswers[currentQuestion.id] === optionIndex;
                const isCorrect = optionIndex === currentQuestion.correctAnswer;
                const showFeedback = quizAnswers[currentQuestion.id] !== undefined;
                
                return (
                  <button
                    key={optionIndex}
                    onClick={() => handleQuizAnswer(currentQuestion.id, optionIndex)}
                    disabled={showFeedback}
                    className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                      showFeedback
                        ? isCorrect
                          ? 'border-g3ms-green bg-g3ms-green/10'
                          : isSelected
                          ? 'border-g3ms-purple bg-g3ms-purple/10'
                          : 'border-gray-200 bg-gray-50'
                        : isSelected
                        ? 'border-g3ms-blue bg-g3ms-blue/10 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    } ${showFeedback ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-start space-x-3">
                      <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                        showFeedback
                          ? isCorrect
                            ? 'bg-g3ms-green text-white'
                            : isSelected
                            ? 'bg-g3ms-purple text-white'
                            : 'bg-gray-300 text-gray-600'
                          : isSelected
                          ? 'bg-g3ms-blue text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {showFeedback && isCorrect ? '✓' : showFeedback && isSelected ? '✗' : String.fromCharCode(65 + optionIndex)}
                      </span>
                      <span className="flex-1 text-sm sm:text-base leading-relaxed">
                        {option}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Immediate Feedback */}
            {quizAnswers[currentQuestion.id] !== undefined && (
              <div className="mt-4 p-4 rounded-lg border">
                {quizAnswers[currentQuestion.id] === currentQuestion.correctAnswer ? (
                  <div className="bg-g3ms-green/10 border-g3ms-green text-g3ms-green">
                    <div className="flex items-center space-x-2 mb-2">
                       <div className="w-6 h-6 bg-g3ms-green rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">✓</span>
                      </div>
                      <span className="font-semibold">Correct!</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Diamond className="w-4 h-4 text-g3ms-blue" />
                      <span className="text-sm">+{Math.round(dropData.rewards.baseTokens / dropData.quiz.length)} G3MS tokens earned!</span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-g3ms-purple/10 border-g3ms-purple text-g3ms-purple">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-6 h-6 bg-g3ms-purple rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">✗</span>
                      </div>
                      <span className="font-semibold">Not quite right</span>
                    </div>
                    <div className="text-sm">No tokens for this question, but keep going!</div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between mt-6">
        <Button
          variant="outline"
          onClick={prevQuestion}
          disabled={currentQuestionIndex === 0}
          className="flex items-center space-x-2"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </Button>

        {isLastQuestion && canSubmitQuiz ? (
          <Button 
            onClick={submitQuiz} 
            className="bg-g3ms-green hover:bg-g3ms-green/90 text-white px-8"
          >
            Submit Quiz
          </Button>
        ) : (
          <Button
            onClick={nextQuestion}
            disabled={currentQuestionIndex === dropData.quiz.length - 1}
            className="flex items-center space-x-2"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Answer Status */}
      {quizAnswers[currentQuestion.id] !== undefined && (
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 bg-g3ms-green/10 text-g3ms-green px-3 py-2 rounded-full text-sm">
            <div className="w-2 h-2 bg-g3ms-green rounded-full"></div>
            <span>Answer saved</span>
          </div>
        </div>
      )}
    </div>
  );

  const renderResultsStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-between">
          <div></div>
          <h2 className="text-2xl font-bold">{dropData.title}</h2>
          {/* Close button when 100% complete */}
          {getProgress() === 100 && (
            <button 
              onClick={() => {
                setDropFullyCompleted(true);
                setCurrentStep('results');
              }}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          )}
        </div>
        <h3 className="text-xl font-semibold">Take the Quiz & Stack G3MS!</h3>
      </div>

      <Card>
        <CardContent className="p-6 text-center space-y-6">
          <div className="text-6xl font-bold text-g3ms-purple">
            {score}%
          </div>
          <p className="text-lg text-muted-foreground">
            {dropData.quiz.filter((q, i) => quizAnswers[q.id] === q.correctAnswer).length} of {dropData.quiz.length} correct
          </p>
          
          <div className="flex items-center justify-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
              <span className="text-white font-bold">💎</span>
            </div>
            <span className="text-2xl font-bold text-blue-600">${tokensEarned}</span>
          </div>

          <Button onClick={claimReward} className="w-full bg-g3ms-purple hover:bg-g3ms-purple/90">
            Claim Rewards
          </Button>

          <div className="border-t pt-4 space-y-3">
            <Button 
              variant="outline" 
              onClick={openVideoModal}
              disabled={sharedVideo}
              className="w-full"
            >
              <Video className="w-4 h-4 mr-2" />
              {sharedVideo ? 'Bonus Earned!' : 'Share to win a bonus 🎥'}
            </Button>
            
            <Button 
              onClick={() => navigate('/drops')}
              variant="outline"
              className="w-full"
            >
              Back to Drops
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Same as /drops page */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-12 sm:h-14 md:h-16">
            <div className="flex items-center">
              <button onClick={() => window.location.href = '/'} className="focus:outline-none touch-manipulation">
                <img 
                  src="/lovable-uploads/b617ee5c-bf33-49d0-9752-4040f240cab6.png" 
                  alt="G3MS Logo" 
                  className="h-6 sm:h-8 md:h-10 w-auto hover:opacity-80 transition-opacity"
                />
              </button>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* User Profile */}
              <UserProfile compact />
              
              {/* Token Balance */}
              <div className="flex items-center space-x-1 bg-g3ms-blue/10 px-3 py-1.5 rounded-full">
                <Diamond className="w-4 h-4 text-g3ms-blue fill-current" />
                <span className="text-sm font-bold text-g3ms-blue">$150</span>
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Drop Info Bar - only show for active drops, not completed ones */}
      {!dropCompleted && !dropFullyCompleted && (
        <div className="bg-gray-50 border-b">
          <div className="max-w-md mx-auto px-4 py-3">
            <div className="flex items-center justify-center">
              {/* Timer Only */}
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span className="font-medium">{timeUntilNextDrop}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progress Bar - only show for active drops */}
      {currentStep !== 'no-drops' && (
        <div className="bg-white">
          <div className="max-w-md mx-auto px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Step {getStepNumber(currentStep)} of 4</span>
              <span className="text-sm text-muted-foreground">{getProgress()}% Complete</span>
            </div>
            <Progress value={getProgress()} className="h-2" />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-6">
        {currentStep === 'no-drops' && renderNoDropsState()}
        {(dropCompleted || dropFullyCompleted) && currentStep === 'results' && renderDropCompletedState()}
        {!dropCompleted && !dropFullyCompleted && currentStep === 'watch' && renderWatchStep()}
        {!dropCompleted && !dropFullyCompleted && currentStep === 'respond' && renderResponseStep()}
        {!dropCompleted && !dropFullyCompleted && currentStep === 'quiz' && renderQuizStep()}
        {!dropCompleted && !dropFullyCompleted && currentStep === 'results' && renderResultsStep()}
      </div>

      {/* Reward Modal */}
      <Dialog open={showRewardModal} onOpenChange={setShowRewardModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-center">
              {selectedReward === 'Amazon Gift Card' ? (
                <div className="space-y-4">
                  <div className="bg-black text-white p-4 rounded-lg">
                    <div className="text-2xl font-bold">amazon.com</div>
                    <div className="text-4xl font-bold">a</div>
                    <div className="text-sm">gift card</div>
                  </div>
                  <div>
                    <h3 className="font-bold">Amazon eGift Card</h3>
                    <p className="text-blue-600">www.amazon.com</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Gift className="w-16 h-16 mx-auto text-g3ms-purple" />
                  <h3 className="font-bold">{selectedReward}</h3>
                </div>
              )}
            </DialogTitle>
          </DialogHeader>
          
          <div className="text-center space-y-4">
            <h4 className="font-bold">Congratulations on Redeeming Your Gift Card!</h4>
            <p className="text-sm text-muted-foreground">
              Your reward is on its way, NO CAP! Please allow 1-48 hours for delivery. 
              We appreciate your patience and are excited for you to enjoy your gift card soon!
            </p>
            
            <div className="text-left">
              <p className="text-sm font-medium text-pink-600">Your eGift card will be sent to:</p>
              <p className="text-sm">{displayUser?.email}</p>
            </div>
            
             <Button 
               onClick={() => {
                 setShowRewardModal(false);
                 // Pass state to indicate drop was completed
                 navigate('/drops/main', { state: { dropCompleted: true } });
               }}
               className="w-full bg-g3ms-purple hover:bg-g3ms-purple/90 text-white"
             >
               Done
             </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Video Recording Modal */}
      <Dialog open={showVideoModal} onOpenChange={setShowVideoModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              <div className="space-y-2">
                <Video className="w-12 h-12 mx-auto text-g3ms-blue" />
                <h3 className="font-bold text-xl">Share Your G3MS Experience!</h3>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Prompt for user */}
            <div className="bg-g3ms-blue/10 border border-g3ms-blue rounded-lg p-4">
              <h4 className="font-semibold text-g3ms-blue mb-2">Your prompt:</h4>
              <p className="text-sm text-gray-700">
                "Tell your friends why you love G3MS and how amazing this Drop experience was! 
                Share what you learned, how much you earned, and why they should join you on G3MS. 
                Keep it fun and authentic - your excitement is contagious! 🎉"
              </p>
            </div>

            {!socialVideo ? (
              <div className="space-y-4">
                <div className="bg-black text-white rounded-lg p-6 text-center space-y-4">
                  <h4 className="text-lg font-bold">Record or Upload Your Video</h4>
                  <p className="text-sm text-gray-300">Share your G3MS experience with friends!</p>
                  
                  <div className="flex justify-center space-x-4">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleSocialVideoUpload}
                        className="hidden"
                      />
                      <div className="bg-g3ms-blue hover:bg-g3ms-blue/90 w-16 h-16 rounded-full flex items-center justify-center">
                        <Video className="w-8 h-8" />
                      </div>
                    </label>
                    
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="video/*"
                        capture="user"
                        onChange={handleSocialVideoUpload}
                        className="hidden"
                      />
                      <div className="bg-g3ms-purple hover:bg-g3ms-purple/90 w-16 h-16 rounded-full flex items-center justify-center">
                        <Camera className="w-8 h-8" />
                      </div>
                    </label>
                  </div>
                  
                  <div className="text-xs text-gray-400">
                    <p>📹 Upload existing video or 📷 Record new video</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-g3ms-green/10 border border-g3ms-green rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <div className="w-6 h-6 bg-g3ms-green rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <span className="font-semibold text-g3ms-green">Video Ready!</span>
                  </div>
                  <p className="text-sm text-gray-700">{socialVideo.name}</p>
                </div>

                <div className="bg-gray-100 rounded-lg p-4 text-center">
                  <Video className="w-12 h-12 mx-auto mb-2 text-gray-500" />
                  <p className="text-sm text-gray-600">Video Preview</p>
                  <p className="text-xs text-gray-500">Ready to share your G3MS experience!</p>
                </div>

                <Button 
                  onClick={shareOnSocial}
                  className="w-full bg-g3ms-green hover:bg-g3ms-green/90 text-white"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share & Earn $100 Tokens!
                </Button>
              </div>
            )}

            <div className="text-center">
              <p className="text-xs text-gray-500">
                💰 Earn $100 G3MS tokens instantly when you share!
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Drawer */}
      <Drawer open={showSuccessDrawer} onOpenChange={setShowSuccessDrawer}>
        <DrawerContent className="max-w-md mx-auto">
          <DrawerHeader className="text-center">
            <div className="space-y-3">
              <div className="w-16 h-16 bg-g3ms-green rounded-full flex items-center justify-center mx-auto">
                <span className="text-white text-2xl">✓</span>
              </div>
              <DrawerTitle className="text-xl font-bold text-g3ms-green">Correct! 🎉</DrawerTitle>
              <DrawerDescription className="flex items-center justify-center space-x-2">
                <Diamond className="w-5 h-5 text-g3ms-blue fill-current" />
                <span className="text-lg font-semibold text-g3ms-blue">+{questionTokens} G3MS tokens earned!</span>
              </DrawerDescription>
            </div>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>

      {/* Failure Drawer */}
      <Drawer open={showFailureDrawer} onOpenChange={setShowFailureDrawer}>
        <DrawerContent className="max-w-md mx-auto">
          <DrawerHeader className="text-center">
            <div className="space-y-3">
              <div className="w-16 h-16 bg-g3ms-purple rounded-full flex items-center justify-center mx-auto">
                <span className="text-white text-2xl">✗</span>
              </div>
              <DrawerTitle className="text-xl font-bold text-g3ms-purple">Not quite right 😅</DrawerTitle>
              <DrawerDescription className="text-gray-600">
                No tokens for this question, but keep going!
              </DrawerDescription>
            </div>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    </div>
  );
}