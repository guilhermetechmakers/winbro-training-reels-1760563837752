import { useState, useRef, useEffect } from "react";
import { Search, Mic, MicOff, X, Clock, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useAutocompleteSuggestions, usePopularSearches, useRecentSearches } from "@/hooks/use-search";

interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
  showSuggestions?: boolean;
  showVoiceSearch?: boolean;
}

export function SearchBar({
  query,
  onQueryChange,
  onSearch,
  placeholder = "Search videos, descriptions, or tags...",
  className,
  showSuggestions = true,
  showVoiceSearch = true,
}: SearchBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  const { data: suggestions = [] } = useAutocompleteSuggestions(query);
  const { data: popularSearches = [] } = usePopularSearches();
  const { data: recentSearches = [] } = useRecentSearches();

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      recognitionRef.current = new (window as any).webkitSpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onQueryChange(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [onQueryChange]);


  const handleVoiceSearch = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSearch = (searchQuery: string) => {
    onQueryChange(searchQuery);
    setIsOpen(false);
    onSearch?.(searchQuery);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch(query);
    }
  };

  const clearQuery = () => {
    onQueryChange("");
    inputRef.current?.focus();
  };

  const hasQuery = query.length > 0;

  return (
    <div className={cn("relative w-full", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(showSuggestions)}
          placeholder={placeholder}
          className="pl-10 pr-20"
          aria-label="Search videos"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {hasQuery && (
            <Button
              variant="ghost"
              size="icon"
              onClick={clearQuery}
              className="h-6 w-6 hover:bg-muted"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
          {showVoiceSearch && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleVoiceSearch}
              className={cn(
                "h-6 w-6 hover:bg-muted",
                isListening && "bg-red-100 text-red-600"
              )}
            >
              {isListening ? (
                <MicOff className="h-3 w-3" />
              ) : (
                <Mic className="h-3 w-3" />
              )}
            </Button>
          )}
        </div>
      </div>

      {showSuggestions && isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 shadow-lg">
          <CardContent className="p-0">
            <Command>
              <CommandList className="max-h-80">
                {query.length === 0 ? (
                  <>
                    {recentSearches.length > 0 && (
                      <CommandGroup heading="Recent Searches">
                        {recentSearches.slice(0, 5).map((search, index) => (
                          <CommandItem
                            key={index}
                            onSelect={() => handleSearch(search)}
                            className="flex items-center gap-2"
                          >
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            {search}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
                    {popularSearches.length > 0 && (
                      <CommandGroup heading="Popular Searches">
                        {popularSearches.slice(0, 5).map((search, index) => (
                          <CommandItem
                            key={index}
                            onSelect={() => handleSearch(search)}
                            className="flex items-center gap-2"
                          >
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            {search}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
                  </>
                ) : (
                  <>
                    {suggestions.length > 0 && (
                      <CommandGroup heading="Suggestions">
                        {suggestions.map((suggestion, index) => (
                          <CommandItem
                            key={index}
                            onSelect={() => handleSearch(suggestion)}
                            className="flex items-center gap-2"
                          >
                            <Search className="h-4 w-4 text-muted-foreground" />
                            {suggestion}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
                    <CommandItem
                      onSelect={() => handleSearch(query)}
                      className="flex items-center gap-2 font-medium"
                    >
                      <Search className="h-4 w-4" />
                      Search for "{query}"
                    </CommandItem>
                  </>
                )}
                {query.length > 0 && suggestions.length === 0 && (
                  <CommandEmpty>No suggestions found</CommandEmpty>
                )}
              </CommandList>
            </Command>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
