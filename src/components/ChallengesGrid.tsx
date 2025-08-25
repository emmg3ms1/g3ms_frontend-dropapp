
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Gift, Users, Play } from "lucide-react";

export const ChallengesGrid = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("trending");
  
  const categories = [
    { id: "trending", label: "🔥 Trending", slug: null },
    { id: "math-logic", label: "🔢 Math & Logic", slug: "math-logic" },
    { id: "reading-writing", label: "📖 Reading & Writing", slug: "reading-writing" },
    { id: "science-curiosity", label: "💡 Science & Curiosity", slug: "science-curiosity" },
    { id: "test-prep", label: "🧠 Test Prep", slug: "test-prep" },
    { id: "arts-creativity", label: "🎭 Arts & Creativity", slug: "arts-creativity" },
    { id: "social-studies-civics", label: "📚 Social Studies & Civics", slug: "social-studies-civics" },
    { id: "life-career", label: "🌱 Life & Career", slug: "life-career" },
    { id: "communication-skills", label: "💬 Communication Skills", slug: "communication-skills" },
    { id: "financial-literacy", label: "🧮 Financial Literacy", slug: "financial-literacy" },
    { id: "career-workforce", label: "🧰 Career & Workforce Skills", slug: "career-workforce" },
    { id: "mental-health-wellness", label: "❤️ Mental Health & Wellness", slug: "mental-health-wellness" },
    { id: "social-emotional-learning", label: "👥 Social-Emotional Learning", slug: "social-emotional-learning" },
    { id: "global-citizenship", label: "🌍 Global Citizenship", slug: "global-citizenship" },
    { id: "code-creation", label: "💻 Code Creation", slug: "code-creation" }
  ];

  const challenges = [
    {
      id: 1,
      title: "TikTok Math: Viral Problem Solving",
      description: "Solve trending math problems and create your own explanation video",
      reward: "$25 Amazon",
      participants: "2.3K",
      timeLeft: "2 days",
      difficulty: "Medium",
      color: "from-pink-500 to-purple-600"
    },
    {
      id: 2,
      title: "Science Experiment Challenge",
      description: "Film a safe experiment and explain the science behind it",
      reward: "$30 Target",
      participants: "1.8K",
      timeLeft: "5 days",
      difficulty: "Easy",
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: 3,
      title: "History Mystery Solver",
      description: "Research and create content about unsolved historical mysteries",
      reward: "$20 Starbucks",
      participants: "950",
      timeLeft: "1 week",
      difficulty: "Hard",
      color: "from-orange-500 to-red-500"
    },
    {
      id: 4,
      title: "Climate Action Creator",
      description: "Share creative solutions for climate change in your community",
      reward: "$40 Nike",
      participants: "3.1K",
      timeLeft: "3 days",
      difficulty: "Medium",
      color: "from-green-500 to-emerald-600"
    }
  ];

  return (
    <section id="challenges" className="py-20 relative bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Daily Drip Challenge
          </h2>
          <p className="text-xl text-gray-600">
            Learn Fast. Win Big.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <Button
              key={category.id}
              onClick={() => {
                setActiveCategory(category.id);
              }}
              className={`rounded-full px-6 py-3 font-semibold transition-all duration-200 ${
                activeCategory === category.id
                  ? 'bg-gradient-to-r from-g3ms-purple to-g3ms-green text-white shadow-lg transform scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Challenges Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {challenges.map((challenge, index) => (
            <div 
              key={challenge.id}
              className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className={`bg-gradient-to-br ${challenge.color} rounded-3xl p-6 relative overflow-hidden shadow-2xl`}>
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-sm font-semibold text-white`}>
                      {challenge.difficulty}
                    </div>
                    <div className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold">
                      <Gift className="w-3 h-3 inline mr-1" />
                      {challenge.reward}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3">{challenge.title}</h3>
                  <p className="text-white/90 mb-4 text-sm">{challenge.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-white/80 text-sm">
                      <Users className="w-4 h-4 mr-1" />
                      {challenge.participants} joined
                    </div>
                    <div className="text-white/80 text-sm">
                      ⏰ {challenge.timeLeft} left
                    </div>
                  </div>
                  
                  <Button className="w-full bg-white/20 hover:bg-white/30 text-white border-0 rounded-full font-semibold backdrop-blur-md transition-all duration-200">
                    <Play className="w-4 h-4 mr-2" />
                    Join Challenge
                  </Button>
                </div>
                
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full px-8 py-3 font-semibold text-lg">
            View All Challenges
          </Button>
        </div>
      </div>
    </section>
  );
};
