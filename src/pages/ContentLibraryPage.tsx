import { useState, useMemo } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Grid3X3, 
  List, 
  Upload,
  Loader2
} from "lucide-react";
import { ProcessingStatus } from "@/components/upload/ProcessingStatus";
import { useVideoProcessingJobs } from "@/hooks/use-video-processing";
import { useSearchState, useSearchVideos, useSearchFilters } from "@/hooks/use-search";
import { SearchFilters } from "@/components/search/SearchFilters";
import { SearchResults } from "@/components/search/SearchResults";
import { SearchBar } from "@/components/search/SearchBar";
import { BulkActions } from "@/components/search/BulkActions";
import type { VideoClip } from "@/types";

export function ContentLibraryPage() {
  const [showProcessingJobs, setShowProcessingJobs] = useState(false);
  
  // Use the new search state hook
  const {
    query,
    filters,
    selectedVideos,
    viewMode,
    setQuery,
    setFilters,
    setSelectedVideos,
    setViewMode,
    clearSelection,
  } = useSearchState();

  // Get processing jobs
  const { jobs: processingJobs } = useVideoProcessingJobs({
    status: 'processing',
    limit: 10
  });

  // Use the new search hooks
  const { 
    data: searchData, 
    isLoading, 
    error, 
    hasNextPage, 
    fetchNextPage
  } = useSearchVideos(query, filters);

  const { data: availableFilters } = useSearchFilters();

  // Flatten search results from all pages
  const videos = useMemo(() => {
    if (!searchData?.pages) return [];
    return searchData.pages.flatMap((page: any) => page.videos);
  }, [searchData]);

  const searchTime = searchData?.pages?.[0]?.searchTime || 0;

  // Handle bulk actions
  const handleBulkAction = async (action: string, videoIds: string[]) => {
    // TODO: Implement actual bulk actions
    console.log(`Bulk action: ${action}`, videoIds);
  };

  // Handle video click
  const handleVideoClick = (video: VideoClip) => {
    // TODO: Navigate to video player or details
    console.log('Video clicked:', video);
  };

  // Handle video action
  const handleVideoAction = (video: VideoClip, action: string) => {
    // TODO: Handle video actions (edit, delete, etc.)
    console.log('Video action:', action, video);
  };


  return (
    <MainLayout>
      <div className="flex h-full">
        {/* Search Filters Sidebar */}
        <SearchFilters
          filters={filters}
          onFiltersChange={setFilters}
          availableFilters={availableFilters}
          isLoading={isLoading}
        />
        
        {/* Main Content Area */}
        <main className="flex-1 flex flex-col">
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold">Content Library</h1>
                <p className="text-muted-foreground mt-1 text-sm lg:text-base">
                  Manage and organize your training videos
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {processingJobs.length > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => setShowProcessingJobs(!showProcessingJobs)}
                    className="relative w-full sm:w-auto"
                  >
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing ({processingJobs.length})
                    <Badge 
                      variant="secondary" 
                      className="ml-2 bg-blue-500 text-white"
                    >
                      {processingJobs.length}
                    </Badge>
                  </Button>
                )}
                <Button className="w-full sm:w-auto">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Video
                </Button>
              </div>
            </div>

            {/* Search and View Controls */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Search Bar */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                    <div className="flex-1">
                      <SearchBar
                        query={query}
                        onQueryChange={setQuery}
                        placeholder="Search videos, descriptions, or tags..."
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        <Button
                          variant={viewMode === 'grid' ? 'default' : 'outline'}
                          size="icon"
                          onClick={() => setViewMode('grid')}
                          aria-label="Switch to grid view"
                          aria-pressed={viewMode === 'grid'}
                        >
                          <Grid3X3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={viewMode === 'list' ? 'default' : 'outline'}
                          size="icon"
                          onClick={() => setViewMode('list')}
                          aria-label="Switch to list view"
                          aria-pressed={viewMode === 'list'}
                        >
                          <List className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

        {/* Processing Jobs Panel */}
        {showProcessingJobs && processingJobs.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Processing Videos</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowProcessingJobs(false)}
                  >
                    Hide
                  </Button>
                </div>
                <div className="space-y-3">
                  {processingJobs.map((job) => (
                    <ProcessingStatus
                      key={job.videoId}
                      videoId={job.videoId}
                      compact={true}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

            {/* Bulk Actions */}
            <BulkActions
              selectedVideos={selectedVideos}
              onClearSelection={clearSelection}
              onBulkAction={handleBulkAction}
            />

            {/* Search Results */}
            <SearchResults
              videos={videos}
              viewMode={viewMode}
              selectedVideos={selectedVideos}
              onSelectionChange={setSelectedVideos}
              onLoadMore={fetchNextPage}
              hasMore={hasNextPage || false}
              isLoading={isLoading}
              error={error}
              searchTime={searchTime}
              onVideoClick={handleVideoClick}
              onVideoAction={handleVideoAction}
            />
          </div>
        </main>
      </div>
    </MainLayout>
  );
}
