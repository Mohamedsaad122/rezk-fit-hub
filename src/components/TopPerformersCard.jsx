import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Users, Sparkles, Dumbbell, Apple } from "lucide-react";

export function TopPerformersCard({ topPerformers = {} }) {
    const [activeTab, setActiveTab] = useState("clients");

    const tabs = [
        { id: "clients", label: "أفضل المتدربين", icon: Users, data: topPerformers.topClients || [] },
        { id: "coaches", label: "أفضل المدربين", icon: Award, data: topPerformers.topCoaches || [] },
        { id: "workouts", label: "البرامج التدريبية", icon: Dumbbell, data: topPerformers.bestWorkoutPrograms || [] },
        { id: "diets", label: "الخطط الغذائية", icon: Apple, data: topPerformers.bestNutritionPlans || [] }
    ];

    const currentTab = tabs.find(t => t.id === activeTab) || tabs[0];

    return (
        <Card className="border-0 shadow-md bg-gradient-card">
            <CardHeader className="text-right pb-2">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-base font-bold text-foreground">قوائم الصدارة والتميز</CardTitle>
                        <CardDescription className="text-xs text-muted-foreground">التصنيف الأعلى التزاماً وأداءً بالنظام</CardDescription>
                    </div>
                    <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
                </div>
            </CardHeader>
            <CardContent className="pt-2">
                {/* Tab selectors */}
                <div className="flex gap-1.5 border-b border-border/60 pb-3 overflow-x-auto text-xs shrink-0 select-none">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isSelected = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-semibold transition-all ${
                                    isSelected 
                                        ? "bg-primary text-white border-primary shadow-sm" 
                                        : "bg-muted/30 text-muted-foreground border-border/80 hover:bg-muted/50 hover:text-foreground"
                                }`}
                            >
                                <Icon className="w-3.5 h-3.5" />
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Listing content */}
                <div className="mt-4 space-y-3 min-h-[160px]">
                    {currentTab.data.length === 0 ? (
                        <div className="text-center py-10 text-xs text-muted-foreground">لا توجد بيانات متاحة حالياً.</div>
                    ) : (
                        currentTab.data.map((item, index) => (
                            <div 
                                key={item.id} 
                                className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-muted/10"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs font-sans">
                                        #{index + 1}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-xs text-foreground">{item.name}</h4>
                                        {item.detail && <p className="text-[10px] text-muted-foreground mt-0.5">{item.detail}</p>}
                                    </div>
                                </div>
                                <Badge className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300 border-0 text-xs font-sans">
                                    {item.score}
                                </Badge>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export default TopPerformersCard;
