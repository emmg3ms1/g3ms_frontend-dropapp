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
      <DialogContent className="sm:max-w-md p-0 gap-0">
        <div className="relative bg-white rounded-lg">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>

          <div className="p-6 space-y-4">
            {/* Reward Image/Icon */}
            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
              {rewardData.image ? (
                <img 
                  src={rewardData.image} 
                  alt={rewardData.title}
                  className="w-full max-w-sm mx-auto rounded-lg"
                />
              ) : (
                <div className="w-full h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
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
              <p className="text-center text-blue-600 text-sm">
                {rewardData.website}
              </p>
            )}

            {/* Main Message */}
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium text-gray-900">
                {rewardData.message}
              </h3>
              <p className="text-sm text-gray-600">
                {rewardData.details}
              </p>
            </div>

            {/* Contact Info */}
            {rewardData.contactInfo && (
              <div className="bg-pink-50 rounded-lg p-3">
                <p className="text-sm font-medium text-pink-700 mb-1">
                  Your {rewardType === 'giftcard' ? 'eGift card' : 'reward'} will be sent to:
                </p>
                <p className="text-sm text-gray-800">
                  {rewardData.contactInfo}
                </p>
              </div>
            )}

            {/* Amount for tokens */}
            {rewardType === 'tokens' && rewardData.amount && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  +{rewardData.amount} Tokens
                </div>
                <p className="text-sm text-green-700">Added to your account!</p>
              </div>
            )}

            {/* Done Button */}
            <Button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl"
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