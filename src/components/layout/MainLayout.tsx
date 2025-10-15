import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
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
  FileText,
  Play,
  Plus,
} from "lucide-react";
import { useCurrentUser, useLogout } from "@/hooks/use-api";

interface SidebarProps {
  className?: string;
  onMobileMenuClose?: () => void;
}

export function Sidebar({ className, onMobileMenuClose }: SidebarProps) {
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
      badge: null,
    },
    {
      title: "Content Library",
      href: "/library",
      icon: Library,
      badge: null,
    },
    {
      title: "Upload",
      href: "/upload",
      icon: Upload,
      badge: "New",
    },
    {
      title: "Course Builder",
      href: "/course-builder",
      icon: Plus,
      badge: "New",
    },
    {
      title: "My Courses",
      href: "/courses",
      icon: BookOpen,
      badge: null,
    },
    {
      title: "Analytics",
      href: "/analytics",
      icon: BarChart3,
      badge: null,
    },
    {
      title: "Users",
      href: "/users",
      icon: Users,
      badge: null,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
      badge: null,
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
      "flex h-screen bg-gradient-to-b from-card to-card/95 border-r backdrop-blur-sm transition-all duration-300 shadow-lg",
      isCollapsed ? "w-16" : "w-64",
      className
    )}>
      <div className="flex flex-col w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/50">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                <Play className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Winbro Training
              </h1>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-9 w-9 hover:bg-primary/10 transition-all duration-200"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-4 py-6">
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={onMobileMenuClose}
                  className={cn(
                    "group flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative",
                    isActive
                      ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/25"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:translate-x-1",
                    isCollapsed && "justify-center"
                  )}
                >
                  <item.icon className={cn(
                    "h-5 w-5 flex-shrink-0 transition-transform duration-200",
                    isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground group-hover:scale-110"
                  )} />
                  {!isCollapsed && (
                    <>
                      <span className="flex-1">{item.title}</span>
                      {item.badge && (
                        <span className="px-2 py-1 text-xs bg-primary/20 text-primary rounded-full font-semibold">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary-foreground rounded-r-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          <Separator className="my-6 bg-border/50" />

          {/* User Navigation */}
          <nav className="space-y-1">
            {userNavigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={onMobileMenuClose}
                  className={cn(
                    "group flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/25"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:translate-x-1",
                    isCollapsed && "justify-center"
                  )}
                >
                  <item.icon className={cn(
                    "h-5 w-5 flex-shrink-0 transition-transform duration-200",
                    isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground group-hover:scale-110"
                  )} />
                  {!isCollapsed && <span>{item.title}</span>}
                </Link>
              );
            })}
          </nav>
        </ScrollArea>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-border/50 bg-gradient-to-t from-muted/20 to-transparent">
          {!isCollapsed && userData && (
            <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-muted/50 to-muted/30 border border-border/50">
              <p className="text-sm font-semibold text-foreground">{userData?.full_name || userData?.email}</p>
              <p className="text-xs text-muted-foreground capitalize">{userData?.role}</p>
            </div>
          )}
          <Button
            variant="ghost"
            onClick={handleLogout}
            className={cn(
              "w-full justify-start text-muted-foreground hover:text-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200",
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      
      {/* Mobile Menu */}
      <Dialog open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <DialogContent className="w-80 p-0 max-w-none">
          <Sidebar onMobileMenuClose={() => setIsMobileMenuOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b bg-card">
          <Dialog open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open mobile menu">
                <Menu className="h-6 w-6" />
              </Button>
            </DialogTrigger>
          </Dialog>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
              <Play className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Winbro Training
            </span>
          </div>
          
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
        
        {children as React.ReactNode}
      </main>
    </div>
  );
}
