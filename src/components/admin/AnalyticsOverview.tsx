import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Eye, 
  CheckCircle, 
  DollarSign,
  Download,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { usePlatformAnalytics, useReportGeneration } from '@/hooks/use-admin';

interface AnalyticsOverviewProps {
  className?: string;
}

export function AnalyticsOverview({ className }: AnalyticsOverviewProps) {
  const [dateRange, setDateRange] = useState('30d');
  const { data: analytics, isLoading } = usePlatformAnalytics({
    dateFrom: getDateFromRange(dateRange),
    dateTo: new Date().toISOString(),
  });
  const { generateReport } = useReportGeneration();

  function getDateFromRange(range: string): string {
    const now = new Date();
    switch (range) {
      case '7d':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      case '30d':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
      case '90d':
        return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString();
      case '1y':
        return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000).toISOString();
      default:
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };


  const handleExportReport = () => {
    generateReport.mutate({
      type: 'analytics',
      filters: {
        dateFrom: getDateFromRange(dateRange),
        dateTo: new Date().toISOString(),
      },
    });
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Platform Analytics
          </CardTitle>
          <CardDescription>
            Key metrics and performance indicators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                <div className="h-8 w-16 bg-muted animate-pulse rounded" />
                <div className="h-3 w-12 bg-muted animate-pulse rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analytics) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Platform Analytics
          </CardTitle>
          <CardDescription>
            Key metrics and performance indicators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Failed to load analytics data</p>
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
              <BarChart3 className="h-5 w-5" />
              Platform Analytics
            </CardTitle>
            <CardDescription>
              Key metrics and performance indicators
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportReport}
              disabled={generateReport.isPending}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Content Metrics */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Content Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Clips</p>
                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                      {formatNumber(analytics.contentMetrics.totalClips)}
                    </p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-blue-500" />
                </div>
              </div>

              <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">Total Courses</p>
                    <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                      {formatNumber(analytics.contentMetrics.totalCourses)}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </div>

              <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Total Views</p>
                    <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                      {formatNumber(analytics.contentMetrics.totalViews)}
                    </p>
                  </div>
                  <Eye className="h-8 w-8 text-purple-500" />
                </div>
              </div>

              <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Completion Rate</p>
                    <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                      {analytics.contentMetrics.averageCompletionRate.toFixed(1)}%
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-orange-500" />
                </div>
              </div>
            </div>
          </div>

          {/* User Engagement */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">User Engagement</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Daily Active Users</p>
                    <p className="text-2xl font-bold">
                      {formatNumber(analytics.userEngagement.dailyActiveUsers)}
                    </p>
                  </div>
                  <Users className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Weekly Active Users</p>
                    <p className="text-2xl font-bold">
                      {formatNumber(analytics.userEngagement.weeklyActiveUsers)}
                    </p>
                  </div>
                  <Users className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg Session Duration</p>
                    <p className="text-2xl font-bold">
                      {Math.round(analytics.userEngagement.averageSessionDuration)}m
                    </p>
                  </div>
                  <Calendar className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Login Frequency</p>
                    <p className="text-2xl font-bold">
                      {analytics.userEngagement.loginFrequency.toFixed(1)}/week
                    </p>
                  </div>
                  <TrendingUp className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Metrics */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Subscription Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/20 dark:to-emerald-900/20 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Total Revenue</p>
                    <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                      {formatCurrency(analytics.subscriptionMetrics.totalRevenue)}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-emerald-500" />
                </div>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Subscriptions</p>
                    <p className="text-2xl font-bold">
                      {formatNumber(analytics.subscriptionMetrics.activeSubscriptions)}
                    </p>
                  </div>
                  <Users className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Churn Rate</p>
                    <p className="text-2xl font-bold">
                      {analytics.subscriptionMetrics.churnRate.toFixed(1)}%
                    </p>
                  </div>
                  <TrendingUp className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">ARPU</p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(analytics.subscriptionMetrics.averageRevenuePerUser)}
                    </p>
                  </div>
                  <DollarSign className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>
            </div>
          </div>

          {/* Support Metrics */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Support Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Tickets</p>
                    <p className="text-2xl font-bold">
                      {formatNumber(analytics.supportMetrics.totalTickets)}
                    </p>
                  </div>
                  <BarChart3 className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Open Tickets</p>
                    <p className="text-2xl font-bold">
                      {formatNumber(analytics.supportMetrics.openTickets)}
                    </p>
                  </div>
                  <AlertTriangle className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg Resolution Time</p>
                    <p className="text-2xl font-bold">
                      {Math.round(analytics.supportMetrics.averageResolutionTime)}h
                    </p>
                  </div>
                  <Calendar className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Satisfaction Score</p>
                    <p className="text-2xl font-bold">
                      {analytics.supportMetrics.satisfactionScore.toFixed(1)}/5
                    </p>
                  </div>
                  <CheckCircle className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}