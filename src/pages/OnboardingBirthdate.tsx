import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '@/services/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const OnboardingBirthdate = () => {
  const navigate = useNavigate();
  const [birthDate, setBirthDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!birthDate) {
      toast.error('Please enter your birth date');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await apiService.setBirthdate(birthDate);
      
      if (response.state === 'PENDING_PHONE_VERIFICATION') {
        navigate('/onboarding/phone');
      } else if (response.state === 'PENDING_GUARDIAN_INFO') {
        navigate('/onboarding/guardian');
      } else {
        toast.error('Unexpected onboarding state. Please try again.');
      }
    } catch (error: any) {
      console.error('Birthdate submission error:', error);
      
      if (error.message.includes('409')) {
        toast.error('Birth date already set. Please continue with your onboarding.');
      } else if (error.message.includes('422')) {
        toast.error('Invalid birth date. Please enter a valid date.');
      } else if (error.message.includes('401')) {
        toast.error('Please log in again.');
        navigate('/login');
      } else {
        toast.error('Failed to set birth date. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-g3ms-purple/5 to-g3ms-green/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Enter Your Birth Date</CardTitle>
          <CardDescription>
            We need this information to provide age-appropriate content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="birthdate">Birth Date</Label>
              <Input
                id="birthdate"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Submitting...' : 'Continue'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingBirthdate;