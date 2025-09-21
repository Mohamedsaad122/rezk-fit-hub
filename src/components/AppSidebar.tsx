import { Home, Dumbbell, Apple, BarChart3, Moon, Sun, User } from "lucide-react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const navigationItems = [
  { 
    title: "الصفحة الرئيسية", 
    url: "/", 
    icon: Home,
    description: "نظرة عامة على النظام"
  },
  { 
    title: "التمارين", 
    url: "/exercises", 
    icon: Dumbbell,
    description: "إدارة التمارين الرياضية"
  },
  { 
    title: "النظام الغذائي", 
    url: "/nutrition", 
    icon: Apple,
    description: "خطط التغذية المتخصصة"
  },
  { 
    title: "لوحة التحكم", 
    url: "/dashboard", 
    icon: BarChart3,
    description: "إحصائيات ومعلومات"
  },
];

export function AppSidebar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Sidebar className="border-r border-sidebar-border" collapsible="icon">
      <SidebarHeader className="p-4">
        <motion.div 
          className="flex items-center gap-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg">
            <Dumbbell className="w-6 h-6 text-white" />
          </div>
          <div className="hidden group-data-[collapsible=icon]:hidden">
            <h2 className="text-lg font-bold text-sidebar-foreground">نظام التدريب</h2>
            <p className="text-sm text-sidebar-foreground/70">الإلكتروني</p>
          </div>
        </motion.div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60 font-semibold">
            القائمة الرئيسية
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item, index) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-12">
                    <NavLink 
                      to={item.url} 
                      end
                      className={({ isActive }) => `
                        flex items-center gap-3 rounded-lg px-3 py-2 transition-all
                        ${isActive 
                          ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-md' 
                          : 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                        }
                      `}
                    >
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                      >
                        <item.icon className="h-5 w-5" />
                      </motion.div>
                      <div className="hidden group-data-[collapsible=icon]:hidden">
                        <p className="font-medium">{item.title}</p>
                        <p className="text-xs opacity-70">{item.description}</p>
                      </div>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="space-y-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="w-full justify-start gap-3 h-10 text-sidebar-foreground hover:bg-sidebar-accent"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
            <span className="hidden group-data-[collapsible=icon]:hidden">
              {theme === 'dark' ? 'الوضع النهاري' : 'الوضع الليلي'}
            </span>
          </Button>

          {/* User Profile */}
          <div className="flex items-center gap-3 p-2 rounded-lg bg-sidebar-accent/50">
            <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="hidden group-data-[collapsible=icon]:hidden">
              <p className="font-medium text-sidebar-foreground">Rezk Naser</p>
              <p className="text-xs text-sidebar-foreground/70">مدرب شخصي</p>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}