import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Clock, CheckCircle, AlertCircle, Eye, RefreshCw } from 'lucide-react';
import { EducatorDrop } from '@/stores/educatorDropStore';

interface Student {
  id: string;
  name: string;
  status: 'completed' | 'in-progress' | 'not-started';
  completedAt?: string;
  timeSpent?: number;
}

interface MonitorProgressStepProps {
  drop: EducatorDrop;
  onNext: () => void;
  onBack: () => void;
}

export const MonitorProgressStep: React.FC<MonitorProgressStepProps> = ({
  drop,
  onNext,
  onBack
}) => {
  const [students, setStudents] = useState<Student[]>([
    // Mock data for now - will be replaced with real API data
    { id: '1', name: 'Emma Johnson', status: 'completed', completedAt: '2024-01-15T10:30:00Z', timeSpent: 25 },
    { id: '2', name: 'Liam Smith', status: 'in-progress', timeSpent: 12 },
    { id: '3', name: 'Sophia Davis', status: 'completed', completedAt: '2024-01-15T11:15:00Z', timeSpent: 18 },
    { id: '4', name: 'Noah Wilson', status: 'not-started' },
    { id: '5', name: 'Olivia Brown', status: 'in-progress', timeSpent: 8 },
  ]);
  
  const [isRefreshing, setIsRefreshing] = useState(false);

  const completedCount = students.filter(s => s.status === 'completed').length;
  const inProgressCount = students.filter(s => s.status === 'in-progress').length;
  const notStartedCount = students.filter(s => s.status === 'not-started').length;
  const completionRate = Math.round((completedCount / students.length) * 100);
  const averageTime = Math.round(
    students
      .filter(s => s.timeSpent)
      .reduce((sum, s) => sum + (s.timeSpent || 0), 0) / 
    students.filter(s => s.timeSpent).length
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // TODO: Fetch real progress data from API
    // await apiService.getDropProgress(drop.id);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const getStatusBadgeVariant = (status: Student['status']) => {
    switch (status) {
      case 'completed': return 'default';
      case 'in-progress': return 'secondary';
      case 'not-started': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: Student['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'not-started': return <AlertCircle className="h-4 w-4 text-gray-400" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Monitor Progress</h2>
          <p className="text-muted-foreground">
            Track student participation in "{drop.title}"
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div className="flex flex-col">
                <p className="text-sm font-medium">Total Students</p>
                <p className="text-2xl font-bold">{students.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div className="flex flex-col">
                <p className="text-sm font-medium">Completed</p>
                <p className="text-2xl font-bold text-green-600">{completedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <div className="flex flex-col">
                <p className="text-sm font-medium">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">{inProgressCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-gray-400" />
              <div className="flex flex-col">
                <p className="text-sm font-medium">Not Started</p>
                <p className="text-2xl font-bold text-gray-600">{notStartedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Completion Rate</span>
              <span>{completionRate}%</span>
            </div>
            <Progress value={completionRate} className="h-2" />
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Average Time:</span>
              <span className="ml-2 font-medium">{averageTime} min</span>
            </div>
            <div>
              <span className="text-muted-foreground">Drop Status:</span>
              <Badge variant="secondary" className="ml-2">{drop.status}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Student List */}
      <Card>
        <CardHeader>
          <CardTitle>Student Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {students.map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {getStatusIcon(student.status)}
                  <div>
                    <p className="font-medium">{student.name}</p>
                    {student.completedAt && (
                      <p className="text-sm text-muted-foreground">
                        Completed {new Date(student.completedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {student.timeSpent && (
                    <span className="text-sm text-muted-foreground">
                      {student.timeSpent} min
                    </span>
                  )}
                  <Badge variant={getStatusBadgeVariant(student.status)}>
                    {student.status.replace('-', ' ')}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back to Drops
        </Button>
        
        <div className="space-x-2">
          <Button variant="outline" onClick={() => window.open(`/drops/${drop.id}/live`, '_blank')}>
            <Eye className="h-4 w-4 mr-2" />
            View Live Drop
          </Button>
          <Button 
            onClick={onNext}
            disabled={completedCount === 0}
          >
            Celebrate Success
          </Button>
        </div>
      </div>
    </div>
  );
};