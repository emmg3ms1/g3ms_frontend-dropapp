import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Trophy, 
  Star, 
  Users, 
  Clock, 
  Share2, 
  ChevronRight,
  Sparkles,
  Target,
  Award
} from 'lucide-react';
import { EducatorDrop } from '@/stores/educatorDropStore';

interface CelebrateSuccessStepProps {
  drop: EducatorDrop;
  onBack: () => void;
  onCreateAnother: () => void;
}

export const CelebrateSuccessStep: React.FC<CelebrateSuccessStepProps> = ({
  drop,
  onBack,
  onCreateAnother
}) => {
  // Mock completion data - will be replaced with real API data
  const completionStats = {
    totalStudents: 15,
    completedStudents: 12,
    averageTime: 22,
    averageScore: 85,
    totalEngagement: 18, // in minutes
    topPerformers: [
      { name: 'Emma Johnson', score: 95, timeSpent: 25 },
      { name: 'Sophia Davis', score: 92, timeSpent: 18 },
      { name: 'Liam Smith', score: 88, timeSpent: 28 }
    ]
  };

  const completionRate = Math.round((completionStats.completedStudents / completionStats.totalStudents) * 100);
  
  const handleShareSuccess = () => {
    // TODO: Implement sharing functionality
    console.log('Sharing success...');
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="relative">
            <Trophy className="h-16 w-16 text-yellow-500" />
            <Sparkles className="h-6 w-6 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
          </div>
        </div>
        
        <div>
          <h2 className="text-3xl font-bold tracking-tight">🎉 Fantastic Work!</h2>
          <p className="text-lg text-muted-foreground mt-2">
            Your drop "{drop.title}" was a huge success!
          </p>
        </div>

        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">{completionStats.completedStudents}</p>
                <p className="text-sm text-muted-foreground">Students Completed</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{completionRate}%</p>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{completionStats.averageTime}m</p>
                <p className="text-sm text-muted-foreground">Avg. Time</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">{completionStats.averageScore}%</p>
                <p className="text-sm text-muted-foreground">Avg. Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievement Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Performers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="h-5 w-5 text-yellow-500 mr-2" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {completionStats.topPerformers.map((student, index) => (
              <div key={student.name} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-muted-foreground">{student.timeSpent}m spent</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  {student.score}%
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Engagement Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 text-blue-500 mr-2" />
              Engagement Highlights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Learning Time</span>
                <span className="text-sm font-bold">{completionStats.totalEngagement} hours</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Subject Mastery</span>
                <Badge variant="secondary">{drop.subject || 'General'}</Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Learning Goal</span>
                <span className="text-sm text-muted-foreground">Achieved ✅</span>
              </div>

              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <Award className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-green-800 font-medium">Excellent participation!</span>
                </div>
                <p className="text-green-700 text-sm mt-1">
                  {completionRate}% completion rate exceeds the average of 75%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Share Success */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Share2 className="h-5 w-5 text-primary mr-2" />
            Share Your Success
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Let your students and school community know about this fantastic achievement!
          </p>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleShareSuccess}>
              <Share2 className="h-4 w-4 mr-2" />
              Share with School
            </Button>
            <Button variant="outline" onClick={handleShareSuccess}>
              Send Certificates to Students
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-primary">What's Next?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">Create Another Drop</p>
                <p className="text-sm text-muted-foreground">Keep the momentum going!</p>
              </div>
            </div>
            <Button onClick={onCreateAnother}>
              Create Drop
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">Invite More Students</p>
                <p className="text-sm text-muted-foreground">Expand your reach</p>
              </div>
            </div>
            <Button variant="outline">
              Invite Students
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back to Monitoring
        </Button>
        
        <Button onClick={onCreateAnother} className="bg-gradient-to-r from-primary to-primary/80">
          <Sparkles className="h-4 w-4 mr-2" />
          Create New Drop
        </Button>
      </div>
    </div>
  );
};