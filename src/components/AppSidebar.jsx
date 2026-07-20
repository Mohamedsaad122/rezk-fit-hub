import { Home, Dumbbell, Apple, BarChart3, Moon, Sun, User, LogOut, LogIn, Users, Calendar, Bell, CheckSquare, LineChart, MessageSquare, Activity, FolderOpen, Image, Settings, Shield, Building, ClipboardList, FileSpreadsheet, HeartPulse, Key, CreditCard, Mail, Percent, Bot, Cpu, Plug } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import ROUTES from "@/constants/routes.constants";
import { useAuthStore } from "@/store/auth.store";
import { useQueryClient } from "@tanstack/react-query";
import { useUnreadNotifications } from "@/hooks/use-notifications";
import { useOverdueTasks } from "@/hooks/use-tasks";
import { useConversations } from "@/hooks/use-messages";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const sidebarSections = [
  {
    id: "main",
    label: "الرئيسية",
    items: [
      { title: "الرئيسية", url: ROUTES.HOME, icon: Home, description: "نظرة عامة على النظام" },
      { title: "لوحة التحكم", url: ROUTES.DASHBOARD, icon: BarChart3, description: "إحصائيات ومعلومات" }
    ]
  },
  {
    id: "clients",
    label: "العملاء والمتابعة",
    items: [
      { title: "العملاء", url: ROUTES.CLIENTS, icon: Users, description: "إدارة ومتابعة المتدربين" },
      { title: "المدربين", url: ROUTES.MEMBERS, icon: Users, description: "إدارة طاقم العمل" },
      { title: "التمارين", url: ROUTES.EXERCISES, icon: Dumbbell, description: "تصميم التمارين الرياضية" },
      { title: "الأنظمة الغذائية", url: ROUTES.NUTRITION, icon: Apple, description: "خطط التغذية المتخصصة" }
    ]
  },
  {
    id: "management",
    label: "الجدولة والإدارة",
    items: [
      { title: "المواعيد", url: ROUTES.CALENDAR, icon: Calendar, description: "المواعيد وجلسات التدريب" },
      { title: "التقويم", url: ROUTES.CALENDAR, icon: Calendar, description: "جدولة التدريبات واللقاءات" },
      { title: "المهام", url: ROUTES.TASKS, icon: CheckSquare, description: "إدارة المهام والعمليات" },
      { title: "الرسائل", url: ROUTES.MESSAGES, icon: MessageSquare, description: "التواصل والرسائل المباشرة" },
      { title: "الإشعارات", url: ROUTES.NOTIFICATIONS, icon: Bell, description: "مركز الإشعارات والرسائل" }
    ]
  },
  {
    id: "business",
    label: "إدارة الأعمال",
    items: [
      { title: "التقارير", url: ROUTES.REPORTS, icon: FileSpreadsheet, description: "تصدير وجدولة التقارير" },
      { title: "التحليلات", url: ROUTES.ANALYTICS, icon: LineChart, description: "مؤشرات وتقارير الأعمال" },
      { title: "الفواتير", url: ROUTES.INVOICES, icon: ClipboardList, description: "سجل الفواتير والدفعات" },
      { title: "المدفوعات", url: ROUTES.PAYMENTS, icon: CreditCard, description: "إدارة المعاملات المالية" },
      { title: "الاشتراسات", url: ROUTES.BILLING, icon: CreditCard, description: "إدارة باقة الاشتراك والدفع" }
    ]
  },
  {
    id: "admin",
    label: "الإشراف والعمليات",
    items: [
      { title: "الإدارة", url: ROUTES.ADMIN_USERS, icon: Users, description: "حسابات المستخدمين والموظفين" },
      { title: "الأدوار والصلاحيات", url: ROUTES.ADMIN_RBAC, icon: Shield, description: "مصفوفة الأدوار والصلاحيات" },
      { title: "مركز الأمان", url: ROUTES.SECURITY_CENTER, icon: Shield, description: "أمان الحساب والخصوصية" },
      { title: "المطورين", url: ROUTES.DEVELOPER_PORTAL, icon: Key, description: "مفاتيح الربط والـ API" },
      { title: "مركز العمليات", url: ROUTES.OBSERVABILITY_CENTER, icon: Activity, description: "مراقبة الأداء وصحة النظام" }
    ]
  },
  {
    id: "settings",
    label: "الإعدادات",
    items: [
      { title: "الإعدادات", url: ROUTES.SETTINGS, icon: Settings, description: "تفضيلات وتكوين النظام" }
    ]
  }
];

