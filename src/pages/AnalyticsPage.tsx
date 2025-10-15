import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Play, 
  Eye, 
  Download,
  RefreshCw
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { cn } from "@/lib/utils";

type TimeRange = '7d' | '30d' | '90d' | '1y';

export function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock data - in real app this would come from API
  const mockData = {
    overview: {
      totalClips: 1247,
      totalCourses: 23,
      totalUsers: 2847,
      totalViews: 45632,
      completionRate: 87.3,
      avgSessionDuration: 12.5,
      clipsThisMonth: 45,
      coursesThisMonth: 3,
      usersThisMonth: 156,
      viewsThisMonth: 3245
    },
    viewsOverTime: [
      { date: '2024-01-01', views: 1200, users: 45 },
      { date: '2024-01-02', views: 1350, users: 52 },
      { date: '2024-01-03', views: 1100, users: 38 },
      { date: '2024-01-04', views: 1600, users: 61 },
      { date: '2024-01-05', views: 1800, users: 68 },
      { date: '2024-01-06', views: 1400, users: 55 },
      { date: '2024-01-07', views: 2000, users: 78 },
      { date: '2024-01-08', views: 2200, users: 85 },
      { date: '2024-01-09', views: 1900, users: 72 },
      { date: '2024-01-10', views: 2100, users: 81 },
      { date: '2024-01-11', views: 2400, users: 92 },
      { date: '2024-01-12', views: 2600, users: 98 },
      { date: '2024-01-13', views: 2300, users: 88 },
      { date: '2024-01-14', views: 2500, users: 95 },
      { date: '2024-01-15', views: 2800, users: 105 },
      { date: '2024-01-16', views: 3000, users: 112 },
      { date: '2024-01-17', views: 2700, users: 98 },
      { date: '2024-01-18', views: 2900, users: 108 },
      { date: '2024-01-19', views: 3200, users: 118 },
      { date: '2024-01-20', views: 3500, users: 125 },
      { date: '2024-01-21', views: 3300, users: 115 },
      { date: '2024-01-22', views: 3600, users: 128 },
      { date: '2024-01-23', views: 3800, users: 135 },
      { date: '2024-01-24', views: 4000, users: 142 },
      { date: '2024-01-25', views: 4200, users: 148 },
      { date: '2024-01-26', views: 3900, users: 138 },
      { date: '2024-01-27', views: 4100, users: 145 },
      { date: '2024-01-28', views: 4300, users: 152 },
      { date: '2024-01-29', views: 4500, users: 158 },
      { date: '2024-01-30', views: 4700, users: 165 }
    ],
    topClips: [
      { id: '1', title: 'Machine Setup - Part 1', views: 2340, completion: 89, duration: 32 },
      { id: '2', title: 'Safety Protocol Overview', views: 1890, completion: 92, duration: 28 },
      { id: '3', title: 'Maintenance Checklist', views: 1650, completion: 85, duration: 45 },
      { id: '4', title: 'Tool Change Procedure', views: 1420, completion: 78, duration: 38 },
      { id: '5', title: 'Quality Control Inspection', views: 1280, completion: 91, duration: 42 }
    ],
    engagementByCategory: [
      { category: 'Machining', clips: 45, views: 12340, completion: 87 },
      { category: 'Safety', clips: 23, views: 8900, completion: 92 },
      { category: 'Maintenance', clips: 34, views: 11200, completion: 85 },
      { category: 'Quality Control', clips: 18, views: 6700, completion: 89 },
      { category: 'Troubleshooting', clips: 12, views: 4500, completion: 83 }
    ],
    userActivity: [
      { hour: '00:00', active: 5 },
      { hour: '01:00', active: 3 },
      { hour: '02:00', active: 2 },
      { hour: '03:00', active: 1 },
      { hour: '04:00', active: 2 },
      { hour: '05:00', active: 4 },
      { hour: '06:00', active: 8 },
      { hour: '07:00', active: 15 },
      { hour: '08:00', active: 45 },
      { hour: '09:00', active: 78 },
      { hour: '10:00', active: 92 },
      { hour: '11:00', active: 85 },
      { hour: '12:00', active: 65 },
      { hour: '13:00', active: 72 },
      { hour: '14:00', active: 88 },
      { hour: '15:00', active: 95 },
      { hour: '16:00', active: 82 },
      { hour: '17:00', active: 68 },
      { hour: '18:00', active: 45 },
      { hour: '19:00', active: 32 },
      { hour: '20:00', active: 28 },
      { hour: '21:00', active: 18 },
      { hour: '22:00', active: 12 },
      { hour: '23:00', active: 8 }
    ],
    deviceBreakdown: [
      { name: 'Desktop', value: 65, color: '#4F46E5' },
      { name: 'Mobile', value: 25, color: '#059669' },
      { name: 'Tablet', value: 10, color: '#DC2626' }
    ]
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatPercentage = (num: number) => {
    return num.toFixed(1) + '%';
  };


  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Analytics</h1>
            <p className="text-muted-foreground mt-1">
              Track performance and engagement across your training content
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={(value) => setTimeRange(value as TimeRange)}>
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
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clips</CardTitle>
              <Play className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(mockData.overview.totalClips)}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                <span className="text-green-600">+{mockData.overview.clipsThisMonth}</span>
                <span className="ml-1">this month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(mockData.overview.totalViews)}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                <span className="text-green-600">+{formatNumber(mockData.overview.viewsThisMonth)}</span>
                <span className="ml-1">this month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(mockData.overview.totalUsers)}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                <span className="text-green-600">+{mockData.overview.usersThisMonth}</span>
                <span className="ml-1">this month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPercentage(mockData.overview.completionRate)}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                <span className="text-green-600">+5.2%</span>
                <span className="ml-1">vs last month</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Views Over Time */}
          <Card>
            <CardHeader>
              <CardTitle>Views Over Time</CardTitle>
              <CardDescription>
                Daily view count for the selected period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockData.viewsOverTime}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                      formatter={(value: any) => [formatNumber(value), 'Views']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="views" 
                      stroke="#4F46E5" 
                      fill="#4F46E5" 
                      fillOpacity={0.1}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* User Activity by Hour */}
          <Card>
            <CardHeader>
              <CardTitle>User Activity by Hour</CardTitle>
              <CardDescription>
                Average active users throughout the day
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockData.userActivity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip formatter={(value: any) => [value, 'Active Users']} />
                    <Bar dataKey="active" fill="#059669" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Performing Clips */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Clips</CardTitle>
              <CardDescription>
                Most viewed clips this period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockData.topClips.map((clip, index) => (
                  <div key={clip.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-semibold text-primary">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{clip.title}</p>
                        <p className="text-xs text-muted-foreground">{clip.duration}s</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{formatNumber(clip.views)}</p>
                      <p className="text-xs text-muted-foreground">{formatPercentage(clip.completion)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Engagement by Category */}
          <Card>
            <CardHeader>
              <CardTitle>Engagement by Category</CardTitle>
              <CardDescription>
                Performance across different content categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockData.engagementByCategory.map((category) => (
                  <div key={category.category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{category.category}</span>
                      <span className="text-sm text-muted-foreground">{category.clips} clips</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(category.views / 15000) * 100}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{formatNumber(category.views)} views</span>
                      <span>{formatPercentage(category.completion)} completion</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Device Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Device Breakdown</CardTitle>
              <CardDescription>
                User access by device type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mockData.deviceBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {mockData.deviceBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => [value + '%', '']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Average Session Duration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{mockData.overview.avgSessionDuration}m</div>
              <p className="text-sm text-muted-foreground mt-1">
                Time spent per user session
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Total Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{mockData.overview.totalCourses}</div>
              <p className="text-sm text-muted-foreground mt-1">
                Active training courses
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Export Data</CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
              <p className="text-sm text-muted-foreground mt-2 text-center">
                Export analytics data as CSV
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
