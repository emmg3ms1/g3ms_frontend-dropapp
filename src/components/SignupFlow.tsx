import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useDropData } from '@/contexts/DropDataContext';
import { apiService } from '@/services/api';
import { TokenManager } from '@/utils/cookies';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { X, ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

type SignupStep = 
  | 'social-login'
  | 'email-password' 
  | 'user-type' 
  | 'birthdate' 
  | 'age-verification' 
  | 'phone-number' 
  | 'phone-verification' 
  | 'guardian-info' 
  | 'guardian-pending' 
  | 'complete';

type OnboardingState = 
  | 'READY'
  | 'PENDING_ROLE'
  | 'PENDING_BIRTHDATE'
  | 'PENDING_PHONE_VERIFICATION'
  | 'PENDING_GUARDIAN_APPROVAL';

interface SignupFlowProps {
  isOpen: boolean;
  onClose: () => void;
  initialEmail?: string;
  preselectedUserType?: string;
  initialStep?: string;
}

export const SignupFlow: React.FC<SignupFlowProps> = ({ 
  isOpen, 
  onClose, 
  initialEmail = '', 
  preselectedUserType = '',
  initialStep
}) => {
  const { signup, user } = useAuth();
  const navigate = useNavigate();
  const { isDropCreationFlow, clearDropData } = useDropData();
  
  // Map URL step parameters to SignupStep values
  const getInitialStep = (): SignupStep => {
    // Check if this is a gated signup flow with stored onboarding state
    const gatedSignupFlow = sessionStorage.getItem('gated_signup_flow') === 'true';
    const storedOnboardingState = sessionStorage.getItem('signup_onboarding_state');
    
    if (gatedSignupFlow && storedOnboardingState) {
      // Resume from the appropriate onboarding step
      switch (storedOnboardingState) {
        case 'PENDING_ROLE':
          return 'user-type';
        case 'PENDING_BIRTHDATE':
          return 'birthdate';
        case 'PENDING_PHONE_VERIFICATION':
          return 'phone-number';
        case 'PENDING_GUARDIAN_INFO':
          return 'guardian-info';
        default:
          return 'email-password';
      }
    }
    
    if (!initialStep) return 'social-login';
    
    switch (initialStep) {
      case 'role':
        return 'user-type';
      case 'birthdate':
        return 'birthdate';
      case 'phone':
        return 'phone-number';
      case 'guardian':
        return 'guardian-info';
      default:
        return 'email-password';
    }
  };
  
  const [currentStep, setCurrentStep] = useState<SignupStep>(getInitialStep());
  const [isLoading, setIsLoading] = useState(false);
  const [onboardingState, setOnboardingState] = useState<OnboardingState | null>(null);
  const [formData, setFormData] = useState({
    email: initialEmail || '',
    password: '',
    userType: preselectedUserType || '',
    studentFirstName: '',
    studentLastName: '',
    parentFirstName: '',
    parentLastName: '',
    parentPhone: '',
    birthdate: '',
    phoneNumber: '',
    verificationCode: '',
    age: 0
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Update current step when initialStep prop changes
  useEffect(() => {
    if (initialStep) {
      const newStep = getInitialStep();
      setCurrentStep(newStep);
    }
  }, [initialStep]);

  if (!isOpen) return null;

  // Token validation utility with retry logic
  const validateTokenAvailability = async (maxRetries = 10, delayMs = 100): Promise<boolean> => {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      const token = TokenManager.getToken();
      if (token) {
        console.log('✅ Token found for API call');
        return true;
      }
      
      console.log(`⏳ Token not available, attempt ${attempt + 1}/${maxRetries}`);
      
      if (attempt < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delayMs * Math.pow(1.5, attempt))); // Exponential backoff
      }
    }
    
    console.error('❌ Token not available after maximum retries');
    return false;
  };

  // Enhanced API call wrapper with authentication validation
  const makeAuthenticatedApiCall = async <T,>(
    apiCall: () => Promise<T>,
    errorContext: string
  ): Promise<T> => {
    try {
      // First, validate token availability
      const tokenAvailable = await validateTokenAvailability();
      if (!tokenAvailable) {
        throw new Error('Authentication token not available. Please try signing up again.');
      }

      // Make the API call
      return await apiCall();
    } catch (error: any) {
      console.error(`API call failed (${errorContext}):`, error);
      
      // Handle specific authentication errors
      if (error.message.includes('401') || error.message.includes('Invalid or expired token')) {
        throw new Error('Authentication expired. Please sign up again.');
      } else if (error.message.includes('403')) {
        throw new Error('Access denied. Please contact support.');
      }
      
      // Re-throw original error for other cases
      throw error;
    }
  };

  const redirectToRoleDashboard = () => {
    const userRole = user?.role || formData.userType;
    
    switch (userRole) {
      case 'student':
        navigate('/drops/main');
        break;
      case 'educator':
        // Check if this is a drop creation flow
        if (isDropCreationFlow) {
          navigate('/educator/dashboard');
        } else {
          navigate('/drops/main');
        }
        break;
      case 'brand':
      case 'creator':
        navigate('/profile'); // Brands and creators start with profile setup
        break;
      default:
        navigate('/drops/main'); // Default to main drops page
    }
  };

  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const handleNext = async () => {
    if (!isStepValid()) return;
    
    setLoading(true);
    setError('');

    try {
      switch (currentStep) {
        case 'email-password':
          // Step 0: Registration - Use AuthContext which handles post-auth flow
          try {
            await signup({
              email: formData.email,
              password: formData.password
            });
            
            // For gated signup flow, AuthContext stores onboarding state and returns early
            // We need to advance to the next onboarding step manually
            const isGatedSignupFlow = sessionStorage.getItem('gated_signup_flow') === 'true';
            if (isGatedSignupFlow) {
              // Check if onboarding state was stored and advance accordingly
              let retries = 0;
              const checkAndAdvance = async () => {
                const storedState = sessionStorage.getItem('signup_onboarding_state');
                if (storedState || retries > 10) { // Max 1 second wait
                  if (storedState) {
                    await advanceOnboardingFlow();
                  } else {
                    // Fallback if no state was stored - start with role selection
                    setCurrentStep('user-type');
                  }
                } else {
                  retries++;
                  setTimeout(checkAndAdvance, 100);
                }
              };
              await checkAndAdvance();
            }
            // For non-gated flows, AuthContext handles the complete post-auth flow
          } catch (error: any) {
            // Handle specific signup errors
            if (error.message.includes('already exists') || error.message.includes('User already registered')) {
              // Check if this user actually completed signup and we should advance
              const isGatedSignupFlow = sessionStorage.getItem('gated_signup_flow') === 'true';
              if (isGatedSignupFlow) {
                // Try to get the onboarding status to see if the user was actually created
                try {
                  await advanceOnboardingFlow();
                  return; // Successfully advanced, don't show error
                } catch (statusError) {
                  // If we can't get status, show the original error
                }
              }
              setError('An account with this email already exists. Please try logging in instead.');
            } else if (error.message.includes('password')) {
              setError('Password must be at least 8 characters long and contain letters and numbers.');
            } else {
              setError(error.message || 'Failed to create account. Please try again.');
            }
            return;
          }
          break;

        case 'user-type':
          // Step 2: Role Selection
          try {
            await makeAuthenticatedApiCall(
              () => apiService.setRole(formData.userType),
              'Role Selection'
            );
            await advanceOnboardingFlow();
          } catch (error: any) {
            if (error.message.includes('Authentication')) {
              setError('Authentication expired. Please sign up again.');
              setCurrentStep('email-password');
            } else if (error.message.includes('409')) {
              setError('Role has already been set for this account.');
            } else if (error.message.includes('422')) {
              setError('Please select a valid user type.');
            } else {
              setError(error.message || 'Failed to set user type. Please try again.');
            }
            return;
          }
          break;

        case 'birthdate':
          // Step 3: Student Birthdate
          try {
            await makeAuthenticatedApiCall(
              () => apiService.setBirthdate(formData.birthdate),
              'Birthdate Setting'
            );
            
            // Check age after setting birthdate
            const birthDate = new Date(formData.birthdate);
            const age = calculateAge(birthDate);
            setFormData(prev => ({ ...prev, age }));
            
            // If under 13, show age verification screen first
            if (age < 13) {
              setCurrentStep('age-verification');
            } else {
              await advanceOnboardingFlow();
            }
          } catch (error: any) {
            if (error.message.includes('Authentication')) {
              setError('Authentication expired. Please sign up again.');
              setCurrentStep('email-password');
            } else if (error.message.includes('409')) {
              setError('Birthdate has already been set for this account.');
            } else if (error.message.includes('422')) {
              setError('Please enter a valid birthdate (not in the future).');
            } else {
              setError(error.message || 'Failed to set birthdate. Please try again.');
            }
            return;
          }
          break;
          
        case 'age-verification':
          // For under 13 users, go to guardian info collection
          setCurrentStep('guardian-info');
          break;

        case 'phone-number':
          // Step 4a: Send OTP
          try {
            await makeAuthenticatedApiCall(
              () => apiService.sendPhoneOTP(formData.phoneNumber),
              'Phone OTP Send'
            );
            setCurrentStep('phone-verification');
          } catch (error: any) {
            if (error.message.includes('Authentication')) {
              setError('Authentication expired. Please sign up again.');
              setCurrentStep('email-password');
            } else if (error.message.includes('422')) {
              setError('Please enter a valid phone number.');
            } else if (error.message.includes('429')) {
              setError('Too many attempts. Please try again later.');
            } else if (error.message.includes('502')) {
              setError('Unable to send SMS. Please try again.');
            } else {
              setError(error.message || 'Failed to send verification code. Please try again.');
            }
            return;
          }
          break;

        case 'phone-verification':
          // Step 4b: Verify OTP
          try {
            await makeAuthenticatedApiCall(
              () => apiService.verifyPhoneOTP(formData.phoneNumber, formData.verificationCode),
              'Phone OTP Verification'
            );
            await advanceOnboardingFlow();
          } catch (error: any) {
            if (error.message.includes('Authentication')) {
              setError('Authentication expired. Please sign up again.');
              setCurrentStep('email-password');
            } else if (error.message.includes('400')) {
              setError('Invalid or expired verification code. Please try again.');
            } else if (error.message.includes('410')) {
              setError('This verification code has already been used.');
            } else if (error.message.includes('409')) {
              setError('This phone number is already associated with another account.');
            } else if (error.message.includes('422')) {
              setError('Invalid verification code format.');
            } else {
              setError(error.message || 'Failed to verify code. Please try again.');
            }
            return;
          }
          break;

        case 'guardian-info':
          // Step 5: Guardian Approval Request
          try {
            await makeAuthenticatedApiCall(
              () => apiService.createGuardianRequest({
                studentFirstName: formData.studentFirstName,
                studentLastName: formData.studentLastName,
                parentFirstName: formData.parentFirstName,
                parentLastName: formData.parentLastName,
                parentPhone: formData.parentPhone
              }),
              'Guardian Request Creation'
            );
            // After successful guardian request, complete the flow
            setCurrentStep('complete');
          } catch (error: any) {
            if (error.message.includes('Authentication')) {
              setError('Authentication expired. Please sign up again.');
              setCurrentStep('email-password');
            } else if (error.message.includes('422')) {
              setError('Please enter valid names and parent phone number.');
            } else if (error.message.includes('429')) {
              setError('Too many attempts. Please try again later.');
            } else if (error.message.includes('502')) {
              setError('Unable to send SMS to parent. Please try again.');
            } else {
              setError(error.message || 'Failed to send guardian request. Please try again.');
            }
            return;
          }
          break;

        case 'guardian-pending':
          // Poll for guardian approval
          await advanceOnboardingFlow();
          break;

        case 'complete':
          // Clean up gated signup flow session flags
          const wasGatedSignupFlow = sessionStorage.getItem('gated_signup_flow') === 'true';
          if (wasGatedSignupFlow) {
            sessionStorage.removeItem('gated_signup_flow');
            sessionStorage.removeItem('signup_onboarding_state');
          }
          
          onClose();
          
          // Redirect to appropriate dashboard based on user role
          redirectToRoleDashboard();
          break;

        default:
          await advanceOnboardingFlow();
      }
    } catch (error: any) {
      console.error('Signup flow error:', error);
      
      // Handle authentication errors
      if (error.message.includes('401') || error.message.includes('not authenticated')) {
        setError('Authentication failed. Please try signing up again.');
        setCurrentStep('email-password');
      } else {
        setError(error.message || 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Status Gate - Check onboarding status and branch accordingly
  const advanceOnboardingFlow = async () => {
    try {
      const statusResult = await makeAuthenticatedApiCall(
        () => apiService.getOnboardingStatus(),
        'Onboarding Status Check'
      );
      
      switch (statusResult.state) {
        case 'PENDING_ROLE':
          setCurrentStep('user-type');
          break;
        case 'PENDING_BIRTHDATE':
          setCurrentStep('birthdate');
          break;
        case 'PENDING_PHONE_VERIFICATION':
          setCurrentStep('phone-number');
          break;
        case 'PENDING_GUARDIAN_INFO':
          setCurrentStep('guardian-pending');
          break;
        case 'READY':
          setCurrentStep('complete');
          break;
        default:
          console.warn('Unknown onboarding state:', statusResult.state);
          setCurrentStep('user-type'); // Fallback
      }
    } catch (error: any) {
      console.error('Failed to get onboarding status:', error);
      
      // Handle authentication errors specifically
      if (error.message.includes('Authentication')) {
        setError('Authentication expired. Please sign up again.');
        setCurrentStep('email-password');
        return;
      }
      
      throw error;
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'email-password':
        setCurrentStep('social-login');
        break;
      case 'user-type':
        setCurrentStep('email-password');
        break;
      case 'birthdate':
        setCurrentStep('user-type');
        break;
      case 'age-verification':
        setCurrentStep('birthdate');
        break;
      case 'phone-number':
        setCurrentStep('birthdate');
        break;
      case 'phone-verification':
        setCurrentStep('phone-number');
        break;
      case 'guardian-info':
        setCurrentStep('age-verification');
        break;
      case 'guardian-pending':
        setCurrentStep('guardian-info');
        break;
      case 'complete':
        setCurrentStep('phone-verification');
        break;
    }
  };

  const getStepProgress = () => {
    const gatedSignupFlow = sessionStorage.getItem('gated_signup_flow') === 'true';
    const storedOnboardingState = sessionStorage.getItem('signup_onboarding_state');
    
    // If this is a gated signup flow resuming from onboarding, adjust progress calculation
    if (gatedSignupFlow && storedOnboardingState) {
      const steps = ['social-login', 'email-password', 'user-type', 'birthdate', 'phone-number', 'phone-verification', 'guardian-info', 'guardian-pending', 'complete'];
      const currentIndex = steps.indexOf(currentStep);
      
      // For resumed flows, we skip the social-login and email-password steps since they're already completed
      if (currentStep !== 'social-login' && currentStep !== 'email-password') {
        const adjustedSteps = steps.slice(2); // Remove 'social-login' and 'email-password' from calculation
        const adjustedIndex = adjustedSteps.indexOf(currentStep);
        return ((adjustedIndex + 1) / adjustedSteps.length) * 100;
      }
    }
    
    // Default progress calculation for new flows
    const steps = ['social-login', 'email-password', 'user-type', 'birthdate', 'phone-number', 'phone-verification', 'guardian-info', 'guardian-pending', 'complete'];
    const currentIndex = steps.indexOf(currentStep);
    return ((currentIndex + 1) / steps.length) * 100;
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 'email-password':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return formData.email && 
               emailRegex.test(formData.email) &&
               formData.password && 
               formData.password.length >= 8;
      case 'user-type':
        return formData.userType !== '';
      case 'birthdate':
        return formData.birthdate !== '';
      case 'age-verification':
        return true;
      case 'phone-number':
        return formData.phoneNumber !== '';
      case 'phone-verification':
        return formData.verificationCode.length === 6;
      case 'guardian-info':
        return formData.studentFirstName && formData.studentLastName && formData.parentFirstName && formData.parentLastName && formData.parentPhone;
      default:
        return true;
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'social-login':
        return (
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-bold">Welcome to G3MS</h2>
              <p className="text-muted-foreground">
                Sign up to start your learning journey and access your rewards.
              </p>
            </div>
            
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full h-12 text-left justify-start gap-3"
                onClick={() => {/* TODO: Implement Google signup */}}
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-4 h-4">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </div>
                Continue with Google
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full h-12 text-left justify-start gap-3"
                onClick={() => {/* TODO: Implement Microsoft signup */}}
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-4 h-4">
                    <path fill="#F25022" d="M11.4 11.4H0V0h11.4v11.4z"/>
                    <path fill="#00A4EF" d="M24 11.4H12.6V0H24v11.4z"/>
                    <path fill="#7FBA00" d="M11.4 24H0V12.6h11.4V24z"/>
                    <path fill="#FFB900" d="M24 24H12.6V12.6H24V24z"/>
                  </svg>
                </div>
                Continue with Microsoft
              </Button>
              
              <Button 
                variant="default" 
                className="w-full h-12 text-left justify-start gap-3 bg-black text-white hover:bg-gray-800"
                onClick={() => {/* TODO: Implement Apple signup */}}
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
                  </svg>
                </div>
                Continue with Apple
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full h-12 text-left justify-start gap-3 bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => {/* TODO: Implement ClassLink signup */}}
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                    <circle cx="12" cy="12" r="10"/>
                  </svg>
                </div>
                Continue with ClassLink
              </Button>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">OR</span>
              </div>
            </div>
            
            <Button 
              variant="outline"
              className="w-full"
              onClick={() => setCurrentStep('email-password')}
            >
              Sign up with Email & Password
            </Button>
            
            <div className="text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <button 
                className="text-primary hover:underline"
                onClick={() => {
                  onClose();
                  // TODO: Navigate to login page
                }}
              >
                Sign in here
              </button>
            </div>
          </div>
        );

      case 'email-password':
        return (
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-bold">Create Your Account</h2>
              <p className="text-muted-foreground">Enter your email and create a secure password</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  placeholder="your.email@example.com"
                />
                {error && error.includes('email') && (
                  <p className="text-sm text-destructive">{error}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => updateFormData('password', e.target.value)}
                  placeholder="At least 8 characters"
                />
                {error && error.includes('password') && (
                  <p className="text-sm text-destructive">{error}</p>
                )}
                {formData.password && formData.password.length < 8 && !error && (
                  <p className="text-sm text-muted-foreground">Password must be at least 8 characters long</p>
                )}
              </div>
            </div>
          </div>
        );

      case 'user-type':
        return (
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-bold">I Am A...</h2>
              <p className="text-muted-foreground">Tell us which best describes you</p>
            </div>
            <div className="space-y-3">
              {[
                { value: 'student', label: '🎓 Student', description: 'I want to learn and participate in drops' },
                { value: 'educator', label: '👩‍🏫 Educator', description: 'I teach and want to use G3MS in my classroom' },
                { value: 'brand', label: '🏢 Brand', description: 'I represent a company or organization' },
                { value: 'creator', label: '🎨 Creator', description: 'I create content and want to collaborate' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateFormData('userType', option.value)}
                  className={`w-full p-4 text-left border-2 rounded-xl transition-all ${
                    formData.userType === option.value 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:bg-accent'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{option.label.split(' ')[0]}</div>
                    <div>
                      <div className="font-semibold">{option.label.split(' ').slice(1).join(' ')}</div>
                      <div className="text-sm text-muted-foreground mt-1">{option.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 'birthdate':
        return (
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-bold">When's Your Birthday?</h2>
              <p className="text-muted-foreground">This helps us create an age-appropriate experience</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="birthdate">Date of Birth</Label>
              <Input
                id="birthdate"
                type="date"
                value={formData.birthdate}
                onChange={(e) => updateFormData('birthdate', e.target.value)}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
        );

      case 'age-verification':
        return (
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <AlertCircle className="w-12 h-12 mx-auto text-primary" />
              <h2 className="text-2xl font-bold">Special Requirements</h2>
              <p className="text-muted-foreground">Since you're under 13, we need a guardian's approval</p>
            </div>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                We follow COPPA guidelines to keep young learners safe online.
              </AlertDescription>
            </Alert>
          </div>
        );

      case 'guardian-info':
        return (
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-bold">Guardian Information</h2>
              <p className="text-muted-foreground">We'll send an approval request to your guardian</p>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="studentFirstName">Your First Name</Label>
                  <Input
                    id="studentFirstName"
                    value={formData.studentFirstName}
                    onChange={(e) => updateFormData('studentFirstName', e.target.value)}
                    placeholder="First name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="studentLastName">Your Last Name</Label>
                  <Input
                    id="studentLastName"
                    value={formData.studentLastName}
                    onChange={(e) => updateFormData('studentLastName', e.target.value)}
                    placeholder="Last name"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="parentFirstName">Guardian's First Name</Label>
                  <Input
                    id="parentFirstName"
                    value={formData.parentFirstName}
                    onChange={(e) => updateFormData('parentFirstName', e.target.value)}
                    placeholder="Guardian first name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parentLastName">Guardian's Last Name</Label>
                  <Input
                    id="parentLastName"
                    value={formData.parentLastName}
                    onChange={(e) => updateFormData('parentLastName', e.target.value)}
                    placeholder="Guardian last name"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="parentPhone">Guardian's Phone Number</Label>
                <Input
                  id="parentPhone"
                  type="tel"
                  value={formData.parentPhone}
                  onChange={(e) => {
                    let value = e.target.value;
                    // Ensure it starts with +
                    if (!value.startsWith('+') && value.length > 0) {
                      value = '+' + value.replace(/^\+*/, '');
                    }
                    updateFormData('parentPhone', value);
                  }}
                  placeholder="+1234567890"
                />
              </div>
            </div>
          </div>
        );

      case 'phone-number':
        return (
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-bold">Verify Your Phone</h2>
              <p className="text-muted-foreground">We'll send you a verification code</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => {
                  let value = e.target.value;
                  // Ensure it starts with +
                  if (!value.startsWith('+') && value.length > 0) {
                    value = '+' + value.replace(/^\+*/, '');
                  }
                  updateFormData('phoneNumber', value);
                }}
                placeholder="+1234567890"
              />
              {error && error.includes('phone') && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>
          </div>
        );

      case 'phone-verification':
        return (
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-bold">Enter Verification Code</h2>
              <p className="text-muted-foreground">Check your phone for a 6-digit code</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="verificationCode">Verification Code</Label>
              <Input
                id="verificationCode"
                value={formData.verificationCode}
                onChange={(e) => updateFormData('verificationCode', e.target.value)}
                placeholder="123456"
                maxLength={6}
              />
              {error && error.includes('code') && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>
          </div>
        );

      case 'guardian-pending':
        return (
          <div className="space-y-6 text-center">
            <Check className="w-16 h-16 mx-auto text-green-500" />
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Request Sent!</h2>
              <p className="text-muted-foreground">
                We've sent an approval request to your guardian. They'll receive an SMS with instructions.
              </p>
            </div>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Your account will be activated once your guardian approves the request.
              </AlertDescription>
            </Alert>
          </div>
        );

      case 'complete':
        return (
          <div className="space-y-6 text-center">
            <Check className="w-16 h-16 mx-auto text-green-500" />
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Welcome to G3MS!</h2>
              <p className="text-muted-foreground">Your account is ready. Let's start your journey!</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getButtonText = () => {
    switch (currentStep) {
      case 'email-password':
        return 'Create Account';
      case 'guardian-pending':
        return 'Check Status';
      case 'complete':
        return 'Get Started';
      default:
        return 'Continue';
    }
  };

  const showBackButton = () => {
    const gatedSignupFlow = sessionStorage.getItem('gated_signup_flow') === 'true';
    const storedOnboardingState = sessionStorage.getItem('signup_onboarding_state');
    
    // For gated signup flows resuming from onboarding, don't show back button on the first resumed step
    if (gatedSignupFlow && storedOnboardingState && currentStep !== 'complete') {
      // If we're at the step that matches the stored state, don't show back button
      const stateStepMap: { [key: string]: SignupStep } = {
        'PENDING_ROLE': 'user-type',
        'PENDING_BIRTHDATE': 'birthdate',
        'PENDING_PHONE_VERIFICATION': 'phone-number',
        'PENDING_GUARDIAN_INFO': 'guardian-info'
      };
      
      if (stateStepMap[storedOnboardingState] === currentStep) {
        return false;
      }
    }
    
    return currentStep !== 'email-password' && currentStep !== 'complete';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute right-0 top-0"
          >
            <X className="h-4 w-4" />
          </Button>
          <Progress value={getStepProgress()} className="mb-4" />
          <CardTitle className="text-center">Sign Up for G3MS</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {renderStepContent()}
          
          <div className="flex gap-2">
            {showBackButton() && (
              <Button variant="outline" onClick={handleBack} className="flex-1">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={!isStepValid() || loading}
              className="flex-1"
            >
              {loading ? 'Processing...' : getButtonText()}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};