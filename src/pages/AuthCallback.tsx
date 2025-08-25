import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export default function AuthCallback() {
  const { handleAuthCallback } = useAuth();
  const navigate = useNavigate();
  const hasProcessed = useRef(false);
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const processCallback = async () => {
      // Prevent multiple executions
      if (hasProcessed.current) {
        console.log('🔄 AuthCallback already processed, skipping');
        return;
      }
      
      hasProcessed.current = true;
      console.log('🎯 AuthCallback: Processing callback once');
      setStatus('processing');

      try {
        await handleAuthCallback();
        console.log('✅ Auth callback completed successfully');
        setStatus('success');
        
        // Don't redirect here - let the auth context handle the proper redirect
        setTimeout(() => {
          // The auth context will handle the redirect based on onboarding state
          console.log('✅ Auth callback processing complete');
        }, 1500);
      } catch (error) {
        console.error('❌ Auth callback error:', error);
        setStatus('error');
        setErrorMessage(error instanceof Error ? error.message : 'Authentication failed');
        
        // Redirect to login page if authentication fails
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 3000);
      }
    };

    // Add a small delay to ensure the URL parameters and session are fully loaded
    const timer = setTimeout(processCallback, 500);
    
    return () => {
      clearTimeout(timer);
    };
  }, [handleAuthCallback, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        {status === 'processing' && (
          <>
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-g3ms-purple" />
            <p className="text-muted-foreground">Completing sign-in...</p>
            <p className="text-sm text-gray-500 mt-2">Connecting with your provider...</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <CheckCircle className="h-8 w-8 mx-auto mb-4 text-green-500" />
            <p className="text-foreground font-medium">Sign-in successful!</p>
            <p className="text-sm text-gray-500 mt-2">Redirecting to your dashboard...</p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <AlertCircle className="h-8 w-8 mx-auto mb-4 text-red-500" />
            <p className="text-foreground font-medium">Sign-in failed</p>
            <p className="text-sm text-gray-500 mt-2">{errorMessage}</p>
            <p className="text-xs text-gray-400 mt-2">Redirecting to login page...</p>
          </>
        )}
      </div>
    </div>
  );
}