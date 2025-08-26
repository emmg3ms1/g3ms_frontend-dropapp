
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VideoPreview } from "./VideoPreview";
import GatedSignupForm from "./GatedSignupForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DemoBooking } from "./DemoBooking";
import { SignupFlow } from "./SignupFlow";

export const HeroSection = () => {
  const [showVideo, setShowVideo] = useState(false);
  const [email, setEmail] = useState("");
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [showSignupFlow, setShowSignupFlow] = useState(false);

  const handleGetStarted = () => {
    if (!email.trim()) {
      return;
    }
    
    // For testing - show error message for any email, then show signup
    setShowErrorDialog(true);
  };

  const partnerLogos = [
    {
      name: "Wingstop",
      image: "/lovable-uploads/0644f691-514d-4b36-905b-b18794d803c4.png"
    },
    {
      name: "University of Pennsylvania",
      image: "/lovable-uploads/4fc363e9-5313-4ace-b6f7-3fa7625dc9cf.png"
    },
    {
      name: "Design Partner",
      image: "/lovable-uploads/36b67e90-d730-4e8a-aabb-3e9f07063f1c.png"
    },
    {
      name: "Google for Startups",
      image: "/lovable-uploads/d693431e-d663-40e4-9336-a678edbb019c.png"
    },
    {
      name: "Innovation for Equity",
      image: "/lovable-uploads/19bf79e5-ac32-4cf0-854c-9d0d611a5d96.png"
    },
    {
      name: "Uprooted Academy",
      image: "/lovable-uploads/7d72cfdf-4304-4181-9c80-96d4488e8eb9.png"
    },
    {
      name: "Anita B.org",
      image: "/lovable-uploads/e2174252-f05c-44e9-97ff-c6100cff639f.png"
    },
    {
      name: "Title I",
      image: "/lovable-uploads/86337167-f815-4b9a-a4fd-017eddfbd203.png"
    },
    {
      name: "NYC Department of Education",
      image: "/lovable-uploads/72f160df-cf0a-4996-b8a3-7be180afd730.png"
    }
  ];

  return (
    <section className="relative min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 pt-16 sm:pt-20 pb-8 sm:pb-12">
      {/* Pricing Banner - Full Width */}
      <div className="w-full text-white py-3 sm:py-4 px-4 sm:px-6 shadow-lg" style={{ backgroundColor: '#aa1b83' }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 text-center">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold">
            <span>Kick off the school year with G3MS — free for schools, simple plans for families, powered by brands.</span>
          </div>
          <Button
            onClick={() => window.location.href = '/pricing'}
            className="bg-white text-g3ms-purple hover:bg-gray-100 rounded-full px-4 sm:px-6 py-2 text-xs sm:text-sm font-semibold transform hover:scale-105 transition-all duration-200 shadow-lg touch-manipulation min-h-[40px]"
          >
            See Pricing
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-3 sm:px-4">
        <div className="max-w-6xl mx-auto text-center">
          {/* Main Heading */}
          <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 px-2 leading-tight">
            <span style={{ color: '#aa1b83' }}>Built for learners.</span>{" "}
            <span className="text-gray-900">Backed by AI.</span>{" "}
            <span style={{ color: '#3ec7ac' }}>Funded by brands.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-6 sm:mb-8 font-bold px-2 leading-relaxed">
            G3MS turns short-form learning into daily habits rewarded with tokens, gift cards, and branded Drops students love.
          </p>


          {/* Email Input Form */}
          <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-8 mb-6 sm:mb-8 max-w-md mx-auto px-2">
            <div className="w-full flex flex-col sm:flex-row gap-2 sm:gap-2">
              <Input 
                type="email" 
                placeholder="What's your school or work email?"
                className="rounded-full h-11 sm:h-12 text-base touch-manipulation"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button 
                onClick={handleGetStarted}
                className="bg-g3ms-purple text-white hover:bg-g3ms-purple/90 rounded-full whitespace-nowrap h-11 sm:h-12 px-6 sm:px-8 text-base font-semibold touch-manipulation"
              >
                Get Started
              </Button>
            </div>
            
          </div>

          {/* Error Dialog */}
          <Dialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-center text-lg font-semibold">
                  Oops! Your school/company email can't be used here.
                </DialogTitle>
              </DialogHeader>
              <div className="text-center space-y-4">
                <p className="text-gray-600">
                  ➡️ No worries! Use a personal email (Gmail, Yahoo, Outlook, etc.) and you'll still have full access to G3MS.
                </p>
                <Button 
                  onClick={() => {
                    setShowErrorDialog(false);
                    setShowSignupFlow(true);
                  }}
                  className="w-full bg-g3ms-purple text-white hover:bg-g3ms-purple/90 rounded-full h-11 font-semibold"
                >
                  Continue with Personal Email
                </Button>
              </div>
            </DialogContent>
          </Dialog>


          {/* Trusted Partners Section */}
          <div className="mt-12 sm:mt-16">
            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 font-medium px-2">
              Trusted by Educational and Corporate Partners
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-12 opacity-70 hover:opacity-100 transition-opacity duration-300 px-2">
              {partnerLogos.map((partner, index) => (
                <div key={index} className="h-8 sm:h-10 md:h-12 flex items-center justify-center touch-manipulation">
                  <img 
                    src={partner.image} 
                    alt={partner.name}
                    className="h-full w-auto object-contain hover:scale-105 transition-all duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Signup Flow Modal */}
      <SignupFlow 
        isOpen={showSignupFlow}
        onClose={() => setShowSignupFlow(false)}
        initialEmail={email}
        preselectedUserType="student"
      />
    </section>
  );
};
