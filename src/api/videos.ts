import { api } from "@/lib/api";
import type { VideoClip, User } from "@/types";

// Enhanced video types for the player
export interface Video {
  id: string;
  title: string;
  description?: string;
  streamingUrl: string;
  thumbnailUrl: string;
  duration: number;
  machineModel: string;
  process: string;
  tags: string[];
  transcript?: TranscriptSegment[];
  createdBy: User;
  createdAt: string;
  isBookmarked: boolean;
  permissions: {
    download: boolean;
    share: boolean;
    comment: boolean;
  };
  viewCount: number;
  likeCount: number;
  isLiked: boolean;
}

export interface TranscriptSegment {
  id: string;
  startTime: number;
  endTime: number;
  text: string;
  confidence?: number;
  speakerId?: string;
}

export interface VideoComment {
  id: string;
  videoId: string;
  userId: string;
  user: User;
  content: string;
  timestamp?: number; // Video timestamp for timestamped comments
  parentId?: string; // For replies
  createdAt: string;
  updatedAt: string;
  replies?: VideoComment[];
}

export interface VideoProgress {
  videoId: string;
  currentTime: number;
  duration: number;
  completed: boolean;
  lastWatchedAt: string;
}

export interface VideoBookmark {
  id: string;
  videoId: string;
  userId: string;
  createdAt: string;
  video?: Video;
}

// Video API functions
export const videosApi = {
  // Get video by ID with full details
  getById: async (id: string): Promise<Video> => {
    const response = await api.get<Video>(`/videos/${id}`);
    return response;
  },

  // Get related videos based on similarity
  getRelated: async (id: string, limit: number = 4): Promise<Video[]> => {
    const response = await api.get<Video[]>(`/videos/${id}/related?limit=${limit}`);
    return response;
  },

  // Bookmark/unbookmark video
  bookmark: async (id: string): Promise<void> => {
    await api.post(`/videos/${id}/bookmark`, {});
  },

  unbookmark: async (id: string): Promise<void> => {
    await api.delete(`/videos/${id}/bookmark`);
  },

  // Like/unlike video
  like: async (id: string): Promise<void> => {
    await api.post(`/videos/${id}/like`, {});
  },

  unlike: async (id: string): Promise<void> => {
    await api.delete(`/videos/${id}/like`);
  },

  // Update video progress
  updateProgress: async (videoId: string, currentTime: number, duration: number): Promise<void> => {
    await api.post(`/videos/${videoId}/progress`, {
      currentTime,
      duration,
      completed: currentTime >= duration * 0.9, // 90% watched = completed
    });
  },

  // Get video progress
  getProgress: async (videoId: string): Promise<VideoProgress | null> => {
    try {
      const response = await api.get<VideoProgress>(`/videos/${videoId}/progress`);
      return response;
    } catch {
      return null;
    }
  },

  // Get video comments
  getComments: async (videoId: string): Promise<VideoComment[]> => {
    const response = await api.get<VideoComment[]>(`/videos/${videoId}/comments`);
    return response;
  },

  // Add comment
  addComment: async (videoId: string, content: string, timestamp?: number, parentId?: string): Promise<VideoComment> => {
    const response = await api.post<VideoComment>(`/videos/${videoId}/comments`, {
      content,
      timestamp,
      parentId,
    });
    return response;
  },

  // Update comment
  updateComment: async (commentId: string, content: string): Promise<VideoComment> => {
    const response = await api.put<VideoComment>(`/comments/${commentId}`, { content });
    return response;
  },

  // Delete comment
  deleteComment: async (commentId: string): Promise<void> => {
    await api.delete(`/comments/${commentId}`);
  },

  // Get user's bookmarks
  getBookmarks: async (): Promise<VideoBookmark[]> => {
    const response = await api.get<VideoBookmark[]>("/videos/bookmarks");
    return response;
  },

  // Share video
  share: async (videoId: string, shareType: 'link' | 'embed', options?: any): Promise<{ url: string; embedCode?: string }> => {
    const response = await api.post<{ url: string; embedCode?: string }>(`/videos/${videoId}/share`, {
      shareType,
      ...options,
    });
    return response;
  },

  // Download video (if permitted)
  getDownloadUrl: async (videoId: string): Promise<{ downloadUrl: string }> => {
    const response = await api.get<{ downloadUrl: string }>(`/videos/${videoId}/download`);
    return response;
  },

  // Report video
  report: async (videoId: string, reason: string, description?: string): Promise<void> => {
    await api.post(`/videos/${videoId}/report`, {
      reason,
      description,
    });
  },

  // Get video analytics (for content creators)
  getAnalytics: async (videoId: string): Promise<{
    views: number;
    uniqueViewers: number;
    averageWatchTime: number;
    completionRate: number;
    engagement: {
      likes: number;
      comments: number;
      shares: number;
    };
    demographics: {
      ageGroups: Record<string, number>;
      locations: Record<string, number>;
    };
  }> => {
    const response = await api.get<{
      views: number;
      uniqueViewers: number;
      averageWatchTime: number;
      completionRate: number;
      engagement: {
        likes: number;
        comments: number;
        shares: number;
      };
      demographics: {
        ageGroups: Record<string, number>;
        locations: Record<string, number>;
      };
    }>(`/videos/${videoId}/analytics`);
    return response;
  },
};

// Convert VideoClip to Video format
export function convertVideoClipToVideo(clip: VideoClip, user?: User): Video {
  return {
    id: clip.id,
    title: clip.title,
    description: clip.description,
    streamingUrl: clip.file_url, // In real app, this would be the HLS/DASH URL
    thumbnailUrl: clip.thumbnail_url || '',
    duration: clip.duration,
    machineModel: clip.machine_model || '',
    process: clip.process || '',
    tags: clip.tags,
    transcript: clip.transcript ? parseTranscript(clip.transcript) : undefined,
    createdBy: user || {
      id: clip.uploaded_by,
      email: '',
      full_name: clip.uploaded_by,
      role: 'user',
      organization_id: clip.organization_id,
      is_verified: false,
      created_at: clip.created_at,
      updated_at: clip.updated_at,
    },
    createdAt: clip.created_at,
    isBookmarked: false, // This would come from API
    permissions: {
      download: clip.privacy_level === 'public' || clip.privacy_level === 'organization',
      share: true,
      comment: true,
    },
    viewCount: clip.view_count,
    likeCount: clip.like_count,
    isLiked: false, // This would come from API
  };
}

// Parse transcript string into segments
function parseTranscript(transcript: string): TranscriptSegment[] {
  // This is a simple parser - in a real app, you'd have structured transcript data
  const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const segmentDuration = 8; // Average 8 seconds per segment
  
  return sentences.map((sentence, index) => ({
    id: `segment-${index}`,
    startTime: index * segmentDuration,
    endTime: (index + 1) * segmentDuration,
    text: sentence.trim(),
    confidence: 0.95,
  }));
}