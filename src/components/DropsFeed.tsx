import React from 'react';
import { Heart, MessageCircle, Share, Diamond, Play } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface DropProject {
  id: string;
  user: {
    name: string;
    username: string;
    avatar: string;
    grade: string;
    school: string;
  };
  drop: {
    title: string;
    subject: string;
    date: string;
  };
  content: {
    type: 'image' | 'video';
    url: string;
    thumbnail?: string;
  };
  reward: {
    type: string;
    amount: string;
    brand?: string;
  };
  stats: {
    likes: number;
    comments: number;
    shares: number;
  };
  isLiked: boolean;
}

const mockProjects: DropProject[] = [
  {
    id: '1',
    user: {
      name: 'Rihanna J.',
      username: '@rjhagins',
      avatar: '/lovable-uploads/6c094e07-219a-4abc-bd5b-129ccf2cf3b7.png',
      grade: '3rd Grade',
      school: 'PS11 Brooklyn'
    },
    drop: {
      title: 'Nike + Algebra',
      subject: 'Math',
      date: 'June 5, 2025'
    },
    content: {
      type: 'image',
      url: '/lovable-uploads/6c094e07-219a-4abc-bd5b-129ccf2cf3b7.png'
    },
    reward: {
      type: 'Sephora Gift Card',
      amount: '$50',
      brand: 'sephora'
    },
    stats: {
      likes: 127,
      comments: 23,
      shares: 8
    },
    isLiked: false
  },
  {
    id: '2',
    user: {
      name: 'Marcus T.',
      username: '@marcust_learns',
      avatar: '/lovable-uploads/77d380bc-6094-4e16-a283-f06ab50adc79.png',
      grade: '5th Grade',
      school: 'Lincoln Elementary'
    },
    drop: {
      title: 'Science Lab Challenge',
      subject: 'Science',
      date: 'June 4, 2025'
    },
    content: {
      type: 'video',
      url: '/videos/educator-drop.mp4',
      thumbnail: '/lovable-uploads/77d380bc-6094-4e16-a283-f06ab50adc79.png'
    },
    reward: {
      type: 'Amazon Gift Card',
      amount: '$25',
      brand: 'amazon'
    },
    stats: {
      likes: 89,
      comments: 15,
      shares: 5
    },
    isLiked: true
  },
  {
    id: '3',
    user: {
      name: 'Sofia M.',
      username: '@sofia_math',
      avatar: '/lovable-uploads/b1b80d28-746f-43d0-833a-99eed0da5b04.png',
      grade: '4th Grade',
      school: 'Riverside Academy'
    },
    drop: {
      title: 'Poetry & Expression',
      subject: 'English',
      date: 'June 3, 2025'
    },
    content: {
      type: 'image',
      url: '/lovable-uploads/b1b80d28-746f-43d0-833a-99eed0da5b04.png'
    },
    reward: {
      type: 'Visa Gift Card',
      amount: '$30',
      brand: 'visa'
    },
    stats: {
      likes: 156,
      comments: 31,
      shares: 12
    },
    isLiked: false
  }
];

const getBrandLogo = (brand?: string) => {
  switch (brand) {
    case 'amazon':
      return '/src/assets/amazon-logo.svg';
    case 'sephora':
      return '/src/assets/sephora-logo.png';
    case 'visa':
      return '/src/assets/visa-logo.svg';
    default:
      return null;
  }
};

const DropProjectCard: React.FC<{ project: DropProject }> = ({ project }) => {
  const [isLiked, setIsLiked] = React.useState(project.isLiked);
  const [likes, setLikes] = React.useState(project.stats.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 mb-4">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={project.user.avatar} alt={project.user.name} />
            <AvatarFallback>{project.user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-sm">{project.user.name}</h3>
              <span className="text-xs text-gray-500">{project.user.username}</span>
            </div>
            <p className="text-xs text-gray-500">{project.user.grade}, {project.user.school}</p>
          </div>
        </div>
        <div className="flex items-center space-x-1 bg-blue-50 px-2 py-1 rounded-full">
          <Diamond className="w-3 h-3 text-blue-600 fill-current" />
          <span className="text-xs font-bold text-blue-600">{project.reward.amount}</span>
        </div>
      </div>

      {/* Content */}
      <div className="relative">
        {project.content.type === 'video' ? (
          <div className="relative aspect-[4/5] bg-black">
            <video
              src={project.content.url}
              className="w-full h-full object-cover"
              poster={project.content.thumbnail}
              controls
              playsInline
            />
            <div className="absolute top-4 left-4 bg-black/50 text-white px-2 py-1 rounded-lg text-xs">
              VIDEO
            </div>
          </div>
        ) : (
          <div className="aspect-[4/5] bg-gray-100">
            <img
              src={project.content.url}
              alt="Drop project"
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        {/* Drop Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <div className="text-white">
            <h4 className="font-bold text-lg mb-1">Drop: {project.drop.title}</h4>
            <div className="flex items-center justify-between">
              <p className="text-sm opacity-90">{project.drop.date}</p>
              {project.reward.brand && (
                <div className="flex items-center space-x-2">
                  <img
                    src={getBrandLogo(project.reward.brand)}
                    alt={project.reward.brand}
                    className="h-4 w-auto"
                  />
                  <span className="text-xs bg-white/20 px-2 py-1 rounded">
                    {project.reward.type}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              className="flex items-center space-x-1 touch-manipulation"
            >
              <Heart
                className={`w-6 h-6 ${
                  isLiked ? 'fill-red-500 text-red-500' : 'text-gray-700'
                }`}
              />
              <span className="text-sm font-medium">{likes}</span>
            </button>
            <button className="flex items-center space-x-1 touch-manipulation">
              <MessageCircle className="w-6 h-6 text-gray-700" />
              <span className="text-sm font-medium">{project.stats.comments}</span>
            </button>
            <button className="flex items-center space-x-1 touch-manipulation">
              <Share className="w-6 h-6 text-gray-700" />
              <span className="text-sm font-medium">{project.stats.shares}</span>
            </button>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="text-xs font-medium"
          >
            Try This Drop
          </Button>
        </div>
        
        {likes > 0 && (
          <p className="text-sm text-gray-600 mb-2">
            <span className="font-medium">{likes} students</span> found this inspiring
          </p>
        )}
      </div>
    </div>
  );
};

export const DropsFeed: React.FC = () => {
  return (
    <div className="max-w-md mx-auto">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold mb-2">🔥 Student Spotlight</h2>
        <p className="text-gray-600 text-sm">
          See how students across the country are crushing their Drops and winning rewards
        </p>
      </div>
      
      <div className="space-y-0">
        {mockProjects.map((project) => (
          <DropProjectCard key={project.id} project={project} />
        ))}
      </div>
      
      <div className="text-center py-6">
        <Button variant="outline" className="rounded-full px-6">
          Load More Projects
        </Button>
      </div>
    </div>
  );
};