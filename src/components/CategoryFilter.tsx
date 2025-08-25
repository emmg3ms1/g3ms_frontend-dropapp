import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onCategoryChange,
}) => {
  const categories = [
    { id: 'all', label: 'All', emoji: '🌟' },
    { id: 'coding', label: 'Coding', emoji: '💻' },
    { id: 'math', label: 'Math', emoji: '🔢' },
    { id: 'science', label: 'Science', emoji: '🧪' },
    { id: 'history', label: 'History', emoji: '📚' },
    { id: 'quiz', label: 'Quiz', emoji: '🧠' },
    { id: 'video-lesson', label: 'Lessons', emoji: '🎥' },
    { id: 'token-stack', label: 'Tokens', emoji: '💎' },
  ];

  return (
    <div className="absolute top-16 left-0 right-0 z-30 bg-black/20 backdrop-blur-sm border-b border-white/10">
      <ScrollArea className="w-full">
        <div className="flex gap-2 p-4 pb-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "ghost"}
              size="sm"
              onClick={() => onCategoryChange(category.id)}
              className={`
                flex items-center gap-2 whitespace-nowrap text-white flex-shrink-0
                ${selectedCategory === category.id 
                  ? 'bg-white/20 text-white' 
                  : 'hover:bg-white/10'
                }
              `}
            >
              <span>{category.emoji}</span>
              <span>{category.label}</span>
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};