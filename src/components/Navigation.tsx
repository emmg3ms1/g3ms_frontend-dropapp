
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Diamond } from "lucide-react";
import GatedSignupForm from "@/components/GatedSignupForm";
import { UserProfile } from "@/components/UserProfile";
import { useLoginStatus } from "@/hooks/useLoginStatus";

interface MenuItem {
  label: string;
  action: () => void;
}

interface NavigationProps {
  isScrolled: boolean;
  customMenuItems?: MenuItem[];
}

export const Navigation = ({ isScrolled, customMenuItems }: NavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn } = useLoginStatus();

  const handleNavClick = (targetId: string) => {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleMeetAyoClick = () => {
    const element = document.getElementById('meet-ayo');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const handleParentsClick = () => {
    const element = document.getElementById('educators-parents');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const handleDailyDripClick = () => {
    const element = document.getElementById('daily-drip');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white shadow-lg' 
        : 'bg-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex items-center">
            <button onClick={handleLogoClick} className="focus:outline-none">
              <img 
                src="/lovable-uploads/b617ee5c-bf33-49d0-9752-4040f240cab6.png" 
                alt="G3MS Logo" 
                className="h-8 sm:h-10 w-auto hover:opacity-80 transition-opacity"
              />
            </button>
          </div>
          
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
            {customMenuItems && (
              <div className="flex items-center space-x-4 lg:space-x-6">
                {customMenuItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      item.action();
                      setIsMenuOpen(false);
                    }}
                    className="text-gray-700 hover:text-g3ms-purple font-medium text-sm lg:text-base transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                {/* User Profile */}
                <UserProfile compact />
                
                {/* Token Balance */}
                <div className="flex items-center space-x-1 bg-g3ms-blue/10 px-3 py-1.5 rounded-full">
                  <Diamond className="w-4 h-4 text-g3ms-blue fill-current" />
                  <span className="text-sm font-bold text-g3ms-blue">$150</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 ml-2 lg:ml-4">
                <Button 
                  variant="outline"
                  onClick={() => navigate('/login')}
                  className="text-gray-700 border-gray-300 hover:bg-gray-50 rounded-full px-4 lg:px-6 py-2 font-semibold text-sm lg:text-base"
                >
                  Login
                </Button>
                <GatedSignupForm audience="educator">
                  <Button 
                    className="bg-gradient-to-r from-g3ms-purple to-g3ms-green hover:from-pink-600 hover:to-emerald-600 text-white rounded-full px-4 lg:px-6 py-2 font-semibold text-sm lg:text-base"
                  >
                    Free for Schools
                  </Button>
                </GatedSignupForm>
              </div>
            )}
          </div>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 p-2"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t">
          <div className="px-2 pt-2 pb-3 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
            {customMenuItems && (
              <div className="px-3 space-y-1 mb-4">
                {customMenuItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      item.action();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-gray-700 hover:text-g3ms-purple font-medium text-base transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
            {isLoggedIn ? (
              <div className="px-3 pt-2 flex justify-end">
                <div className="flex items-center space-x-3">
                  {/* User Profile */}
                  <UserProfile compact />
                  
                  {/* Token Balance */}
                  <div className="flex items-center space-x-1 bg-g3ms-blue/10 px-3 py-1.5 rounded-full">
                    <Diamond className="w-4 h-4 text-g3ms-blue fill-current" />
                    <span className="text-sm font-bold text-g3ms-blue">$150</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="px-3 pt-2 space-y-2">
                <Button 
                  variant="outline"
                  onClick={() => navigate('/login')}
                  className="w-full text-gray-700 border-gray-300 hover:bg-gray-50 rounded-full py-3 text-base font-semibold"
                >
                  Login
                </Button>
                <GatedSignupForm audience="educator">
                  <Button 
                    className="w-full bg-gradient-to-r from-g3ms-purple to-g3ms-green text-white rounded-full py-3 text-base font-semibold"
                  >
                    Free for Schools
                  </Button>
                </GatedSignupForm>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
