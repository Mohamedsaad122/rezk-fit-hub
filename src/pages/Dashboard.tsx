import { motion } from "framer-motion";
import { Users, TrendingUp, Calendar, Trophy, Target, Clock, Zap, Apple, Dumbbell, Activity } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const stats = [
  {
    title: "إجمالي المتدربين",
    value: "247",
    change: "+12%",
    trend: "up",
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900/30"
  },
  {
    title: "التمارين النشطة",
    value: "45",
    change: "+8%",
    trend: "up",
    icon: Dumbbell,
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900/30"
  },
  {
    title: "الأنظمة الغذائية",
    value: "28",
    change: "+5%",
    trend: "up",
    icon: Apple,
    color: "text-orange-600",
    bgColor: "bg-orange-100 dark:bg-orange-900/30"
  },
  {
    title: "معدل الإنجاز",
    value: "89%",
    change: "+3%",
    trend: "up",
    icon: Trophy,
    color: "text-purple-600",
    bgColor: "bg-purple-100 dark:bg-purple-900/30"
  }
];

const recentActivities = [
  {
    id: 1,
    type: "تمرين جديد",
    description: "تم إضافة تمرين 'تقوية عضلات الكور'",
    time: "منذ ساعتين",
    icon: Dumbbell,
    color: "text-blue-500"
  },
  {
    id: 2,
    type: "متدرب جديد",
    description: "انضمام أحمد محمد إلى البرنامج التدريبي",
    time: "منذ 3 ساعات",
    icon: Users,
    color: "text-green-500"
  },
  {
    id: 3,
    type: "نظام غذائي",
    description: "تحديث برنامج حرق الدهون",
    time: "منذ 5 ساعات",
    icon: Apple,
    color: "text-orange-500"
  },
  {
    id: 4,
    type: "إنجاز",
    description: "فاطمة أحمد حققت هدفها الشهري",
    time: "منذ يوم واحد",
    icon: Trophy,
    color: "text-purple-500"
  }
];

const monthlyProgress = [
  { month: "يناير", trainees: 180, workouts: 520, nutrition: 85 },
  { month: "فبراير", trainees: 195, workouts: 580, nutrition: 88 },
  { month: "مارس", trainees: 210, workouts: 640, nutrition: 92 },
  { month: "أبريل", trainees: 225, workouts: 720, nutrition: 95 },
  { month: "مايو", trainees: 240, workouts: 800, nutrition: 89 },
  { month: "يونيو", trainees: 247, workouts: 850, nutrition: 94 }
];

const topTrainees = [
  { name: "سارة أحمد", progress: 95, workouts: 28, streak: 15 },
  { name: "محمد علي", progress: 92, workouts: 26, streak: 12 },
  { name: "فاطمة حسن", progress: 89, workouts: 24, streak: 18 },
  { name: "أحمد خالد", progress: 87, workouts: 22, streak: 10 },
  { name: "نورا سامي", progress: 85, workouts: 25, streak: 14 }
];

export default function Dashboard() {
  return (
    <div className="min-h-full bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Header */}
      <motion.section 
        className="py-12 px-6 bg-gradient-to-r from-primary to-purple-600 text-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">لوحة التحكم</h1>
              <p className="text-xl opacity-90">نظرة شاملة على أداء النظام</p>
            </div>
            
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-sm font-medium">آخر تحديث: الآن</span>
            </div>
          </div>
        </div>
      </motion.section>

      <div className="p-6 max-w-7xl mx-auto space-y-8">
        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="hover-lift bg-gradient-card border-0 shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground mb-1">
                    {stat.value}
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-xs text-green-600 font-medium">
                      {stat.change}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      من الشهر الماضي
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Monthly Progress Chart */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-gradient-card border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  التقدم الشهري
                </CardTitle>
                <CardDescription>
                  مقارنة الأداء خلال الأشهر الستة الماضية
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {monthlyProgress.map((month, index) => (
                    <div key={month.month} className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-medium">{month.month}</span>
                        <div className="flex gap-4 text-xs text-muted-foreground">
                          <span>متدربين: {month.trainees}</span>
                          <span>تمارين: {month.workouts}</span>
                          <span>تغذية: {month.nutrition}%</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Progress 
                          value={(month.trainees / 300) * 100} 
                          className="h-2" 
                        />
                        <div className="flex justify-end text-xs text-muted-foreground">
                          {Math.round((month.trainees / 300) * 100)}% من الهدف
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="bg-gradient-card border-0 shadow-lg h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  النشاطات الأخيرة
                </CardTitle>
                <CardDescription>
                  آخر التحديثات والأنشطة
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                    >
                      <div className={`p-2 rounded-full bg-background ${activity.color}`}>
                        <activity.icon className="h-3 w-3" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          {activity.type}
                        </p>
                        <p className="text-xs text-muted-foreground mb-1">
                          {activity.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.time}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Top Trainees */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card className="bg-gradient-card border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                أفضل المتدربين هذا الشهر
              </CardTitle>
              <CardDescription>
                المتدربون الأكثر التزاماً وتميزاً في الأداء
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                {topTrainees.map((trainee, index) => (
                  <motion.div
                    key={trainee.name}
                    className="text-center space-y-3 p-4 rounded-xl bg-muted/30"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 1 + index * 0.1 }}
                  >
                    <div className="relative">
                      <div className="w-16 h-16 mx-auto rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        {index + 1}
                      </div>
                      {index < 3 && (
                        <Badge 
                          className="absolute -top-1 -right-1 w-6 h-6 rounded-full p-0 flex items-center justify-center"
                          variant={index === 0 ? "default" : "secondary"}
                        >
                          <Trophy className="w-3 h-3" />
                        </Badge>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-foreground text-sm">
                        {trainee.name}
                      </h4>
                      <div className="text-xs text-muted-foreground space-y-1 mt-2">
                        <div>تقدم: {trainee.progress}%</div>
                        <div>تمارين: {trainee.workouts}</div>
                        <div>
                          <div className="flex items-center justify-center gap-1">
                            <Zap className="w-3 h-3 text-orange-500" />
                            <span>{trainee.streak} يوم</span>
                          </div>
                        </div>
                      </div>
                      
                      <Progress 
                        value={trainee.progress} 
                        className="h-1 mt-2" 
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}