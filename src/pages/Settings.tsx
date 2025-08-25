import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Bell, Volume2, Shield, Smartphone } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user: authUser } = useAuth();
  
  // Mock user role - replace with actual user role later
  const userRole = authUser?.role || 'student';
  
  // Settings state
  const [notificationSettings, setNotificationSettings] = useState({
    dropReminders: true,
    rewardAlerts: true,
    dropAlerts: false,
    weeklyProgress: true,
  });
  
  const [soundSettings, setSoundSettings] = useState({
    soundEffects: true,
    animations: true,
    reducedMotion: false,
    minimalistMode: false,
  });
  
  const [privacySettings, setPrivacySettings] = useState({
    showLeaderboard: true,
    showDropHistory: true,
    shareProgress: false,
    publicProfile: false,
  });

  const handleSaveSettings = () => {
    // TODO: Save settings to backend when connected
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  const SettingsSection = ({ 
    title, 
    description, 
    icon: Icon, 
    children 
  }: { 
    title: string; 
    description: string; 
    icon: React.ElementType; 
    children: React.ReactNode 
  }) => (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-g3ms-purple">
          <div className="p-2 bg-gradient-to-br from-g3ms-purple/10 to-g3ms-pink/10 rounded-lg">
            <Icon className="w-5 h-5 text-g3ms-purple" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-gray-600 font-normal">{description}</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {children}
      </CardContent>
    </Card>
  );

  const SettingsToggle = ({ 
    label, 
    description, 
    checked, 
    onCheckedChange 
  }: { 
    label: string; 
    description: string; 
    checked: boolean; 
    onCheckedChange: (checked: boolean) => void 
  }) => (
    <div className="flex items-center justify-between space-x-4">
      <div className="flex-1">
        <Label htmlFor={label} className="text-sm font-medium text-gray-900">
          {label}
        </Label>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      <Switch
        id={label}
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="data-[state=checked]:bg-g3ms-purple"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(authUser?.role === 'educator' ? '/educator/dashboard' : '/drops/main')}
            className="flex items-center gap-2 hover:bg-white/50 text-g3ms-purple"
          >
            <ArrowLeft className="w-4 h-4" />
            {authUser?.role === 'educator' ? 'Back to Dashboard' : 'Back to Drops'}
          </Button>
          
          <Button
            onClick={handleSaveSettings}
            className="bg-g3ms-purple text-white hover:bg-g3ms-purple/90"
          >
            Save Changes
          </Button>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Smartphone className="w-8 h-8 text-g3ms-purple" />
              <h1 className="text-3xl font-bold text-g3ms-purple">Settings</h1>
            </div>
            <p className="text-gray-600">Manage preferences</p>
          </div>

          {/* Student Settings */}
          {userRole === 'student' && (
            <div className="space-y-6">
              {/* Notification Preferences */}
              <SettingsSection
                title="Notification Preferences"
                description="Control when and how you receive alerts"
                icon={Bell}
              >
                <SettingsToggle
                  label="Drop Reminders"
                  description="Get notified about upcoming Drops"
                  checked={notificationSettings.dropReminders}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, dropReminders: checked }))
                  }
                />
                <Separator />
                <SettingsToggle
                  label="Reward Alerts"
                  description="Be notified when you earn tokens or rewards"
                  checked={notificationSettings.rewardAlerts}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, rewardAlerts: checked }))
                  }
                />
                <Separator />
                <SettingsToggle
                  label="Drop Alerts"
                  description="Real-time notifications when new Drops are available"
                  checked={notificationSettings.dropAlerts}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, dropAlerts: checked }))
                  }
                />
                <Separator />
                <SettingsToggle
                  label="Weekly Progress"
                  description="Weekly summary of your learning progress"
                  checked={notificationSettings.weeklyProgress}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, weeklyProgress: checked }))
                  }
                />
              </SettingsSection>

              {/* Sound & Animation Preferences */}
              <SettingsSection
                title="Sound & Animation Preferences"
                description="Customize your accessibility and interface experience"
                icon={Volume2}
              >
                <SettingsToggle
                  label="Sound Effects"
                  description="Play sounds for interactions and notifications"
                  checked={soundSettings.soundEffects}
                  onCheckedChange={(checked) => 
                    setSoundSettings(prev => ({ ...prev, soundEffects: checked }))
                  }
                />
                <Separator />
                <SettingsToggle
                  label="Animations"
                  description="Enable smooth transitions and animations"
                  checked={soundSettings.animations}
                  onCheckedChange={(checked) => 
                    setSoundSettings(prev => ({ ...prev, animations: checked }))
                  }
                />
                <Separator />
                <SettingsToggle
                  label="Reduced Motion"
                  description="Minimize animations for accessibility"
                  checked={soundSettings.reducedMotion}
                  onCheckedChange={(checked) => 
                    setSoundSettings(prev => ({ ...prev, reducedMotion: checked }))
                  }
                />
                <Separator />
                <SettingsToggle
                  label="Minimalist Mode"
                  description="Simplified interface with reduced visual elements"
                  checked={soundSettings.minimalistMode}
                  onCheckedChange={(checked) => 
                    setSoundSettings(prev => ({ ...prev, minimalistMode: checked }))
                  }
                />
              </SettingsSection>

              {/* Privacy Settings */}
              <SettingsSection
                title="Privacy Settings"
                description="Control what information is visible to others"
                icon={Shield}
              >
                <SettingsToggle
                  label="Show in Leaderboard"
                  description="Display your progress on class leaderboards"
                  checked={privacySettings.showLeaderboard}
                  onCheckedChange={(checked) => 
                    setPrivacySettings(prev => ({ ...prev, showLeaderboard: checked }))
                  }
                />
                <Separator />
                <SettingsToggle
                  label="Show Drop History"
                  description="Allow others to see your completed Drops"
                  checked={privacySettings.showDropHistory}
                  onCheckedChange={(checked) => 
                    setPrivacySettings(prev => ({ ...prev, showDropHistory: checked }))
                  }
                />
                <Separator />
                <SettingsToggle
                  label="Share Progress"
                  description="Let teachers and parents view your learning progress"
                  checked={privacySettings.shareProgress}
                  onCheckedChange={(checked) => 
                    setPrivacySettings(prev => ({ ...prev, shareProgress: checked }))
                  }
                />
                <Separator />
                <SettingsToggle
                  label="Public Profile"
                  description="Make your profile visible to other students"
                  checked={privacySettings.publicProfile}
                  onCheckedChange={(checked) => 
                    setPrivacySettings(prev => ({ ...prev, publicProfile: checked }))
                  }
                />
              </SettingsSection>
            </div>
          )}

          {/* Save Button at Bottom */}
          <div className="mt-8 text-center">
            <Button
              onClick={handleSaveSettings}
              className="bg-gradient-to-r from-g3ms-purple to-g3ms-pink text-white hover:opacity-90 px-8 py-3"
            >
              Save All Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;