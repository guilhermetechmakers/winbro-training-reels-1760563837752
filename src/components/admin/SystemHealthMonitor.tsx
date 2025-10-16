import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Server, 
  Database, 
  HardDrive, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  RefreshCw,
  Activity,
  Zap,
  Trash2
} from 'lucide-react';
import { useSystemHealth, useSystemManagement } from '@/hooks/use-admin';
import { cn } from '@/lib/utils';

interface SystemHealthMonitorProps {
  className?: string;
}

export function SystemHealthMonitor({ className }: SystemHealthMonitorProps) {
  const { data: systemHealth, isLoading, refetch } = useSystemHealth();
  const { retryFailedProcessing, clearProcessingQueue } = useSystemManagement();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'secondary';
      case 'warning': return 'default';
      case 'error': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'healthy': return 'Healthy';
      case 'warning': return 'Warning';
      case 'error': return 'Error';
      default: return 'Unknown';
    }
  };

  const formatBytes = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatResponseTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            System Health
          </CardTitle>
          <CardDescription>
            Monitor system performance and status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                  <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                </div>
                <div className="h-2 w-full bg-muted animate-pulse rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!systemHealth) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            System Health
          </CardTitle>
          <CardDescription>
            Monitor system performance and status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <XCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Failed to load system health data</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="mt-4"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
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
              <Server className="h-5 w-5" />
              System Health
            </CardTitle>
            <CardDescription>
              Overall status: {getStatusText(systemHealth.status)}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isLoading}
            >
              <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Overall Status */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              {getStatusIcon(systemHealth.status)}
              <div>
                <p className="font-medium">System Status</p>
                <p className="text-sm text-muted-foreground">
                  Last updated: {new Date().toLocaleTimeString()}
                </p>
              </div>
            </div>
            <Badge variant={getStatusColor(systemHealth.status)}>
              {getStatusText(systemHealth.status)}
            </Badge>
          </div>

          {/* Video Processing */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-blue-500" />
                <span className="font-medium">Video Processing</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => retryFailedProcessing.mutate('failed')}
                  disabled={retryFailedProcessing.isPending}
                  className="h-7 text-xs"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Retry Failed
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => clearProcessingQueue.mutate()}
                  disabled={clearProcessingQueue.isPending}
                  className="h-7 text-xs"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Clear Queue
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {systemHealth.videoProcessing.queue}
                </div>
                <div className="text-xs text-muted-foreground">In Queue</div>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {systemHealth.videoProcessing.active}
                </div>
                <div className="text-xs text-muted-foreground">Active</div>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {systemHealth.videoProcessing.failed}
                </div>
                <div className="text-xs text-muted-foreground">Failed</div>
              </div>
            </div>
          </div>

          {/* CDN Status */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-purple-500" />
              <span className="font-medium">CDN Status</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div>
                <p className="text-sm font-medium">
                  {systemHealth.cdn.status === 'healthy' ? 'Operational' : 
                   systemHealth.cdn.status === 'degraded' ? 'Degraded' : 'Down'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Response time: {formatResponseTime(systemHealth.cdn.responseTime)}
                </p>
              </div>
              <Badge variant={
                systemHealth.cdn.status === 'healthy' ? 'secondary' :
                systemHealth.cdn.status === 'degraded' ? 'default' : 'destructive'
              }>
                {systemHealth.cdn.status}
              </Badge>
            </div>
          </div>

          {/* Database Status */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-green-500" />
              <span className="font-medium">Database</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div>
                <p className="text-sm font-medium">
                  {systemHealth.database.status === 'healthy' ? 'Connected' :
                   systemHealth.database.status === 'slow' ? 'Slow Response' : 'Disconnected'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Response time: {formatResponseTime(systemHealth.database.responseTime)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Connections: {systemHealth.database.connections}
                </p>
              </div>
              <Badge variant={
                systemHealth.database.status === 'healthy' ? 'secondary' :
                systemHealth.database.status === 'slow' ? 'default' : 'destructive'
              }>
                {systemHealth.database.status}
              </Badge>
            </div>
          </div>

          {/* Storage Usage */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-orange-500" />
              <span className="font-medium">Storage Usage</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>{formatBytes(systemHealth.storage.used)} used</span>
                <span>{formatBytes(systemHealth.storage.total)} total</span>
              </div>
              <Progress 
                value={systemHealth.storage.percentage} 
                className="h-2"
              />
              <div className="text-xs text-muted-foreground text-center">
                {systemHealth.storage.percentage.toFixed(1)}% used
              </div>
            </div>
          </div>

          {/* Recent Errors */}
          {systemHealth.errors.count > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span className="font-medium">Recent Errors</span>
                <Badge variant="destructive">{systemHealth.errors.count}</Badge>
              </div>
              <ScrollArea className="h-32">
                <div className="space-y-2">
                  {systemHealth.errors.recent.map((error) => (
                    <div
                      key={error.id}
                      className="p-2 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded text-xs"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-red-800 dark:text-red-200">
                          {error.severity.toUpperCase()}
                        </span>
                        <span className="text-red-600 dark:text-red-400">
                          {new Date(error.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-red-700 dark:text-red-300">
                        {error.message}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}