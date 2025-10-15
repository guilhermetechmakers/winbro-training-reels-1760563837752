import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users,
  MapPin, 
  Building, 
  Calendar, 
  Clock, 
  BookOpen, 
  Play, 
  Eye, 
  Heart, 
  Edit, 
  Save, 
  Upload, 
  Shield, 
  CheckCircle, 
  Star, 
  TrendingUp, 
  BarChart3,
  Target,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

export function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Mock user data
  const [userProfile, setUserProfile] = useState({
    full_name: 'John Doe',
    email: 'john.doe@company.com',
    phone: '+1 (555) 123-4567',
    title: 'Training Manager',
    department: 'Operations',
    location: 'San Francisco, CA',
    bio: 'Experienced training manager with 10+ years in manufacturing operations. Passionate about creating effective learning experiences that drive real results.',
    avatar_url: 'https://via.placeholder.com/150x150/4F46E5/FFFFFF?text=JD',
    join_date: '2024-01-15T10:30:00Z',
    last_active: '2024-01-20T14:30:00Z',
    role: 'admin',
    is_verified: true,
    stats: {
      total_clips_created: 45,
      total_courses_created: 8,
      total_views: 12340,
      completion_rate: 87,
      average_rating: 4.8,
      total_likes: 234
    },
    achievements: [
      { id: '1', title: 'Content Creator', description: 'Created 25+ video clips', icon: Play, earned: true },
      { id: '2', title: 'Course Builder', description: 'Built 5+ courses', icon: BookOpen, earned: true },
      { id: '3', title: 'Top Performer', description: 'Achieved 90%+ completion rate', icon: Star, earned: true },
      { id: '4', title: 'Team Player', description: 'Collaborated on 10+ projects', icon: Users, earned: false },
      { id: '5', title: 'Innovator', description: 'Introduced new training methods', icon: Zap, earned: false }
    ],
    recent_activity: [
      { id: '1', type: 'clip_created', title: 'Machine Setup - Part 3', time: '2 hours ago', icon: Play },
      { id: '2', type: 'course_published', title: 'Safety Training Program', time: '1 day ago', icon: BookOpen },
      { id: '3', type: 'clip_viewed', title: 'Maintenance Checklist', time: '2 days ago', icon: Eye },
      { id: '4', type: 'course_completed', title: 'Advanced Machining', time: '3 days ago', icon: CheckCircle },
      { id: '5', type: 'clip_liked', title: 'Quality Control Process', time: '4 days ago', icon: Heart }
    ],
    skills: ['Training Design', 'Video Production', 'Process Improvement', 'Team Leadership', 'Safety Management'],
    interests: ['Manufacturing', 'Technology', 'Education', 'Innovation']
  });

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'clip_created':
        return Play;
      case 'course_published':
        return BookOpen;
      case 'clip_viewed':
        return Eye;
      case 'course_completed':
        return CheckCircle;
      case 'clip_liked':
        return Heart;
      default:
        return Play;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'clip_created':
        return 'text-blue-600';
      case 'course_published':
        return 'text-green-600';
      case 'clip_viewed':
        return 'text-purple-600';
      case 'course_completed':
        return 'text-orange-600';
      case 'clip_liked':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Profile</h1>
            <p className="text-muted-foreground mt-1">
              Manage your profile and view your activity
            </p>
          </div>
          <div className="flex items-center gap-3">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isSaving}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Overview */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="relative inline-block">
                    <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden mx-auto">
                      <img
                        src={userProfile.avatar_url}
                        alt={userProfile.full_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {isEditing && (
                      <Button
                        size="icon"
                        className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-bold">{userProfile.full_name}</h2>
                    <p className="text-muted-foreground">{userProfile.title}</p>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <Badge variant="default" className="flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        {userProfile.role.charAt(0).toUpperCase() + userProfile.role.slice(1)}
                      </Badge>
                      {userProfile.is_verified && (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground space-y-1">
                    <div className="flex items-center justify-center gap-2">
                      <Building className="h-4 w-4" />
                      {userProfile.department}
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {userProfile.location}
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Joined {formatDate(userProfile.join_date)}
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Clock className="h-4 w-4" />
                      Last active {formatDateTime(userProfile.last_active)}
                    </div>
                  </div>

                  {isEditing && (
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={userProfile.bio}
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setUserProfile(prev => ({ ...prev, bio: e.target.value }))}
                          rows={3}
                        />
                      </div>
                    </div>
                  )}

                  {!isEditing && (
                    <p className="text-sm text-muted-foreground">{userProfile.bio}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{userProfile.stats.total_clips_created}</div>
                    <div className="text-xs text-muted-foreground">Clips Created</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{userProfile.stats.total_courses_created}</div>
                    <div className="text-xs text-muted-foreground">Courses Built</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{userProfile.stats.total_views.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Total Views</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{userProfile.stats.completion_rate}%</div>
                    <div className="text-xs text-muted-foreground">Completion Rate</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Average Rating</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{userProfile.stats.average_rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Total Likes</span>
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4 text-red-500" />
                      <span className="font-medium">{userProfile.stats.total_likes}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skills & Interests */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Skills & Interests</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {userProfile.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Interests</h4>
                  <div className="flex flex-wrap gap-2">
                    {userProfile.interests.map((interest, index) => (
                      <Badge key={index} variant="outline">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle>Achievements</CardTitle>
                <CardDescription>
                  Track your progress and unlock new achievements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userProfile.achievements.map((achievement) => {
                    const Icon = achievement.icon;
                    return (
                      <div
                        key={achievement.id}
                        className={cn(
                          "flex items-center gap-3 p-4 rounded-lg border transition-colors",
                          achievement.earned
                            ? "border-green-200 bg-green-50"
                            : "border-muted bg-muted/30"
                        )}
                      >
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center",
                          achievement.earned
                            ? "bg-green-100 text-green-600"
                            : "bg-muted text-muted-foreground"
                        )}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{achievement.title}</h4>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        </div>
                        {achievement.earned && (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your latest actions and interactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userProfile.recent_activity.map((activity) => {
                    const Icon = getActivityIcon(activity.type);
                    return (
                      <div key={activity.id} className="flex items-center gap-3">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center",
                          getActivityColor(activity.type),
                          "bg-muted"
                        )}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.title}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
                <CardDescription>
                  Your content performance over the last 30 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-600" />
                      <div className="text-2xl font-bold text-green-600">+12%</div>
                      <div className="text-sm text-muted-foreground">Views Growth</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <Target className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                      <div className="text-2xl font-bold text-blue-600">94%</div>
                      <div className="text-sm text-muted-foreground">Goal Achievement</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <BarChart3 className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                      <div className="text-2xl font-bold text-purple-600">#3</div>
                      <div className="text-sm text-muted-foreground">Team Ranking</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Content Quality Score</span>
                      <span className="font-medium">92/100</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Engagement Rate</span>
                      <span className="font-medium">78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
