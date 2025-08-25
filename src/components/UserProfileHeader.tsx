import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { User, Settings, CreditCard, LogOut, Diamond, FolderOpen } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export const UserProfileHeader = () => {
  const navigate = useNavigate();
  const { user: authUser, logout } = useAuth();
  
  // Don't render if not authenticated
  if (!authUser) {
    return null;
  }
  
  // Use real user data
  const user = {
    firstName: (authUser as any).firstName || authUser.email?.split('@')[0] || 'User',
    lastName: (authUser as any).lastName || '',
    role: authUser.role === 'student' ? 'Student' : authUser.role === 'educator' ? 'Educator' : 'User',
    school: (authUser as any).school || 'School',
    avatar: (authUser as any).profileImageUrl,
    tokens: (authUser as any).tokens || 0
  };

  const handleProfileClick = (action: string) => {
    console.log(`Profile action: ${action}`);
    if (action === 'profile') {
      navigate('/profile');
    } else if (action === 'portfolio') {
      navigate('/portfolio');
    } else if (action === 'settings') {
      navigate('/settings');
    } else if (action === 'logout') {
      logout();
    }
  };

  const handleTokenClick = () => {
    navigate('/rewards-progress');
  };

  return (
    <div className="flex items-center gap-1 sm:gap-3 min-w-0">
      {/* Progress to Gift Card - Mobile: Stack vertically, Desktop: Side by side */}
      <div className="flex flex-col items-end min-w-0 flex-shrink">
        {/* Progress Bar */}
        <div className="flex items-center gap-1 mb-1 min-w-0">
          <div className="w-16 sm:w-24 md:w-32 bg-gray-200 rounded-full h-1.5 sm:h-2 flex-shrink-0">
            <div 
              className="bg-g3ms-blue h-1.5 sm:h-2 rounded-full" 
              style={{ width: `${((user.tokens) / 15000) * 100}%` }}
            />
          </div>
        </div>
        {/* Progress Text - Responsive sizing */}
        <div className="text-[9px] sm:text-xs text-g3ms-blue font-medium text-right max-w-full">
          <span className="hidden sm:inline">${(15000 - user.tokens).toLocaleString()} tokens to go • $15,000 = Gift card</span>
          <span className="sm:hidden">${((15000 - user.tokens) / 1000).toFixed(1)}k to go • $15k = Gift</span>
        </div>
      </div>

      {/* Token Display */}
      <button 
        className="flex items-center gap-1 bg-g3ms-blue/10 px-1.5 py-1 sm:px-3 sm:py-1.5 rounded-full hover:bg-g3ms-blue/20 transition-colors cursor-pointer flex-shrink-0"
        onClick={handleTokenClick}
      >
        <Diamond className="w-3 h-3 sm:w-4 sm:h-4 text-g3ms-blue" />
        <span className="font-semibold text-g3ms-blue text-xs sm:text-base">${user.tokens.toLocaleString()}</span>
      </button>
      
      {/* User Info */}
      <div className="hidden md:flex flex-col text-right min-w-0">
        <div className="text-sm font-semibold text-gray-900 truncate">
          {user.firstName} {user.lastName}
        </div>
        <div className="text-xs text-gray-600 flex items-center justify-end gap-1 truncate">
          <span className="truncate">{user.role}</span>
          <span>•</span>
          <span className="truncate">{user.school}</span>
        </div>
      </div>

      {/* Profile Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 hover:bg-gray-100">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
              <AvatarFallback className="bg-g3ms-purple text-white">
                {user.firstName[0]}{user.lastName[0]}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="w-56 bg-white border border-gray-200 shadow-lg rounded-lg z-50" 
          align="end" 
          forceMount
        >
          <div className="flex items-center justify-start gap-2 p-3 border-b border-gray-100">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
              <AvatarFallback className="bg-g3ms-purple text-white text-xs">
                {user.firstName[0]}{user.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium text-gray-900">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-gray-600">
                {user.role} • {user.school}
              </p>
            </div>
          </div>
          
          <DropdownMenuItem 
            className="cursor-pointer py-2 px-3 hover:bg-gray-50"
            onClick={() => handleProfileClick('profile')}
          >
            <User className="mr-2 h-4 w-4 text-gray-600" />
            <span>Profile</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            className="cursor-pointer py-2 px-3 hover:bg-gray-50"
            onClick={() => handleProfileClick('portfolio')}
          >
            <FolderOpen className="mr-2 h-4 w-4 text-gray-600" />
            <span>Portfolio</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            className="cursor-pointer py-2 px-3 hover:bg-gray-50"
            onClick={() => handleProfileClick('settings')}
          >
            <Settings className="mr-2 h-4 w-4 text-gray-600" />
            <span>Settings</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            className="cursor-pointer py-2 px-3 hover:bg-gray-50"
            onClick={() => handleProfileClick('billing')}
          >
            <CreditCard className="mr-2 h-4 w-4 text-gray-600" />
            <span>Billing</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator className="bg-gray-100" />
          
          <DropdownMenuItem 
            className="cursor-pointer py-2 px-3 hover:bg-gray-50 text-red-600 focus:text-red-600 focus:bg-red-50"
            onClick={() => handleProfileClick('logout')}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};