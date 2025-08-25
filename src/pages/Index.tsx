
import { useState, useEffect } from "react";
import { HeroSection } from "@/components/HeroSection";

import { G3MSExperience } from "@/components/G3MSExperience";
import { RewardsSection } from "@/components/RewardsSection";

import { TrustSection } from "@/components/TrustSection";
import { Navigation } from "@/components/Navigation";

const Index = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navigation 
        isScrolled={isScrolled} 
        customMenuItems={[
          { 
            label: "Drops", 
            action: () => {
              const element = document.getElementById('daily-drip');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }
          },
          { 
            label: "Meet Ayo", 
            action: () => {
              const element = document.getElementById('meet-ayo');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }
          },
          { 
            label: "Schools & Families", 
            action: () => {
              const element = document.getElementById('educators-parents');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }
          },
          { 
            label: "Brands & Creators", 
            action: () => {
              const element = document.getElementById('join-mission');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }
          }
        ]}
      />
      <HeroSection />
      
      <G3MSExperience />
      
      <TrustSection />
    </div>
  );
};

export default Index;
