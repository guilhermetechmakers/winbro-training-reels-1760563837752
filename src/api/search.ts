import { api } from "@/lib/api";
import type { VideoClip } from "@/types";

export interface VideoFilters {
  machineModel?: string[];
  processType?: string[];
  tags?: string[];
  duration?: [number, number];
  dateRange?: [Date, Date];
  customer?: string;
  accessLevel?: "public" | "organization" | "private";
  uploadedBy?: string;
  status?: string[];
}

export interface SearchResponse {
  videos: VideoClip[];
  totalCount: number;
  facets: {
    machineModels: { value: string; count: number }[];
    processTypes: { value: string; count: number }[];
    tags: { value: string; count: number }[];
    uploadedBy: { value: string; count: number }[];
  };
  searchTime: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface SearchFiltersResponse {
  machineModels: { value: string; count: number }[];
  processTypes: { value: string; count: number }[];
  tags: { value: string; count: number }[];
  uploadedBy: { value: string; count: number }[];
}

export interface AutocompleteResponse {
  suggestions: string[];
}

export const searchApi = {
  searchVideos: async (
    query: string, 
    filters: VideoFilters, 
    page = 1, 
    limit = 24
  ): Promise<SearchResponse> => {
    const params = new URLSearchParams();
    
    if (query.trim()) {
      params.append("q", query.trim());
    }
    
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    
    // Add filters to params
    if (filters.machineModel?.length) {
      filters.machineModel.forEach(model => params.append("machineModel", model));
    }
    
    if (filters.processType?.length) {
      filters.processType.forEach(type => params.append("processType", type));
    }
    
    if (filters.tags?.length) {
      filters.tags.forEach(tag => params.append("tags", tag));
    }
    
    if (filters.duration) {
      params.append("durationMin", filters.duration[0].toString());
      params.append("durationMax", filters.duration[1].toString());
    }
    
    if (filters.dateRange) {
      params.append("dateFrom", filters.dateRange[0].toISOString());
      params.append("dateTo", filters.dateRange[1].toISOString());
    }
    
    if (filters.customer) {
      params.append("customer", filters.customer);
    }
    
    if (filters.accessLevel) {
      params.append("accessLevel", filters.accessLevel);
    }
    
    if (filters.uploadedBy) {
      params.append("uploadedBy", filters.uploadedBy);
    }
    
    if (filters.status?.length) {
      filters.status.forEach(status => params.append("status", status));
    }
    
    const response = await api.get<SearchResponse>(`/search/videos?${params.toString()}`);
    return response;
  },
  
  getSearchFilters: async (): Promise<SearchFiltersResponse> => {
    const response = await api.get<SearchFiltersResponse>("/search/filters");
    return response;
  },
  
  getAutocompleteSuggestions: async (query: string): Promise<string[]> => {
    if (!query.trim()) return [];
    
    const response = await api.get<AutocompleteResponse>(`/search/autocomplete?q=${encodeURIComponent(query)}`);
    return response.suggestions;
  },
  
  getPopularSearches: async (): Promise<string[]> => {
    const response = await api.get<{ searches: string[] }>("/search/popular");
    return response.searches;
  },
  
  getRecentSearches: async (): Promise<string[]> => {
    const response = await api.get<{ searches: string[] }>("/search/recent");
    return response.searches;
  },
  
  saveSearch: async (query: string, filters: VideoFilters): Promise<void> => {
    await api.post("/search/save", { query, filters });
  },
  
  getSavedSearches: async (): Promise<Array<{ id: string; name: string; query: string; filters: VideoFilters; createdAt: string }>> => {
    const response = await api.get<{ searches: Array<{ id: string; name: string; query: string; filters: VideoFilters; createdAt: string }> }>("/search/saved");
    return response.searches;
  },
  
  deleteSavedSearch: async (id: string): Promise<void> => {
    await api.delete(`/search/saved/${id}`);
  }
};
