import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SignupFlow } from '@/components/SignupFlow';

const Signup = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showSignupFlow, setShowSignupFlow] = useState(true);
  const step = searchParams.get('step');

  // If user closes the signup flow, redirect to home
  const handleClose = () => {
    setShowSignupFlow(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-g3ms-purple/5 to-g3ms-green/5 flex items-center justify-center">
      <SignupFlow 
        isOpen={showSignupFlow}
        onClose={handleClose}
        initialStep={step || undefined}
      />
      
      {/* Fallback content if modal is closed */}
      {!showSignupFlow && (
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Sign Up for G3MS</h1>
          <p className="text-gray-600 mb-6">Complete your account setup to continue</p>
          <button 
            onClick={() => setShowSignupFlow(true)}
            className="bg-g3ms-purple text-white px-6 py-2 rounded-lg hover:opacity-90"
          >
            Continue Setup
          </button>
        </div>
      )}
    </div>
  );
};

export default Signup;