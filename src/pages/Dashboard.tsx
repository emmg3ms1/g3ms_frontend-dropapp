import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleRoleRedirect = () => {
    const userRole = user?.role;
    
    switch (userRole) {
      case 'student':
        navigate('/drops/main');
        break;
      case 'educator':
        navigate('/educator/dashboard');
        break;
      case 'brand':
        navigate('/brands/dashboard');
        break;
      default:
        navigate('/drops/main');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-g3ms-purple/5 to-g3ms-green/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Welcome to G3MS!</CardTitle>
          <CardDescription>
            Your onboarding is complete. Ready to get started?
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Welcome, {user?.email}! You're all set to start using G3MS.
          </p>
          <Button onClick={handleRoleRedirect} className="w-full">
            Continue to {user?.role === 'brand' ? 'Brand Dashboard' : user?.role === 'educator' ? 'Educator Dashboard' : 'Drops'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;