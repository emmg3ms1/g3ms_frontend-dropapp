import React, { useEffect, ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import { OnboardingState } from '@/types/auth';

interface OnboardingGuardProps {
  children: ReactNode;
}

// Routing map for onboarding states
const getRouteForState = (state: OnboardingState): string => {
  switch (state) {
    case 'PENDING_ROLE':
      return '/onboarding/role';
    case 'PENDING_BIRTHDATE':
      return '/onboarding/birthdate';
    case 'PENDING_PHONE_VERIFICATION':
      return '/onboarding/phone';
    case 'PENDING_GUARDIAN_INFO':
      return '/onboarding/guardian';
    case 'READY':
      return '/dashboard';
    default:
      return '/onboarding/role';
  }
};

export function OnboardingGuard({ children }: OnboardingGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Allow access to public routes without any onboarding checks
  const isPublicRoute = location.pathname.startsWith('/onboarding') || 
                       location.pathname === '/login' || 
                       location.pathname === '/signup' ||
                       location.pathname === '/' ||
                       location.pathname === '/dashboard' ||
                       location.pathname === '/auth/callback';

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      // Only check onboarding status for authenticated users on non-public routes
      // Wait for loading to complete before checking
      if (!isAuthenticated || !user || isPublicRoute || isLoading) return;

      try {
        const { state } = await apiService.getOnboardingStatus();
        const requiredRoute = getRouteForState(state);
        
        // Only redirect if we're not already on the correct route
        if (location.pathname !== requiredRoute && state !== 'READY') {
          window.location.href = requiredRoute;
        }
      } catch (error) {
        console.error('Failed to check onboarding status:', error);
        // If there's an error, redirect to role selection
        if (location.pathname !== '/onboarding/role') {
          window.location.href = '/onboarding/role';
        }
      }
    };

    checkOnboardingStatus();
  }, [isAuthenticated, user, location.pathname, isPublicRoute, isLoading]);

  // For public routes, always render children regardless of auth status
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // For protected routes, require authentication
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}