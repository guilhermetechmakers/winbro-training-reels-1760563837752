import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useCallback, useMemo } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { searchApi, type VideoFilters } from "@/api/search";
import { toast } from "sonner";

export const useSearchVideos = (query: string, filters: VideoFilters) => {
  const debouncedQuery = useDebounce(query, 300);
  
  return useInfiniteQuery({
    queryKey: ["search", "videos", debouncedQuery, filters],
    queryFn: ({ pageParam = 1 }) => 
      searchApi.searchVideos(debouncedQuery, filters, pageParam as number),
    getNextPageParam: (lastPage: any) => 
      lastPage.hasMore ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
    enabled: debouncedQuery.length > 0 || Object.keys(filters).length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

export const useSearchFilters = () => {
  return useQuery({
    queryKey: ["search", "filters"],
    queryFn: () => searchApi.getSearchFilters(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
};

export const useAutocompleteSuggestions = (query: string) => {
  const debouncedQuery = useDebounce(query, 200);
  
  return useQuery({
    queryKey: ["search", "autocomplete", debouncedQuery],
    queryFn: () => searchApi.getAutocompleteSuggestions(debouncedQuery),
    enabled: debouncedQuery.length > 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1,
  });
};

export const usePopularSearches = () => {
  return useQuery({
    queryKey: ["search", "popular"],
    queryFn: () => searchApi.getPopularSearches(),
    staleTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
  });
};

export const useRecentSearches = () => {
  return useQuery({
    queryKey: ["search", "recent"],
    queryFn: () => searchApi.getRecentSearches(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

export const useSavedSearches = () => {
  return useQuery({
    queryKey: ["search", "saved"],
    queryFn: () => searchApi.getSavedSearches(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

export const useSaveSearch = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ query, filters }: { 
      query: string; 
      filters: VideoFilters 
    }) => searchApi.saveSearch(query, filters),
    onSuccess: () => {
      toast.success("Search saved successfully");
      queryClient.invalidateQueries({ queryKey: ["search", "saved"] });
    },
    onError: (error) => {
      toast.error("Failed to save search");
      console.error("Save search error:", error);
    },
  });
};

export const useDeleteSavedSearch = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => searchApi.deleteSavedSearch(id),
    onSuccess: () => {
      toast.success("Search deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["search", "saved"] });
    },
    onError: (error) => {
      toast.error("Failed to delete search");
      console.error("Delete search error:", error);
    },
  });
};

// Hook for managing search state
export const useSearchState = () => {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<VideoFilters>({});
  const [selectedVideos, setSelectedVideos] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"relevance" | "newest" | "oldest" | "title" | "duration" | "views" | "likes">("relevance");

  const clearFilters = useCallback(() => {
    setFilters({});
    setQuery("");
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedVideos([]);
  }, []);

  const toggleVideoSelection = useCallback((videoId: string) => {
    setSelectedVideos(prev => 
      prev.includes(videoId) 
        ? prev.filter(id => id !== videoId)
        : [...prev, videoId]
    );
  }, []);

  const selectAllVideos = useCallback((videoIds: string[]) => {
    setSelectedVideos(videoIds);
  }, []);

  const hasActiveFilters = useMemo(() => {
    return query.length > 0 || Object.keys(filters).some(key => {
      const value = filters[key as keyof VideoFilters];
      return Array.isArray(value) ? value.length > 0 : value !== undefined;
    });
  }, [query, filters]);

  return {
    // State
    query,
    filters,
    selectedVideos,
    viewMode,
    sortBy,
    
    // Setters
    setQuery,
    setFilters,
    setSelectedVideos,
    setViewMode,
    setSortBy,
    
    // Actions
    clearFilters,
    clearSelection,
    toggleVideoSelection,
    selectAllVideos,
    
    // Computed
    hasActiveFilters,
  };
};