export function AppSidebar() {
  const { theme, toggleTheme } = useTheme();
  const { state } = useSidebar();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { unreadCount } = useUnreadNotifications();
  const { count: overdueCount } = useOverdueTasks();
  const { data: conversations = [] } = useConversations();
  const unreadMessagesCount = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  const handleLogout = () => {
    logout();
    queryClient.clear();
    navigate(ROUTES.LOGIN);
  };

  const getVisibleItems = (items) => {
    const role = user?.role || 'trainee';
    return items.filter(item => {
      if (!isAuthenticated) {
        return item.url === ROUTES.HOME;
      }
      
      // Trainee RBAC Isolation
      if (role === 'trainee' || role === 'client') {
        const traineeAllowedUrls = [
          ROUTES.HOME,
          ROUTES.DASHBOARD,
          ROUTES.PROFILE,
          ROUTES.EXERCISES,
          ROUTES.NUTRITION,
          ROUTES.CALENDAR,
          ROUTES.TASKS,
          ROUTES.MESSAGES,
          ROUTES.DOCUMENTS,
          ROUTES.SETTINGS
        ];
        return traineeAllowedUrls.includes(item.url);
      }
      
      // Nutritionist RBAC
      if (role === 'nutritionist') {
        const nutritionistAllowedUrls = [
          ROUTES.HOME,
          ROUTES.DASHBOARD,
          ROUTES.CLIENTS,
          ROUTES.CLIENT_DETAILS,
          ROUTES.NUTRITION,
          ROUTES.CALENDAR,
          ROUTES.MESSAGES,
          ROUTES.NOTIFICATIONS,
          ROUTES.SETTINGS
        ];
        return nutritionistAllowedUrls.includes(item.url);
      }
      
      // Receptionist RBAC
      if (role === 'receptionist') {
        const receptionistAllowedUrls = [
          ROUTES.HOME,
          ROUTES.DASHBOARD,
          ROUTES.CLIENTS,
          ROUTES.CLIENT_DETAILS,
          ROUTES.CALENDAR,
          ROUTES.SETTINGS,
          ROUTES.NOTIFICATIONS
        ];
        return receptionistAllowedUrls.includes(item.url);
      }
      
      // Coach RBAC
      if (role === 'coach') {
        const coachAllowedUrls = [
          ROUTES.HOME,
          ROUTES.DASHBOARD,
          ROUTES.CLIENTS,
          ROUTES.CLIENT_DETAILS,
          ROUTES.EXERCISES,
          ROUTES.NUTRITION,
          ROUTES.CALENDAR,
          ROUTES.TASKS,
          ROUTES.MESSAGES,
          ROUTES.NOTIFICATIONS,
          ROUTES.REPORTS,
          ROUTES.ANALYTICS,
          ROUTES.SETTINGS
        ];
        return coachAllowedUrls.includes(item.url);
      }
      
      // Admin gets full access
      return true;
    });
  };

  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-l border-zinc-200 dark:border-zinc-800 bg-zinc-950 text-white shadow-2xl transition-all duration-300">
      <SidebarHeader className="border-b border-zinc-800 p-4">
        <div className="flex items-center gap-3 animate-fade-in">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-primary-foreground flex items-center justify-center shadow-[0_0_15px_rgba(14,165,233,0.3)] transition-transform duration-300 hover:scale-105">
            <Dumbbell className="w-5 h-5 text-white animate-pulse" />
          </div>
          {!isCollapsed && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col text-right"
            >
              <h2 className="font-bold text-foreground text-sm tracking-wide bg-gradient-to-r from-primary to-sky-400 bg-clip-text text-transparent">Rezk Fit Hub</h2>
              <p className="text-[10px] text-zinc-400">لوحة تحكم المدرب</p>
            </motion.div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4 space-y-4 overflow-y-auto no-scrollbar">
        {sidebarSections.map((section) => {
          const visibleItems = getVisibleItems(section.items);
          if (visibleItems.length === 0) return null;

          return (
            <SidebarGroup key={section.id} className="p-0">
              {!isCollapsed && (
                <SidebarGroupLabel className="px-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 text-right">
                  {section.label}
                </SidebarGroupLabel>
              )}
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {visibleItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <TooltipProvider>
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger asChild>
                            <NavLink 
                              to={item.url} 
                              end
                              className={({ isActive }) => `
                                relative flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all w-full overflow-hidden text-right
                                ${isActive 
                                  ? 'bg-gradient-to-r from-primary/15 to-transparent text-primary font-bold shadow-sm' 
                                  : 'text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-100 hover:scale-[1.02]'
                                }
                              `}
                            >
                              {({ isActive }) => (
                                <>
                                  {isActive && (
                                    <motion.div 
                                      layoutId="activeIndicator"
                                      className="absolute right-0 top-1 bottom-1 w-1 bg-primary rounded-l shadow-[0_0_10px_var(--primary)]"
                                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                  )}
                                  <div className="relative flex items-center justify-center shrink-0">
                                    <item.icon className={`h-4.5 w-4.5 ${isActive ? 'text-primary' : 'text-zinc-400'}`} />
                                    {item.url === ROUTES.NOTIFICATIONS && unreadCount > 0 && (
                                      <span className="absolute -top-1 -right-1 flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                                      </span>
                                    )}
                                    {item.url === ROUTES.TASKS && overdueCount > 0 && (
                                      <span className="absolute -top-1 -right-1 flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                                      </span>
                                    )}
                                    {item.url === ROUTES.MESSAGES && unreadMessagesCount > 0 && (
                                      <span className="absolute -top-1 -right-1 flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                                      </span>
                                    )}
                                  </div>
                                  {!isCollapsed && (
                                    <div className="flex-1 flex items-center justify-between min-w-0 flex-row-reverse text-right">
                                      <span className="text-xs leading-none font-medium truncate">
                                        {item.title}
                                      </span>
                                      {item.url === ROUTES.NOTIFICATIONS && unreadCount > 0 && (
                                        <span className="bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-4 h-4 flex items-center justify-center shrink-0">
                                          {unreadCount}
                                        </span>
                                      )}
                                      {item.url === ROUTES.TASKS && overdueCount > 0 && (
                                        <span className="bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-4 h-4 flex items-center justify-center shrink-0">
                                          {overdueCount}
                                        </span>
                                      )}
                                      {item.url === ROUTES.MESSAGES && unreadMessagesCount > 0 && (
                                        <span className="bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-4 h-4 flex items-center justify-center shrink-0">
                                          {unreadMessagesCount}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </>
                              )}
                            </NavLink>
                          </TooltipTrigger>
                          {isCollapsed && (
                            <TooltipContent side="left" className="bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs shadow-xl">
                              {item.title}
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-zinc-800">
        <div className="space-y-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="w-full justify-start gap-3 h-10 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40 flex-row-reverse text-right"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 shrink-0 text-zinc-400" />
            ) : (
              <Moon className="h-4 w-4 shrink-0 text-zinc-400" />
            )}
            {!isCollapsed && (
              <span className="text-xs leading-none">
                {theme === 'dark' ? 'الوضع النهاري' : 'الوضع الليلي'}
              </span>
            )}
          </Button>

          {isAuthenticated ? (
            <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-900/60 border border-zinc-800 flex-row-reverse">
              <div className="flex items-center gap-3 flex-row-reverse">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-sky-400 flex items-center justify-center shadow-md">
                  <User className="w-4 h-4 text-white" />
                </div>
                {!isCollapsed && (
                  <div className="text-right">
                    <p className="font-bold text-zinc-200 text-xs leading-none truncate max-w-[100px]">{user?.name}</p>
                    <p className="text-[9px] text-zinc-500 mt-1">
                      {user?.role === 'coach' ? 'مدرب شخصي' : user?.role === 'admin' ? 'مدير النظام' : 'متدرب'}
                    </p>
                  </div>
                )}
              </div>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-rose-500 hover:bg-rose-500/10 shrink-0">
                    <LogOut className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rtl text-right bg-zinc-900 border border-zinc-800">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-zinc-100">تأكيد تسجيل الخروج</AlertDialogTitle>
                    <AlertDialogDescription className="text-zinc-400 text-xs">
                      هل أنت متأكد من رغبتك في تسجيل الخروج؟ سيتم إنهاء الجلسة الحالية ومسح الكاش والرموز المخزنة.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="flex flex-row-reverse gap-2 justify-start mt-4">
                    <AlertDialogCancel className="mt-0 bg-transparent border-zinc-800 text-zinc-300 hover:bg-zinc-800">إلغاء</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLogout} className="bg-rose-600 text-white hover:bg-rose-500">
                      تسجيل الخروج
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ) : (
            <Button
              onClick={() => navigate(ROUTES.LOGIN)}
              className="w-full justify-start gap-3 h-10 bg-gradient-to-r from-primary to-sky-500 text-white flex-row-reverse text-right"
            >
              <LogIn className="h-4 w-4 shrink-0" />
              {!isCollapsed && <span className="text-xs leading-none">تسجيل الدخول</span>}
            </Button>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}