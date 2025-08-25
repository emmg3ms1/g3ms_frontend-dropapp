import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { LogOut, User, Settings, FolderOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// Remove BYPASS_AUTH - always use real authentication

interface UserProfileProps {
  user?: {
    id: string;
    name: string;
    email: string;
    profileImage?: string;
    type: 'student' | 'adult';
    // Student specific
    school?: string;
    grade?: string;
    // Adult specific
    firstName?: string;
    lastName?: string;
    company?: string;
    role?: string;
  };
  compact?: boolean;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user, compact = false }) => {
  const { user: authUser, logout } = useAuth();
  
  // Only show when actually authenticated
  const shouldShowProfile = authUser;
  
  // Use real user data from auth context
  const currentUser = user || (authUser ? {
    ...authUser,
    type: authUser.role === 'student' ? 'student' as const : 'adult' as const,
    name: `${(authUser as any).firstName || ''} ${(authUser as any).lastName || ''}`.trim() || authUser.email || 'User',
    firstName: (authUser as any).firstName || authUser.email?.split('@')[0] || 'User',
    lastName: (authUser as any).lastName || '',
    profileImage: (authUser as any).profileImageUrl || undefined,
    school: (authUser as any).school || undefined,
    grade: (authUser as any).grade || undefined,
    company: (authUser as any).company || undefined,
    role: authUser.role,
  } : null);

  const getInitials = () => {
    if (!currentUser) return 'U';
    
    if (currentUser.type === 'student') {
      const name = currentUser.name || currentUser.email || 'User';
      return name.split(' ').map(n => n[0]).join('').toUpperCase();
    } else {
      return `${currentUser.firstName?.[0] || ''}${currentUser.lastName?.[0] || ''}`.toUpperCase();
    }
  };

  const getDisplayName = () => {
    if (!currentUser) return 'User';
    
    if (currentUser.type === 'student') {
      return currentUser.name || currentUser.email || 'Student User';
    } else {
      return `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || currentUser.email || 'User';
    }
  };

  const getSecondaryInfo = () => {
    if (!currentUser) return '';
    
    if (currentUser.type === 'student') {
      return currentUser.school || 'Student';
    } else {
      return currentUser.company || currentUser.school || currentUser.email;
    }
  };

  const getTertiaryInfo = () => {
    if (!currentUser) return undefined;
    
    if (currentUser.type === 'student') {
      return currentUser.grade || undefined;
    } else {
      return currentUser.role || undefined;
    }
  };

  
  // Don't render if not in testing mode or not logged in
  if (!shouldShowProfile) {
    return null;
  }

  if (compact) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center space-x-2 hover:bg-gray-50 rounded-lg p-1 transition-colors">
          <span className="text-sm font-medium text-gray-700 hidden sm:block">
            {getDisplayName().split(' ')[0]}
          </span>
          <Avatar className="w-8 h-8">
            <AvatarImage src={currentUser?.profileImage} alt={getDisplayName()} />
            <AvatarFallback className="bg-g3ms-blue text-white text-xs font-bold">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-3 py-2">
            <p className="text-sm font-medium">{getDisplayName()}</p>
            <p className="text-xs text-gray-500">{getSecondaryInfo()}</p>
            {getTertiaryInfo() && (
              <Badge variant="secondary" className="text-xs mt-1">
                {getTertiaryInfo()}
              </Badge>
            )}
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link to="/profile">
              <User className="w-4 h-4 mr-2" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link to="/portfolio">
              <FolderOpen className="w-4 h-4 mr-2" />
              Portfolio
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link to="/settings">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => logout()}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center space-x-3 p-2 bg-white rounded-lg border border-gray-200 min-w-0 max-w-[200px] hover:bg-gray-50 transition-colors">
        <div className="flex-1 min-w-0 text-right">
          <h3 className="text-sm font-semibold text-gray-900 truncate leading-tight">
            {getDisplayName()}
          </h3>
          <p className="text-xs text-gray-600 truncate leading-tight">
            {getSecondaryInfo()}
          </p>
          {getTertiaryInfo() && (
            <div className="flex justify-end mt-1">
              <Badge variant="secondary" className="text-xs px-1.5 py-0.5 h-auto leading-tight">
                {getTertiaryInfo()}
              </Badge>
            </div>
          )}
        </div>
        <Avatar className="w-10 h-10 flex-shrink-0">
          <AvatarImage src={currentUser?.profileImage} alt={getDisplayName()} />
          <AvatarFallback className="bg-g3ms-purple text-white font-bold text-sm">
            {getInitials()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <div className="px-3 py-3">
          <p className="text-sm font-semibold">{getDisplayName()}</p>
          <p className="text-xs text-gray-500">{getSecondaryInfo()}</p>
          {getTertiaryInfo() && (
            <Badge variant="secondary" className="text-xs mt-1">
              {getTertiaryInfo()}
            </Badge>
          )}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link to="/profile">
            <User className="w-4 h-4 mr-2" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link to="/portfolio">
            <FolderOpen className="w-4 h-4 mr-2" />
            Portfolio
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link to="/settings">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={() => logout()}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};