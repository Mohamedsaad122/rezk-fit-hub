import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home, ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-full flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-6">
      <motion.div 
        className="max-w-md w-full"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="bg-gradient-card border-0 shadow-2xl text-center p-8">
          <CardContent className="space-y-6">
            {/* 404 Icon */}
            <motion.div
              className="text-8xl font-bold text-transparent bg-gradient-primary bg-clip-text"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
            >
              404
            </motion.div>

            {/* Error Message */}
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h1 className="text-2xl font-bold text-foreground">الصفحة غير موجودة</h1>
              <p className="text-muted-foreground">
                عذراً، لا يمكننا العثور على الصفحة التي تبحث عنها.
                تأكد من صحة الرابط أو عد إلى الصفحة الرئيسية.
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-3 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Button 
                asChild
                size="lg"
                className="bg-gradient-primary hover:opacity-90 text-white rounded-xl shadow-lg flex-1"
              >
                <a href="/">
                  <Home className="w-4 h-4 mr-2" />
                  العودة للرئيسية
                </a>
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="rounded-xl border-2 flex-1"
                onClick={() => window.history.back()}
              >
                <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                الصفحة السابقة
              </Button>
            </motion.div>

            {/* Helpful Links */}
            <motion.div 
              className="pt-4 border-t border-border"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <p className="text-sm text-muted-foreground mb-3">صفحات مفيدة:</p>
              <div className="flex flex-wrap justify-center gap-2 text-sm">
                <a href="/exercises" className="text-primary hover:underline">التمارين</a>
                <span className="text-muted-foreground">•</span>
                <a href="/nutrition" className="text-primary hover:underline">التغذية</a>
                <span className="text-muted-foreground">•</span>
                <a href="/dashboard" className="text-primary hover:underline">لوحة التحكم</a>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Background Elements */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-40 h-40 bg-accent/10 rounded-full blur-3xl"></div>
    </div>
  );
};

export default NotFound;
