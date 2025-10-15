# Video Processing & Storage Pipeline

This document describes the implementation of the video processing and storage pipeline for the Winbro Training Reels platform.

## Overview

The video processing pipeline handles:
- Resumable file uploads with chunked transfer
- Video transcoding to multiple formats (HLS, DASH, MP4)
- Thumbnail generation at key timestamps
- CDN distribution for global delivery
- Real-time processing status updates
- Error handling and retry mechanisms

## Architecture

### Components

1. **Upload Widget** (`src/components/upload/UploadWidget.tsx`)
   - Enhanced with resumable upload functionality
   - Real-time progress tracking
   - Pause/resume capabilities
   - Error handling and retry logic

2. **Processing Status Component** (`src/components/upload/ProcessingStatus.tsx`)
   - Real-time status updates via WebSocket
   - Processing stage visualization
   - Progress tracking and time estimates
   - Error handling and retry options

3. **Video Storage Service** (`src/services/storage.ts`)
   - Chunked upload implementation
   - Resume capability across browser sessions
   - Upload progress tracking
   - Error handling and retry logic

4. **Video Processor Service** (`src/services/video-processor.ts`)
   - Transcoding job management
   - Thumbnail generation
   - Format recommendations
   - Queue status monitoring

5. **API Layer** (`src/api/video-processing.ts`)
   - RESTful endpoints for video processing
   - WebSocket integration for real-time updates
   - Type-safe API interfaces

6. **React Hooks** (`src/hooks/use-video-processing.ts`)
   - Video processing status tracking
   - Upload management
   - Real-time updates integration

## Database Schema

### Tables

- `video_processing_jobs` - Main processing job tracking
- `video_formats` - Different quality/format versions
- `video_thumbnails` - Thumbnail images at timestamps
- `video_uploads` - Upload progress and metadata
- `video_processing_stages` - Individual processing stages
- `video_cdn_cache` - CDN distribution tracking
- `video_analytics` - Processing and delivery metrics

### Key Features

- Comprehensive indexing for performance
- Automatic cleanup of expired uploads
- Processing queue status functions
- Real-time status queries with stages

## API Endpoints

### Upload Endpoints

- `POST /api/videos/upload/initiate` - Start upload process
- `POST /api/videos/upload/chunk` - Upload file chunk
- `POST /api/videos/upload/complete` - Complete upload and start processing

### Processing Endpoints

- `GET /api/videos/:id/processing-status` - Get processing status
- `POST /api/videos/:id/retry-processing` - Retry failed processing
- `GET /api/videos/:id` - Get video details with formats
- `GET /api/videos/:id/preview` - Get preview URL

### Queue Management

- `GET /api/videos/processing/queue-status` - Get queue statistics
- `GET /api/videos/processing/jobs` - Get user's processing jobs

### WebSocket

- `wss://api.winbro.com/videos/:id/processing-status` - Real-time updates

## Usage Examples

### Basic Upload

```typescript
import { useVideoUpload } from '@/hooks/use-video-processing';

function UploadComponent() {
  const { upload, uploadProgress, uploadStatus, videoId } = useVideoUpload();

  const handleUpload = async (file: File) => {
    await upload({
      file,
      metadata: {
        title: 'My Training Video',
        description: 'Step-by-step guide',
        machineModel: 'CNC-2000',
        process: 'Milling',
        tags: ['Training', 'Milling'],
        customerAccess: []
      }
    });
  };

  return (
    <div>
      <input type="file" onChange={(e) => handleUpload(e.target.files[0])} />
      <div>Progress: {uploadProgress}%</div>
      <div>Status: {uploadStatus}</div>
    </div>
  );
}
```

### Processing Status Tracking

```typescript
import { useVideoProcessing } from '@/hooks/use-video-processing';

function ProcessingComponent({ videoId }: { videoId: string }) {
  const {
    processingStatus,
    isProcessing,
    isCompleted,
    currentStage,
    overallProgress,
    retry
  } = useVideoProcessing({ videoId });

  if (isCompleted) {
    return <div>Processing complete!</div>;
  }

  return (
    <div>
      <div>Status: {processingStatus?.status}</div>
      <div>Progress: {overallProgress}%</div>
      <div>Current Stage: {currentStage?.name}</div>
      {processingStatus?.status === 'failed' && (
        <button onClick={() => retry()}>Retry</button>
      )}
    </div>
  );
}
```

### Storage Service Usage

