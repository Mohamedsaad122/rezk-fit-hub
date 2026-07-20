import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Dumbbell } from "lucide-react";
import { AppSidebar } from "./AppSidebar";
import { NotificationBell } from "./NotificationBell";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import ROUTES from "@/constants/routes.constants";

export const Layout = ({ children }) => {
  const location = useLocation();
  
  // Verify if current path belongs to authentication views
  const isAuthRoute = [
    ROUTES.LOGIN,
    ROUTES.FORGOT_PASSWORD,
    ROUTES.VERIFY_CODE,
    ROUTES.RESET_PASSWORD
  ].includes(location.pathname);

  if (isAuthRoute) {
    return (
      <div className="min-h-screen w-full bg-background flex flex-col justify-center items-center">
        {children}
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />

        <main className="flex-1 flex flex-col">
          {/* Header with Sidebar Toggle */}
          <motion.header
            className="fixed top-0 left-0 right-0 w-full h-16 border-b border-border bg-card/50 backdrop-blur-sm"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="max-w-7xl ml-auto h-full px-3 sm:px-4 md:px-6 lg:px-8 flex items-center justify-between">

              <div className="flex items-center gap-4">
                <SidebarTrigger className="hover:bg-muted p-2 rounded-lg transition-colors" />
                <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg">
                  <Dumbbell className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">
                    نظام التدريب الإلكتروني
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    إدارة شاملة للتدريب واللياقة البدنية
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <NotificationBell />
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
                  <span className="text-sm text-muted-foreground hidden sm:inline">متصل</span>
                </div>
              </div>

            </div>
          </motion.header>


          {/* Main Content */}
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};