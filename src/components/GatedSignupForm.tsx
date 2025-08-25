import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SignupFlow } from '@/components/SignupFlow';
// Removed Google auth service import - now using Supabase OAuth
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface GatedSignupFormProps {
  audience: 'student' | 'educator' | 'brand' | 'creator';
  children: React.ReactNode;
  onSubmit?: () => void;
}

const GatedSignupForm: React.FC<GatedSignupFormProps> = ({ audience, children, onSubmit }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { googleLogin, appleLogin } = useAuth();
  const [showSignupFlow, setShowSignupFlow] = useState(false);
  const [emailValue, setEmailValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  console.log('GatedSignupForm render state:', { showSignupFlow, emailValue });

  const getSubheadline = () => {
    switch (audience) {
      case 'student':
        return "Get tokens, gift cards & surprises for every Drop you complete.";
      case 'educator':
        return "Assign gamified learning aligned to standards. Track growth. It's free to start.";
      case 'brand':
        return "Launch branded Drops to engage students & families with purpose-driven rewards.";
      case 'creator':
        return "Partner with brands to create educational content and earn based on impact.";
      default:
        return "";
    }
  };

  const getButtonColor = () => {
    switch (audience) {
      case 'student':
        return 'from-g3ms-purple to-g3ms-purple';
      case 'educator':
        return 'from-gray-900 to-gray-800';
      case 'brand':
        return 'from-g3ms-green to-g3ms-green';
      case 'creator':
        return 'from-blue-500 to-blue-600';
      default:
        return 'from-g3ms-purple to-g3ms-purple';
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    try {
      console.log('🚀 Starting Google signup process');
      await googleLogin(true); // Pass true for signup flow
      // OAuth flow and postAuth flow will handle redirection automatically
    } catch (error) {
      console.error('Google signup failed:', error);
      toast({
        title: "Google Sign-up Failed",
        description: error instanceof Error ? error.message : "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleSignup = async () => {
    setIsLoading(true);
    try {
      console.log('🚀 Starting Apple signup process');
      await appleLogin(true); // Pass true for signup flow
      // OAuth flow and postAuth flow will handle redirection automatically
    } catch (error) {
      console.error('Apple signup failed:', error);
      toast({
        title: "Apple Sign-up Failed", 
        description: error instanceof Error ? error.message : "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDialogTrigger = () => {
    if (onSubmit) {
      onSubmit();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild onClick={handleDialogTrigger}>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-gray-900 mb-2">
            Unlock Your First Drop — It's Free!
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            Choose your preferred sign-up method below
          </DialogDescription>
        </DialogHeader>
        
        <div className="text-center mb-6">
          <p className="text-sm sm:text-base text-gray-600 mb-3">
            Join G3MS to earn rewards, create challenges, and power up learning.
          </p>
          <p className="text-sm text-gray-500">
            {getSubheadline()}
          </p>
        </div>

        <div className="space-y-3">
          {/* Google Sign Up */}
          <Button 
            onClick={handleGoogleSignup}
            disabled={isLoading}
            className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 flex items-center justify-center gap-3 h-12 font-medium"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {isLoading ? 'Signing up...' : 'Continue with Google'}
          </Button>

          {/* Microsoft Sign Up */}
          <Button className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 flex items-center justify-center gap-3 h-12 font-medium">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#00BCF2" d="M0 0h11.377v11.372H0V0z"/>
              <path fill="#00BCF2" d="M12.623 0H24v11.372H12.623V0z"/>
              <path fill="#00BCF2" d="M0 12.623h11.377V24H0V12.623z"/>
              <path fill="#00BCF2" d="M12.623 12.623H24V24H12.623V12.623z"/>
            </svg>
            Continue with Microsoft
          </Button>

          {/* Apple Sign Up */}
          <Button 
            onClick={handleAppleSignup}
            disabled={isLoading}
            className="w-full bg-black hover:bg-gray-800 text-white flex items-center justify-center gap-3 h-12 font-medium"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            {isLoading ? 'Signing up...' : 'Continue with Apple'}
          </Button>

          {/* ClassLink Sign Up - Only for students and educators */}
          {audience !== 'brand' && (
            <Button className="w-full bg-[#1e5f99] hover:bg-[#1a5287] text-white flex items-center justify-center gap-3 h-12 font-medium">
              <svg className="w-5 h-5" viewBox="0 0 100 100" fill="currentColor">
                <path d="M50 15c19.33 0 35 15.67 35 35s-15.67 35-35 35-35-15.67-35-35 15.67-35 35-35zm0-15C22.43 0 0 22.43 0 50s22.43 50 50 50 50-22.43 50-50S77.57 0 50 0z"/>
                <circle cx="35" cy="35" r="3"/>
                <path d="M35 40c-8 0-15 7-15 15v10h10V55c0-3 2-5 5-5s5 2 5 5v10h10V55c0-8-7-15-15-15z"/>
                <path d="M50 25l15 10-15 10V35h-10v10l-15-10 15-10V25z"/>
              </svg>
              Continue with ClassLink
            </Button>
          )}

          {/* OR Divider */}
          <div className="flex items-center gap-4 my-4">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-sm text-gray-500 font-medium">OR</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>


          {/* Email Input */}
          <div className="flex gap-2">
            <Input 
              placeholder="Enter your email" 
              type="email"
              value={emailValue}
              onChange={(e) => setEmailValue(e.target.value)}
              className="flex-1 h-12 border-gray-300 focus:border-g3ms-purple focus:ring-g3ms-purple"
            />
            <DialogClose asChild>
              <Button onClick={() => setShowSignupFlow(true)}
                className={`bg-gradient-to-r ${getButtonColor()} hover:opacity-90 text-white h-12 px-4`}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </DialogClose>
          </div>
        </div>

        <div className="text-center mt-4 space-y-2">
          <p className="text-xs text-gray-500">
            No credit card needed. Free to start.
          </p>
          <div>
            <button 
              onClick={() => navigate('/login')}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Already have an account?
            </button>
          </div>
        </div>
      </DialogContent>
      
      {/* SignupFlow rendered outside of Dialog to avoid nesting conflicts */}
      {showSignupFlow && (
        <SignupFlow
          isOpen={showSignupFlow}
          onClose={() => {
            console.log('SignupFlow close triggered');
            setShowSignupFlow(false);
          }}
          initialEmail={emailValue}
          preselectedUserType={audience}
        />
      )}
    </Dialog>
  );
};

export default GatedSignupForm;