import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Upload, 
  Play, 
  BookOpen, 
  Users,
  TrendingUp,
  Plus
} from "lucide-react";

export function DashboardPage() {
  const stats = [
    {
      title: "Total Clips",
      value: "1,234",
      change: "+12%",
      icon: Play,
      color: "text-blue-600"
    },
    {
      title: "Active Courses",
      value: "45",
      change: "+8%",
      icon: BookOpen,
      color: "text-green-600"
    },
    {
      title: "Total Users",
      value: "2,847",
      change: "+15%",
      icon: Users,
      color: "text-purple-600"
    },
    {
      title: "Completion Rate",
      value: "87%",
      change: "+5%",
      icon: TrendingUp,
      color: "text-orange-600"
    }
  ];

  const recentClips = [
    {
      id: "1",
      title: "Machine Setup - Part 1",
      duration: "0:32",
      views: 156,
      uploaded: "2 hours ago",
      status: "published"
    },
    {
      id: "2",
      title: "Safety Protocol Overview",
      duration: "0:28",
      views: 89,
      uploaded: "4 hours ago",
      status: "published"
    },
    {
      id: "3",
      title: "Maintenance Checklist",
      duration: "0:45",
      views: 234,
      uploaded: "1 day ago",
      status: "published"
    }
  ];

  const recentCourses = [
    {
      id: "1",
      title: "New Employee Onboarding",
      progress: 75,
      enrolled: 24,
      duration: "2h 30m"
    },
    {
      id: "2",
      title: "Safety Training Program",
      progress: 60,
      enrolled: 18,
      duration: "1h 45m"
    },
    {
      id: "3",
      title: "Equipment Operation",
      progress: 90,
      enrolled: 31,
      duration: "3h 15m"
    }
  ];

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's what's happening with your training content.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search clips, courses..."
                className="pl-10 w-80"
              />
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Upload Clip
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">{stat.change}</span> from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Clips */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Clips</CardTitle>
              <CardDescription>
                Your latest uploaded video clips
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentClips.map((clip) => (
                  <div key={clip.id} className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                      <Play className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{clip.title}</p>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <span>{clip.duration}</span>
                        <span>•</span>
                        <span>{clip.views} views</span>
                        <span>•</span>
                        <span>{clip.uploaded}</span>
                      </div>
                    </div>
                    <Badge variant={clip.status === "published" ? "default" : "secondary"}>
                      {clip.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Courses */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Courses</CardTitle>
              <CardDescription>
                Courses with recent activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentCourses.map((course) => (
                  <div key={course.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{course.title}</p>
                      <span className="text-xs text-muted-foreground">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{course.enrolled} enrolled</span>
                      <span>{course.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks to get you started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <Upload className="h-6 w-6" />
                <span>Upload New Clip</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <BookOpen className="h-6 w-6" />
                <span>Create Course</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <Users className="h-6 w-6" />
                <span>Invite Users</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
