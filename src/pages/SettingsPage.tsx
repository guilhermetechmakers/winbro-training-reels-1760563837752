import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Building, 
  Bell, 
  Shield, 
  Globe, 
  Mail, 
  Upload,
  Save,
  Edit,
  Eye,
  EyeOff,
  Check
} from "lucide-react";
import { cn } from "@/lib/utils";

type SettingsTab = 'profile' | 'organization' | 'notifications' | 'security' | 'billing' | 'integrations';

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Mock user data
  const [userSettings, setUserSettings] = useState({
    profile: {
      full_name: 'John Doe',
      email: 'john.doe@company.com',
      phone: '+1 (555) 123-4567',
      title: 'Training Manager',
      department: 'Operations',
      location: 'San Francisco, CA',
      bio: 'Experienced training manager with 10+ years in manufacturing operations.',
      avatar_url: 'https://via.placeholder.com/100x100/4F46E5/FFFFFF?text=JD',
      timezone: 'America/Los_Angeles',
      language: 'en'
    },
    notifications: {
      email: {
        course_updates: true,
        new_clips: true,
        system_announcements: true,
        weekly_digest: false,
        security_alerts: true
      },
      push: {
        enabled: true,
        course_reminders: true,
        new_content: true,
        mentions: true
      }
    },
    playback: {
      autoplay: false,
      default_speed: 1.0,
      quality: 'auto',
      captions: true,
      volume: 0.8
    },
    privacy: {
      profile_visibility: 'organization',
      show_activity: true,
      allow_downloads: true,
      data_sharing: false
    }
  });

  // Mock organization data
  const [orgSettings, setOrgSettings] = useState({
    general: {
      name: 'Acme Manufacturing',
      domain: 'acme.com',
      industry: 'Manufacturing',
      size: '100-500',
      logo_url: 'https://via.placeholder.com/100x100/059669/FFFFFF?text=AM',
      description: 'Leading manufacturer of precision components and assemblies.'
    },
    branding: {
      primary_color: '#4F46E5',
      secondary_color: '#059669',
      logo_url: 'https://via.placeholder.com/100x100/059669/FFFFFF?text=AM',
      custom_css: ''
    },
    content_workflow: {
      require_approval: true,
      approvers: ['sarah.smith@company.com', 'david.wilson@company.com'],
      auto_publish: false,
      retention_days: 365
    },
    sso: {
      enabled: false,
      provider: 'saml',
      metadata_url: '',
      client_id: '',
      client_secret: ''
    }
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'organization', label: 'Organization', icon: Building },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Billing', icon: Shield },
    { id: 'integrations', label: 'Integrations', icon: Shield }
  ];

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original values
  };

  const renderProfileSettings = () => (
    <div className="space-y-6">
      {/* Avatar Section */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
          <CardDescription>
            Upload a new profile picture
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center overflow-hidden">
              <img
                src={userSettings.profile.avatar_url}
                alt={userSettings.profile.full_name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-2">
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Upload New
              </Button>
              <p className="text-xs text-muted-foreground">
                JPG, PNG or GIF. Max size 2MB.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Update your personal details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={userSettings.profile.full_name}
                onChange={(e) => setUserSettings(prev => ({
                  ...prev,
                  profile: { ...prev.profile, full_name: e.target.value }
                }))}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={userSettings.profile.email}
                onChange={(e) => setUserSettings(prev => ({
                  ...prev,
                  profile: { ...prev.profile, email: e.target.value }
                }))}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={userSettings.profile.phone}
                onChange={(e) => setUserSettings(prev => ({
                  ...prev,
                  profile: { ...prev.profile, phone: e.target.value }
                }))}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="title">Job Title</Label>
              <Input
                id="title"
                value={userSettings.profile.title}
                onChange={(e) => setUserSettings(prev => ({
                  ...prev,
                  profile: { ...prev.profile, title: e.target.value }
                }))}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={userSettings.profile.department}
                onChange={(e) => setUserSettings(prev => ({
                  ...prev,
                  profile: { ...prev.profile, department: e.target.value }
                }))}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={userSettings.profile.location}
                onChange={(e) => setUserSettings(prev => ({
                  ...prev,
                  profile: { ...prev.profile, location: e.target.value }
                }))}
                disabled={!isEditing}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={userSettings.profile.bio}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setUserSettings(prev => ({
                ...prev,
                profile: { ...prev.profile, bio: e.target.value }
              }))}
              disabled={!isEditing}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>
            Set your language and timezone preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="timezone">Timezone</Label>
              <Select
                value={userSettings.profile.timezone}
                onValueChange={(value) => setUserSettings(prev => ({
                  ...prev,
                  profile: { ...prev.profile, timezone: value }
                }))}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                  <SelectItem value="America/Denver">Mountain Time</SelectItem>
                  <SelectItem value="America/Chicago">Central Time</SelectItem>
                  <SelectItem value="America/New_York">Eastern Time</SelectItem>
                  <SelectItem value="Europe/London">London</SelectItem>
                  <SelectItem value="Europe/Paris">Paris</SelectItem>
                  <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="language">Language</Label>
              <Select
                value={userSettings.profile.language}
                onValueChange={(value) => setUserSettings(prev => ({
                  ...prev,
                  profile: { ...prev.profile, language: value }
                }))}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                  <SelectItem value="ja">Japanese</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderOrganizationSettings = () => (
    <div className="space-y-6">
      {/* Organization Info */}
      <Card>
        <CardHeader>
          <CardTitle>Organization Information</CardTitle>
          <CardDescription>
            Update your organization details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
              <img
                src={orgSettings.general.logo_url}
                alt={orgSettings.general.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-2">
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Upload Logo
              </Button>
              <p className="text-xs text-muted-foreground">
                PNG or SVG. Max size 1MB.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="org_name">Organization Name</Label>
              <Input
                id="org_name"
                value={orgSettings.general.name}
                onChange={(e) => setOrgSettings(prev => ({
                  ...prev,
                  general: { ...prev.general, name: e.target.value }
                }))}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="domain">Domain</Label>
              <Input
                id="domain"
                value={orgSettings.general.domain}
                onChange={(e) => setOrgSettings(prev => ({
                  ...prev,
                  general: { ...prev.general, domain: e.target.value }
                }))}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="industry">Industry</Label>
              <Select
                value={orgSettings.general.industry}
                onValueChange={(value) => setOrgSettings(prev => ({
                  ...prev,
                  general: { ...prev.general, industry: value }
                }))}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="size">Company Size</Label>
              <Select
                value={orgSettings.general.size}
                onValueChange={(value) => setOrgSettings(prev => ({
                  ...prev,
                  general: { ...prev.general, size: value }
                }))}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-10">1-10 employees</SelectItem>
                  <SelectItem value="11-50">11-50 employees</SelectItem>
                  <SelectItem value="51-100">51-100 employees</SelectItem>
                  <SelectItem value="101-500">101-500 employees</SelectItem>
                  <SelectItem value="500+">500+ employees</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="org_description">Description</Label>
            <Textarea
              id="org_description"
              value={orgSettings.general.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setOrgSettings(prev => ({
                ...prev,
                general: { ...prev.general, description: e.target.value }
              }))}
              disabled={!isEditing}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Content Workflow */}
      <Card>
        <CardHeader>
          <CardTitle>Content Workflow</CardTitle>
          <CardDescription>
            Configure how content is reviewed and published
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="require_approval">Require Content Approval</Label>
              <p className="text-sm text-muted-foreground">
                All content must be approved before publishing
              </p>
            </div>
            <Switch
              id="require_approval"
              checked={orgSettings.content_workflow.require_approval}
              onCheckedChange={(checked) => setOrgSettings(prev => ({
                ...prev,
                content_workflow: { ...prev.content_workflow, require_approval: checked }
              }))}
              disabled={!isEditing}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto_publish">Auto-publish Approved Content</Label>
              <p className="text-sm text-muted-foreground">
                Automatically publish content after approval
              </p>
            </div>
            <Switch
              id="auto_publish"
              checked={orgSettings.content_workflow.auto_publish}
              onCheckedChange={(checked) => setOrgSettings(prev => ({
                ...prev,
                content_workflow: { ...prev.content_workflow, auto_publish: checked }
              }))}
              disabled={!isEditing}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      {/* Email Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
          <CardDescription>
            Choose what email notifications you want to receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(userSettings.notifications.email).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <Label htmlFor={`email_${key}`}>
                  {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {key === 'course_updates' && 'Get notified when courses are updated'}
                  {key === 'new_clips' && 'Get notified when new video clips are added'}
                  {key === 'system_announcements' && 'Get notified about system updates and maintenance'}
                  {key === 'weekly_digest' && 'Receive a weekly summary of activity'}
                  {key === 'security_alerts' && 'Get notified about security-related events'}
                </p>
              </div>
              <Switch
                id={`email_${key}`}
                checked={value}
                onCheckedChange={(checked) => setUserSettings(prev => ({
                  ...prev,
                  notifications: {
                    ...prev.notifications,
                    email: { ...prev.notifications.email, [key]: checked }
                  }
                }))}
                disabled={!isEditing}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Push Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Push Notifications</CardTitle>
          <CardDescription>
            Manage browser and mobile push notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="push_enabled">Enable Push Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications in your browser
              </p>
            </div>
            <Switch
              id="push_enabled"
              checked={userSettings.notifications.push.enabled}
              onCheckedChange={(checked) => setUserSettings(prev => ({
                ...prev,
                notifications: {
                  ...prev.notifications,
                  push: { ...prev.notifications.push, enabled: checked }
                }
              }))}
              disabled={!isEditing}
            />
          </div>
          
          {userSettings.notifications.push.enabled && (
            <div className="space-y-4 pl-4 border-l-2 border-muted">
              {Object.entries(userSettings.notifications.push).filter(([key]) => key !== 'enabled').map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <Label htmlFor={`push_${key}`}>
                      {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {key === 'course_reminders' && 'Get reminded about course deadlines'}
                      {key === 'new_content' && 'Get notified about new content'}
                      {key === 'mentions' && 'Get notified when you are mentioned'}
                    </p>
                  </div>
                  <Switch
                    id={`push_${key}`}
                    checked={value}
                    onCheckedChange={(checked) => setUserSettings(prev => ({
                      ...prev,
                      notifications: {
                        ...prev.notifications,
                        push: { ...prev.notifications.push, [key]: checked }
                      }
                    }))}
                    disabled={!isEditing}
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      {/* Password */}
      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>
            Update your password to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="current_password">Current Password</Label>
            <div className="relative">
              <Input
                id="current_password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter current password"
                disabled={!isEditing}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div>
            <Label htmlFor="new_password">New Password</Label>
            <Input
              id="new_password"
              type="password"
              placeholder="Enter new password"
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="confirm_password">Confirm New Password</Label>
            <Input
              id="confirm_password"
              type="password"
              placeholder="Confirm new password"
              disabled={!isEditing}
            />
          </div>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>
            Add an extra layer of security to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                <span className="font-medium">Enabled</span>
                <Badge variant="default" className="text-green-600 bg-green-50 border-green-600">
                  <Check className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Two-factor authentication is currently enabled on your account
              </p>
            </div>
            <Button variant="outline" disabled={!isEditing}>
              Manage
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Privacy Settings</CardTitle>
          <CardDescription>
            Control how your information is shared
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="profile_visibility">Profile Visibility</Label>
              <p className="text-sm text-muted-foreground">
                Who can see your profile information
              </p>
            </div>
            <Select
              value={userSettings.privacy.profile_visibility}
              onValueChange={(value) => setUserSettings(prev => ({
                ...prev,
                privacy: { ...prev.privacy, profile_visibility: value as any }
              }))}
              disabled={!isEditing}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="organization">Organization</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="show_activity">Show Activity Status</Label>
              <p className="text-sm text-muted-foreground">
                Let others see when you're online
              </p>
            </div>
            <Switch
              id="show_activity"
              checked={userSettings.privacy.show_activity}
              onCheckedChange={(checked) => setUserSettings(prev => ({
                ...prev,
                privacy: { ...prev.privacy, show_activity: checked }
              }))}
              disabled={!isEditing}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderBillingSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>
            Manage your subscription and billing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="default">Professional</Badge>
                <span className="text-sm text-muted-foreground">$99/month</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Up to 50 users • Unlimited video clips • Advanced analytics
              </p>
            </div>
            <Button variant="outline">Change Plan</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Billing Information</CardTitle>
          <CardDescription>
            Update your payment method and billing details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center">
                  VISA
                </div>
                <span className="text-sm">•••• •••• •••• 4242</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Expires 12/25
              </p>
            </div>
            <Button variant="outline" disabled={!isEditing}>
              Update
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderIntegrationsSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Available Integrations</CardTitle>
          <CardDescription>
            Connect with your favorite tools and services
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center">
                  <Globe className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="font-medium">Slack</div>
                  <div className="text-sm text-muted-foreground">Team communication</div>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Connect
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-600 rounded flex items-center justify-center">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="font-medium">Microsoft Teams</div>
                  <div className="text-sm text-muted-foreground">Video conferencing</div>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Connect
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileSettings();
      case 'organization':
        return renderOrganizationSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'security':
        return renderSecuritySettings();
      case 'billing':
        return renderBillingSettings();
      case 'integrations':
        return renderIntegrationsSettings();
      default:
        return null;
    }
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground mt-1">
              Manage your account and organization settings
            </p>
          </div>
          <div className="flex items-center gap-3">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={handleCancel}>
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
                Edit Settings
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Settings Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-4">
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as SettingsTab)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                          activeTab === tab.id
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
