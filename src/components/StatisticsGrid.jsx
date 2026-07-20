import React from "react";
import { 
    Users, 
    UserCheck, 
    UserX, 
    Calendar, 
    CheckSquare, 
    Clock, 
    AlertTriangle, 
    Zap, 
    Apple, 
    Heart, 
    Award, 
    Flame 
} from "lucide-react";
import { KpiCard } from "@/components/KpiCard";

export function StatisticsGrid({ kpis = {}, trends = {} }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            <KpiCard
                title="إجمالي المشتركين"
                value={kpis.totalClients || 0}
                trend={trends.totalClients}
                icon={Users}
                description="إجمالي المتدربين المسجلين"
            />
            <KpiCard
                title="المشتركين النشطين"
                value={kpis.activeClients || 0}
                trend={trends.activeClients}
                icon={UserCheck}
                description="اشتراكات سارية العمل"
            />
            <KpiCard
                title="المشتركين غير النشطين"
                value={kpis.inactiveClients || 0}
                trend={trends.totalClients ? -trends.totalClients : undefined}
                icon={UserX}
                description="اشتراكات منتهية الصلاحية"
            />
            <KpiCard
                title="اللقاءات والمواعيد"
                value={kpis.appointments || 0}
                trend={trends.appointments}
                icon={Calendar}
                description="إجمالي الجلسات المجدولة"
            />
            <KpiCard
                title="المهام المكتملة"
                value={kpis.completedTasks || 0}
                trend={trends.completedTasks}
                icon={CheckSquare}
                description="المتابعات المنجزة بنجاح"
            />
            <KpiCard
                title="المهام المعلقة"
                value={kpis.pendingTasks || 0}
                trend={trends.completedTasks ? -trends.completedTasks : undefined}
                icon={Clock}
                description="مهام قيد الانتظار حالياً"
            />
            <KpiCard
                title="جلسات ملغاة"
                value={kpis.cancelledAppointments || 0}
                icon={AlertTriangle}
                description="جلسات تم إلغاؤها"
            />
            <KpiCard
                title="الالتزام بالتمارين"
                value={kpis.workoutCompletion || 0}
                trend={trends.workoutCompletion}
                suffix="%"
                icon={Zap}
                description="معدل إكمال التمارين"
            />
            <KpiCard
                title="الالتزام بالتغذية"
                value={kpis.nutritionCompliance || 0}
                trend={trends.nutritionCompliance}
                suffix="%"
                icon={Apple}
                description="معدل تطبيق النظام الغذائي"
            />
            <KpiCard
                title="معدل الاستبقاء"
                value={kpis.retentionRate || 0}
                trend={trends.retentionRate}
                suffix="%"
                icon={Heart}
                description="نسبة الاحتفاظ بالمتدربين"
            />
            <KpiCard
                title="معدل أداء الكوتشز"
                value={kpis.coachProductivity || 0}
                trend={trends.completedTasks}
                icon={Award}
                description="متوسط إنجاز المهام الأسبوعية"
            />
            <KpiCard
                title="متوسط السعرات"
                value={kpis.averageCalories || 0}
                suffix="سعرة"
                icon={Flame}
                description="متوسط الاستهلاك اليومي"
            />
        </div>
    );
}

export default StatisticsGrid;
