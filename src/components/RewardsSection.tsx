import { Button } from "@/components/ui/button";
import { Gift, Award, Video, Plus, Minus, Crown, Diamond } from "lucide-react";

export const RewardsSection = () => {
  const recentActivity = [
    { 
      type: "earned", 
      title: "Algebra 1A56 Quiz", 
      subtitle: "Completed • 2 hours ago", 
      amount: "+$10" 
    },
    { 
      type: "won", 
      title: "Algebra 1A56 Drop", 
      subtitle: "Gift Card Won! • Tap to view", 
      amount: "", 
      highlight: true 
    },
    { 
      type: "spent", 
      title: "Weekly Draw Entry", 
      subtitle: "Entered • Yesterday", 
      amount: "-$1,000" 
    },
    { 
      type: "earned", 
      title: "Chemistry Lab Complete", 
      subtitle: "Completed • 3 days ago", 
      amount: "+$30" 
    }
  ];

  return (
    <div className="bg-white rounded-2xl p-8 shadow-xl border max-w-2xl w-full">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          🎁 Your Rewards + Progress
        </h2>
        <Button className="bg-g3ms-purple text-white font-semibold px-6 py-2 rounded-full hover:bg-g3ms-purple/90">
          <Crown className="w-4 h-4 mr-2" />
          Upgrade
        </Button>
      </div>

      {/* Current Balance */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
        <div className="text-center">
          <p className="text-blue-600 text-sm mb-2">Current Balance</p>
          <h3 className="text-2xl font-bold text-blue-800 mb-3">$6,300 G3MS</h3>
          <div className="text-sm text-gray-600">
            <span className="font-medium">$8,700 tokens to go</span> • <span className="text-green-600 font-medium">$15,000 = Gift card</span>
          </div>
        </div>
      </div>

      {/* Tokens Earned vs Spent */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="text-center">
          <p className="text-gray-600 text-sm mb-1">Tokens Earned</p>
          <p className="text-xl font-bold text-green-600">$6,300 G3MS</p>
        </div>
        <div className="text-center">
          <p className="text-gray-600 text-sm mb-1">Tokens Spent</p>
          <p className="text-xl font-bold text-red-500">$0 G3MS</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h4>
        <div className="space-y-3">
          {recentActivity.map((activity, index) => (
            <div 
              key={index} 
              className={`flex items-center justify-between p-3 rounded-lg ${
                activity.highlight 
                  ? 'bg-blue-50 border border-blue-200' 
                  : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  activity.type === 'earned' ? 'bg-green-100' :
                  activity.type === 'spent' ? 'bg-red-100' :
                  'bg-blue-100'
                }`}>
                  {activity.type === 'earned' && <Plus className="w-4 h-4 text-green-600" />}
                  {activity.type === 'spent' && <Minus className="w-4 h-4 text-red-600" />}
                  {activity.type === 'won' && <Gift className="w-4 h-4 text-blue-600" />}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-600">{activity.subtitle}</p>
                </div>
              </div>
              {activity.amount && (
                <span className={`font-bold ${
                  activity.amount.startsWith('+') ? 'text-green-600' : 'text-red-500'
                }`}>
                  {activity.amount}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Action Cards */}
      <div className="space-y-4">
        {/* Weekly Draw Card */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-6 text-black">
          <div className="flex items-start gap-4">
            <div className="bg-white/20 rounded-lg p-3">
              <Gift className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h5 className="font-bold text-lg mb-2">
                Spend $1,000 G3MS to enter this week's gift card draw!
              </h5>
              <Button className="bg-g3ms-purple text-white font-semibold px-6 py-2 rounded-full hover:bg-g3ms-purple/90 mt-3">
                Enter Weekly
              </Button>
            </div>
          </div>
        </div>

        {/* Redeem Card */}
        <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-xl p-6 text-white">
          <div className="flex items-start gap-4">
            <div className="bg-white/20 rounded-lg p-3">
              <Award className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h5 className="font-bold text-lg mb-2">
                Got $15,000 G3MS stacked? 🎉 Time to cash out grab your gift card now!
              </h5>
              <Button className="bg-white text-g3ms-purple font-bold px-8 py-3 rounded-full hover:bg-gray-50 shadow-lg mt-3">
                Redeem now
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-6 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          Unlock real gift cards & experiences with G3MS Tokens.
        </p>
      </div>
    </div>
  );
};
