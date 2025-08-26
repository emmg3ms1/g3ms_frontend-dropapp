import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function AuthCallback() {
  const { handleAuthCallback } = useAuth();
  const navigate = useNavigate();
  const hasProcessed = useRef(false);
  const [status, setStatus] = useState<'processing' | 'success' | 'error' | 'mobile-redirect'>('processing');
  const [errorMessage, setErrorMessage] = useState('');

  // Check if this is a mobile OAuth callback (coming from mobile app)
  const isMobileCallback = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const mobileRegex = /Mobile|Android|iPhone|iPad/;
    return urlParams.has('mobile') || hashParams.has('mobile') || 
           document.referrer.includes('g3ms-dev://') ||
           mobileRegex.exec(navigator.userAgent);
  };

  const redirectToMobileApp = (session: any = null) => {
    const urlParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    
    // Get tokens from URL or session
    let access_token = urlParams.get('access_token') || hashParams.get('access_token');
    let refresh_token = urlParams.get('refresh_token') || hashParams.get('refresh_token');
    
    // If we have a session, use those tokens instead
    if (session?.access_token) {
      access_token = session.access_token;
      refresh_token = session.refresh_token;
    }

    if (access_token && refresh_token) {
      const deepLinkUrl = `g3ms-dev://auth?access_token=${encodeURIComponent(access_token)}&refresh_token=${encodeURIComponent(refresh_token)}`;
      
      console.log('🚀 Redirecting to mobile app:', deepLinkUrl);
      
      // Multiple redirect methods for better compatibility
      window.location.href = deepLinkUrl;
      
      // Fallback methods
      setTimeout(() => {
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = deepLinkUrl;
        document.body.appendChild(iframe);
        
        setTimeout(() => {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
        }, 1000);
      }, 500);
      
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = deepLinkUrl;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        if (document.body.contains(link)) {
          document.body.removeChild(link);
        }
      }, 1000);
      
      return true;
    }
    
    return false;
  };

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
        // Check if this is a mobile callback first
        if (isMobileCallback()) {
          console.log('📱 Mobile OAuth callback detected');
          
          // Try to redirect with tokens from URL first
          if (redirectToMobileApp()) {
            setStatus('mobile-redirect');
            return;
          }
        }

        // Process authentication normally
        await handleAuthCallback();
        console.log('✅ Auth callback completed successfully');
        
        // If this was a mobile callback, try to redirect back to mobile
        if (isMobileCallback()) {
          console.log('📱 Attempting to redirect authenticated user back to mobile app');
          setStatus('mobile-redirect');
          setTimeout(() => {
            // Try redirecting with current session data
            const urlParams = new URLSearchParams(window.location.search);
            const hashParams = new URLSearchParams(window.location.hash.substring(1));
            const access_token = urlParams.get('access_token') || hashParams.get('access_token');
            const refresh_token = urlParams.get('refresh_token') || hashParams.get('refresh_token');
            
            if (access_token && refresh_token) {
              redirectToMobileApp({ access_token, refresh_token });
            }
          }, 1000);
          return;
        }
        
        setStatus('success');
        
        // For web users, let auth context handle redirect after onboarding
        setTimeout(() => {
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
        
        {status === 'mobile-redirect' && (
          <>
            <div className="animate-pulse mb-4">
              <div className="w-16 h-16 bg-g3ms-purple rounded-full mx-auto flex items-center justify-center">
                <span className="text-white text-2xl">📱</span>
              </div>
            </div>
            <p className="text-foreground font-medium">Redirecting to G3MS App...</p>
            <p className="text-sm text-gray-500 mt-2">You should be redirected to the mobile app shortly.</p>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-600">If the app doesn't open automatically, please return to the G3MS mobile app.</p>
            </div>
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