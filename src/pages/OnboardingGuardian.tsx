import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '@/services/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const OnboardingGuardian = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    studentFirstName: '',
    studentLastName: '',
    parentFirstName: '',
    parentLastName: '',
    parentPhone: '+',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    if (!formData.studentFirstName || !formData.studentLastName || 
        !formData.parentFirstName || !formData.parentLastName || 
        !formData.parentPhone || formData.parentPhone === '+') {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await apiService.createGuardianRequest(formData);
      
      if (response.state === 'READY') {
        toast.success('Guardian request submitted! An approval SMS has been sent.');
        navigate('/dashboard');
      } else {
        toast.error('Unexpected onboarding state. Please try again.');
      }
    } catch (error: any) {
      console.error('Guardian request error:', error);
      
      if (error.message.includes('422')) {
        toast.error('Invalid information provided. Please check all fields.');
      } else if (error.message.includes('429')) {
        toast.error('Too many attempts. Please try again later.');
      } else if (error.message.includes('502')) {
        toast.error('SMS service error. Please try again later.');
      } else if (error.message.includes('401')) {
        toast.error('Please log in again.');
        navigate('/login');
      } else {
        toast.error('Failed to submit guardian request. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-g3ms-purple/5 to-g3ms-green/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Guardian Information</CardTitle>
          <CardDescription>
            Since you're under 13, we need a parent or guardian to approve your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="studentFirstName">Your First Name</Label>
                <Input
                  id="studentFirstName"
                  type="text"
                  value={formData.studentFirstName}
                  onChange={(e) => handleInputChange('studentFirstName', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="studentLastName">Your Last Name</Label>
                <Input
                  id="studentLastName"
                  type="text"
                  value={formData.studentLastName}
                  onChange={(e) => handleInputChange('studentLastName', e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="parentFirstName">Parent First Name</Label>
                <Input
                  id="parentFirstName"
                  type="text"
                  value={formData.parentFirstName}
                  onChange={(e) => handleInputChange('parentFirstName', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parentLastName">Parent Last Name</Label>
                <Input
                  id="parentLastName"
                  type="text"
                  value={formData.parentLastName}
                  onChange={(e) => handleInputChange('parentLastName', e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="parentPhone">Parent Phone Number</Label>
              <Input
                id="parentPhone"
                type="tel"
                value={formData.parentPhone}
                onChange={(e) => handleInputChange('parentPhone', e.target.value)}
                placeholder="+1234567890"
                required
              />
              <p className="text-sm text-muted-foreground">
                Include country code (e.g., +1 for US)
              </p>
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Submitting...' : 'Submit Guardian Request'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingGuardian;