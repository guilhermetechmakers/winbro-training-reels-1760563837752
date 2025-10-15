import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Home, 
  Library, 
  Upload, 
  Users, 
  BarChart3, 
  Settings, 
  User,
  Menu,
  X,
  BookOpen,
  FileText
} from "lucide-react";
import { useCurrentUser, useLogout } from "@/hooks/use-api";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { data: user } = useCurrentUser();
  const userData = user as any;
  const logout = useLogout();

  const navigation = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    {
      title: "Content Library",
      href: "/library",
      icon: Library,
    },
    {
      title: "Upload",
      href: "/upload",
      icon: Upload,
    },
    {
      title: "Courses",
      href: "/courses",
      icon: BookOpen,
    },
    {
      title: "Analytics",
      href: "/analytics",
      icon: BarChart3,
    },
    {
      title: "Users",
      href: "/users",
      icon: Users,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ];

  const userNavigation = [
    {
      title: "Profile",
      href: "/profile",
      icon: User,
    },
    {
      title: "Orders",
      href: "/orders",
      icon: FileText,
    },
  ];

  const handleLogout = () => {
    logout.mutate();
  };

  return (
    <div className={cn(
      "flex h-screen bg-card border-r transition-all duration-300",
      isCollapsed ? "w-16" : "w-64",
      className
    )}>
      <div className="flex flex-col w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          {!isCollapsed && (
            <h1 className="text-xl font-bold text-primary">Winbro Training</h1>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8"
          >
            {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted",
                    isCollapsed && "justify-center"
                  )}
                >
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  {!isCollapsed && <span>{item.title}</span>}
                </Link>
              );
            })}
          </nav>

          <Separator className="my-4" />

          {/* User Navigation */}
          <nav className="space-y-2">
            {userNavigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted",
                    isCollapsed && "justify-center"
                  )}
                >
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  {!isCollapsed && <span>{item.title}</span>}
                </Link>
              );
            })}
          </nav>
        </ScrollArea>

        {/* User Info & Logout */}
        <div className="p-4 border-t">
          {!isCollapsed && userData && (
            <div className="mb-3">
              <p className="text-sm font-medium">{userData?.full_name || userData?.email}</p>
              <p className="text-xs text-muted-foreground capitalize">{userData?.role}</p>
            </div>
          )}
          <Button
            variant="ghost"
            onClick={handleLogout}
            className={cn(
              "w-full justify-start text-muted-foreground hover:text-foreground",
              isCollapsed && "justify-center px-2"
            )}
            disabled={logout.isPending}
          >
            <X className="h-4 w-4" />
            {!isCollapsed && <span className="ml-2">Sign Out</span>}
          </Button>
        </div>
      </div>
    </div>
  );
}

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {children as React.ReactNode}
      </main>
    </div>
  );
}
