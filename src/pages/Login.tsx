import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/services/api';
// Removed Google auth service import - now using Supabase OAuth

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, googleLogin, appleLogin, isLoading } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const from = location.state?.from?.pathname || '/drops/main';

  const handleEmailLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }

    try {
      await login({ email, password });
      // Auth context will handle the redirect via postAuth flow
      // No manual navigation needed here
    } catch (error) {
      console.error('Login failed:', error);
      
      let errorMessage = 'Login failed, please try again.';
      
      if (error instanceof Error) {
        // Check if it's an HTTP error with status code
        if (error.message.includes('400')) {
          errorMessage = 'Invalid input data.';
        } else if (error.message.includes('401')) {
          errorMessage = 'Incorrect email or password.';
        } else {
          // Try to parse other API error responses
          try {
            const errorData = JSON.parse(error.message);
            if (errorData.message && Array.isArray(errorData.message)) {
              errorMessage = errorData.message.join(', ');
            } else if (errorData.message && typeof errorData.message === 'string') {
              errorMessage = errorData.message;
            }
          } catch (parseError) {
            // If parsing fails, use generic message
            errorMessage = 'Login failed, please try again.';
          }
        }
      }
      
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const [socialLoading, setSocialLoading] = useState(false);

  const handleSocialLogin = async (provider: 'google' | 'microsoft' | 'apple' | 'classlink', isFromSignup: boolean = false) => {
    setSocialLoading(true);
    
    try {
      switch (provider) {
        case 'google':
          console.log('Starting Google login process...');
          await googleLogin(isFromSignup);
          // OAuth flow and postAuth flow will handle redirection automatically
          break;
          
        case 'apple':
          console.log('Starting Apple login process...');
          await appleLogin(isFromSignup);
          // OAuth flow and postAuth flow will handle redirection automatically
          break;
          
        case 'microsoft':
        case 'classlink':
          toast({
            title: `${provider.charAt(0).toUpperCase() + provider.slice(1)} Login`,
            description: `${provider.charAt(0).toUpperCase() + provider.slice(1)} authentication is not yet implemented.`,
            variant: "destructive",
          });
          break;
          
        default:
          throw new Error('Unknown provider');
      }
    } catch (error) {
      console.error(`${provider} login failed:`, error);
      
      let errorMessage = `${provider.charAt(0).toUpperCase() + provider.slice(1)} sign-in failed. Please try again.`;
      if (error instanceof Error) {
        if (error.message.includes('configuration') || error.message.includes('not configured')) {
          errorMessage = `${provider.charAt(0).toUpperCase() + provider.slice(1)} authentication is not properly configured. Please contact support.`;
        } else if (error.message.includes('cancelled') || error.message.includes('timeout')) {
          errorMessage = 'Sign-in was cancelled or timed out. Please try again.';
        } else if (error.message.includes('popup')) {
          errorMessage = 'Pop-up was blocked. Please allow pop-ups and try again.';
        } else {
          errorMessage = error.message || errorMessage;
        }
      }
      
      toast({
        title: `${provider.charAt(0).toUpperCase() + provider.slice(1)} Sign-in Failed`,
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSocialLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-g3ms-purple/5 to-g3ms-green/5 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* G3MS Logo */}
        <div className="text-center mb-8">
          <button onClick={() => navigate('/')} className="focus:outline-none">
            <img 
              src="/lovable-uploads/b617ee5c-bf33-49d0-9752-4040f240cab6.png" 
              alt="G3MS Logo" 
              className="h-12 w-auto mx-auto hover:opacity-80 transition-opacity bg-white rounded-lg p-2 shadow-sm"
            />
          </button>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sm:p-8">
          <div className="text-center mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Welcome Back to G3MS
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Log in to continue your learning journey and access your rewards.
            </p>
          </div>

          <div className="space-y-3">
          {/* Google Login */}
          <Button 
            onClick={() => handleSocialLogin('google', false)}
            disabled={socialLoading || isLoading}
            className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 flex items-center justify-center gap-3 h-12 font-medium"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {socialLoading ? 'Signing in...' : 'Continue with Google'}
          </Button>

          {/* Microsoft Login */}
          <Button 
            onClick={() => handleSocialLogin('microsoft')}
            disabled={socialLoading || isLoading}
            className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 flex items-center justify-center gap-3 h-12 font-medium"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#00BCF2" d="M0 0h11.377v11.372H0V0z"/>
              <path fill="#00BCF2" d="M12.623 0H24v11.372H12.623V0z"/>
              <path fill="#00BCF2" d="M0 12.623h11.377V24H0V12.623z"/>
              <path fill="#00BCF2" d="M12.623 12.623H24V24H12.623V12.623z"/>
            </svg>
            Continue with Microsoft
          </Button>

            {/* Apple Login */}
            <Button 
              onClick={() => handleSocialLogin('apple', false)}
              disabled={socialLoading || isLoading}
              className="w-full bg-black hover:bg-gray-800 text-white flex items-center justify-center gap-3 h-12 font-medium"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Continue with Apple
            </Button>

            {/* ClassLink Login */}
            <Button 
              onClick={() => handleSocialLogin('classlink')}
              disabled={socialLoading || isLoading}
              className="w-full bg-[#1e5f99] hover:bg-[#1a5287] text-white flex items-center justify-center gap-3 h-12 font-medium"
            >
              <svg className="w-5 h-5" viewBox="0 0 100 100" fill="currentColor">
                <path d="M50 15c19.33 0 35 15.67 35 35s-15.67 35-35 35-35-15.67-35-35 15.67-35 35-35zm0-15C22.43 0 0 22.43 0 50s22.43 50 50 50 50-22.43 50-50S77.57 0 50 0z"/>
                <circle cx="35" cy="35" r="3"/>
                <path d="M35 40c-8 0-15 7-15 15v10h10V55c0-3 2-5 5-5s5 2 5 5v10h10V55c0-8-7-15-15-15z"/>
                <path d="M50 25l15 10-15 10V35h-10v10l-15-10 15-10V25z"/>
              </svg>
              Continue with ClassLink
            </Button>

            {/* OR Divider */}
            <div className="flex items-center gap-4 my-4">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="text-sm text-gray-500 font-medium">OR</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

          {/* Email & Password Form */}
          <form onSubmit={handleEmailLogin} className="space-y-3">
            <Input 
              placeholder="Enter your email" 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="h-12 border-gray-300 focus:border-g3ms-purple focus:ring-g3ms-purple"
              required
            />
            
            <div className="relative">
              <Input 
                placeholder="Enter your password" 
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="h-12 border-gray-300 focus:border-g3ms-purple focus:ring-g3ms-purple pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <Button 
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full bg-gradient-to-r from-g3ms-purple to-g3ms-purple hover:opacity-90 text-white h-12 font-medium"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          </div>


          <div className="text-center mt-6 space-y-3">
            <button className="text-sm text-blue-600 hover:text-blue-800 underline">
              Forgot your password?
            </button>
            <div>
              <span className="text-sm text-gray-600">Don't have an account? </span>
              <button 
                onClick={() => navigate('/drops')}
                className="text-sm text-g3ms-purple hover:text-g3ms-purple/80 underline font-medium"
              >
                Sign up here
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;