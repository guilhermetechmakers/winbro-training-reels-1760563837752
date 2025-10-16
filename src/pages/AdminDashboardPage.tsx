import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Bell, 
  Settings, 
  RefreshCw,
  Users,
  BarChart3,
  Server,
  Flag,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { ModerationQueue } from '@/components/admin/ModerationQueue';
import { UserManagementPanel } from '@/components/admin/UserManagementPanel';
import { SystemHealthMonitor } from '@/components/admin/SystemHealthMonitor';
import { AnalyticsOverview } from '@/components/admin/AnalyticsOverview';
import { useAdminStats, useGlobalSearch } from '@/hooks/use-admin';
import { cn } from '@/lib/utils';

export function AdminDashboardPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useAdminStats();
  const { data: searchResults } = useGlobalSearch(
    searchQuery,
    { type: 'all' }
  );


  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'moderation', label: 'Moderation', icon: Flag },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'system', label: 'System', icon: Server },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Platform administration and content moderation
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetchStats()}
              disabled={statsLoading}
            >
              <RefreshCw className={cn("h-4 w-4 mr-2", statsLoading && "animate-spin")} />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Global Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search across content, users, and organizations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            {searchQuery && searchResults && (
              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <div className="text-sm text-muted-foreground mb-2">
                  Found {searchResults.total} results
                </div>
                <div className="space-y-2">
                  {searchResults.content.slice(0, 3).map((item: any) => (
                    <div key={item.id} className="flex items-center gap-2 text-sm">
                      <BarChart3 className="h-4 w-4 text-blue-500" />
                      <span>{item.title}</span>
                      <Badge variant="secondary" className="text-xs">Content</Badge>
                    </div>
                  ))}
                  {searchResults.users.slice(0, 3).map((user: any) => (
                    <div key={user.id} className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-green-500" />
                      <span>{user.full_name || user.email}</span>
                      <Badge variant="secondary" className="text-xs">User</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pending Content</p>
                    <p className="text-2xl font-bold">{stats.pendingContent}</p>
                  </div>
                  <Flag className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                    <p className="text-2xl font-bold">{formatNumber(stats.activeUsers)}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">System Health</p>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(stats.systemHealth)}
                      <span className="text-sm font-medium capitalize">
                        {stats.systemHealth}
                      </span>
                    </div>
                  </div>
                  <Server className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Processing Queue</p>
                    <p className="text-2xl font-bold">{stats.processingQueue}</p>
                  </div>
                  <Activity className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-muted/50 p-1 rounded-lg w-fit">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2"
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </Button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AnalyticsOverview />
              <SystemHealthMonitor />
            </div>
          )}

          {activeTab === 'moderation' && (
            <div className="space-y-6">
              <ModerationQueue />
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              <UserManagementPanel />
            </div>
          )}

          {activeTab === 'system' && (
            <div className="space-y-6">
              <SystemHealthMonitor />
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    System Configuration
                  </CardTitle>
                  <CardDescription>
                    Manage system settings and configurations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>System configuration panel coming soon</p>
                    <p className="text-sm">Configure system settings, integrations, and more</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}