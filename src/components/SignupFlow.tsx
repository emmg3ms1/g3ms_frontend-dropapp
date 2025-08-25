import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useDropData } from '@/contexts/DropDataContext';
import { apiService } from '@/services/api';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { X, ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

type SignupStep = 
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
    if (!initialStep) return 'email-password';
    
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
          // Step 0: Registration
          try {
            const signupResult = await apiService.signup({
              email: formData.email,
              password: formData.password
            });
            
            // Store session data
            const session = signupResult.session;
            if (session?.access_token) {
              const { TokenManager } = await import('@/utils/cookies');
              const { sessionManager } = await import('@/utils/security');
              TokenManager.setToken(session.access_token);
              if (session.refresh_token) {
                TokenManager.setRefreshToken(session.refresh_token);
              }
              sessionManager.startSession();
            }

            // For email/password signup, let auth context handle the flow
            // The signup() method in auth context will call handlePostAuthFlow
            onClose();
          } catch (error: any) {
            // Handle specific signup errors
            if (error.message.includes('already exists')) {
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
            await apiService.setRole(formData.userType);
            await advanceOnboardingFlow();
          } catch (error: any) {
            if (error.message.includes('409')) {
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
            await apiService.setBirthdate(formData.birthdate);
            
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
            if (error.message.includes('409')) {
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
            await apiService.sendPhoneOTP(formData.phoneNumber);
            setCurrentStep('phone-verification');
          } catch (error: any) {
            if (error.message.includes('422')) {
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
            await apiService.verifyPhoneOTP(formData.phoneNumber, formData.verificationCode);
            await advanceOnboardingFlow();
          } catch (error: any) {
            if (error.message.includes('400')) {
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
            await apiService.createGuardianRequest({
              studentFirstName: formData.studentFirstName,
              studentLastName: formData.studentLastName,
              parentFirstName: formData.parentFirstName,
              parentLastName: formData.parentLastName,
              parentPhone: formData.parentPhone
            });
            // After successful guardian request, complete the flow
            setCurrentStep('complete');
          } catch (error: any) {
            if (error.message.includes('422')) {
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
          onClose();
          // Auth context will handle redirection through postAuth flow
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
      const statusResult = await apiService.getOnboardingStatus();
      
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
      throw error;
    }
  };

  const handleBack = () => {
    switch (currentStep) {
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
    const steps = ['email-password', 'user-type', 'birthdate', 'phone-number', 'phone-verification', 'guardian-info', 'guardian-pending', 'complete'];
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

  const showBackButton = currentStep !== 'email-password' && currentStep !== 'complete';

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
            {showBackButton && (
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