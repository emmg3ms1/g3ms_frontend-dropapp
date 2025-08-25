import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '@/services/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const OnboardingRole = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelect = async (role: string) => {
    setIsLoading(true);
    
    try {
      const response = await apiService.setRole(role);
      
      if (response.state === 'PENDING_BIRTHDATE') {
        navigate('/onboarding/birthdate');
      } else {
        // Handle unexpected state
        toast.error('Unexpected onboarding state. Please try again.');
      }
    } catch (error: any) {
      console.error('Role selection error:', error);
      
      if (error.message.includes('409')) {
        toast.error('Role already set. Please continue with your onboarding.');
      } else if (error.message.includes('422')) {
        toast.error('Invalid role selected. Please try again.');
      } else if (error.message.includes('401')) {
        toast.error('Please log in again.');
        navigate('/login');
      } else {
        toast.error('Failed to set role. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const roles = [
    {
      id: 'student',
      title: 'Student',
      description: 'Join challenges and earn rewards',
    },
    {
      id: 'educator',
      title: 'Educator',
      description: 'Create and manage educational content',
    },
    {
      id: 'brand',
      title: 'Brand Partner',
      description: 'Connect with students and educators',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-g3ms-purple/5 to-g3ms-green/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Choose Your Role</CardTitle>
          <CardDescription>
            Select how you'd like to use G3MS
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {roles.map((role) => (
            <Button
              key={role.id}
              variant="outline"
              className="w-full h-auto p-4 flex flex-col items-start"
              onClick={() => handleRoleSelect(role.id)}
              disabled={isLoading}
            >
              <div className="font-semibold">{role.title}</div>
              <div className="text-sm text-muted-foreground">{role.description}</div>
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingRole;