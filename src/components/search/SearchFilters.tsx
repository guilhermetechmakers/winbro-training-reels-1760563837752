import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import type { VideoFilters } from "@/api/search";

interface SearchFiltersProps {
  filters: VideoFilters;
  onFiltersChange: (filters: VideoFilters) => void;
  availableFilters?: {
    machineModels: { value: string; count: number }[];
    processTypes: { value: string; count: number }[];
    tags: { value: string; count: number }[];
    uploadedBy: { value: string; count: number }[];
  };
  isLoading?: boolean;
}

export function SearchFilters({ 
  filters, 
  onFiltersChange, 
  availableFilters
}: SearchFiltersProps) {
  const [expandedSections, setExpandedSections] = useState({
    machineModel: true,
    processType: true,
    duration: true,
    dateRange: false,
    tags: false,
    accessLevel: false,
    uploadedBy: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const updateFilter = <K extends keyof VideoFilters>(
    key: K, 
    value: VideoFilters[K]
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };


  const clearAllFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.keys(filters).some(key => {
    const value = filters[key as keyof VideoFilters];
    return Array.isArray(value) ? value.length > 0 : value !== undefined;
  });

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <aside className="w-80 border-r bg-card p-6 space-y-6 overflow-y-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Clear all
          </Button>
        )}
      </div>

      {/* Machine Model Filter */}
      <Card>
        <Collapsible 
          open={expandedSections.machineModel}
          onOpenChange={() => toggleSection("machineModel")}
        >
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Machine Model</CardTitle>
                {expandedSections.machineModel ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <Select
                value={filters.machineModel?.[0] || ""}
                onValueChange={(value) => 
                  updateFilter("machineModel", value ? [value] : [])
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select machine model" />
                </SelectTrigger>
                <SelectContent>
                  {availableFilters?.machineModels?.map((model) => (
                    <SelectItem key={model.value} value={model.value}>
                      <div className="flex items-center justify-between w-full">
                        <span>{model.value}</span>
                        <Badge variant="secondary" className="ml-2">
                          {model.count}
                        </Badge>
                      </div>
                    </SelectItem>
                  )) || []}
                </SelectContent>
              </Select>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Process Type Filter */}
      <Card>
        <Collapsible 
          open={expandedSections.processType}
          onOpenChange={() => toggleSection("processType")}
        >
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Process Type</CardTitle>
                {expandedSections.processType ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-2">
              {availableFilters?.processTypes?.map((type) => (
                <div key={type.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`process-${type.value}`}
                    checked={filters.processType?.includes(type.value) || false}
                    onCheckedChange={(checked: boolean) => {
                      const currentTypes = filters.processType || [];
                      if (checked) {
                        updateFilter("processType", [...currentTypes, type.value]);
                      } else {
                        updateFilter("processType", currentTypes.filter(t => t !== type.value));
                      }
                    }}
                  />
                  <Label 
                    htmlFor={`process-${type.value}`}
                    className="flex-1 flex items-center justify-between cursor-pointer"
                  >
                    <span>{type.value}</span>
                    <Badge variant="secondary" className="text-xs">
                      {type.count}
                    </Badge>
                  </Label>
                </div>
              )) || []}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Duration Filter */}
      <Card>
        <Collapsible 
          open={expandedSections.duration}
          onOpenChange={() => toggleSection("duration")}
        >
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Duration</CardTitle>
                {expandedSections.duration ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-4">
              <div className="space-y-2">
                <Label className="text-sm">
                  {filters.duration 
                    ? `${formatDuration(filters.duration[0])} - ${formatDuration(filters.duration[1])}`
                    : "0:00 - 5:00"
                  }
                </Label>
                <Slider
                  value={filters.duration || [0, 300]}
                  onValueChange={(value) => updateFilter("duration", value as [number, number])}
                  max={300}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0:00</span>
                  <span>5:00</span>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Date Range Filter */}
      <Card>
        <Collapsible 
          open={expandedSections.dateRange}
          onOpenChange={() => toggleSection("dateRange")}
        >
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Date Range</CardTitle>
                {expandedSections.dateRange ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <DateRangePicker
                value={filters.dateRange ? {
                  from: filters.dateRange[0],
                  to: filters.dateRange[1]
                } : undefined}
                onChange={(range) => 
                  updateFilter("dateRange", range ? [range.from!, range.to!] : undefined)
                }
                placeholder="Select date range"
              />
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Tags Filter */}
      <Card>
        <Collapsible 
          open={expandedSections.tags}
          onOpenChange={() => toggleSection("tags")}
        >
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Tags</CardTitle>
                {expandedSections.tags ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-3">
              <div className="flex flex-wrap gap-2">
                {availableFilters?.tags?.map((tag) => (
                  <Badge
                    key={tag.value}
                    variant={filters.tags?.includes(tag.value) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/10 transition-colors"
                    onClick={() => {
                      const currentTags = filters.tags || [];
                      if (currentTags.includes(tag.value)) {
                        updateFilter("tags", currentTags.filter(t => t !== tag.value));
                      } else {
                        updateFilter("tags", [...currentTags, tag.value]);
                      }
                    }}
                  >
                    {tag.value}
                    <span className="ml-1 text-xs opacity-70">({tag.count})</span>
                  </Badge>
                )) || []}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Access Level Filter */}
      <Card>
        <Collapsible 
          open={expandedSections.accessLevel}
          onOpenChange={() => toggleSection("accessLevel")}
        >
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Access Level</CardTitle>
                {expandedSections.accessLevel ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <Select
                value={filters.accessLevel || ""}
                onValueChange={(value) => 
                  updateFilter("accessLevel", value as "public" | "organization" | "private" | undefined)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select access level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="organization">Organization</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Uploaded By Filter */}
      <Card>
        <Collapsible 
          open={expandedSections.uploadedBy}
          onOpenChange={() => toggleSection("uploadedBy")}
        >
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Uploaded By</CardTitle>
                {expandedSections.uploadedBy ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <Select
                value={filters.uploadedBy || ""}
                onValueChange={(value) => updateFilter("uploadedBy", value || undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select uploader" />
                </SelectTrigger>
                <SelectContent>
                  {availableFilters?.uploadedBy?.map((uploader) => (
                    <SelectItem key={uploader.value} value={uploader.value}>
                      <div className="flex items-center justify-between w-full">
                        <span>{uploader.value}</span>
                        <Badge variant="secondary" className="ml-2">
                          {uploader.count}
                        </Badge>
                      </div>
                    </SelectItem>
                  )) || []}
                </SelectContent>
              </Select>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </aside>
  );
}
