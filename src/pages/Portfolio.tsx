import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, ExternalLink, Share2, Trophy, Code, Palette, Sparkles, ArrowLeft, Award, Download, Link as LinkIcon } from "lucide-react";
import { Link } from "react-router-dom";

const Portfolio = () => {
  // Mock data for portfolio items
  const dropProjects = [
    {
      id: 1,
      title: "Sustainable Fashion Challenge",
      category: "Lifestyle",
      completedAt: "2024-01-15",
      image: "/lovable-uploads/0644f691-514d-4b36-905b-b18794d803c4.png",
      description: "Created an eco-friendly wardrobe plan and documented my journey",
      rewards: 150,
      likes: 24,
      shares: 8
    },
    {
      id: 2,
      title: "AI Art Creation",
      category: "Technology",
      completedAt: "2024-01-10",
      image: "/lovable-uploads/08564c31-67cc-4e1a-8522-d529424ebe12.png",
      description: "Generated artwork using AI tools and learned prompt engineering",
      rewards: 200,
      likes: 45,
      shares: 12
    },
    {
      id: 3,
      title: "Community Garden Project",
      category: "Environment",
      completedAt: "2024-01-05",
      image: "/lovable-uploads/09c7da27-0435-4f40-876f-2b98324d7e8a.png",
      description: "Documented the process of starting a local community garden",
      rewards: 175,
      likes: 32,
      shares: 15
    }
  ];

  const codingProjects = [
    {
      id: 1,
      title: "Weather Dashboard",
      tech: ["React", "API Integration", "CSS"],
      liveUrl: "https://weather-app-demo.com",
      description: "Real-time weather app with location-based forecasts",
      completedAt: "2024-01-12",
      image: "/lovable-uploads/0b9303a1-6f07-4ff4-b2eb-b443246e2d3e.png"
    },
    {
      id: 2,
      title: "Task Manager",
      tech: ["JavaScript", "Local Storage", "Bootstrap"],
      liveUrl: "https://task-manager-demo.com",
      description: "Productivity app with drag-and-drop functionality",
      completedAt: "2024-01-08",
      image: "/lovable-uploads/1598f0ef-1d2d-4423-9b24-12abab060627.png"
    },
    {
      id: 3,
      title: "Portfolio Website",
      tech: ["HTML", "CSS", "JavaScript"],
      liveUrl: "https://portfolio-demo.com",
      description: "Personal portfolio showcasing web development skills",
      completedAt: "2024-01-03",
      image: "/lovable-uploads/15e58f96-66d6-4e51-86ea-92c50ff126fb.png"
    }
  ];

  const videos = [
    {
      id: 1,
      title: "My First AI Art Win",
      type: "win",
      thumbnail: "/lovable-uploads/16864d54-baf3-4eee-8c0b-b277c565af2f.png",
      duration: "2:15",
      views: 156,
      likes: 23
    },
    {
      id: 2,
      title: "Coding Challenge Walkthrough",
      type: "share",
      thumbnail: "/lovable-uploads/178da90b-ea31-4cf0-9d12-c27be225c987.png",
      duration: "5:42",
      views: 89,
      likes: 17
    },
    {
      id: 3,
      title: "G3MS Community Garden Success",
      type: "win",
      thumbnail: "/lovable-uploads/19bf79e5-ac32-4cf0-854c-9d0d611a5d96.png",
      duration: "3:28",
      views: 234,
      likes: 41
    }
  ];

  const certificates = [
    {
      id: 1,
      title: "AI Art Mastery",
      issuer: "G3MS Academy",
      completedAt: "2024-01-15",
      image: "/lovable-uploads/27c21c32-f8dc-49b6-95bf-1ed20558f18c.png",
      skills: ["AI Prompting", "Digital Art", "Creative Thinking"],
      verificationId: "G3MS-2024-001"
    },
    {
      id: 2,
      title: "Web Development Fundamentals",
      issuer: "G3MS Tech Track",
      completedAt: "2024-01-10",
      image: "/lovable-uploads/2bd18cbe-0fba-49ea-937b-4a210ef001fc.png",
      skills: ["HTML", "CSS", "JavaScript", "React"],
      verificationId: "G3MS-2024-002"
    },
    {
      id: 3,
      title: "Sustainable Innovation Challenge",
      issuer: "G3MS Community",
      completedAt: "2024-01-05",
      image: "/lovable-uploads/2cd2402f-ffa1-4406-9fdf-d1984c19cf6a.png",
      skills: ["Environmental Science", "Project Management", "Community Engagement"],
      verificationId: "G3MS-2024-003"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" asChild className="gap-2">
            <Link to="/drops/main">
              <ArrowLeft className="w-4 h-4" />
              Back to Drops
            </Link>
          </Button>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">My Portfolio</h1>
              <p className="text-muted-foreground text-lg">
                Showcase of my G3MS journey, projects, and achievements
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={() => {
                  // Generate portfolio PDF
                  const portfolioData = {
                    dropProjects: dropProjects.length,
                    codingProjects: codingProjects.length,
                    certificates: certificates.length,
                    videos: videos.length,
                    totalRewards: dropProjects.reduce((sum, project) => sum + project.rewards, 0)
                  };
                  console.log("Downloading portfolio...", portfolioData);
                  // In a real app, this would generate and download a PDF
                  alert("Portfolio download started! Check your downloads folder.");
                }}
              >
                <Download className="w-4 h-4" />
                Download PDF
              </Button>
              <Button 
                className="gap-2"
                onClick={() => {
                  // Share portfolio link
                  const portfolioUrl = `${window.location.origin}/portfolio`;
                  if (navigator.share) {
                    navigator.share({
                      title: "My G3MS Portfolio",
                      text: "Check out my portfolio showcasing my G3MS journey and achievements!",
                      url: portfolioUrl
                    });
                  } else {
                    navigator.clipboard.writeText(portfolioUrl);
                    alert("Portfolio link copied to clipboard!");
                  }
                }}
              >
                <LinkIcon className="w-4 h-4" />
                Share Portfolio
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{dropProjects.length}</div>
              <div className="text-sm text-muted-foreground">Drop Projects</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{codingProjects.length}</div>
              <div className="text-sm text-muted-foreground">Coding Projects</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{videos.length}</div>
              <div className="text-sm text-muted-foreground">Videos</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{certificates.length}</div>
              <div className="text-sm text-muted-foreground">Total Certificates</div>
            </CardContent>
          </Card>
        </div>

        {/* Portfolio Content */}
        <Tabs defaultValue="drops" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="drops" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Drop Projects
            </TabsTrigger>
            <TabsTrigger value="coding" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              Coding Projects
            </TabsTrigger>
            <TabsTrigger value="certificates" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Certificates
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              Videos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="drops" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dropProjects.map((project) => (
                <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video relative">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-2 right-2" variant="secondary">
                      {project.category}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">{project.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {project.description}
                    </p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                      <span>Completed: {new Date(project.completedAt).toLocaleDateString()}</span>
                      <span className="text-primary font-medium">+{project.rewards} points</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          ❤️ {project.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <Share2 className="w-3 h-3" />
                          {project.shares}
                        </span>
                      </div>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="coding" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {codingProjects.map((project) => (
                <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video relative">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">{project.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {project.tech.map((tech) => (
                        <Badge key={tech} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <div className="text-sm text-muted-foreground mb-3">
                      Completed: {new Date(project.completedAt).toLocaleDateString()}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Live Demo
                      </Button>
                      <Button size="sm" variant="outline">
                        Code
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="certificates" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates.map((certificate) => (
                <Card key={certificate.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video relative">
                    <img
                      src={certificate.image}
                      alt={certificate.title}
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-2 right-2" variant="default">
                      <Award className="w-3 h-3 mr-1" />
                      Certificate
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">{certificate.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Issued by {certificate.issuer}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {certificate.skills.map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <div className="text-sm text-muted-foreground mb-3">
                      Completed: {new Date(certificate.completedAt).toLocaleDateString()}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Verify
                      </Button>
                      <Button size="sm" variant="outline">
                        <Share2 className="w-3 h-3 mr-1" />
                        Share
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="videos" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video relative cursor-pointer group">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-12 h-12 text-white" />
                    </div>
                    <Badge 
                      className="absolute top-2 left-2" 
                      variant={video.type === 'win' ? 'default' : 'secondary'}
                    >
                      {video.type === 'win' ? <Trophy className="w-3 h-3 mr-1" /> : <Share2 className="w-3 h-3 mr-1" />}
                      {video.type === 'win' ? 'Win' : 'Share'}
                    </Badge>
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">{video.title}</h3>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{video.views} views</span>
                      <span className="flex items-center gap-1">
                        ❤️ {video.likes}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Portfolio;