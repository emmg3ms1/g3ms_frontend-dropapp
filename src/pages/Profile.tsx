import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Camera, Save, Edit } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user: authUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  // Initialize with real user data
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    grade: '',
    school: '',
    profileImage: ''
  });

  // Populate profile data when authUser changes
  useEffect(() => {
    if (authUser) {
      const firstName = (authUser as any).firstName || '';
      const lastName = (authUser as any).lastName || '';
      const fullName = `${firstName} ${lastName}`.trim() || authUser.email || 'User';
      
      setProfileData({
        name: fullName,
        email: authUser.email,
        phone: (authUser as any).phone || '',
        grade: (authUser as any).grade || '',
        school: (authUser as any).school || '',
        profileImage: (authUser as any).profileImageUrl || ''
      });
    }
  }, [authUser]);

  // Don't render if not authenticated
  if (!authUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Please log in</h2>
          <p className="text-gray-600 mb-4">You need to be logged in to view your profile.</p>
          <Button onClick={() => navigate('/')}>Go to Home</Button>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    try {
      // TODO: Implement profile update API call
      // await apiService.updateProfile(profileData);
      
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData(prev => ({
          ...prev,
          profileImage: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(authUser.role === 'educator' ? '/educator/dashboard' : '/drops/main')}
            className="flex items-center gap-2 hover:bg-white/50 text-g3ms-purple"
          >
            <ArrowLeft className="w-4 h-4" />
            {authUser.role === 'educator' ? 'Back to Dashboard' : 'Back to Drops'}
          </Button>
          
          <Button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="bg-g3ms-purple text-white hover:bg-g3ms-purple/90"
          >
            {isEditing ? (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            ) : (
              <>
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </>
            )}
          </Button>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-g3ms-purple mb-4">
                My Profile
              </CardTitle>
              
              {/* Profile Image */}
              <div className="relative inline-block">
                <Avatar className="w-32 h-32 mx-auto border-4 border-g3ms-purple/20">
                  <AvatarImage src={profileData.profileImage} />
                  <AvatarFallback className="bg-gradient-to-br from-g3ms-purple to-g3ms-pink text-white text-2xl font-bold">
                    {profileData.name ? profileData.name.split(' ').map(n => n[0]).join('') : authUser?.email?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                
                {isEditing && (
                  <label className="absolute bottom-2 right-2 bg-g3ms-purple text-white p-2 rounded-full cursor-pointer hover:bg-g3ms-purple/90 transition-colors">
                    <Camera className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-g3ms-purple font-semibold">
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={profileData.name}
                  onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                  disabled={!isEditing}
                  className="bg-white/50 border-g3ms-purple/20 focus:border-g3ms-purple"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-g3ms-purple font-semibold">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                  disabled={!isEditing}
                  className="bg-white/50 border-g3ms-purple/20 focus:border-g3ms-purple"
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-g3ms-purple font-semibold">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1234567890"
                  value={profileData.phone}
                  onChange={(e) => {
                    let value = e.target.value;
                    // Ensure it starts with +
                    if (!value.startsWith('+') && value.length > 0) {
                      value = '+' + value.replace(/^\+*/, '');
                    }
                    setProfileData(prev => ({ ...prev, phone: value }));
                  }}
                  disabled={!isEditing}
                  className="bg-white/50 border-g3ms-purple/20 focus:border-g3ms-purple"
                />
              </div>

              {/* Grade */}
              <div className="space-y-2">
                <Label htmlFor="grade" className="text-g3ms-purple font-semibold">
                  Grade Level
                </Label>
                <Input
                  id="grade"
                  value={profileData.grade}
                  onChange={(e) => setProfileData(prev => ({ ...prev, grade: e.target.value }))}
                  disabled={!isEditing}
                  className="bg-white/50 border-g3ms-purple/20 focus:border-g3ms-purple"
                />
              </div>

              {/* Role */}
              <div className="space-y-2">
                <Label htmlFor="role" className="text-g3ms-purple font-semibold">
                  Role
                </Label>
                <Input
                  id="role"
                  value={authUser.role}
                  disabled={true}
                  className="bg-gray-50 border-g3ms-purple/20 text-gray-600"
                />
              </div>

              {/* Onboarding Status */}
              <div className="space-y-2">
                <Label htmlFor="onboardingState" className="text-g3ms-purple font-semibold">
                  Account Status
                </Label>
                <Input
                  id="onboardingState"
                  value={(authUser as any).onboardingState || 'Unknown'}
                  disabled={true}
                  className="bg-gray-50 border-g3ms-purple/20 text-gray-600"
                />
              </div>

              {/* Phone Verified Status */}
              <div className="space-y-2">
                <Label className="text-g3ms-purple font-semibold">
                  Phone Verification
                </Label>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${(authUser as any).phoneVerified ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-sm text-gray-600">
                    {(authUser as any).phoneVerified ? 'Verified' : 'Not Verified'}
                  </span>
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleSave}
                    className="flex-1 bg-gradient-to-r from-g3ms-purple to-g3ms-pink text-white hover:opacity-90"
                  >
                    Save Changes
                  </Button>
                  <Button
                    onClick={() => setIsEditing(false)}
                    variant="outline"
                    className="flex-1 border-g3ms-purple/20 text-g3ms-purple hover:bg-g3ms-purple/5"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;