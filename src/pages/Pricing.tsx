import React from 'react';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import GatedSignupForm from '@/components/GatedSignupForm';

const Pricing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50">
      <Navigation isScrolled={false} />
      
      <main className="pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span style={{ color: '#aa1b83' }}>G3MS Pricing</span>
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              From free access for schools to brand partnerships, G3MS makes learning accessible and engaging for all.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Schools Plan */}
            <Card className="border-2 border-g3ms-green shadow-lg">
              <CardHeader className="text-center pb-8">
                <Badge className="w-fit mx-auto mb-4 bg-g3ms-green text-white">
                  Most Popular
                </Badge>
                <CardTitle className="text-2xl font-bold">🎓 Schools</CardTitle>
                <CardDescription className="text-lg">
                  Free forever for educational institutions
                </CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-g3ms-green">FREE</span>
                  <span className="text-gray-600 ml-2">forever</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center">
                    <span className="text-g3ms-green mr-2">✓</span>
                    Unlimited teachers
                  </li>
                  <li className="flex items-center">
                    <span className="text-g3ms-green mr-2">✓</span>
                    Unlimited students
                  </li>
                  <li className="flex items-center">
                    <span className="text-g3ms-green mr-2">✓</span>
                    Real-time dashboards & insights
                  </li>
                  <li className="flex items-center">
                    <span className="text-g3ms-green mr-2">✓</span>
                    Access to Drops, tokens, and rewards
                  </li>
                  <li className="flex items-center">
                    <span className="text-g3ms-green mr-2">✓</span>
                    Admin onboarding & support
                  </li>
                </ul>
                <p className="text-xs text-gray-500 italic mt-4">
                  For districts and networks that need integrations, dedicated training, or advanced reporting, enterprise options are available through our team.
                </p>
                <GatedSignupForm audience="educator">
                  <Button className="w-full mt-6 bg-g3ms-green hover:bg-g3ms-green/90 text-white">
                    Bring G3MS to Your School for Free
                  </Button>
                </GatedSignupForm>
              </CardContent>
            </Card>

            {/* Families Plan */}
            <Card className="shadow-lg">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold">👨‍👩‍👧 Families</CardTitle>
                <CardDescription className="text-lg">
                  Perfect for families with student learners
                </CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold" style={{ color: '#aa1b83' }}>$9.99</span>
                  <span className="text-gray-600 ml-2">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center">
                    <span className="text-g3ms-purple mr-2">✓</span>
                    Up to 3 student accounts
                  </li>
                  <li className="flex items-center">
                    <span className="text-g3ms-purple mr-2">✓</span>
                    Daily short-form Drops (Math, ELA, Science, more)
                  </li>
                  <li className="flex items-center">
                    <span className="text-g3ms-purple mr-2">✓</span>
                    Tokens & gift cards as rewards
                  </li>
                  <li className="flex items-center">
                    <span className="text-g3ms-purple mr-2">✓</span>
                    AI tutor (Ayo) for homework help
                  </li>
                </ul>
                <GatedSignupForm audience="student">
                  <Button 
                    variant="outline" 
                    className="w-full mt-6 border-g3ms-purple text-g3ms-purple hover:bg-g3ms-purple hover:text-white"
                  >
                    Start Free Trial
                  </Button>
                </GatedSignupForm>
              </CardContent>
            </Card>

            {/* Brands Plan */}
            <Card className="shadow-lg">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold">💡 Brands & Creators</CardTitle>
                <CardDescription className="text-lg">
                  Partner with G3MS to engage learners
                </CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold" style={{ color: '#aa1b83' }}>$250</span>
                  <span className="text-gray-600 ml-2">+ $1,000 rewards</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="mb-4">
                  <h4 className="font-semibold text-sm mb-2 text-g3ms-purple">Starter Sponsorship</h4>
                  <ul className="space-y-2 text-xs">
                    <li className="flex items-center">
                      <span className="text-g3ms-purple mr-2">✓</span>
                      Launch your first branded Drop
                    </li>
                    <li className="flex items-center">
                      <span className="text-g3ms-purple mr-2">✓</span>
                      Choose rewards (gift cards, event tickets, merch)
                    </li>
                    <li className="flex items-center">
                      <span className="text-g3ms-purple mr-2">✓</span>
                      Brand featured in Drop intro/outro
                    </li>
                    <li className="flex items-center">
                      <span className="text-g3ms-purple mr-2">✓</span>
                      Engagement reporting
                    </li>
                  </ul>
                </div>
                <div className="mb-4">
                  <h4 className="font-semibold text-sm mb-2 text-g3ms-purple">Growth Sponsorship ($2,500+)</h4>
                  <ul className="space-y-2 text-xs">
                    <li className="flex items-center">
                      <span className="text-g3ms-purple mr-2">✓</span>
                      Multi-Drop series with branded storylines
                    </li>
                    <li className="flex items-center">
                      <span className="text-g3ms-purple mr-2">✓</span>
                      Target by grade, subject, or region
                    </li>
                  </ul>
                </div>
                <GatedSignupForm audience="brand">
                  <Button 
                    variant="outline" 
                    className="w-full mt-6 border-g3ms-purple text-g3ms-purple hover:bg-g3ms-purple hover:text-white"
                  >
                    Partner With G3MS
                  </Button>
                </GatedSignupForm>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
              Frequently Asked Questions
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-lg mb-2" style={{ color: '#aa1b83' }}>
                  Is G3MS really free for schools?
                </h3>
                <p className="text-gray-600">
                  Yes. Any teacher or school can use G3MS at no cost, forever. For large districts that need integrations, advanced reporting, or training, we offer enterprise options.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2" style={{ color: '#aa1b83' }}>
                  Can families cancel anytime?
                </h3>
                <p className="text-gray-600">
                  Yes. The family plan is month-to-month. You can upgrade, downgrade, or cancel at any time from your account dashboard.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2" style={{ color: '#aa1b83' }}>
                  What rewards can students earn?
                </h3>
                <p className="text-gray-600">
                  Rewards include digital gift cards, event tickets, and branded merchandise. Brands fund these rewards so families and schools don't have to.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2" style={{ color: '#aa1b83' }}>
                  How do brands participate?
                </h3>
                <p className="text-gray-600">
                  Brands can sponsor Drops starting at $250 with a $1,000 rewards pool. Larger campaigns can include multi-Drop series, targeting, and creator collaborations.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2" style={{ color: '#aa1b83' }}>
                  How do creators fit into G3MS?
                </h3>
                <p className="text-gray-600">
                  Creators can launch their own challenge Drops, earn sponsorships, and refer brands or schools. They're part of the ecosystem that keeps Drops fun and relevant.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2" style={{ color: '#aa1b83' }}>
                  Is student data safe?
                </h3>
                <p className="text-gray-600">
                  Yes. G3MS complies with COPPA, FERPA, and standard privacy protections. We never sell student data.
                </p>
              </div>
            </div>
            <div className="grid md:grid-cols-1 gap-8 mt-8">
              <div className="text-center">
                <h3 className="font-semibold text-lg mb-2" style={{ color: '#aa1b83' }}>
                  Does G3MS work outside the U.S.?
                </h3>
                <p className="text-gray-600">
                  Yes. Families and schools worldwide can use G3MS. Reward availability may vary by country.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Pricing;