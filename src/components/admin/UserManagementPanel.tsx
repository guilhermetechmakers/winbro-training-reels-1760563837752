import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Users, 
  Search, 
  UserCheck, 
  UserX, 
  UserCog,
  Calendar
} from 'lucide-react';
import { useAdminUsers, useUserManagement } from '@/hooks/use-admin';
import { cn } from '@/lib/utils';

interface UserManagementPanelProps {
  className?: string;
}

export function UserManagementPanel({ className }: UserManagementPanelProps) {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: users = [], isLoading } = useAdminUsers({
    role: roleFilter === 'all' ? undefined : roleFilter,
    status: statusFilter === 'all' ? undefined : statusFilter,
    search: searchQuery || undefined,
  });

  const {
    updateUserRole,
    activateUser,
    deactivateUser,
    bulkUpdateUsers,
  } = useUserManagement();

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(user => user.id));
    }
  };

  const handleRoleChange = (userId: string, role: 'admin' | 'curator' | 'user') => {
    updateUserRole.mutate({ userId, role });
  };

  const handleActivateUser = (userId: string) => {
    activateUser.mutate(userId);
  };

  const handleDeactivateUser = (userId: string) => {
    deactivateUser.mutate(userId);
  };

  const handleBulkRoleChange = (role: 'admin' | 'curator' | 'user') => {
    if (selectedUsers.length > 0) {
      bulkUpdateUsers.mutate({ 
        userIds: selectedUsers, 
        updates: { role } 
      });
      setSelectedUsers([]);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'curator': return 'default';
      case 'user': return 'secondary';
      default: return 'secondary';
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'secondary' : 'destructive';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatLastLogin = (lastLogin?: string) => {
    if (!lastLogin) return 'Never';
    const date = new Date(lastLogin);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return formatDate(lastLogin);
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Management
          </CardTitle>
          <CardDescription>
            Manage user accounts and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                <div className="h-4 w-4 bg-muted animate-pulse rounded" />
                <div className="h-10 w-10 bg-muted animate-pulse rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/3 bg-muted animate-pulse rounded" />
                  <div className="h-3 w-1/4 bg-muted animate-pulse rounded" />
                </div>
                <div className="h-6 w-16 bg-muted animate-pulse rounded" />
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
              <Users className="h-5 w-5" />
              User Management
            </CardTitle>
            <CardDescription>
              {users.length} users found
            </CardDescription>
          </div>
          {selectedUsers.length > 0 && (
            <div className="flex items-center gap-2">
              <Select onValueChange={(value: 'admin' | 'curator' | 'user') => handleBulkRoleChange(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Change Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="curator">Curator</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground">
                ({selectedUsers.length} selected)
              </span>
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
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="curator">Curator</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Users List */}
        <ScrollArea className="h-[500px]">
          <div className="space-y-4">
            {users.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No users found</p>
                <p className="text-sm">Try adjusting your search or filters</p>
              </div>
            ) : (
              <>
                {/* Select All */}
                <div className="flex items-center space-x-2 p-2 border-b">
                  <Checkbox
                    checked={selectedUsers.length === users.length && users.length > 0}
                    onChange={handleSelectAll}
                  />
                  <span className="text-sm text-muted-foreground">
                    Select all ({users.length} users)
                  </span>
                </div>

                {users.map((user) => (
                  <div
                    key={user.id}
                    className={cn(
                      "flex items-center space-x-4 p-4 border rounded-lg transition-all duration-200 hover:shadow-md",
                      selectedUsers.includes(user.id) && "bg-muted/50 border-primary"
                    )}
                  >
                    <Checkbox
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                    />
                    
                    {/* Avatar */}
                    <div className="relative">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground font-medium">
                        {user.full_name ? user.full_name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                      </div>
                      <div className={cn(
                        "absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-background",
                        user.is_verified ? "bg-green-500" : "bg-muted"
                      )} />
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">
                            {user.full_name || 'No name'}
                          </h4>
                          <p className="text-xs text-muted-foreground truncate">
                            {user.email}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              Joined {formatDate(user.created_at)}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <UserCog className="h-3 w-3" />
                              Last login: {formatLastLogin(user.last_login)}
                            </div>
                          </div>
                        </div>
                        
                        {/* Role and Status */}
                        <div className="flex flex-col items-end gap-2 ml-4">
                          <Badge variant={getRoleColor(user.role)}>
                            {user.role}
                          </Badge>
                          <Badge variant={getStatusColor(user.is_verified)}>
                            {user.is_verified ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Select
                        value={user.role}
                        onValueChange={(value: 'admin' | 'curator' | 'user') => 
                          handleRoleChange(user.id, value)
                        }
                      >
                        <SelectTrigger className="w-24 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="curator">Curator</SelectItem>
                          <SelectItem value="user">User</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      {user.is_verified ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeactivateUser(user.id)}
                          disabled={deactivateUser.isPending}
                          className="h-8"
                        >
                          <UserX className="h-3 w-3 mr-1" />
                          Deactivate
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleActivateUser(user.id)}
                          disabled={activateUser.isPending}
                          className="h-8"
                        >
                          <UserCheck className="h-3 w-3 mr-1" />
                          Activate
                        </Button>
                      )}
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