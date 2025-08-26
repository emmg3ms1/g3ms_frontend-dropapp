import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Shield, Info, Mail } from 'lucide-react';
import { toast } from 'sonner';

interface GuardianRequest {
  id: string;
  studentName: string;
  parentName: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'denied';
}

const GuardianApproval = () => {
  const { approvalId } = useParams<{ approvalId: string }>();
  const [request, setRequest] = useState<GuardianRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<'pending' | 'approved' | 'denied' | 'error'>('pending');

  useEffect(() => {
    // TODO: Replace with actual API call once backend is connected
    // For now, simulate loading request data
    const loadRequest = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data - replace with actual API call
        const mockRequest: GuardianRequest = {
          id: approvalId || '',
          studentName: 'Alex Johnson',
          parentName: 'Sarah Johnson',
          createdAt: new Date().toISOString(),
          status: 'pending'
        };

        setRequest(mockRequest);
        setStatus(mockRequest.status);
      } catch (error) {
        setStatus('error');
        toast.error('Failed to load approval request');
      } finally {
        setIsLoading(false);
      }
    };

    if (approvalId) {
      loadRequest();
    } else {
      setStatus('error');
      setIsLoading(false);
    }
  }, [approvalId]);

  const handleApproval = async (approved: boolean) => {
    if (!request) return;

    setIsProcessing(true);
    try {
      // TODO: Replace with actual API call
      // await apiService.approveGuardianRequest(approvalId, approved);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newStatus = approved ? 'approved' : 'denied';
      setStatus(newStatus);
      
      toast.success(
        approved 
          ? 'Account approved! Your child can now access G3MS.' 
          : 'Request denied. The student account remains restricted.'
      );
    } catch (error) {
      toast.error('Failed to process approval. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === 'error' || !request) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <CardTitle>Invalid Request</CardTitle>
            <CardDescription>
              This approval link is invalid or has expired.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col gap-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                If you need help, please contact us at{' '}
                <a href="mailto:help@getg3ms.com" className="text-primary underline">
                  help@getg3ms.com
                </a>
              </AlertDescription>
            </Alert>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (status === 'approved') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <CardTitle>Account Approved!</CardTitle>
            <CardDescription>
              {request.studentName}'s account has been successfully approved.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center text-sm text-muted-foreground">
            <p>Your child can now access their G3MS account and participate in educational activities.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === 'denied') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <CardTitle>Account Denied</CardTitle>
            <CardDescription>
              The approval request for {request.studentName}'s account has been denied.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center text-sm text-muted-foreground">
            <p>The student account will remain restricted until parental approval is granted.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">G3MS Parental Approval</h1>
          <p className="text-muted-foreground">
            Your approval is required for your child to access G3MS
          </p>
        </div>

        {/* Main Approval Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Parental Consent Required
            </CardTitle>
            <CardDescription>
              Under COPPA regulations, we need your permission for children under 13 to use G3MS.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Student Information */}
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3">Student Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Student Name:</span>
                  <span className="font-medium">{request.studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Parent/Guardian:</span>
                  <span className="font-medium">{request.parentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Request Date:</span>
                  <span className="font-medium">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* What is G3MS */}
            <div>
              <h3 className="font-semibold mb-3">About G3MS</h3>
              <p className="text-sm text-muted-foreground mb-2">
                G3MS is an educational platform designed to help students learn and grow through interactive activities and challenges.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                <li>Safe, supervised learning environment</li>
                <li>Educational content and challenges</li>
                <li>Progress tracking and rewards</li>
                <li>COPPA-compliant data protection</li>
              </ul>
            </div>

            {/* Privacy Information */}
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Privacy Protection:</strong> We collect only necessary educational data and never share personal information with third parties. You can review our privacy policy and withdraw consent at any time.
              </AlertDescription>
            </Alert>

            {/* Approval Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={() => handleApproval(true)}
                disabled={isProcessing}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {isProcessing ? (
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                Approve Access
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleApproval(false)}
                disabled={isProcessing}
                className="flex-1"
              >
                {isProcessing ? (
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                ) : (
                  <XCircle className="h-4 w-4 mr-2" />
                )}
                Deny Access
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-primary" />
              <a href="mailto:help@getg3ms.com" className="text-primary underline">
                help@getg3ms.com
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GuardianApproval;