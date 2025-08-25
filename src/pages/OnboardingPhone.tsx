import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '@/services/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const OnboardingPhone = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('+');
  const [code, setCode] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone || phone === '+') {
      toast.error('Please enter a valid phone number');
      return;
    }

    setIsLoading(true);
    
    try {
      await apiService.sendPhoneOTP(phone);
      setIsOtpSent(true);
      toast.success('Verification code sent!');
    } catch (error: any) {
      console.error('OTP send error:', error);
      
      if (error.message.includes('422')) {
        toast.error('Invalid phone number format. Please use E.164 format (e.g., +1234567890)');
      } else if (error.message.includes('429')) {
        toast.error('Too many attempts. Please try again later.');
      } else if (error.message.includes('502')) {
        toast.error('SMS service error. Please try again later.');
      } else if (error.message.includes('401')) {
        toast.error('Please log in again.');
        navigate('/login');
      } else {
        toast.error('Failed to send verification code. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code) {
      toast.error('Please enter the verification code');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await apiService.verifyPhoneOTP(phone, code);
      
      if (response.state === 'READY') {
        toast.success('Phone verified successfully!');
        navigate('/dashboard');
      } else {
        toast.error('Unexpected onboarding state. Please try again.');
      }
    } catch (error: any) {
      console.error('OTP verify error:', error);
      
      if (error.message.includes('400') || error.message.includes('410')) {
        toast.error('Invalid or expired verification code. Please try again.');
      } else if (error.message.includes('409')) {
        toast.error('This phone number is already in use.');
      } else if (error.message.includes('422')) {
        toast.error('Invalid verification code format.');
      } else if (error.message.includes('401')) {
        toast.error('Please log in again.');
        navigate('/login');
      } else {
        toast.error('Failed to verify code. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-g3ms-purple/5 to-g3ms-green/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Verify Your Phone Number</CardTitle>
          <CardDescription>
            We'll send you a verification code to complete setup
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isOtpSent ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1234567890"
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Include country code (e.g., +1 for US)
                </p>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send Verification Code'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Verification Code</Label>
                <Input
                  id="code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Code sent to {phone}
                </p>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Verifying...' : 'Verify Code'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={() => setIsOtpSent(false)}
              >
                Change Phone Number
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingPhone;