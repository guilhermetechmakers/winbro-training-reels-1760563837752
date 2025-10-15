-- Video Processing & Storage Pipeline Database Schema
-- This migration creates the necessary tables for video processing, storage, and CDN delivery

-- Video processing jobs table
CREATE TABLE video_processing_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'completed', 'failed', 'cancelled')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  message TEXT,
  current_stage VARCHAR(50),
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  error_details JSONB,
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  priority VARCHAR(10) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Video formats table (stores different quality/format versions)
CREATE TABLE video_formats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID NOT NULL,
  format VARCHAR(10) NOT NULL CHECK (format IN ('hls', 'dash', 'mp4', 'webm')),
  quality VARCHAR(10) NOT NULL CHECK (quality IN ('360p', '720p', '1080p', '4k')),
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  duration INTEGER NOT NULL, -- in seconds
  bitrate INTEGER NOT NULL, -- in bits per second
  resolution_width INTEGER NOT NULL,
  resolution_height INTEGER NOT NULL,
  codec VARCHAR(20),
  container VARCHAR(10),
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Video thumbnails table
CREATE TABLE video_thumbnails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID NOT NULL,
  timestamp DECIMAL(10,3) NOT NULL, -- timestamp in seconds
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Video uploads table (tracks upload progress and metadata)
CREATE TABLE video_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID NOT NULL,
  upload_id VARCHAR(255) NOT NULL UNIQUE,
  file_name TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  content_type VARCHAR(100) NOT NULL,
  upload_url TEXT,
  resume_url TEXT,
  chunk_size INTEGER DEFAULT 1048576, -- 1MB default
  total_chunks INTEGER NOT NULL,
  uploaded_chunks INTEGER DEFAULT 0,
  upload_progress INTEGER DEFAULT 0 CHECK (upload_progress >= 0 AND upload_progress <= 100),
  status VARCHAR(20) DEFAULT 'uploading' CHECK (status IN ('uploading', 'completed', 'failed', 'cancelled')),
  error_message TEXT,
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  expires_at TIMESTAMP DEFAULT (NOW() + INTERVAL '24 hours')
);

-- Video processing stages table (tracks individual processing stages)
CREATE TABLE video_processing_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES video_processing_jobs(id) ON DELETE CASCADE,
  stage_name VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  message TEXT,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  error_details JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Video CDN cache table (tracks CDN distribution status)
CREATE TABLE video_cdn_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID NOT NULL,
  format_id UUID REFERENCES video_formats(id) ON DELETE CASCADE,
  cdn_provider VARCHAR(50) NOT NULL,
  cdn_url TEXT NOT NULL,
  region VARCHAR(50) NOT NULL,
  cache_status VARCHAR(20) DEFAULT 'pending' CHECK (cache_status IN ('pending', 'cached', 'expired', 'failed')),
  cache_key VARCHAR(255),
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Video analytics table (tracks processing and delivery metrics)
CREATE TABLE video_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID NOT NULL,
  event_type VARCHAR(50) NOT NULL, -- 'upload_started', 'upload_completed', 'processing_started', etc.
  event_data JSONB,
  processing_time_ms INTEGER,
  file_size_bytes BIGINT,
  format VARCHAR(10),
  quality VARCHAR(10),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_video_processing_jobs_video_id ON video_processing_jobs(video_id);
CREATE INDEX idx_video_processing_jobs_status ON video_processing_jobs(status);
CREATE INDEX idx_video_processing_jobs_created_at ON video_processing_jobs(created_at);
CREATE INDEX idx_video_processing_jobs_priority ON video_processing_jobs(priority);

CREATE INDEX idx_video_formats_video_id ON video_formats(video_id);
CREATE INDEX idx_video_formats_format_quality ON video_formats(format, quality);
CREATE INDEX idx_video_formats_is_primary ON video_formats(is_primary);

CREATE INDEX idx_video_thumbnails_video_id ON video_thumbnails(video_id);
CREATE INDEX idx_video_thumbnails_is_primary ON video_thumbnails(is_primary);

CREATE INDEX idx_video_uploads_video_id ON video_uploads(video_id);
CREATE INDEX idx_video_uploads_upload_id ON video_uploads(upload_id);
CREATE INDEX idx_video_uploads_status ON video_uploads(status);
CREATE INDEX idx_video_uploads_expires_at ON video_uploads(expires_at);

CREATE INDEX idx_video_processing_stages_job_id ON video_processing_stages(job_id);
CREATE INDEX idx_video_processing_stages_status ON video_processing_stages(status);

CREATE INDEX idx_video_cdn_cache_video_id ON video_cdn_cache(video_id);
CREATE INDEX idx_video_cdn_cache_format_id ON video_cdn_cache(format_id);
CREATE INDEX idx_video_cdn_cache_region ON video_cdn_cache(region);
CREATE INDEX idx_video_cdn_cache_status ON video_cdn_cache(cache_status);

CREATE INDEX idx_video_analytics_video_id ON video_analytics(video_id);
CREATE INDEX idx_video_analytics_event_type ON video_analytics(event_type);
CREATE INDEX idx_video_analytics_created_at ON video_analytics(created_at);

-- Update triggers for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_video_processing_jobs_updated_at 
  BEFORE UPDATE ON video_processing_jobs 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_video_formats_updated_at 
  BEFORE UPDATE ON video_formats 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_video_cdn_cache_updated_at 
  BEFORE UPDATE ON video_cdn_cache 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to clean up expired uploads
CREATE OR REPLACE FUNCTION cleanup_expired_uploads()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM video_uploads 
  WHERE expires_at < NOW() 
    AND status IN ('failed', 'cancelled');
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get processing queue status
CREATE OR REPLACE FUNCTION get_processing_queue_status()
RETURNS TABLE(
  total_jobs BIGINT,
  pending_jobs BIGINT,
  processing_jobs BIGINT,
  completed_jobs BIGINT,
  failed_jobs BIGINT,
  estimated_wait_time INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_jobs,
    COUNT(*) FILTER (WHERE status = 'queued') as pending_jobs,
    COUNT(*) FILTER (WHERE status = 'processing') as processing_jobs,
    COUNT(*) FILTER (WHERE status = 'completed') as completed_jobs,
    COUNT(*) FILTER (WHERE status = 'failed') as failed_jobs,
    COALESCE(
      AVG(EXTRACT(EPOCH FROM (completed_at - started_at)))::INTEGER 
      FILTER (WHERE status = 'completed' AND completed_at IS NOT NULL), 
      0
    ) as estimated_wait_time
  FROM video_processing_jobs
  WHERE created_at > NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql;

-- Function to get video processing status with stages
CREATE OR REPLACE FUNCTION get_video_processing_status(p_video_id UUID)
RETURNS TABLE(
  job_id UUID,
  video_id UUID,
  status VARCHAR(20),
  progress INTEGER,
  message TEXT,
  current_stage VARCHAR(50),
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  error_details JSONB,
  stages JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    j.id as job_id,
    j.video_id,
    j.status,
    j.progress,
    j.message,
    j.current_stage,
    j.started_at,
    j.completed_at,
    j.error_details,
    COALESCE(
      json_agg(
        json_build_object(
          'name', s.stage_name,
          'status', s.status,
          'progress', s.progress,
          'message', s.message,
          'started_at', s.started_at,
          'completed_at', s.completed_at
        ) ORDER BY s.created_at
      ) FILTER (WHERE s.id IS NOT NULL),
      '[]'::json
    ) as stages
  FROM video_processing_jobs j
  LEFT JOIN video_processing_stages s ON j.id = s.job_id
  WHERE j.video_id = p_video_id
  GROUP BY j.id, j.video_id, j.status, j.progress, j.message, j.current_stage, 
           j.started_at, j.completed_at, j.error_details;
END;
$$ LANGUAGE plpgsql;

-- Insert some default processing stages
INSERT INTO video_processing_stages (job_id, stage_name, status) VALUES
  (NULL, 'Upload Validation', 'pending'),
  (NULL, 'Video Analysis', 'pending'),
  (NULL, 'Transcoding', 'pending'),
  (NULL, 'Thumbnail Generation', 'pending'),
  (NULL, 'Quality Check', 'pending'),
  (NULL, 'CDN Distribution', 'pending');

-- Comments for documentation
COMMENT ON TABLE video_processing_jobs IS 'Tracks video processing jobs and their status';
COMMENT ON TABLE video_formats IS 'Stores different quality/format versions of videos';
COMMENT ON TABLE video_thumbnails IS 'Stores video thumbnail images at different timestamps';
COMMENT ON TABLE video_uploads IS 'Tracks file upload progress and metadata';
COMMENT ON TABLE video_processing_stages IS 'Tracks individual processing stages within a job';
COMMENT ON TABLE video_cdn_cache IS 'Tracks CDN distribution and caching status';
COMMENT ON TABLE video_analytics IS 'Stores processing and delivery analytics data';

COMMENT ON COLUMN video_processing_jobs.priority IS 'Job priority: low, normal, high';
COMMENT ON COLUMN video_processing_jobs.retry_count IS 'Number of times this job has been retried';
COMMENT ON COLUMN video_processing_jobs.max_retries IS 'Maximum number of retries allowed';

COMMENT ON COLUMN video_formats.is_primary IS 'Whether this is the primary format for the video';
COMMENT ON COLUMN video_formats.bitrate IS 'Video bitrate in bits per second';

COMMENT ON COLUMN video_thumbnails.timestamp IS 'Timestamp in seconds where thumbnail was captured';
COMMENT ON COLUMN video_thumbnails.is_primary IS 'Whether this is the primary thumbnail for the video';

COMMENT ON COLUMN video_uploads.chunk_size IS 'Size of each upload chunk in bytes';
COMMENT ON COLUMN video_uploads.total_chunks IS 'Total number of chunks for this upload';
COMMENT ON COLUMN video_uploads.uploaded_chunks IS 'Number of chunks successfully uploaded';

COMMENT ON COLUMN video_cdn_cache.region IS 'CDN region where content is cached';
COMMENT ON COLUMN video_cdn_cache.cache_key IS 'Unique key for CDN cache invalidation';

COMMENT ON COLUMN video_analytics.event_type IS 'Type of event: upload_started, processing_completed, etc.';
COMMENT ON COLUMN video_analytics.processing_time_ms IS 'Processing time in milliseconds';