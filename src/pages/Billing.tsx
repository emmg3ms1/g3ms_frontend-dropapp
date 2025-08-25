import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, CreditCard, Calendar, Download, CheckCircle, Clock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const Billing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user: authUser } = useAuth();
  
  // Mock billing data - replace with real API calls
  const currentPlan = {
    name: "G3MS Educator Free",
    price: "$0/month",
    status: "Active",
    nextBilling: "N/A"
  };

  const billingHistory = [
    {
      id: 1,
      date: "2024-01-15",
      description: "G3MS Educator Free Plan",
      amount: "$0.00",
      status: "Active"
    }
  ];

  const handleDownloadInvoice = (invoiceId: number) => {
    toast({
      title: "Download started",
      description: `Invoice #${invoiceId} is being downloaded.`,
    });
  };

  // Don't render if not authenticated
  if (!authUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Please log in</h2>
          <p className="text-gray-600 mb-4">You need to be logged in to view billing information.</p>
          <Button onClick={() => navigate('/')}>Go to Home</Button>
        </div>
      </div>
    );
  }

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
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <CreditCard className="w-8 h-8 text-g3ms-purple" />
              <h1 className="text-3xl font-bold text-g3ms-purple">Billing & Subscription</h1>
            </div>
            <p className="text-gray-600">Manage your subscription and billing information</p>
          </div>

          <div className="space-y-6">
            {/* Current Plan */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-g3ms-purple">Current Plan</span>
                  <Badge className="bg-g3ms-green text-white">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {currentPlan.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{currentPlan.name}</h3>
                    <p className="text-gray-600">Perfect for getting started with G3MS</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-g3ms-purple">{currentPlan.price}</div>
                    <p className="text-sm text-gray-600">Next billing: {currentPlan.nextBilling}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900">Plan Features:</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-g3ms-green" />
                      Create unlimited drops
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-g3ms-green" />
                      Up to 30 students per class
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-g3ms-green" />
                      Basic analytics dashboard
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-g3ms-green" />
                      Email support
                    </li>
                  </ul>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button className="bg-g3ms-purple hover:bg-g3ms-purple/90">
                    Upgrade Plan
                  </Button>
                  <Button variant="outline" className="border-g3ms-purple/20 text-g3ms-purple hover:bg-g3ms-purple/5">
                    View All Plans
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Billing History */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-g3ms-purple">Billing History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {billingHistory.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-g3ms-purple/10 rounded-lg flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-g3ms-purple" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{invoice.description}</h4>
                          <p className="text-sm text-gray-600">{invoice.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">{invoice.amount}</div>
                          <Badge variant="outline" className="text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            {invoice.status}
                          </Badge>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDownloadInvoice(invoice.id)}
                          className="text-g3ms-purple hover:bg-g3ms-purple/10"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {billingHistory.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No billing history available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-g3ms-purple">Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="mb-4">No payment method required for free plan</p>
                  <Button variant="outline" className="border-g3ms-purple/20 text-g3ms-purple hover:bg-g3ms-purple/5">
                    Add Payment Method
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;