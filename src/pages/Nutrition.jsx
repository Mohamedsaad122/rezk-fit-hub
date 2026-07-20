import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Search, Users, Clock, ChefHat, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";
import { useNutrition, useDeleteNutrition } from "@/hooks/use-nutrition";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import SEO from "@/components/SEO";
import ErrorState from "@/components/ErrorState";
import EmptyState from "@/components/EmptyState";
import AddEditNutritionDialog from "@/components/AddEditNutritionDialog";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";
import { useDebounce } from "@/hooks/use-debounce";

export default function Nutrition() {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounce(searchTerm, 300);
    const limit = 4;

    // Reset page to 1 when search changes
    useEffect(() => {
        setPage(1);
    }, [debouncedSearch]);

    const { isLoading, isError, data, refetch } = useNutrition({
        page,
        limit,
        search: debouncedSearch
    });

    const nutritionPlans = data?.data || [];
    const meta = data?.meta || { page: 1, limit, total: 0, totalPages: 1 };

    const totalPages = data?.meta?.totalPages;

    // Handle Delete-on-Last-Page Safety
    useEffect(() => {
        if (typeof totalPages === 'number') {
            if (totalPages > 0 && page > totalPages) {
                setPage(totalPages);
            } else if (totalPages === 0 && page > 1) {
                setPage(1);
            }
        }
    }, [totalPages, page]);

    const { mutate: deletePlan, isPending: isDeletePending } = useDeleteNutrition();

    // Dialog state
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState(null);
    const [deletingPlanId, setDeletingPlanId] = useState(null);

    const handleAddClick = () => {
        setEditingPlan(null);
        setIsDialogOpen(true);
    };

    const handleEditClick = (plan) => {
        setEditingPlan(plan);
        setIsDialogOpen(true);
    };

    const handleDeleteClick = (planId) => {
        setDeletingPlanId(planId);
    };

    return (
        <div className="min-h-full bg-gradient-to-br from-background via-muted/20 to-background">
            <SEO title="الأنظمة الغذائية" />
            
            {/* Header */}
            <motion.section
                className="pt-28 pb-12 px-6 bg-gradient-to-r from-accent to-green-600 text-white"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="max-w-7xl ml-auto">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div>
                            <h1 className="text-4xl font-bold mb-2">الأنظمة الغذائية</h1>
                            <p className="text-xl opacity-90">خطط تغذية متخصصة ومتوازنة</p>
                        </div>

                        <Button
                            size="lg"
                            variant="secondary"
                            onClick={handleAddClick}
                            className="bg-white text-accent hover:bg-white/90 px-6 py-3 rounded-xl shadow-lg"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            إضافة نظام غذائي
                        </Button>
                    </div>
                </div>
            </motion.section>

            <div className="p-6 max-w-7xl ml-auto space-y-8">
                {isLoading ? (
                    <div className="flex items-center justify-center min-h-[400px]">
                        <LoadingSpinner message="جاري تحميل الأنظمة الغذائية..." />
                    </div>
                ) : isError ? (
                    <ErrorState onRetry={refetch} />
                ) : (
                    <>
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
                            {nutritionPlans.map((plan, index) => (
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
                                                    <Button 
                                                        size="sm" 
                                                        variant="ghost" 
                                                        onClick={() => handleEditClick(plan)}
                                                        className="w-8 h-8 p-0"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <Button 
                                                        size="sm" 
                                                        variant="ghost" 
                                                        onClick={() => handleDeleteClick(plan.id)}
                                                        className="w-8 h-8 p-0 text-destructive"
                                                    >
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
                                            {plan.macros && (
                                                <div className="space-y-3">
                                                    <h4 className="font-semibold text-foreground">توزيع المغذيات الكبرى</h4>
                                                    <div className="space-y-2">
                                                        <div className="flex justify-between items-center text-sm">
                                                            <span>البروتين</span>
                                                            <span className="font-semibold">{plan.macros.protein?.value ?? 0}%</span>
                                                        </div>
                                                        <Progress value={plan.macros.protein?.value ?? 0} className="h-2" />

                                                        <div className="flex justify-between items-center text-sm">
                                                            <span>الكربوهيدرات</span>
                                                            <span className="font-semibold">{plan.macros.carbs?.value ?? 0}%</span>
                                                        </div>
                                                        <Progress value={plan.macros.carbs?.value ?? 0} className="h-2" />

                                                        <div className="flex justify-between items-center text-sm">
                                                            <span>الدهون</span>
                                                            <span className="font-semibold">{plan.macros.fats?.value ?? 0}%</span>
                                                        </div>
                                                        <Progress value={plan.macros.fats?.value ?? 0} className="h-2" />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Meals Preview */}
                                            {plan.meals && plan.meals.length > 0 && (
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
                                            )}

                                            <div className="flex gap-2 pt-2">
                                                <Button variant="outline" className="flex-1 rounded-lg">
                                                    عرض التفاصيل
                                                </Button>
                                                <Button 
                                                    onClick={() => handleEditClick(plan)}
                                                    className="flex-1 rounded-lg bg-accent hover:bg-accent/90"
                                                >
                                                    تحديث النظام
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        {meta.totalPages >= 1 && (
                            <div className="flex items-center justify-between border-t border-muted/50 pt-6 mt-8 flex-col sm:flex-row gap-4">
                                <div className="text-sm text-muted-foreground">
                                    عرض {nutritionPlans.length} من أصل {meta.total} نظام
                                    (صفحة {meta.page} من {meta.totalPages})
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={meta.page <= 1}
                                        aria-label="الصفحة السابقة"
                                        className="rounded-xl border-2"
                                    >
                                        السابق
                                    </Button>
                                    <span className="text-sm font-semibold px-4 py-2 bg-muted/50 rounded-xl" aria-current="page">
                                        {meta.page} / {meta.totalPages}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                                        disabled={meta.page >= meta.totalPages}
                                        aria-label="الصفحة التالية"
                                        className="rounded-xl border-2"
                                    >
                                        التالي
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Empty State */}
                        {nutritionPlans.length === 0 && (
                            <EmptyState 
                                icon="🍎"
                                title="لا توجد أنظمة غذائية"
                                description="جرب تغيير مصطلح البحث للعثور على خطة التغذية المطلوبة."
                            />
                        )}
                    </>
                )}
            </div>

            {/* Add / Edit Dialog */}
            <AddEditNutritionDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                plan={editingPlan}
            />

            {/* Confirm Delete Dialog */}
            <ConfirmDeleteDialog
                isOpen={!!deletingPlanId}
                onClose={() => setDeletingPlanId(null)}
                onConfirm={() => {
                    if (deletingPlanId) {
                        deletePlan(deletingPlanId, {
                            onSuccess: () => {
                                setDeletingPlanId(null);
                            }
                        });
                    }
                }}
                title="حذف النظام الغذائي"
                description="هل أنت متأكد من رغبتك في حذف هذا النظام الغذائي؟ لا يمكن التراجع عن هذا الإجراء."
                isPending={isDeletePending}
            />
        </div>
    );
}
