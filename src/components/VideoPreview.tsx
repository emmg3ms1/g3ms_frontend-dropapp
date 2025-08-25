
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Gift } from "lucide-react";

interface VideoPreviewProps {
  videoSrc?: string;
  thumbnailSrc?: string;
  title?: string;
}

export const VideoPreview = ({ 
  videoSrc = "/videos/ai-drop-1.mp4", 
  thumbnailSrc,
  title = "G3MS Demo Video" 
}: VideoPreviewProps) => {
  const [showFullVideo, setShowFullVideo] = useState(false);

  const handleVideoClick = () => {
    // Cut off video after 15 seconds for homepage preview
    if (!showFullVideo) {
      setShowFullVideo(true);
    }
  };

  return (
    <div className="flex justify-center mb-6 sm:mb-8">
      <div className="w-full aspect-video max-w-lg relative">
        <video
          src={videoSrc}
          className="w-full h-full rounded-lg object-cover touch-manipulation"
          controls={showFullVideo}
          autoPlay
          muted
          loop={showFullVideo}
          title={title}
          playsInline
          onTimeUpdate={(e) => {
            // Cut off video at 15 seconds for preview
            if (!showFullVideo && e.currentTarget.currentTime >= 15) {
              e.currentTarget.pause();
              e.currentTarget.currentTime = 15;
            }
          }}
        />
        {!showFullVideo && (
          <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
            <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg text-center">
              <Play className="w-8 h-8 mx-auto mb-2 text-primary" />
              <p className="text-sm font-medium text-gray-900">Sign up to watch the full Drop!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
