// Utility functions for Mux video handling

export interface MuxAssetDetails {
  id: string;
  status: string;
  tracks: Array<{
    id: string;
    type: 'audio' | 'video';
    primary?: boolean;
    duration: number;
    max_channels?: number;
    max_channel_layout?: string;
    max_width?: number;
    max_height?: number;
    max_frame_rate?: number;
  }>;
  duration: number;
  upload_id: string;
  created_at: string;
  ingest_type: string;
  mp4_support: string;
  aspect_ratio: string;
  playback_ids: Array<{
    id: string;
    policy: 'public' | 'signed';
  }>;
  encoding_tier: string;
  master_access: string;
  video_quality: string;
  resolution_tier: string;
  max_resolution_tier: string;
  max_stored_frame_rate: number;
  max_stored_resolution: string;
}

export interface VideoWithAssetDetails {
  id: string;
  title: string;
  assetId: string;
  playbackId: string;
  assetDetails?: MuxAssetDetails;
  createdAt: string;
  updatedAt: string;
}

/**
 * Generate Mux thumbnail URL from playback ID
 * @param playbackId - The Mux playback ID
 * @param format - Image format (jpg, png, gif, webp)
 * @param options - Additional options for thumbnail generation
 * @returns Complete thumbnail URL
 */
export const getMuxThumbnailUrl = (
  playbackId: string, 
  format: 'jpg' | 'png' | 'gif' | 'webp' = 'jpg',
  options?: {
    width?: number;
    height?: number;
    fit_mode?: 'preserve' | 'crop' | 'pad';
    time?: number; // Time in seconds for thumbnail
  }
): string => {
  let url = `https://image.mux.com/${playbackId}/thumbnail.${format}`;
  
  if (options) {
    const params = new URLSearchParams();
    if (options.width) params.append('width', options.width.toString());
    if (options.height) params.append('height', options.height.toString());
    if (options.fit_mode) params.append('fit_mode', options.fit_mode);
    if (options.time) params.append('time', options.time.toString());
    
    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }
  
  return url;
};

/**
 * Extract playback ID from video asset details
 * @param video - Video object with asset details
 * @returns Playback ID or null if not found
 */
export const getPlaybackIdFromVideo = (video: VideoWithAssetDetails): string | null => {
  if (video.playbackId) {
    return video.playbackId;
  }
  
  // Handle the actual API response format
  if (video.assetDetails?.playback_ids?.[0]?.id) {
    return video.assetDetails.playback_ids[0].id;
  }
  
  // Fallback: try to extract from assetId if it's actually a playback ID
  if (video.assetId && video.assetId.length > 20) {
    return video.assetId;
  }
  
  return null;
};

/**
 * Get video thumbnail URL from video object
 * @param video - Video object with asset details
 * @param format - Image format
 * @param options - Thumbnail options
 * @returns Thumbnail URL or null if playback ID not found
 */
export const getVideoThumbnailUrl = (
  video: VideoWithAssetDetails,
  format: 'jpg' | 'png' | 'gif' | 'webp' = 'jpg',
  options?: Parameters<typeof getMuxThumbnailUrl>[2]
): string | null => {
  const playbackId = getPlaybackIdFromVideo(video);
  if (!playbackId) return null;
  
  return getMuxThumbnailUrl(playbackId, format, options);
};

/**
 * Get Mux player embed URL
 * @param playbackId - The Mux playback ID
 * @param options - Player options
 * @returns Mux player URL
 */
export const getMuxPlayerUrl = (
  playbackId: string,
  options?: {
    autoplay?: boolean;
    muted?: boolean;
    loop?: boolean;
    controls?: boolean;
  }
): string => {
  let url = `https://player.mux.com/${playbackId}`;
  
  if (options) {
    const params = new URLSearchParams();
    if (options.autoplay) params.append('autoplay', 'true');
    if (options.muted) params.append('muted', 'true');
    if (options.loop) params.append('loop', 'true');
    if (options.controls === false) params.append('controls', 'false');
    
    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }
  
  return url;
};