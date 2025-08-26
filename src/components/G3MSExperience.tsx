import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BookOpen, Gift, TrendingUp, Users, Zap, Trophy, Play } from "lucide-react";
import GatedSignupForm from "@/components/GatedSignupForm";
import { VideoPreview } from "@/components/VideoPreview";
import { SignupFlow } from "@/components/SignupFlow";
import { useAuth } from "@/contexts/AuthContext";
import { useDropData } from "@/contexts/DropDataContext";

export const G3MSExperience = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setDropData, setIsDropCreationFlow } = useDropData();
  const [showSignupFlow, setShowSignupFlow] = useState(false);
  
  // Student form state
  const [studentFormData, setStudentFormData] = useState({
    city: '',
    state: '',
    school: '',
    grade: ''
  });
  
  // Educator form state
  const [educatorFormData, setEducatorFormData] = useState({
    dropType: '',
    grade: '',
    subject: '',
    rtiTier: '',
    learningGoal: ''
  });

  // Brand form state
  const [brandFormData, setBrandFormData] = useState({
    brandName: '',
    campaignGoal: '',
    rewardType: '',
    budgetRange: '',
    learningGoal: ''
  });
  const usStates = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
    'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
    'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
    'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
    'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
    'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
    'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
  ];

  const grades = ['3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'];

  const subjects = [
    'Math', 'English/Language Arts', 'Science', 'Social Studies', 'History', 'Art', 'Music', 'PE', 'Computer Science'
  ];

  const socialLinks = [
    {
      name: "TikTok",
      url: "https://www.tiktok.com/@getg3ms",
      image: "/lovable-uploads/47b5fd56-1608-44a1-9bd0-7602a09520e9.png"
    },
    {
      name: "YouTube",
      url: "https://www.youtube.com/@getg3ms",
      image: "/lovable-uploads/adad9af6-d179-4d1d-a046-9393c239e603.png"
    },
    {
      name: "Snapchat",
      url: "https://www.snapchat.com/add/getg3ms",
      image: "/lovable-uploads/ba515979-a1e1-4a6a-8b4c-16fb7f9f0ea6.png"
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/getg3ms/",
      image: "/lovable-uploads/749667ad-110e-4941-87e5-a35fbf9fbe01.png"
    },
    {
      name: "Threads",
      url: "https://www.threads.com/@getg3ms",
      image: "/lovable-uploads/1598f0ef-1d2d-4423-9b24-12abab060627.png"
    },
    {
      name: "Facebook",
      url: "https://www.facebook.com/getg3ms/",
      image: "/lovable-uploads/f7cbe212-d171-4f58-80f9-06e2d3f68155.png"
    }
  ];

  const videos = [
    {
      id: 1,
      title: "Learning video 1",
      image: "/lovable-uploads/fa86fd8a-aaf1-4df7-9543-0e113afeb6cb.png",
      giftCard: "Amazon"
    },
    {
      id: 2,
      title: "Learning video 2", 
      image: "/lovable-uploads/15e58f96-66d6-4e51-86ea-92c50ff126fb.png",
      giftCard: "Sephora"
    },
    {
      id: 3,
      title: "Learning video 3",
      image: "/lovable-uploads/e42f48c7-9a24-4f44-bd65-62012ae06f19.png",
      giftCard: "Roblox"
    }
  ];

  const handleVideoClick = () => {
    window.open('https://uqr.to/1grrk', '_blank');
  };

  const handleEducatorFormSubmit = () => {
    // Store the drop creation data
    const dropData = {
      dropType: educatorFormData.dropType,
      grade: educatorFormData.grade,
      subject: educatorFormData.subject,
      rtiTier: educatorFormData.rtiTier,
      learningGoal: educatorFormData.learningGoal
    };
    
    setDropData(dropData);
    setIsDropCreationFlow(true);
    
    // Check if user is authenticated
    if (user && user.role === 'educator') {
      // Redirect to educator dashboard with prefilled data
      navigate('/educator/dashboard');
    } else {
      // User needs to authenticate - this will be handled by GatedSignupForm
      // The form data is already stored in context/sessionStorage
    }
  };

  const updateEducatorFormData = (field: string, value: string) => {
    setEducatorFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateStudentFormData = (field: string, value: string) => {
    setStudentFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateBrandFormData = (field: string, value: string) => {
    setBrandFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Form validation functions
  const isStudentFormValid = studentFormData.city.trim() && 
                             studentFormData.state && 
                             studentFormData.school.trim() && 
                             studentFormData.grade;

  const isEducatorFormValid = educatorFormData.dropType && 
                              educatorFormData.grade && 
                              educatorFormData.subject && 
                              educatorFormData.rtiTier && 
                              educatorFormData.learningGoal.trim();

  const isBrandFormValid = brandFormData.brandName.trim() && 
                           brandFormData.campaignGoal && 
                           brandFormData.rewardType && 
                           brandFormData.budgetRange && 
                           brandFormData.learningGoal.trim();

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Daily Drop Challenge Section */}
        <div id="daily-drip" className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
            Your Daily Drop is Waiting
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-12 px-2 leading-relaxed">
            Create or complete Drops.<br className="hidden sm:block" />
            <span className="sm:hidden"> </span>Earn rewards from gift cards to IRL experiences.
          </p>
          
          
          <Tabs defaultValue="student" className="w-full max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 mb-6 sm:mb-8 h-12 sm:h-14 rounded-lg">
              <TabsTrigger value="student" className="text-xs sm:text-sm md:text-base touch-manipulation">Students</TabsTrigger>
              <TabsTrigger value="educator" className="text-xs sm:text-sm md:text-base touch-manipulation">Educators</TabsTrigger>
              <TabsTrigger value="brand" className="text-xs sm:text-sm md:text-base touch-manipulation">Brands</TabsTrigger>
            </TabsList>
            
            <TabsContent value="student" className="mt-0">
              <div className="bg-white rounded-xl p-4 sm:p-6 lg:p-8 border border-gray-200">
                <div className="text-center mb-6 sm:mb-8">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                    🔥 Complete a Drop. Win Rewards.
                  </h3>
                  <p className="text-gray-600 mb-6 sm:mb-8 text-base sm:text-lg px-2">
                    Tap in. Learn fast. Win something real.
                  </p>
                  <p className="text-sm md:text-base text-muted-foreground text-center px-2">
                    Take today's Drop challenge to earn tokens and surprise rewards—gift cards, merch, or real-world experiences from brands you love.
                  </p>
                </div>
                
                {/* Today's Drop Preview - Video Placeholder */}
                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-3 md:p-4 rounded-lg mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-sm md:text-base">Today's Drop Challenge</span>
                  </div>
                  
                  {/* Video Placeholder */}
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-3 touch-manipulation">
                    <iframe
                      src="https://player.mux.com/h02r3eQPuYTBOCSJDZ3a8RdDMabamWq3oIEi01okuZOpg?metadata-video-title=AI+Drop&video-title=AI+Drop"
                      style={{ width: '100%', border: 'none', aspectRatio: '16/9' }}
                      allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                      allowFullScreen
                      className="rounded-lg"
                      title="Daily Video Challenge"
                    />
                  </div>
                  
                  <div className="text-xs md:text-sm text-gray-600">
                    Where every Drop is a surprise and every win counts—gift cards, merch, or real world experiences from brands you love.
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 md:gap-3 mb-3">
                  <div className="space-y-0.5">
                    <Label htmlFor="student-city" className="text-xs font-medium">City</Label>
                    <Input 
                      id="student-city" 
                      placeholder="Type city name" 
                      className="text-sm h-9 touch-manipulation"
                      value={studentFormData.city}
                      onChange={(e) => updateStudentFormData('city', e.target.value)}
                    />
                  </div>
                  <div className="space-y-0.5">
                    <Label htmlFor="student-state" className="text-xs font-medium">State</Label>
                    <Select value={studentFormData.state} onValueChange={(value) => updateStudentFormData('state', value)}>
                      <SelectTrigger className="text-sm h-9 touch-manipulation">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {usStates.map(state => (
                          <SelectItem key={state} value={state.toLowerCase().replace(' ', '-')} className="touch-manipulation">
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-0.5">
                    <Label htmlFor="student-school" className="text-xs font-medium">School</Label>
                    <Input 
                      id="student-school" 
                      placeholder="Type school name" 
                      className="text-sm h-9 touch-manipulation"
                      value={studentFormData.school}
                      onChange={(e) => updateStudentFormData('school', e.target.value)}
                    />
                  </div>
                  <div className="space-y-0.5">
                    <Label htmlFor="student-grade" className="text-xs font-medium">Grade</Label>
                    <Select value={studentFormData.grade} onValueChange={(value) => updateStudentFormData('grade', value)}>
                      <SelectTrigger className="text-sm h-9 touch-manipulation">
                        <SelectValue placeholder="Select grade" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {grades.map(grade => (
                          <SelectItem key={grade} value={grade} className="touch-manipulation">
                            {grade}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <GatedSignupForm audience="student">
                  <Button 
                    disabled={!isStudentFormValid}
                    className="w-full text-white font-semibold touch-manipulation h-11 sm:h-12 text-sm sm:text-base mt-3 sm:mt-5" 
                    style={{ backgroundColor: '#aa1b83' }}
                  >
                    ✅ Complete a Drop Now
                  </Button>
                </GatedSignupForm>
              </div>
            </TabsContent>
            
            <TabsContent value="educator" className="mt-0">
              <div className="bg-white rounded-xl p-4 sm:p-6 lg:p-8 border border-gray-200">
                <div className="text-center mb-6 sm:mb-8">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                    🧠 Create a Drop. Get Students Learning Anywhere.
                  </h3>
                  <p className="text-gray-600 text-base sm:text-lg px-2">
                    Engagement meets instruction.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 md:gap-3 mb-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="drop-type" className="text-xs font-medium">Choose a Drop type</Label>
                    <Select value={educatorFormData.dropType} onValueChange={(value) => updateEducatorFormData('dropType', value)}>
                      <SelectTrigger className="text-sm h-9 touch-manipulation">
                        <SelectValue placeholder="Select drop type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bellwork">📝 Bellwork & Exit Tickets</SelectItem>
                        <SelectItem value="quiz">🧠 Knowledge Check Quiz</SelectItem>
                        <SelectItem value="lesson">📚 Scaffolded Lesson</SelectItem>
                        <SelectItem value="video">🎬 Video-based Instruction</SelectItem>
                        <SelectItem value="project">🔬 Project-based Learning</SelectItem>
                        <SelectItem value="assessment">📊 Formative Assessment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-0.5">
                    <Label htmlFor="grade" className="text-xs font-medium">Grade</Label>
                    <Select value={educatorFormData.grade} onValueChange={(value) => updateEducatorFormData('grade', value)}>
                      <SelectTrigger className="text-sm h-9 touch-manipulation">
                        <SelectValue placeholder="Select grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {grades.map(grade => (
                          <SelectItem key={grade} value={grade} className="touch-manipulation">
                            {grade}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-0.5">
                    <Label htmlFor="subject" className="text-xs font-medium">Subject</Label>
                    <Select value={educatorFormData.subject} onValueChange={(value) => updateEducatorFormData('subject', value)}>
                      <SelectTrigger className="text-sm h-9 touch-manipulation">
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map(subject => (
                          <SelectItem key={subject} value={subject.toLowerCase().replace('/', '-').replace(' ', '-')} className="touch-manipulation">
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-0.5">
                    <Label htmlFor="rti-tier" className="text-xs font-medium">RTI Tier</Label>
                    <Select value={educatorFormData.rtiTier} onValueChange={(value) => updateEducatorFormData('rtiTier', value)}>
                      <SelectTrigger className="text-sm h-9 touch-manipulation">
                        <SelectValue placeholder="Select tier" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tier1">Tier 1 - Universal Support</SelectItem>
                        <SelectItem value="tier2">Tier 2 - Targeted Support</SelectItem>
                        <SelectItem value="tier3">Tier 3 - Intensive Support</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1.5 mb-4">
                  <Label htmlFor="learning-goal" className="text-xs font-medium">Standards/Learning Goal</Label>
                  <Textarea 
                    id="learning-goal"
                    placeholder="Enter a learning goal, objective, or standard and get a Drop in seconds."
                    className="text-sm min-h-[96px] touch-manipulation"
                    rows={4}
                    value={educatorFormData.learningGoal}
                    onChange={(e) => updateEducatorFormData('learningGoal', e.target.value)}
                  />
                </div>

                <GatedSignupForm audience="educator" onSubmit={handleEducatorFormSubmit}>
                  <Button 
                    disabled={!isEducatorFormValid}
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold text-sm sm:text-base touch-manipulation h-11 sm:h-12"
                    onClick={handleEducatorFormSubmit}
                  >
                    🚀 Create a Drop Now
                  </Button>
                </GatedSignupForm>
              </div>
            </TabsContent>
            
            <TabsContent value="brand" className="mt-0">
              <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
                <div className="text-center mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                    🎯 Launch a Branded Drop
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Your brand, in a challenge students want to complete.
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    Choose a learning theme and attach a reward. G3MS builds and distributes the Drop to students in classrooms and on social.
                  </p>
                </div>

                <div className="space-y-4 mb-6">
                  <h4 className="text-lg font-semibold text-gray-900">Campaign Info</h4>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-0.5">
                      <Label htmlFor="brand-name" className="text-xs font-medium">Brand/Org Name</Label>
                      <Input 
                        id="brand-name" 
                        placeholder="Enter brand or organization name" 
                        className="text-sm h-9 touch-manipulation"
                        value={brandFormData.brandName}
                        onChange={(e) => updateBrandFormData('brandName', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-0.5">
                      <Label htmlFor="campaign-goal" className="text-xs font-medium">Campaign Goal</Label>
                      <Select value={brandFormData.campaignGoal} onValueChange={(value) => updateBrandFormData('campaignGoal', value)}>
                        <SelectTrigger className="text-sm h-9 touch-manipulation">
                          <SelectValue placeholder="Select campaign goal" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="brand-awareness">Brand Awareness</SelectItem>
                          <SelectItem value="product-launch">Product Launch</SelectItem>
                          <SelectItem value="social-impact">Social Impact</SelectItem>
                          <SelectItem value="recruitment">Talent Recruitment</SelectItem>
                          <SelectItem value="community-engagement">Community Engagement</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-0.5">
                      <Label htmlFor="reward-type" className="text-xs font-medium">Reward Type</Label>
                      <Select value={brandFormData.rewardType} onValueChange={(value) => updateBrandFormData('rewardType', value)}>
                        <SelectTrigger className="text-sm h-9 touch-manipulation">
                          <SelectValue placeholder="Select reward" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gift-cards">Gift Cards</SelectItem>
                          <SelectItem value="products">Products/Merchandise</SelectItem>
                          <SelectItem value="experiences">Experiences</SelectItem>
                          <SelectItem value="scholarships">Scholarships</SelectItem>
                          <SelectItem value="internships">Internship Opportunities</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-0.5">
                      <Label htmlFor="budget" className="text-xs font-medium">Budget Range</Label>
                      <Select value={brandFormData.budgetRange} onValueChange={(value) => updateBrandFormData('budgetRange', value)}>
                        <SelectTrigger className="text-sm h-9 touch-manipulation">
                          <SelectValue placeholder="What's your budget for this campaign?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5k-15k">$5K - $15K</SelectItem>
                          <SelectItem value="15k-30k">$15K - $30K</SelectItem>
                          <SelectItem value="30k-50k">$30K - $50K</SelectItem>
                          <SelectItem value="50k-100k">$50K - $100K</SelectItem>
                          <SelectItem value="100k+">$100K+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 mb-4">
                  <Label htmlFor="brand-learning-goal" className="text-xs font-medium">Standards/Learning Goal</Label>
                  <Textarea 
                    id="brand-learning-goal"
                    placeholder="Describe the educational theme, standards, or learning objectives for your branded Drop."
                    className="text-sm min-h-[96px] touch-manipulation"
                    rows={4}
                    value={brandFormData.learningGoal}
                    onChange={(e) => updateBrandFormData('learningGoal', e.target.value)}
                  />
                </div>

                <div className="text-center text-sm text-gray-500 mb-6">
                  <p>Sign up fee + per campaign pricing applies for brands.</p>
                  <p>Want to sponsor with creators? We'll match you.</p>
                </div>

                <GatedSignupForm audience="brand">
                  <Button 
                    disabled={!isBrandFormValid}
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold text-sm sm:text-base touch-manipulation h-11 sm:h-12"
                  >
                    🚀 Launch a Branded Drop
                  </Button>
                </GatedSignupForm>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Meet Ayo Section */}
        <div id="meet-ayo" className="mb-12 sm:mb-16">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 px-2">
                💬 Meet Ayo, Your AI Tutor
              </h2>
              
              <div className="flex justify-center mb-6 sm:mb-8">
                <img 
                  src="/lovable-uploads/59e4c837-9483-4600-b7ed-f83a4b71b87c.png" 
                  alt="Ayo - AI Tutor Character"
                  className="w-24 sm:w-32 h-24 sm:h-32 object-contain"
                />
              </div>
              
              <GatedSignupForm audience="student">
                <Button 
                  className="bg-gradient-to-r from-g3ms-purple to-g3ms-green hover:from-g3ms-purple/90 hover:to-g3ms-green/90 text-white font-bold text-base sm:text-lg px-6 sm:px-8 py-3 rounded-full transform hover:scale-105 transition-all duration-200 shadow-lg touch-manipulation h-12 sm:h-14"
                >
                  Meet Ayo
                </Button>
              </GatedSignupForm>
            </div>
            
            <div className="text-left">
              <p className="text-lg sm:text-xl text-gray-600 font-bold mb-3 sm:mb-4 px-2">
                Built for Gen Alpha and Gen Z. Trusted by Schools.
              </p>
              <p className="text-base sm:text-lg text-gray-600 px-2 leading-relaxed">
                Ayo is a smart, interactive learning companion designed to help every student succeed. Aligned to state standards, Ayo supports students in math, writing, test prep, coding, and more—delivering real-time guidance that builds confidence, critical thinking, and academic growth. <span className="font-bold">Tailored for how today's learners engage best.</span>
              </p>
            </div>
          </div>
        </div>

        {/* Real Student Results Section */}
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-8">📈 Real Student Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-4xl font-bold text-g3ms-purple mb-2">87%</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">Grade Improvement in 30 Days</div>
              <div className="text-gray-600">Students improve quickly by completing daily Drops—AI-powered micro-challenges that deliver personalized feedback and reinforce key skills.</div>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-4xl font-bold text-g3ms-green mb-2">92%</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">Daily Engagement Rate</div>
              <div className="text-gray-600">The Drop experience keeps students coming back. Each challenge earns tokens toward gift cards and real-world rewards, with Ayo guiding their progress.</div>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-4xl font-bold text-pink-500 mb-2">15 Minutes</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">Daily Learning Time</div>
              <div className="text-gray-600">Each Drop is short, focused, and built for impact. In just 15 minutes a day, students build confidence, close learning gaps, and stay on track—without stress.</div>
            </div>
          </div>
        </div>

        {/* Built for Classrooms. Loved by Families Section */}
        <div id="educators-parents" className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Trusted by Teachers. Loved by Families.
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center justify-center mb-6">
                <BookOpen className="w-12 h-12 text-g3ms-purple" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">For Educators</h3>
              <ul className="space-y-4 text-left text-gray-600 mb-8">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-g3ms-purple rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Assign state aligned standards
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-g3ms-purple rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Track RTI/MTSS progress in real time
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-g3ms-purple rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Use our Admin Dashboard for interventions
                </li>
              </ul>
              <Button 
                className="bg-g3ms-purple hover:bg-g3ms-purple/90 text-white rounded-full px-8 py-3"
                onClick={() => window.location.href = '/drops?tab=educator'}
              >
                Get Started for Schools
              </Button>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center justify-center mb-6">
                <Users className="w-12 h-12 text-g3ms-green" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">For Parents</h3>
              <ul className="space-y-4 text-left text-gray-600 mb-8">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-g3ms-green rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Personalized learning for your child
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-g3ms-green rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  AI Tutor for instant homework help
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-g3ms-green rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Get weekly progress insights
                </li>
              </ul>
              <Button 
                className="bg-g3ms-green hover:bg-g3ms-green/90 text-white rounded-full px-8 py-3"
                onClick={() => window.location.href = '/drops?tab=student'}
              >
                Start Free Trial
              </Button>
            </div>
          </div>
        </div>

        {/* Tap in. Earn More Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Tap in. Earn More.
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            Follow us for quizzes, tokens, and epic rewards every day.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-4xl mx-auto">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
              >
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 mb-2 flex items-center justify-center">
                    <img 
                      src={social.image} 
                      alt={social.name}
                      className="w-full h-full group-hover:scale-110 transition-transform duration-200 object-contain"
                    />
                  </div>
                  <div className="text-lg font-semibold text-gray-900">{social.name}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Signup Flow Modal */}
      <SignupFlow 
        isOpen={showSignupFlow}
        onClose={() => setShowSignupFlow(false)}
      />
    </section>
  );
};