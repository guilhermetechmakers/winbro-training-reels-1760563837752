import { useState, useMemo } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Mail, 
  UserPlus,
  Download,
  Upload,
  RefreshCw,
  Eye,
  Shield,
  ShieldCheck,
  Clock,
  Users,
  UserCheck,
  UserX,
  ArrowUpDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { User } from "@/types";

type SortField = 'name' | 'email' | 'role' | 'created_at' | 'last_login';
type SortDirection = 'asc' | 'desc';
type UserRole = 'admin' | 'curator' | 'user';

export function UserManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock user data - in real app this would come from API
  const mockUsers: User[] = [
    {
      id: '1',
      email: 'john.doe@company.com',
      full_name: 'John Doe',
      avatar_url: 'https://via.placeholder.com/40x40/4F46E5/FFFFFF?text=JD',
      role: 'admin',
      organization_id: 'org-1',
      is_verified: true,
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-01-15T10:30:00Z',
      last_login: '2024-01-20T14:30:00Z'
    },
    {
      id: '2',
      email: 'sarah.smith@company.com',
      full_name: 'Sarah Smith',
      avatar_url: 'https://via.placeholder.com/40x40/059669/FFFFFF?text=SS',
      role: 'curator',
      organization_id: 'org-1',
      is_verified: true,
      created_at: '2024-01-14T09:15:00Z',
      updated_at: '2024-01-14T09:15:00Z',
      last_login: '2024-01-19T16:45:00Z'
    },
    {
      id: '3',
      email: 'mike.johnson@company.com',
      full_name: 'Mike Johnson',
      avatar_url: 'https://via.placeholder.com/40x40/DC2626/FFFFFF?text=MJ',
      role: 'user',
      organization_id: 'org-1',
      is_verified: true,
      created_at: '2024-01-13T14:20:00Z',
      updated_at: '2024-01-13T14:20:00Z',
      last_login: '2024-01-18T11:20:00Z'
    },
    {
      id: '4',
      email: 'emily.brown@company.com',
      full_name: 'Emily Brown',
      avatar_url: 'https://via.placeholder.com/40x40/7C3AED/FFFFFF?text=EB',
      role: 'user',
      organization_id: 'org-1',
      is_verified: false,
      created_at: '2024-01-12T16:30:00Z',
      updated_at: '2024-01-12T16:30:00Z',
      last_login: undefined
    },
    {
      id: '5',
      email: 'david.wilson@company.com',
      full_name: 'David Wilson',
      avatar_url: 'https://via.placeholder.com/40x40/F59E0B/FFFFFF?text=DW',
      role: 'curator',
      organization_id: 'org-1',
      is_verified: true,
      created_at: '2024-01-11T11:45:00Z',
      updated_at: '2024-01-11T11:45:00Z',
      last_login: '2024-01-17T13:15:00Z'
    },
    {
      id: '6',
      email: 'lisa.garcia@company.com',
      full_name: 'Lisa Garcia',
      avatar_url: 'https://via.placeholder.com/40x40/EF4444/FFFFFF?text=LG',
      role: 'user',
      organization_id: 'org-1',
      is_verified: true,
      created_at: '2024-01-10T08:30:00Z',
      updated_at: '2024-01-10T08:30:00Z',
      last_login: '2024-01-16T09:45:00Z'
    }
  ];

  const filteredAndSortedUsers = useMemo(() => {
    let filtered = mockUsers.filter(user => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = user.full_name?.toLowerCase().includes(query) || false;
        const matchesEmail = user.email.toLowerCase().includes(query);
        if (!matchesName && !matchesEmail) return false;
      }

      // Role filter
      if (roleFilter !== 'all') {
        if (user.role !== roleFilter) return false;
      }

      // Status filter
      if (statusFilter !== 'all') {
        const isActive = user.is_verified && user.last_login;
        const isPending = !user.is_verified;
        const isInactive = user.is_verified && !user.last_login;
        
        if (statusFilter === 'active' && !isActive) return false;
        if (statusFilter === 'pending' && !isPending) return false;
        if (statusFilter === 'inactive' && !isInactive) return false;
      }

      return true;
    });

    // Sort users
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortField) {
        case 'name':
          aValue = a.full_name || a.email;
          bValue = b.full_name || b.email;
          break;
        case 'email':
          aValue = a.email;
          bValue = b.email;
          break;
        case 'role':
          aValue = a.role;
          bValue = b.role;
          break;
        case 'created_at':
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
          break;
        case 'last_login':
          aValue = a.last_login ? new Date(a.last_login).getTime() : 0;
          bValue = b.last_login ? new Date(b.last_login).getTime() : 0;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [mockUsers, searchQuery, roleFilter, statusFilter, sortField, sortDirection]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(filteredAndSortedUsers.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers(prev => [...prev, userId]);
    } else {
      setSelectedUsers(prev => prev.filter(id => id !== userId));
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'curator':
        return 'default';
      case 'user':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getStatusBadge = (user: User) => {
    if (!user.is_verified) {
      return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Pending</Badge>;
    }
    if (user.last_login) {
      return <Badge variant="default" className="text-green-600 bg-green-50 border-green-600">Active</Badge>;
    }
    return <Badge variant="outline" className="text-gray-600 border-gray-600">Inactive</Badge>;
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-4 w-4" />;
      case 'curator':
        return <ShieldCheck className="h-4 w-4" />;
      case 'user':
        return <UserCheck className="h-4 w-4" />;
      default:
        return <UserX className="h-4 w-4" />;
    }
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage users, roles, and permissions
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")} />
              Refresh
            </Button>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Invite User
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockUsers.length}</div>
              <p className="text-xs text-muted-foreground">
                +2 from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockUsers.filter(u => u.is_verified && u.last_login).length}
              </div>
              <p className="text-xs text-muted-foreground">
                {Math.round((mockUsers.filter(u => u.is_verified && u.last_login).length / mockUsers.length) * 100)}% of total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Verification</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockUsers.filter(u => !u.is_verified).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Awaiting email verification
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admins</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockUsers.filter(u => u.role === 'admin').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Full access users
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search users by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className={cn(showFilters && "bg-muted")}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                {selectedUsers.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {selectedUsers.length} selected
                    </span>
                    <Button variant="outline" size="sm">
                      <Mail className="h-4 w-4 mr-2" />
                      Send Email
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                )}
              </div>

              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Role</label>
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="curator">Curator</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Status</label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Sort by</label>
                    <Select value={`${sortField}-${sortDirection}`} onValueChange={(value) => {
                      const [field, direction] = value.split('-') as [SortField, SortDirection];
                      setSortField(field);
                      setSortDirection(direction);
                    }}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="name-asc">Name A-Z</SelectItem>
                        <SelectItem value="name-desc">Name Z-A</SelectItem>
                        <SelectItem value="email-asc">Email A-Z</SelectItem>
                        <SelectItem value="email-desc">Email Z-A</SelectItem>
                        <SelectItem value="role-asc">Role A-Z</SelectItem>
                        <SelectItem value="role-desc">Role Z-A</SelectItem>
                        <SelectItem value="created_at-desc">Newest First</SelectItem>
                        <SelectItem value="created_at-asc">Oldest First</SelectItem>
                        <SelectItem value="last_login-desc">Last Active</SelectItem>
                        <SelectItem value="last_login-asc">Least Active</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Users ({filteredAndSortedUsers.length})</CardTitle>
                <CardDescription>
                  Manage user accounts and permissions
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">
                      <Checkbox
                        checked={selectedUsers.length === filteredAndSortedUsers.length && filteredAndSortedUsers.length > 0}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                      />
                    </th>
                    <th className="text-left p-4">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort('name')}
                        className="h-auto p-0 font-medium"
                      >
                        User
                        <ArrowUpDown className="h-4 w-4 ml-2" />
                      </Button>
                    </th>
                    <th className="text-left p-4">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort('role')}
                        className="h-auto p-0 font-medium"
                      >
                        Role
                        <ArrowUpDown className="h-4 w-4 ml-2" />
                      </Button>
                    </th>
                    <th className="text-left p-4">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort('created_at')}
                        className="h-auto p-0 font-medium"
                      >
                        Joined
                        <ArrowUpDown className="h-4 w-4 ml-2" />
                      </Button>
                    </th>
                    <th className="text-left p-4">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort('last_login')}
                        className="h-auto p-0 font-medium"
                      >
                        Last Active
                        <ArrowUpDown className="h-4 w-4 ml-2" />
                      </Button>
                    </th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-right p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedUsers.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-muted/50">
                      <td className="p-4">
                        <Checkbox
                          checked={selectedUsers.includes(user.id)}
                          onChange={(e) => handleSelectUser(user.id, e.target.checked)}
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                            {user.avatar_url ? (
                              <img
                                src={user.avatar_url}
                                alt={user.full_name || user.email}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <span className="text-sm font-medium">
                                {(user.full_name || user.email).charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{user.full_name || 'No name'}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant={getRoleBadgeVariant(user.role)} className="flex items-center gap-1 w-fit">
                          {getRoleIcon(user.role)}
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {formatDate(user.created_at)}
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {user.last_login ? formatDateTime(user.last_login) : 'Never'}
                      </td>
                      <td className="p-4">
                        {getStatusBadge(user)}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredAndSortedUsers.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No users found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search criteria or filters
                </p>
                <Button onClick={() => {
                  setSearchQuery('');
                  setRoleFilter('all');
                  setStatusFilter('all');
                }}>
                  Clear Filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
