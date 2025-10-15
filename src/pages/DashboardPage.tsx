import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton, SkeletonCard } from "@/components/ui/skeleton";
import { 
  Search, 
  Upload, 
  Play, 
  BookOpen, 
  Users,
  TrendingUp,
  Plus,
  Eye
} from "lucide-react";

export function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

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
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground text-sm lg:text-base">
              Welcome back! Here's what's happening with your training content.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search clips, courses..."
                className="pl-10 w-full sm:w-80"
                aria-label="Search clips and courses"
              />
            </div>
            <Button className="w-full sm:w-auto" aria-label="Upload new video clip">
              <Plus className="mr-2 h-4 w-4" />
              Upload Clip
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <SkeletonCard key={index} className="h-32" />
            ))
          ) : (
            stats.map((stat, index) => (
              <Card 
                key={index} 
                className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-200">
                    {stat.title}
                  </CardTitle>
                  <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 group-hover:scale-110 transition-transform duration-200">
                    <stat.icon className={`h-5 w-5 ${stat.color} group-hover:scale-110 transition-transform duration-200`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="text-green-600 font-semibold flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {stat.change}
                    </span>
                    <span className="text-muted-foreground ml-2">from last month</span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Clips */}
          <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                Recent Clips
              </CardTitle>
              <CardDescription className="text-base">
                Your latest uploaded video clips
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3">
                      <Skeleton className="w-14 h-14 rounded-xl" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {recentClips.map((clip, index) => (
                    <div 
                      key={clip.id} 
                      className="group flex items-center space-x-4 p-3 rounded-xl hover:bg-muted/50 transition-all duration-200 hover:translate-x-1 animate-fade-in-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                        <Play className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate group-hover:text-primary transition-colors duration-200">
                          {clip.title}
                        </p>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
                          <span className="flex items-center">
                            <Play className="h-3 w-3 mr-1" />
                            {clip.duration}
                          </span>
                          <span>•</span>
                          <span className="flex items-center">
                            <Eye className="h-3 w-3 mr-1" />
                            {clip.views} views
                          </span>
                          <span>•</span>
                          <span>{clip.uploaded}</span>
                        </div>
                      </div>
                      <Badge 
                        variant={clip.status === "published" ? "default" : "secondary"}
                        className="group-hover:scale-105 transition-transform duration-200"
                      >
                        {clip.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Courses */}
          <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                Recent Courses
              </CardTitle>
              <CardDescription className="text-base">
                Courses with recent activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-6">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="space-y-3 p-4">
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-4 w-12" />
                      </div>
                      <Skeleton className="h-3 w-full rounded-full" />
                      <div className="flex justify-between">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {recentCourses.map((course, index) => (
                    <div 
                      key={course.id} 
                      className="group space-y-3 p-4 rounded-xl hover:bg-muted/50 transition-all duration-200 animate-fade-in-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold group-hover:text-primary transition-colors duration-200">
                          {course.title}
                        </p>
                        <span className="text-sm font-bold text-primary">{course.progress}%</span>
                      </div>
                      <div className="w-full bg-muted/50 rounded-full h-3 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-primary to-primary/80 h-3 rounded-full transition-all duration-500 group-hover:shadow-lg"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          {course.enrolled} enrolled
                        </span>
                        <span className="flex items-center">
                          <Play className="h-3 w-3 mr-1" />
                          {course.duration}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              Quick Actions
            </CardTitle>
            <CardDescription className="text-base">
              Common tasks to get you started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Button 
                variant="outline" 
                className="h-24 flex-col space-y-3 group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-2 hover:border-primary/50 hover:bg-primary/5"
              >
                <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 group-hover:scale-110 transition-transform duration-200">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <span className="font-semibold group-hover:text-primary transition-colors duration-200">
                  Upload New Clip
                </span>
              </Button>
              <Button 
                variant="outline" 
                className="h-24 flex-col space-y-3 group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-2 hover:border-primary/50 hover:bg-primary/5"
              >
                <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 group-hover:scale-110 transition-transform duration-200">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <span className="font-semibold group-hover:text-primary transition-colors duration-200">
                  Create Course
                </span>
              </Button>
              <Button 
                variant="outline" 
                className="h-24 flex-col space-y-3 group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-2 hover:border-primary/50 hover:bg-primary/5"
              >
                <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 group-hover:scale-110 transition-transform duration-200">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <span className="font-semibold group-hover:text-primary transition-colors duration-200">
                  Invite Users
                </span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
