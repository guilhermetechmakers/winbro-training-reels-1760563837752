import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Copy, 
  Download, 
  Clock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { TranscriptSegment } from '@/api/videos';

interface TranscriptPanelProps {
  transcript: TranscriptSegment[];
  currentTime: number;
  onSeek: (time: number) => void;
  className?: string;
}

export function TranscriptPanel({ 
  transcript, 
  currentTime, 
  onSeek, 
  className 
}: TranscriptPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedSegment, setSelectedSegment] = useState<number | null>(null);

  // Find active segment based on current time
  const activeSegmentIndex = useMemo(() => {
    return transcript.findIndex(
      segment => currentTime >= segment.startTime && currentTime < segment.endTime
    );
  }, [transcript, currentTime]);

  // Filter transcript based on search query
  const filteredTranscript = useMemo(() => {
    if (!searchQuery.trim()) return transcript;
    
    return transcript.filter(segment =>
      segment.text.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [transcript, searchQuery]);

  // Highlight search terms in text
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
                return parts.map((part, partIndex) => 
      regex.test(part) ? (
        <mark key={partIndex} className="bg-yellow-200 text-yellow-900 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSegmentClick = (segment: TranscriptSegment, index: number) => {
    onSeek(segment.startTime);
    setSelectedSegment(index);
  };

  const copyTranscript = async () => {
    const fullText = transcript.map(segment => 
      `[${formatTime(segment.startTime)}] ${segment.text}`
    ).join('\n');
    
    try {
      await navigator.clipboard.writeText(fullText);
      toast.success('Transcript copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy transcript');
    }
  };

  const downloadTranscript = () => {
    const fullText = transcript.map(segment => 
      `[${formatTime(segment.startTime)}] ${segment.text}`
    ).join('\n');
    
    const blob = new Blob([fullText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'transcript.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('Transcript downloaded');
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Transcript</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        
        {/* Search and Actions */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transcript..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              >
                ×
              </Button>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={copyTranscript}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={downloadTranscript}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            {searchQuery && (
              <Badge variant="secondary" className="text-xs">
                {filteredTranscript.length} of {transcript.length} segments
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0">
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredTranscript.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No segments found matching "{searchQuery}"</p>
              </div>
            ) : (
              filteredTranscript.map((segment) => {
                const originalIndex = transcript.indexOf(segment);
                const isActive = originalIndex === activeSegmentIndex;
                const isSelected = selectedSegment === originalIndex;
                
                return (
                  <div
                    key={segment.id}
                    className={cn(
                      "p-3 rounded-lg cursor-pointer transition-all duration-200",
                      "hover:bg-muted/50 border border-transparent",
                      isActive && "bg-primary/10 border-primary/20",
                      isSelected && "bg-blue-50 border-blue-200",
                      "group"
                    )}
                    onClick={() => handleSegmentClick(segment, originalIndex)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <div className={cn(
                          "text-xs font-mono text-muted-foreground",
                          "group-hover:text-foreground transition-colors",
                          isActive && "text-primary font-semibold"
                        )}>
                          {formatTime(segment.startTime)}
                        </div>
                        {segment.confidence && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {Math.round(segment.confidence * 100)}% confidence
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="text-sm leading-relaxed">
                          {highlightText(segment.text, searchQuery)}
                        </div>
                        
                        {segment.speakerId && (
                          <Badge variant="outline" className="text-xs mt-2">
                            Speaker {segment.speakerId}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}