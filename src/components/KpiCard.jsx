import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendIndicator } from "@/components/TrendIndicator";

export function KpiCard({ title, value, trend, suffix = "", icon: Icon, description }) {
    return (
        <Card className="hover-lift bg-gradient-card border border-border/60 shadow-sm overflow-hidden">
            <CardContent className="p-6 space-y-4 text-right">
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <p className="text-xs font-semibold text-muted-foreground">{title}</p>
                        <h3 className="text-2xl font-black text-foreground font-sans tracking-tight">
                            {value}
                            <span className="text-sm font-bold text-muted-foreground mr-1">{suffix}</span>
                        </h3>
                    </div>
                    {Icon && (
                        <div className="p-2.5 bg-primary/10 text-primary rounded-xl shrink-0">
                            <Icon className="w-5 h-5" />
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-border/30">
                    <p className="text-[10px] text-muted-foreground truncate max-w-[150px]">{description || "مقارنة بالفترة السابقة"}</p>
                    {trend !== undefined && <TrendIndicator value={trend} />}
                </div>
            </CardContent>
        </Card>
    );
}

export default KpiCard;
