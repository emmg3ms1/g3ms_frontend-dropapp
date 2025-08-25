
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Gift, Clock, Trophy, X, Smartphone, Globe } from "lucide-react";

interface SummerOfferPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SummerOfferPopup = ({ open, onOpenChange }: SummerOfferPopupProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xs sm:max-w-sm mx-auto p-0 bg-white text-gray-900 border-0 left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]" hideCloseButton>
        <div className="relative p-3 sm:p-4">
          {/* Close button */}
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 transition-colors z-10 p-1"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <DialogHeader className="text-center mb-3 mt-4 sm:mt-2">
            <div className="flex items-center justify-center mb-2">
              <div className="bg-g3ms-purple/20 backdrop-blur-md rounded-full p-1.5">
                <Gift className="w-4 h-4 text-g3ms-purple" />
              </div>
            </div>
            <DialogTitle className="text-base sm:text-lg font-bold text-gray-900 leading-tight text-center px-2">
              Summer Challenge Starts July 1st 2025
            </DialogTitle>
            <p className="text-sm sm:text-base text-gray-700 mt-1 font-bold text-center px-2">
              Avoid the summer slide and
            </p>
            <p className="text-sm sm:text-base font-bold text-center px-2" style={{ color: '#3ec7ac' }}>
              Earn your first GIFT CARD FOR FREE!
            </p>
          </DialogHeader>

          {/* How it works section */}
          <div className="mb-3">
            <h3 className="text-sm font-bold text-gray-900 mb-2 text-center">Here's how it works:</h3>
            
            <div className="space-y-2">
              <div className="flex items-start gap-2 bg-gray-50 rounded-lg p-2">
                <div className="bg-g3ms-purple/20 rounded-full p-1 mt-0.5 flex-shrink-0">
                  <Trophy className="w-3 h-3 text-g3ms-purple" />
                </div>
                <p className="text-gray-800 text-xs leading-tight">
                  Be the Top G3MS Token Earner in your grade to unlock big rewards.
                </p>
              </div>

              <div className="flex items-start gap-2 bg-gray-50 rounded-lg p-2">
                <div className="bg-g3ms-purple/20 rounded-full p-1 mt-0.5 flex-shrink-0">
                  <Clock className="w-3 h-3 text-g3ms-purple" />
                </div>
                <p className="text-gray-800 text-xs leading-tight">
                  Log in daily 7:00–7:30 PM EST and complete the Daily Drip Challenge.
                </p>
              </div>

              <div className="flex items-start gap-2 bg-gray-50 rounded-lg p-2">
                <div className="bg-g3ms-purple/20 rounded-full p-1 mt-0.5 flex-shrink-0">
                  <Gift className="w-3 h-3 text-g3ms-purple" />
                </div>
                <div className="text-gray-800 text-xs leading-tight">
                  <p>Earn $50 per correct answer, $5 for learning from your mistakes.</p>
                </div>
              </div>

              <div className="flex items-start gap-2 bg-gray-50 rounded-lg p-2">
                <div className="bg-g3ms-purple/20 rounded-full p-1 mt-0.5 flex-shrink-0">
                  <Trophy className="w-3 h-3 text-g3ms-purple" />
                </div>
                <p className="text-gray-800 text-xs leading-tight">
                  Highest earner wins the Daily Drip bonus — top 5 win if tied.
                </p>
              </div>
            </div>
          </div>

          {/* Call to action */}
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-800 leading-tight font-bold text-center mb-3 px-2">
              Get started today and start earning to win!
            </p>
            
            <div className="space-y-2">
              <Button
                onClick={() => window.open('https://uqr.to/1grrk', '_blank')}
                className="bg-g3ms-purple text-white hover:bg-g3ms-purple/90 rounded-full px-4 py-2.5 text-sm font-semibold transform hover:scale-105 transition-all duration-200 shadow-lg w-full flex items-center justify-center gap-2"
              >
                <Smartphone className="w-4 h-4" />
                Get Started Free on App
              </Button>
              
              <Button
                onClick={() => window.open('https://webapp.g3ms.co/', '_blank')}
                className="bg-g3ms-green text-white hover:bg-g3ms-green/90 rounded-full px-4 py-2.5 text-sm font-semibold transform hover:scale-105 transition-all duration-200 shadow-lg w-full flex items-center justify-center gap-2"
              >
                <Globe className="w-4 h-4" />
                Try G3MS Free on Web
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
