

import { Award, Zap, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { HelpForm } from "./HelpForm";
import GatedSignupForm from "./GatedSignupForm";
import { useState } from "react";

export const TrustSection = () => {
  const [helpFormOpen, setHelpFormOpen] = useState(false);

  console.log("TrustSection is rendering - no trusted organizations section should be here");

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section id="join-mission" className="py-20 relative bg-white">
      {/* DEBUG: This should be the only content in TrustSection */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            🚀 Partner with G3MS
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Fuel real student impact through branded learning challenges and reward-driven engagement.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="bg-gradient-to-br from-g3ms-purple/5 to-pink-50 p-6 rounded-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-3">🏷️ Brands & Creators</h3>
            <p className="text-gray-700 mb-4">Launch a branded Drop with real rewards students want.</p>
            <Button 
              className="bg-gradient-to-r from-g3ms-purple to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full px-6 py-2 text-sm w-full"
            >
              Start a Drop
            </Button>
          </div>

          <div className="bg-gradient-to-br from-g3ms-green/5 to-emerald-50 p-6 rounded-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-3">🎥 Creator Takeovers</h3>
            <p className="text-gray-700 mb-4">Host a Drop. Reach students. Inspire real progress.</p>
            <Button 
              className="bg-gradient-to-r from-g3ms-green to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-full px-6 py-2 text-sm w-full"
            >
              Get Started
            </Button>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-3">🤝 Refer & Earn</h3>
            <p className="text-gray-700 mb-4">Invite others. Unlock gift cards, cash, and VIP perks.</p>
            <GatedSignupForm audience="educator">
              <Button
                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-full px-6 py-2 text-sm w-full"
              >
                Join Referral Program
              </Button>
            </GatedSignupForm>
          </div>
        </div>

        <div className="text-center mb-16">
          <h3 className="text-xl font-bold text-gray-900 mb-4">One platform. One mission.</h3>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto">
            Help students learn what matters and earn what counts—one Drop at a time.
          </p>
        </div>
      </div>
      
      <footer className="mt-20 border-t border-gray-200 pt-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 text-center md:text-left">
            <div>
              <button onClick={handleLogoClick} className="focus:outline-none">
                <img 
                  src="/lovable-uploads/b617ee5c-bf33-49d0-9752-4040f240cab6.png" 
                  alt="G3MS Logo" 
                  className="h-8 w-auto mb-4 mx-auto md:mx-0 hover:opacity-80 transition-opacity"
                />
              </button>
              <p className="text-gray-600 text-sm">
                Learn what matters. Earn with counts with G3MS!
              </p>
            </div>
            
            <div>
              <h4 className="text-gray-900 font-semibold mb-4">Learn</h4>
              <div className="space-y-3 text-gray-600 text-sm">
                <div>Math Challenges</div>
                <div>Science Projects</div>
                <div>English Writing</div>
                <div>Social Studies</div>
              </div>
            </div>
            
            <div>
              <h4 className="text-gray-900 font-semibold mb-4">Earn</h4>
              <div className="space-y-3 text-gray-600 text-sm">
                <div>Gift Cards</div>
                <div>Leaderboards</div>
                <div>Badges</div>
                <div>Achievements</div>
              </div>
            </div>
            
            <div>
              <h4 className="text-gray-900 font-semibold mb-4">Support</h4>
              <div className="space-y-3 text-gray-600 text-sm">
                <Dialog open={helpFormOpen} onOpenChange={setHelpFormOpen}>
                  <DialogTrigger asChild>
                    <button className="hover:text-g3ms-green transition-colors text-left md:text-left">
                      Help Center
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <HelpForm onClose={() => setHelpFormOpen(false)} />
                  </DialogContent>
                </Dialog>
                
                <Dialog open={helpFormOpen} onOpenChange={setHelpFormOpen}>
                  <DialogTrigger asChild>
                    <button className="hover:text-g3ms-green transition-colors text-left md:text-left">
                      Contact Us
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <HelpForm onClose={() => setHelpFormOpen(false)} />
                  </DialogContent>
                </Dialog>
                
                <a href="https://www.getg3ms.com/legal_terms" target="_blank" rel="noopener noreferrer" className="hover:text-g3ms-green transition-colors block">Privacy Policy</a>
                <a href="https://www.getg3ms.com/terms-and-conditions" target="_blank" rel="noopener noreferrer" className="hover:text-g3ms-green transition-colors block">Terms of Service</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-12 pt-8 text-center text-gray-500 text-sm">
            © 2021 G3MS. All rights reserved. Made with 💜 for Gen Alpha learners.
            </div>
        </div>
      </footer>
    </section>
  );
};

