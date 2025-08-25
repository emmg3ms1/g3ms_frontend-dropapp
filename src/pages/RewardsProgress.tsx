import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RewardsSection } from '@/components/RewardsSection';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const RewardsProgress = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 overflow-x-hidden">
      <div className="p-6">
        {/* Back Button with G3MS styling */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/drops/main')}
            className="flex items-center gap-2 hover:bg-white/50 text-g3ms-purple hover:text-g3ms-purple"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Drops
          </Button>
        </div>
        
        <div className="flex justify-center items-start">
          <RewardsSection />
        </div>
      </div>
    </div>
  );
};

export default RewardsProgress;