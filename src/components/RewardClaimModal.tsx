import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface RewardClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  rewardType: 'giftcard' | 'event' | 'tokens';
  rewardData: {
    title: string;
    image?: string;
    website?: string;
    message: string;
    details: string;
    contactInfo?: string;
    amount?: string;
  };
}

const RewardClaimModal: React.FC<RewardClaimModalProps> = ({
  isOpen,
  onClose,
  rewardType,
  rewardData
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 gap-0 bg-white">
        <div className="relative bg-white rounded-lg overflow-hidden">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-200"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>

          <div className="p-6 space-y-6">
            {/* Reward Image/Icon - Prominent Display */}
            <div className="rounded-xl bg-black flex items-center justify-center p-8 min-h-[200px]">
              {rewardData.image ? (
                <img 
                  src={rewardData.image} 
                  alt={rewardData.title}
                  className="max-w-full max-h-48 object-contain"
                />
              ) : (
                <div className="w-40 h-40 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-5xl">
                    {rewardType === 'tokens' ? '💎' : rewardType === 'event' ? '🎟️' : '🎁'}
                  </span>
                </div>
              )}
            </div>

            {/* Title */}
            <h2 className="text-xl font-semibold text-center text-gray-900">
              {rewardData.title}
            </h2>

            {/* Website Link */}
            {rewardData.website && (
              <p className="text-center text-cyan-500 text-sm font-medium">
                {rewardData.website}
              </p>
            )}

            {/* Main Message */}
            <div className="text-center space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">
                {rewardData.message}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {rewardData.details}
              </p>
            </div>

            {/* Contact Info */}
            {rewardData.contactInfo && (
              <div className="bg-pink-50 rounded-lg p-4 border border-pink-200">
                <p className="text-sm font-medium text-pink-700 mb-2">
                  Your {rewardType === 'giftcard' ? 'eGift card' : 'reward'} will be sent to:
                </p>
                <div className="text-sm text-gray-800 whitespace-pre-line">
                  {rewardData.contactInfo}
                </div>
              </div>
            )}

            {/* Amount for tokens */}
            {rewardType === 'tokens' && rewardData.amount && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  +{rewardData.amount} Tokens
                </div>
                <p className="text-sm text-green-700 mt-1">Added to your account!</p>
              </div>
            )}

            {/* Done Button */}
            <Button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl h-12"
            >
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RewardClaimModal;