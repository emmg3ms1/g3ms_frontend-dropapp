import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { 
  Users, 
  Mail, 
  Globe, 
  School, 
  Plus, 
  X, 
  Copy, 
  Send,
  UserPlus,
  Building,
  Link,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface InviteStudentsStepProps {
  dropTitle: string;
  onComplete: () => void;
  onBack: () => void;
}

export const InviteStudentsStep: React.FC<InviteStudentsStepProps> = ({
  dropTitle,
  onComplete,
  onBack
}) => {
  const [inviteMethod, setInviteMethod] = useState<'email' | 'public' | 'classroom'>('email');
  const [emailList, setEmailList] = useState<string[]>(['']);
  const [publicAccess, setPublicAccess] = useState(false);
  const [schoolName, setSchoolName] = useState('');
  const [classroomName, setClassroomName] = useState('');
  const [inviteMessage, setInviteMessage] = useState('');

  // Mock data for existing classrooms
  const existingClassrooms = [
    { id: 1, name: 'Math 101 - Period 3', students: 25, school: 'Lincoln High School' },
    { id: 2, name: 'Algebra Basics', students: 18, school: 'Lincoln High School' },
    { id: 3, name: 'Advanced Math', students: 22, school: 'Lincoln High School' }
  ];

  const handleAddEmail = () => {
    setEmailList([...emailList, '']);
  };

  const handleRemoveEmail = (index: number) => {
    const newList = emailList.filter((_, i) => i !== index);
    setEmailList(newList);
  };

  const handleEmailChange = (index: number, value: string) => {
    const newList = [...emailList];
    newList[index] = value;
    setEmailList(newList);
  };

  const handleSendInvites = () => {
    // Mock sending invites
    const validEmails = emailList.filter(email => email.trim() && email.includes('@'));
    toast.success(`Sent invitations to ${validEmails.length} students!`);
  };

  const handleCopyLink = () => {
    const mockLink = `https://g3ms.app/drops/join/${Math.random().toString(36).substr(2, 9)}`;
    navigator.clipboard.writeText(mockLink);
    toast.success('Drop link copied to clipboard!');
  };

  const handleCreateClassroom = () => {
    if (schoolName && classroomName) {
      toast.success(`Created classroom "${classroomName}" at ${schoolName}!`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-g3ms-green">
          <Users className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Invite Students</h2>
        </div>
        <p className="text-muted-foreground">
          Share "{dropTitle}" with your students
        </p>
      </div>

      {/* Invitation Method Tabs */}
      <Tabs value={inviteMethod} onValueChange={(value) => setInviteMethod(value as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email Invites
          </TabsTrigger>
          <TabsTrigger value="public" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Public Access
          </TabsTrigger>
          <TabsTrigger value="classroom" className="flex items-center gap-2">
            <School className="h-4 w-4" />
            Classroom
          </TabsTrigger>
        </TabsList>

        {/* Email Invites Tab */}
        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-g3ms-blue" />
                Invite Students by Email
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label>Student Email Addresses</Label>
                {emailList.map((email, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="student@email.com"
                      value={email}
                      onChange={(e) => handleEmailChange(index, e.target.value)}
                      className="flex-1"
                    />
                    {emailList.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveEmail(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddEmail}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another Email
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="invite-message">Custom Message (Optional)</Label>
                <Textarea
                  id="invite-message"
                  placeholder="Add a personal message to your invitation..."
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  className="resize-none"
                  rows={3}
                />
              </div>

              <div className="flex items-center justify-between pt-4">
                <div className="text-sm text-muted-foreground">
                  {emailList.filter(email => email.trim()).length} email(s) to send
                </div>
                <Button 
                  onClick={handleSendInvites}
                  className="bg-g3ms-blue hover:bg-g3ms-blue/90"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Invitations
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Public Access Tab */}
        <TabsContent value="public" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-g3ms-green" />
                Make Drop Publicly Available
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Allow anyone on G3MS to join</Label>
                  <p className="text-sm text-muted-foreground">
                    Students can find and join this drop without an invitation
                  </p>
                </div>
                <Switch
                  checked={publicAccess}
                  onCheckedChange={setPublicAccess}
                />
              </div>

              {publicAccess && (
                <div className="space-y-4 p-4 bg-g3ms-green/5 rounded-lg border border-g3ms-green/20">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-g3ms-green mt-0.5" />
                    <div className="space-y-2">
                      <h4 className="font-semibold text-g3ms-green">Drop is now public!</h4>
                      <p className="text-sm text-muted-foreground">
                        Students can access this drop using the link below or by searching for it in the G3MS drop library.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Shareable Link</Label>
                    <div className="flex gap-2">
                      <Input
                        value={`https://g3ms.app/drops/join/${Math.random().toString(36).substr(2, 9)}`}
                        readOnly
                        className="flex-1 bg-white"
                      />
                      <Button
                        variant="outline"
                        onClick={handleCopyLink}
                        className="flex-shrink-0"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Link className="h-4 w-4" />
                    <span>Share this link with students or post it on your class website</span>
                  </div>
                </div>
              )}

              {!publicAccess && (
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-700">Private Access</h4>
                    <p className="text-sm text-gray-600">
                      Only invited students will be able to access this drop.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Classroom Tab */}
        <TabsContent value="classroom" className="space-y-6">
          {/* Existing Classrooms */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <School className="h-5 w-5 text-g3ms-purple" />
                Assign to Existing Classroom
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {existingClassrooms.map((classroom) => (
                  <div
                    key={classroom.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-g3ms-purple/10 rounded-lg flex items-center justify-center">
                        <Building className="h-5 w-5 text-g3ms-purple" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{classroom.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {classroom.students} students • {classroom.school}
                        </p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Assign
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          {/* Create New Classroom */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-g3ms-green" />
                Create New Classroom
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="school-name">School Name</Label>
                  <Input
                    id="school-name"
                    placeholder="Lincoln High School"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="classroom-name">Classroom Name</Label>
                  <Input
                    id="classroom-name"
                    placeholder="Math 101 - Period 3"
                    value={classroomName}
                    onChange={(e) => setClassroomName(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleCreateClassroom}
                  disabled={!schoolName || !classroomName}
                  className="bg-g3ms-green hover:bg-g3ms-green/90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Classroom
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-6">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-g3ms-green border-g3ms-green">
            <CheckCircle className="h-3 w-3 mr-1" />
            Students Invited
          </Badge>
          <Button onClick={onComplete} className="bg-g3ms-purple hover:bg-g3ms-purple/90">
            Continue to Monitor Progress
          </Button>
        </div>
      </div>
    </div>
  );
};
