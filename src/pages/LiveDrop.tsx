import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Play, CheckCircle, ArrowRight, ArrowLeft, MessageCircle, BookOpen, Trophy, Diamond } from 'lucide-react';
import RewardClaimModal from '@/components/RewardClaimModal';

const LiveDrop = () => {
  console.log('LiveDrop component is rendering');
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [videoCompleted, setVideoCompleted] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [dropProgress, setDropProgress] = useState(20); // Start at 20% for step 1 (5 steps total)
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [rewardType, setRewardType] = useState<'giftcard' | 'event' | 'tokens'>('giftcard');
  
  // Ayo conversation state
  const [ayoProcessing, setAyoProcessing] = useState(false);
  const [ayoMessages, setAyoMessages] = useState<Array<{type: 'ayo' | 'user', message: string}>>([]);
  const [ayoCompleted, setAyoCompleted] = useState(false);
  const [misconceptionDetected, setMisconceptionDetected] = useState(false);

  const shareMessages = [
    "Just crushed a Live Drop challenge and earned tokens! 🎉 Join me on G3MS and let's learn together! 💎",
    "Stacking G3MS tokens while learning! 🔥 Come join the fun and earn rewards too! 🎁",
    "Just completed an AI Drop and got rewarded! 💪 G3MS makes learning so much more fun! ✨",
    "Learning has never been this rewarding! 🚀 Just earned tokens on G3MS - you should try it! 💎",
    "Drop completed, tokens earned! 🎯 Join me on G3MS where learning pays off! 🔥"
  ];

  const getRandomRewardType = (): 'giftcard' | 'event' | 'tokens' => {
    const types: ('giftcard' | 'event' | 'tokens')[] = ['giftcard', 'event', 'tokens'];
    return types[Math.floor(Math.random() * types.length)];
  };

  const getRewardData = (type: 'giftcard' | 'event' | 'tokens') => {
    switch (type) {
      case 'giftcard':
        return {
          title: '$15 Amazon Gift Card',
          website: 'www.amazon.com',
          message: 'Congratulations on Redeeming Your Gift Card!',
          details: 'Your reward is on its way, NO CAP! Please allow 1-48 hours for delivery. We appreciate your patience and are excited for you to enjoy your gift card soon!',
          contactInfo: '(773) 354 - 9066\ntest@gmail.com'
        };
      case 'event':
        return {
          title: 'Concert Tickets',
          message: 'Congratulations on Your Event Tickets!',
          details: 'Your tickets have been reserved! Check your email for event details and entry instructions. Get ready for an amazing experience!',
          contactInfo: '(773) 354 - 9066\ntest@gmail.com'
        };
      case 'tokens':
        return {
          title: 'Bonus Tokens',
          message: 'Congratulations on Your Bonus Tokens!',
          details: 'Your bonus tokens have been added to your account. Keep completing drops to earn even more rewards!',
          amount: '250'
        };
    }
  };

  const steps = [
    { id: 1, name: 'Watch', icon: Play, description: 'Watch the video' },
    { id: 2, name: 'Respond', icon: MessageCircle, description: 'Share your thoughts' },
    { id: 3, name: 'Ayo', icon: () => <img src="/lovable-uploads/aaa0e430-824d-417a-b389-b89e33406fe2.png" alt="Ayo" className="w-4 h-4" />, description: 'AI feedback review' },
    { id: 4, name: 'Quiz', icon: BookOpen, description: 'Answer questions' },
    { id: 5, name: 'Win', icon: Trophy, description: 'Claim rewards' }
  ];

  const quizQuestions = [
    {
      question: "What is the main benefit of AI in education mentioned in the video?",
      options: [
        "It replaces teachers completely",
        "It personalizes learning experiences",
        "It makes education more expensive",
        "It eliminates the need for homework"
      ],
      correct: 1
    }
  ];

  const handleVideoEnd = () => {
    setVideoCompleted(true);
  };

  const handleNextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
      setDropProgress((currentStep + 1) * 20);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setDropProgress((currentStep - 1) * 20);
    }
  };

  const handleBackToMain = () => {
    navigate('/drops/main');
  };

  const handleCompleteDropClick = () => {
    navigate('/drops/main', { 
      state: { dropCompleted: true }
    });
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1: return videoCompleted;
      case 2: return uploadedFile !== null;
      case 3: return ayoCompleted;
      case 4: return selectedAnswer !== '';
      default: return true;
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleShare = async () => {
    const randomMessage = shareMessages[Math.floor(Math.random() * shareMessages.length)];
    const shareData = {
      title: 'G3MS - Learn & Earn Tokens!',
      text: randomMessage,
      url: 'https://g3ms.lovable.app'
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback for browsers that don't support Web Share API
        const shareText = `${randomMessage} ${shareData.url}`;
        await navigator.clipboard.writeText(shareText);
        alert('Share text copied to clipboard!');
      }
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b px-4 py-3">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToMain}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <img src="/lovable-uploads/7588041f-8987-4a29-bd33-41e667d9b54a.png" alt="G3MS" className="w-8 h-8" />
              <h1 className="text-xl font-bold text-foreground">Live Drop Challenge</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Progress value={dropProgress} className="w-24" />
            <span className="text-sm font-medium">{dropProgress}%</span>
          </div>
        </div>
      </header>

      {/* Step Indicator */}
      <div className="bg-white/80 backdrop-blur-sm border-b px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center">
            <div className="flex items-center justify-between w-full max-w-md">
              {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${
                      currentStep >= step.id 
                        ? 'text-white' 
                        : 'bg-gray-200 text-gray-500'
                    }`} style={{ 
                      backgroundColor: currentStep >= step.id ? '#aa1b83' : undefined 
                    }}>
                      <step.icon className="w-4 h-4" />
                    </div>
                    <span className={`text-xs font-medium ${
                      currentStep >= step.id ? 'text-gray-700' : 'text-gray-500'
                    }`}>
                      {step.name}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 rounded-full ${
                      currentStep > step.id ? 'bg-purple-600' : 'bg-gray-200'
                    }`} style={{ 
                      backgroundColor: currentStep > step.id ? '#aa1b83' : undefined 
                    }}></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="mb-6">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Badge className="text-white animate-pulse" style={{ backgroundColor: '#aa1b83' }}>
                🔴 LIVE
              </Badge>
              <CardTitle className="text-2xl">🔥 Today's AI Drop Challenge</CardTitle>
            </div>
            <p className="text-muted-foreground">
              {steps[currentStep - 1]?.description}
            </p>
          </CardHeader>
          <CardContent>
            {/* Step 1: Watch Video */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <iframe
                    src="https://player.mux.com/h02r3eQPuYTBOCSJDZ3a8RdDMabamWq3oIEi01okuZOpg?metadata-video-title=AI+Drop&video-title=AI+Drop"
                    style={{ width: '100%', border: 'none', aspectRatio: '16/9' }}
                    allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                    allowFullScreen
                    title="G3MS Live Drop Video"
                    onLoad={() => {
                      // For demo purposes, we'll allow proceeding after a short delay
                      setTimeout(() => setVideoCompleted(true), 3000);
                    }}
                  />
                </div>
                <div className="text-center">
                  {videoCompleted ? (
                    <Button 
                      onClick={handleNextStep}
                      className="text-white font-semibold"
                      style={{ background: 'linear-gradient(135deg, #aa1b83 0%, #3ec7ac 100%)' }}
                      size="lg"
                    >
                      Continue to Response <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <p className="text-muted-foreground">
                      <Play className="w-4 h-4 inline mr-1" />
                      Watch the video to continue
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Respond */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2">Share Your Response</h3>
                  <p className="text-muted-foreground">Upload a video, image, or audio response</p>
                </div>
                
                {/* File Upload Section */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept="video/*,image/*,audio/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="space-y-2">
                      <div className="text-4xl">📎</div>
                      <p className="font-medium">Upload your response</p>
                      <p className="text-sm text-muted-foreground">Video, image, or audio file</p>
                    </div>
                  </label>
                  {uploadedFile && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-700">
                        ✅ Uploaded: {uploadedFile.name}
                      </p>
                    </div>
                  )}
                </div>

                <div className="text-center">
                  <div className="flex gap-3 justify-center">
                    {currentStep > 1 && (
                      <Button
                        variant="outline"
                        onClick={handlePrevStep}
                        className="flex items-center gap-2"
                        size="lg"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Previous
                      </Button>
                    )}
                    <Button 
                      onClick={handleNextStep}
                      disabled={!canProceedToNextStep()}
                      className="text-white font-semibold"
                      style={{ background: canProceedToNextStep() ? 'linear-gradient(135deg, #aa1b83 0%, #3ec7ac 100%)' : undefined }}
                      size="lg"
                    >
                      Continue to Ayo Review <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Ayo Review */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <img src="/lovable-uploads/aaa0e430-824d-417a-b389-b89e33406fe2.png" alt="Ayo" className="w-12 h-12" />
                    <h3 className="text-xl font-semibold">Ayo is reviewing your response...</h3> 
                  </div>
                  <p className="text-muted-foreground">AI-powered feedback on your submission</p>
                </div>

                {/* Processing Animation */}
                {ayoProcessing && (
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <img src="/lovable-uploads/aaa0e430-824d-417a-b389-b89e33406fe2.png" alt="Ayo" className="w-8 h-8 animate-pulse" />
                      <div className="animate-pulse">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      {uploadedFile?.type.startsWith('video/') ? 'Converting speech to text...' : 
                       uploadedFile?.type.startsWith('image/') ? 'Analyzing image and extracting text...' : 
                       'Processing your response...'}
                    </p>
                  </div>
                )}

                {/* Ayo Conversation */}
                {ayoMessages.length > 0 && (
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg border p-4 max-h-96 overflow-y-auto">
                      {ayoMessages.map((message, index) => (
                        <div key={index} className={`flex gap-3 mb-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                          {message.type === 'ayo' && (
                            <img src="/lovable-uploads/aaa0e430-824d-417a-b389-b89e33406fe2.png" alt="Ayo" className="w-8 h-8 flex-shrink-0 mt-1" />
                          )}
                          <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.type === 'ayo' 
                              ? 'bg-purple-100 text-purple-900' 
                              : 'bg-blue-500 text-white'
                          }`}>
                            <p className="text-sm">{message.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mock Conversation for Demo */}
                {!ayoProcessing && ayoMessages.length === 0 && (
                  <div className="space-y-4">
                    <Button 
                      onClick={() => {
                        setAyoProcessing(true);
                        // Simulate processing time
                        setTimeout(() => {
                          setAyoProcessing(false);
                          setAyoMessages([
                            {type: 'ayo', message: "I've reviewed your response! I noticed you're thinking about absolute value as negative numbers only. What happens if the number is positive?"},
                          ]);
                          setMisconceptionDetected(true);
                        }, 3000);
                      }}
                      className="w-full text-white font-semibold"
                      style={{ background: 'linear-gradient(135deg, #aa1b83 0%, #3ec7ac 100%)' }}
                      size="lg"
                    >
                      Start Ayo Review
                    </Button>
                    <div className="text-center">
                      <Button
                        variant="outline"
                        onClick={handlePrevStep}
                        className="flex items-center gap-2"
                        size="lg"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Previous
                      </Button>
                    </div>
                  </div>
                )}

                {/* Continue Button - Shows after conversation */}
                {ayoMessages.length > 0 && !ayoCompleted && (
                  <div className="text-center space-y-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-sm text-yellow-800">
                        💡 <strong>Hint:</strong> Think about what absolute value really means for both positive and negative numbers.
                      </p>
                    </div>
                    <div className="flex gap-3 justify-center">
                      <Button
                        variant="outline"
                        onClick={handlePrevStep}
                        className="flex items-center gap-2"
                        size="lg"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Previous
                      </Button>
                      <Button 
                        onClick={() => {
                          setAyoMessages(prev => [...prev, 
                            {type: 'user', message: "I understand now! Absolute value gives the distance from zero, so it's always positive."},
                            {type: 'ayo', message: "Exactly right! 🎉 You've got it now. Let's move on to the quiz to test your understanding!"}
                          ]);
                          setTimeout(() => setAyoCompleted(true), 1000);
                        }}
                        className="text-white font-semibold"
                        style={{ background: 'linear-gradient(135deg, #aa1b83 0%, #3ec7ac 100%)' }}
                        size="lg"
                      >
                        I understand now!
                      </Button>
                    </div>
                  </div>
                )}

                {ayoCompleted && (
                  <div className="text-center">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                      <p className="text-sm text-green-800">
                        ✅ <strong>Great work!</strong> Ayo has helped clarify your understanding. Ready for the quiz?
                      </p>
                    </div>
                    <div className="flex gap-3 justify-center">
                      <Button
                        variant="outline"
                        onClick={handlePrevStep}
                        className="flex items-center gap-2"
                        size="lg"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Previous
                      </Button>
                      <Button 
                        onClick={handleNextStep}
                        className="text-white font-semibold"
                        style={{ background: 'linear-gradient(135deg, #aa1b83 0%, #3ec7ac 100%)' }}
                        size="lg"
                      >
                        Continue to Quiz <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Quiz */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h3 className="text-xl font-semibold mb-2">Take the Quiz & Stack G3MS!</h3>
                  <p className="text-muted-foreground">Answer this question based on the video</p>
                </div>
                
                <div className="space-y-6">
                  <h4 className="text-lg font-medium text-center">{quizQuestions[0].question}</h4>
                  
                  <div className="space-y-3">
                    {quizQuestions[0].options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedAnswer(index.toString())}
                        className={`w-full p-4 text-left rounded-2xl border-2 transition-all duration-200 ${
                          selectedAnswer === index.toString()
                            ? 'bg-blue-500 border-blue-500 text-white'
                            : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 ${
                            selectedAnswer === index.toString()
                              ? 'bg-white text-blue-500'
                              : 'bg-gray-300 text-gray-600'
                          }`}>
                            {String.fromCharCode(97 + index)}
                          </span>
                          <span className="font-medium">{option}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="text-center pt-4">
                  <div className="flex gap-3 justify-center">
                    <Button
                      variant="outline"
                      onClick={handlePrevStep}
                      className="flex items-center gap-2"
                      size="lg"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Previous
                    </Button>
                    <Button 
                      onClick={handleNextStep}
                      disabled={!canProceedToNextStep()}
                      className="text-white font-semibold py-3 px-8"
                      style={{ background: canProceedToNextStep() ? 'linear-gradient(135deg, #aa1b83 0%, #3ec7ac 100%)' : undefined }}
                      size="lg"
                    >
                      Submit Answer <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Win */}
            {currentStep === 5 && (
              <div className="space-y-6 text-center">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-green-600">🎉 Congratulations!</h3>
                  <p className="text-lg">You've completed the Live Drop Challenge!</p>
                </div>
                
                {/* Quiz Score */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                  <div className="text-6xl font-bold text-g3ms-purple mb-2">
                    {selectedAnswer === '1' ? '100%' : '0%'}
                  </div>
                  <p className="text-gray-600 mb-4">
                    {selectedAnswer === '1' ? '1 of 1 correct' : '0 of 1 correct'}
                  </p>
                  <div className="flex items-center justify-center gap-2 text-blue-600">
                    <Diamond className="w-5 h-5" />
                    <span className="text-xl font-bold">
                      {selectedAnswer === '1' ? '$70' : '$20'}
                    </span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-yellow-50 to-green-50 p-4 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold mb-2">Your Rewards:</h4>
                  <div className="space-y-1 text-sm">
                    <p>🪙 +{selectedAnswer === '1' ? '150' : '50'} Tokens</p>
                    <p>🎁 Mystery Bonus Reward</p>
                    <p>📈 +1 Streak</p>
                  </div>
                </div>

                {/* Claim Rewards Button */}
                <div className="flex gap-3 justify-center">
                  <Button
                    variant="outline"
                    onClick={handlePrevStep}
                    className="flex items-center gap-2"
                    size="lg"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  <Button 
                    onClick={() => {
                      const randomType = getRandomRewardType();
                      setRewardType(randomType);
                      setShowRewardModal(true);
                    }}
                    className="text-white font-semibold py-4 text-lg rounded-2xl"
                    style={{ background: 'linear-gradient(135deg, #aa1b83 0%, #3ec7ac 100%)' }}
                    size="lg"
                  >
                    Claim Rewards
                  </Button>
                </div>

                {/* Bonus Section - Now a CTA */}
                <Button
                  onClick={handleShare}
                  variant="outline"
                  className="w-full border-2 border-g3ms-purple text-g3ms-purple hover:bg-g3ms-purple hover:text-white py-4 rounded-2xl"
                >
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-lg">🏆</span>
                    <div className="text-center">
                      <div className="font-medium">Bonus if Friend Joins</div>
                      <div className="text-sm opacity-80">Share and earn extra tokens!</div>
                    </div>
                    <span className="text-lg">🔥</span>
                  </div>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

      </main>

      {/* Reward Claim Modal */}
      <RewardClaimModal
        isOpen={showRewardModal}
        onClose={() => {
          setShowRewardModal(false);
          // Navigate back to main after modal closes
          setTimeout(() => {
            handleCompleteDropClick();
          }, 300);
        }}
        rewardType={rewardType}
        rewardData={getRewardData(rewardType)}
      />
    </div>
  );
};

export default LiveDrop;