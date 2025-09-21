import { motion } from "framer-motion";
import { Dumbbell, Trophy, Users, Star, ArrowRight, Play, Calendar, Target, Apple } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const stats = [
  { icon: Users, label: "المتدربين", value: "150+", color: "text-primary" },
  { icon: Trophy, label: "الإنجازات", value: "85%", color: "text-accent" },
  { icon: Calendar, label: "سنوات الخبرة", value: "8+", color: "text-orange-500" },
  { icon: Target, label: "الأهداف المحققة", value: "200+", color: "text-purple-500" },
];

const features = [
  {
    icon: Dumbbell,
    title: "تمارين متخصصة",
    description: "برامج تدريبية مصممة خصيصاً لكل متدرب حسب أهدافه ومستوى لياقته",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: Apple,
    title: "أنظمة غذائية",
    description: "خطط تغذية متوازنة ومدروسة علمياً لتحقيق أفضل النتائج",
    gradient: "from-green-500 to-emerald-500"
  },
  {
    icon: Target,
    title: "متابعة مستمرة",
    description: "تتبع دقيق للتقدم مع تحليل شامل للنتائج والإنجازات",
    gradient: "from-purple-500 to-pink-500"
  },
];

export default function Home() {
  return (
    <div className="min-h-full bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-6">
        <motion.div 
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <Badge variant="secondary" className="mb-4 text-sm px-4 py-2">
                    <Star className="w-4 h-4 mr-2" />
                    مدرب معتمد ومتخصص
                  </Badge>
                </motion.div>
                
                <h1 className="text-6xl font-bold text-transparent bg-gradient-hero bg-clip-text leading-tight">
                  Rezk Naser
                </h1>
                
                <h2 className="text-3xl font-semibold text-secondary">
                  خبير التدريب الشخصي
                </h2>
                
                <p className="text-xl text-muted-foreground leading-relaxed">
                  أساعدك في تحقيق أهدافك في اللياقة البدنية من خلال برامج تدريبية متخصصة 
                  وأنظمة غذائية مصممة خصيصاً لك. معاً نحو حياة أكثر صحة ونشاط.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  className="bg-gradient-primary hover:opacity-90 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-glow transition-all duration-300"
                >
                  <Play className="w-5 h-5 mr-2" />
                  ابدأ رحلتك الآن
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  className="px-8 py-6 text-lg rounded-xl border-2 hover:bg-muted/50 transition-all duration-300"
                >
                  تعرف على خدماتي
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </motion.div>

            {/* Hero Image/Stats */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="relative bg-gradient-card rounded-3xl p-8 shadow-2xl">
                <div className="grid grid-cols-2 gap-6">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      className="text-center space-y-3"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                    >
                      <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-primary flex items-center justify-center shadow-lg`}>
                        <stat.icon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <div className={`text-3xl font-bold ${stat.color}`}>
                          {stat.value}
                        </div>
                        <div className="text-sm text-muted-foreground font-medium">
                          {stat.label}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Background Elements */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-card/30">
        <motion.div 
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center space-y-4 mb-16">
            <h3 className="text-4xl font-bold text-foreground">خدماتي المتخصصة</h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              حلول شاملة ومتكاملة لتحقيق أهدافك في اللياقة البدنية والصحة العامة
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover-lift bg-gradient-card border-0 shadow-md">
                  <CardHeader className="text-center pb-6">
                    <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center shadow-lg mb-4`}>
                      <feature.icon className="w-10 h-10 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Card className="bg-gradient-primary text-white border-0 shadow-2xl">
            <CardContent className="p-12">
              <div className="space-y-6">
                <h3 className="text-4xl font-bold">هل أنت مستعد للتغيير؟</h3>
                <p className="text-xl opacity-90 max-w-2xl mx-auto">
                  انضم لمئات المتدربين الذين حققوا أهدافهم في اللياقة البدنية معي. 
                  ابدأ رحلتك نحو حياة أكثر صحة ونشاط اليوم.
                </p>
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="px-12 py-6 text-lg rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  احجز استشارتك المجانية
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>
    </div>
  );
}