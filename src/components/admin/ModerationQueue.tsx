import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  CheckCircle, 
  XCircle, 
  Flag, 
  Search, 
  Play, 
  Clock, 
  User,
  AlertTriangle
} from 'lucide-react';
import { useModerationQueue, useContentModeration } from '@/hooks/use-admin';
import { cn } from '@/lib/utils';

interface ModerationQueueProps {
  className?: string;
}

export function ModerationQueue({ className }: ModerationQueueProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: moderationItems = [], isLoading } = useModerationQueue({
    status: statusFilter === 'all' ? undefined : statusFilter,
    priority: priorityFilter === 'all' ? undefined : priorityFilter,
  });

  const {
    approveContent,
    rejectContent,
    flagContent,
    bulkApproveContent,
    bulkRejectContent,
  } = useContentModeration();

  // Filter items based on search query
  const filteredItems = moderationItems.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectItem = (itemId: string) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map(item => item.id));
    }
  };

  const handleApprove = (itemId: string) => {
    approveContent.mutate({ contentId: itemId });
  };

  const handleReject = (itemId: string) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason) {
      rejectContent.mutate({ contentId: itemId, reason });
    }
  };

  const handleFlag = (itemId: string) => {
    const reason = prompt('Please provide a reason for flagging:');
    if (reason) {
      flagContent.mutate({ contentId: itemId, reason });
    }
  };

  const handleBulkApprove = () => {
    if (selectedItems.length > 0) {
      bulkApproveContent.mutate(selectedItems);
      setSelectedItems([]);
    }
  };

  const handleBulkReject = () => {
    if (selectedItems.length > 0) {
      const reason = prompt('Please provide a reason for rejection:');
      if (reason) {
        bulkRejectContent.mutate({ contentIds: selectedItems, reason });
        setSelectedItems([]);
      }
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'default';
      case 'flagged': return 'destructive';
      case 'approved': return 'secondary';
      case 'rejected': return 'destructive';
      default: return 'secondary';
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flag className="h-5 w-5" />
            Moderation Queue
          </CardTitle>
          <CardDescription>
            Review and moderate content submissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                <div className="h-4 w-4 bg-muted animate-pulse rounded" />
                <div className="h-12 w-20 bg-muted animate-pulse rounded" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
                  <div className="h-3 w-1/2 bg-muted animate-pulse rounded" />
                </div>
                <div className="h-8 w-20 bg-muted animate-pulse rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Flag className="h-5 w-5" />
              Moderation Queue
            </CardTitle>
            <CardDescription>
              {filteredItems.length} items requiring review
            </CardDescription>
          </div>
          {selectedItems.length > 0 && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkApprove}
                disabled={approveContent.isPending}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve ({selectedItems.length})
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkReject}
                disabled={rejectContent.isPending}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject ({selectedItems.length})
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="flagged">Flagged</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Content List */}
        <ScrollArea className="h-[600px]">
          <div className="space-y-4">
            {filteredItems.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Flag className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No content items found</p>
                <p className="text-sm">Try adjusting your filters</p>
              </div>
            ) : (
              <>
                {/* Select All */}
                <div className="flex items-center space-x-2 p-2 border-b">
                  <Checkbox
                    checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
                    onChange={handleSelectAll}
                  />
                  <span className="text-sm text-muted-foreground">
                    Select all ({filteredItems.length} items)
                  </span>
                </div>

                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      "flex items-start space-x-4 p-4 border rounded-lg transition-all duration-200 hover:shadow-md",
                      selectedItems.includes(item.id) && "bg-muted/50 border-primary"
                    )}
                  >
                    <Checkbox
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                    />
                    
                    {/* Thumbnail */}
                    <div className="relative w-20 h-12 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                      {item.thumbnailUrl ? (
                        <img
                          src={item.thumbnailUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Play className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
                        {formatDuration(item.duration)}
                      </div>
                    </div>

                    {/* Content Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{item.title}</h4>
                          {item.description && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {item.description}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <User className="h-3 w-3" />
                              {item.uploadedBy}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {formatDate(item.uploadedAt)}
                            </div>
                          </div>
                          {item.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {item.tags.slice(0, 3).map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {item.tags.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{item.tags.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                        
                        {/* Status and Priority */}
                        <div className="flex flex-col items-end gap-2 ml-4">
                          <Badge variant={getStatusColor(item.status)}>
                            {item.status}
                          </Badge>
                          <Badge variant={getPriorityColor(item.priority)}>
                            {item.priority}
                          </Badge>
                        </div>
                      </div>

                      {/* Reason */}
                      {item.reason && (
                        <div className="mt-2 p-2 bg-muted/50 rounded text-xs">
                          <div className="flex items-center gap-1 text-muted-foreground mb-1">
                            <AlertTriangle className="h-3 w-3" />
                            Reason:
                          </div>
                          {item.reason}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-2 mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleApprove(item.id)}
                          disabled={approveContent.isPending}
                          className="h-8"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReject(item.id)}
                          disabled={rejectContent.isPending}
                          className="h-8"
                        >
                          <XCircle className="h-3 w-3 mr-1" />
                          Reject
                        </Button>
                        {item.status !== 'flagged' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleFlag(item.id)}
                            disabled={flagContent.isPending}
                            className="h-8"
                          >
                            <Flag className="h-3 w-3 mr-1" />
                            Flag
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}