import { motion } from "framer-motion";
import { Dumbbell, Clock, Users, Plus, Edit, Trash2, Search, Filter } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const exerciseCategories = [
  {
    id: "gym",
    name: "تمارين الجيم",
    description: "تمارين القوة والمقاومة",
    color: "bg-blue-500",
    exercises: [
      {
        id: 1,
        name: "تمرين الصدر بالدامبل",
        duration: "45 دقيقة",
        difficulty: "متوسط",
        participants: 12,
        sets: "4 مجموعات × 12 تكرار",
        image: "💪"
      },
      {
        id: 2,
        name: "تمرين الظهر بالبار",
        duration: "50 دقيقة",
        difficulty: "متقدم",
        participants: 8,
        sets: "5 مجموعات × 10 تكرار",
        image: "🏋️"
      },
      {
        id: 3,
        name: "تمرين الأرجل السكوات",
        duration: "40 دقيقة",
        difficulty: "مبتدئ",
        participants: 15,
        sets: "3 مجموعات × 15 تكرار",
        image: "🦵"
      }
    ]
  },
  {
    id: "cardio",
    name: "تمارين الكارديو",
    description: "تمارين القلب والأوعية الدموية",
    color: "bg-red-500",
    exercises: [
      {
        id: 4,
        name: "الجري على الآلة",
        duration: "30 دقيقة",
        difficulty: "مبتدئ",
        participants: 20,
        sets: "مستمر لمدة 30 دقيقة",
        image: "🏃"
      },
      {
        id: 5,
        name: "تمرين HIIT",
        duration: "25 دقيقة",
        difficulty: "متقدم",
        participants: 10,
        sets: "8 دورات × 30 ثانية",
        image: "⚡"
      }
    ]
  },
  {
    id: "flexibility",
    name: "تمارين المرونة",
    description: "تمارين الإطالة واليوجا",
    color: "bg-green-500",
    exercises: [
      {
        id: 6,
        name: "يوجا الصباح",
        duration: "60 دقيقة",
        difficulty: "مبتدئ",
        participants: 25,
        sets: "15 وضعية مختلفة",
        image: "🧘"
      },
      {
        id: 7,
        name: "تمارين الإطالة",
        duration: "20 دقيقة",
        difficulty: "مبتدئ",
        participants: 30,
        sets: "10 تمارين إطالة",
        image: "🤸"
      }
    ]
  }
];

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "مبتدئ": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    case "متوسط": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
    case "متقدم": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
  }
};

export default function Exercises() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredCategories = exerciseCategories.filter(category =>
    selectedCategory ? category.id === selectedCategory : true
  );

  return (
    <div className="min-h-full bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Header */}
      <motion.section 
        className="py-12 px-6 bg-gradient-primary text-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">إدارة التمارين</h1>
              <p className="text-xl opacity-90">تنظيم وتصميم البرامج التدريبية</p>
            </div>
            
            <Button 
              size="lg"
              variant="secondary"
              className="bg-white text-primary hover:bg-white/90 px-6 py-3 rounded-xl shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              إضافة تمرين جديد
            </Button>
          </div>
        </div>
      </motion.section>

      <div className="p-6 max-w-7xl mx-auto space-y-8">
        {/* Search and Filters */}
        <motion.div 
          className="flex flex-col md:flex-row gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="البحث عن التمارين..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 rounded-xl border-2 focus:border-primary"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              className="rounded-xl"
            >
              <Filter className="w-4 h-4 mr-2" />
              الكل
            </Button>
            
            {exerciseCategories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className="rounded-xl"
              >
                {category.name}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Exercise Categories */}
        <div className="space-y-12">
          {filteredCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.2 }}
            >
              {/* Category Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-4 h-12 ${category.color} rounded-full`}></div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{category.name}</h2>
                  <p className="text-muted-foreground">{category.description}</p>
                </div>
                <div className="ml-auto">
                  <Badge variant="secondary" className="px-3 py-1">
                    {category.exercises.length} تمرين
                  </Badge>
                </div>
              </div>

              {/* Exercises Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.exercises
                  .filter(exercise => 
                    exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((exercise, exerciseIndex) => (
                    <motion.div
                      key={exercise.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ 
                        duration: 0.4, 
                        delay: categoryIndex * 0.2 + exerciseIndex * 0.1 
                      }}
                    >
                      <Card className="hover-lift bg-gradient-card border-0 shadow-md h-full">
                        <CardHeader className="pb-4">
                          <div className="flex items-start justify-between">
                            <div className="text-4xl mb-3">{exercise.image}</div>
                            <div className="flex gap-1">
                              <Button size="sm" variant="ghost" className="w-8 h-8 p-0">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="w-8 h-8 p-0 text-destructive">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <CardTitle className="text-xl">{exercise.name}</CardTitle>
                          <CardDescription className="text-sm">
                            {exercise.sets}
                          </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Clock className="w-4 h-4" />
                              {exercise.duration}
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Users className="w-4 h-4" />
                              {exercise.participants}
                            </div>
                          </div>

                          <div className="flex justify-between items-center">
                            <Badge className={getDifficultyColor(exercise.difficulty)}>
                              {exercise.difficulty}
                            </Badge>
                            
                            <Button size="sm" variant="outline" className="rounded-lg">
                              عرض التفاصيل
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCategories.every(cat => 
          cat.exercises.filter(ex => 
            ex.name.toLowerCase().includes(searchTerm.toLowerCase())
          ).length === 0
        ) && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">لا توجد تمارين</h3>
            <p className="text-muted-foreground">جرب تغيير مصطلح البحث أو الفلتر</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}