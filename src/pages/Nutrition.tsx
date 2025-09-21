import { motion } from "framer-motion";
import { Apple, Plus, Edit, Trash2, Search, Users, Clock, ChefHat, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";

const nutritionPlans = [
  {
    id: 1,
    name: "برنامج بناء العضلات",
    description: "نظام غذائي مصمم لزيادة الكتلة العضلية",
    duration: "12 أسبوع",
    participants: 45,
    calories: 2800,
    image: "💪",
    macros: {
      protein: { value: 35, color: "bg-red-500" },
      carbs: { value: 45, color: "bg-yellow-500" },
      fats: { value: 20, color: "bg-blue-500" }
    },
    meals: [
      { name: "الإفطار", time: "07:00", calories: 650 },
      { name: "وجبة خفيفة", time: "10:00", calories: 300 },
      { name: "الغداء", time: "13:00", calories: 800 },
      { name: "ما قبل التمرين", time: "16:00", calories: 250 },
      { name: "ما بعد التمرين", time: "18:30", calories: 400 },
      { name: "العشاء", time: "20:00", calories: 400 }
    ]
  },
  {
    id: 2,
    name: "برنامج حرق الدهون",
    description: "نظام غذائي لخسارة الوزن والحفاظ على العضلات",
    duration: "8 أسابيع",
    participants: 62,
    calories: 1800,
    image: "🔥",
    macros: {
      protein: { value: 40, color: "bg-red-500" },
      carbs: { value: 30, color: "bg-yellow-500" },
      fats: { value: 30, color: "bg-blue-500" }
    },
    meals: [
      { name: "الإفطار", time: "07:00", calories: 400 },
      { name: "وجبة خفيفة", time: "10:00", calories: 200 },
      { name: "الغداء", time: "13:00", calories: 500 },
      { name: "وجبة خفيفة", time: "16:00", calories: 150 },
      { name: "العشاء", time: "19:00", calories: 450 },
      { name: "وجبة خفيفة", time: "21:00", calories: 100 }
    ]
  },
  {
    id: 3,
    name: "برنامج الرياضيين",
    description: "تغذية متخصصة للرياضيين المحترفين",
    duration: "16 أسبوع",
    participants: 28,
    calories: 3500,
    image: "🏆",
    macros: {
      protein: { value: 30, color: "bg-red-500" },
      carbs: { value: 50, color: "bg-yellow-500" },
      fats: { value: 20, color: "bg-blue-500" }
    },
    meals: [
      { name: "الإفطار المبكر", time: "06:00", calories: 600 },
      { name: "الإفطار الثاني", time: "08:30", calories: 500 },
      { name: "وجبة خفيفة", time: "11:00", calories: 300 },
      { name: "الغداء", time: "13:30", calories: 900 },
      { name: "ما قبل التمرين", time: "15:30", calories: 400 },
      { name: "ما بعد التمرين", time: "18:00", calories: 500 },
      { name: "العشاء", time: "20:00", calories: 300 }
    ]
  },
  {
    id: 4,
    name: "برنامج الصحة العامة",
    description: "نظام متوازن للحفاظ على الصحة العامة",
    duration: "مستمر",
    participants: 89,
    calories: 2200,
    image: "🌱",
    macros: {
      protein: { value: 25, color: "bg-red-500" },
      carbs: { value: 50, color: "bg-yellow-500" },
      fats: { value: 25, color: "bg-blue-500" }
    },
    meals: [
      { name: "الإفطار", time: "07:30", calories: 500 },
      { name: "وجبة خفيفة", time: "10:30", calories: 200 },
      { name: "الغداء", time: "13:00", calories: 700 },
      { name: "وجبة خفيفة", time: "16:00", calories: 200 },
      { name: "العشاء", time: "19:30", calories: 600 }
    ]
  }
];

export default function Nutrition() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPlans = nutritionPlans.filter(plan =>
    plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-full bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Header */}
      <motion.section 
        className="py-12 px-6 bg-gradient-to-r from-accent to-green-600 text-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">الأنظمة الغذائية</h1>
              <p className="text-xl opacity-90">خطط تغذية متخصصة ومتوازنة</p>
            </div>
            
            <Button 
              size="lg"
              variant="secondary"
              className="bg-white text-accent hover:bg-white/90 px-6 py-3 rounded-xl shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              إضافة نظام غذائي
            </Button>
          </div>
        </div>
      </motion.section>

      <div className="p-6 max-w-7xl mx-auto space-y-8">
        {/* Search */}
        <motion.div 
          className="flex gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="البحث عن الأنظمة الغذائية..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 rounded-xl border-2 focus:border-accent"
            />
          </div>
        </motion.div>

        {/* Nutrition Plans Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {filteredPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="hover-lift bg-gradient-card border-0 shadow-lg h-full">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-4xl">{plan.image}</div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" className="w-8 h-8 p-0">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="w-8 h-8 p-0 text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                  <CardDescription className="text-base">
                    {plan.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-accent">{plan.calories}</div>
                      <div className="text-xs text-muted-foreground">سعرة حرارية</div>
                    </div>
                    <div className="flex items-center gap-1 justify-center">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="font-semibold">{plan.participants}</span>
                    </div>
                    <div className="flex items-center gap-1 justify-center">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{plan.duration}</span>
                    </div>
                  </div>

                  {/* Macros */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground">توزيع المغذيات الكبرى</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span>البروتين</span>
                        <span className="font-semibold">{plan.macros.protein.value}%</span>
                      </div>
                      <Progress value={plan.macros.protein.value} className="h-2" />
                      
                      <div className="flex justify-between items-center text-sm">
                        <span>الكربوهيدرات</span>
                        <span className="font-semibold">{plan.macros.carbs.value}%</span>
                      </div>
                      <Progress value={plan.macros.carbs.value} className="h-2" />
                      
                      <div className="flex justify-between items-center text-sm">
                        <span>الدهون</span>
                        <span className="font-semibold">{plan.macros.fats.value}%</span>
                      </div>
                      <Progress value={plan.macros.fats.value} className="h-2" />
                    </div>
                  </div>

                  {/* Meals Preview */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground flex items-center gap-2">
                      <ChefHat className="w-4 h-4" />
                      الوجبات اليومية
                    </h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {plan.meals.map((meal, mealIndex) => (
                        <div key={mealIndex} className="flex justify-between items-center text-sm p-2 rounded-lg bg-muted/30">
                          <div>
                            <span className="font-medium">{meal.name}</span>
                            <span className="text-muted-foreground mx-2">•</span>
                            <span className="text-muted-foreground">{meal.time}</span>
                          </div>
                          <div className="flex items-center gap-1 text-accent">
                            <Zap className="w-3 h-3" />
                            <span className="font-semibold">{meal.calories}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" className="flex-1 rounded-lg">
                      عرض التفاصيل
                    </Button>
                    <Button className="flex-1 rounded-lg bg-accent hover:bg-accent/90">
                      تحديث النظام
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredPlans.length === 0 && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-6xl mb-4">🍎</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">لا توجد أنظمة غذائية</h3>
            <p className="text-muted-foreground">جرب تغيير مصطلح البحث</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}