```typescript
import { videoStorageService } from '@/services/storage';

// Upload with progress tracking
const videoId = await videoStorageService.uploadVideo(
  file,
  metadata,
  {
    onProgress: (progress) => {
      console.log(`Upload progress: ${progress.percentage}%`);
      console.log(`Speed: ${progress.speed} bytes/s`);
      console.log(`ETA: ${progress.estimatedTimeRemaining}s`);
    },
    onError: (error) => {
      console.error('Upload failed:', error);
    },
    onComplete: (videoId) => {
      console.log('Upload completed:', videoId);
    }
  }
);

// Pause/resume upload
videoStorageService.pauseUpload(videoId);
videoStorageService.resumeUpload(videoId);

// Cancel upload
videoStorageService.cancelUpload(videoId);
```

## Configuration

### Environment Variables

```env
VITE_API_URL=http://localhost:3000/api
VITE_WS_URL=ws://localhost:3000
VITE_CDN_URL=https://cdn.example.com
```

### Upload Limits

- Maximum file size: 500MB (configurable)
- Chunk size: 1MB (configurable)
- Allowed formats: MP4, MOV, AVI, MKV, WebM
- Retry attempts: 3 (configurable)

## Error Handling

### Upload Errors

- File size validation
- Format validation
- Network connectivity issues
- Server-side validation errors

### Processing Errors

- Transcoding failures
- Thumbnail generation errors
- CDN distribution issues
- Automatic retry with exponential backoff

### User Experience

- Clear error messages
- Retry options
- Progress indicators
- Real-time status updates

## Performance Optimizations

### Upload Optimizations

- Chunked uploads for large files
- Resume capability across sessions
- Parallel chunk uploads (future enhancement)
- Compression before upload (future enhancement)

### Processing Optimizations

- Queue-based processing
- Priority-based job scheduling
- Parallel format generation
- CDN pre-warming

### Frontend Optimizations

- WebSocket for real-time updates
- Optimistic UI updates
- Efficient re-rendering
- Memory management for large files

## Security Considerations

### Upload Security

- File type validation
- File size limits
- Virus scanning (future enhancement)
- Content moderation (future enhancement)

### Access Control

- Signed URLs for video access
- Time-limited access tokens
- User-based permissions
- Organization-level access control

### Data Protection

- Encryption at rest
- Encryption in transit
- Secure file storage
- GDPR compliance

## Monitoring and Analytics

### Metrics Tracked

- Upload success/failure rates
- Processing times by format
- CDN hit rates
- User engagement metrics
- Error rates and types

### Logging

- Detailed processing logs
- Error tracking
- Performance metrics
- User activity logs

## Future Enhancements

### Planned Features

- AI-powered content analysis
- Automatic subtitle generation
- Advanced thumbnail selection
- Video compression optimization
- Multi-language support

### Scalability Improvements

- Horizontal scaling
- Load balancing
- Database sharding
- CDN optimization
- Caching strategies

## Troubleshooting

### Common Issues

1. **Upload fails immediately**
   - Check file size and format
   - Verify network connectivity
   - Check server logs

2. **Processing stuck**
   - Check processing queue status
   - Verify server resources
   - Check error logs

3. **WebSocket connection issues**
   - Check network connectivity
   - Verify WebSocket URL
   - Check authentication tokens

### Debug Tools

- Browser developer tools
- Network tab for upload monitoring
- WebSocket tab for real-time updates
- Server logs for backend issues

## Testing

### Unit Tests

- Component testing
- Hook testing
- Service testing
- API testing

### Integration Tests

- End-to-end upload flow
- Processing pipeline testing
- WebSocket communication
- Error handling scenarios

### Performance Tests

- Large file uploads
- Concurrent uploads
- Processing queue stress tests
- CDN performance tests

## Deployment

### Prerequisites

- Node.js 18+
- PostgreSQL 13+
- Redis (for job queue)
- CDN service (CloudFront, etc.)
- Storage service (S3, etc.)

### Environment Setup

1. Install dependencies
2. Set up database
3. Configure environment variables
4. Set up CDN and storage
5. Deploy application

### Monitoring Setup

- Application monitoring
- Database monitoring
- CDN monitoring
- Error tracking
- Performance monitoring

## Support

For issues or questions regarding the video processing pipeline:

1. Check this documentation
2. Review error logs
3. Test with sample files
4. Contact development team

## Changelog

### Version 1.0.0
- Initial implementation
- Resumable uploads
- Multi-format transcoding
- Thumbnail generation
- Real-time status updates
- Error handling and retry
- CDN integration