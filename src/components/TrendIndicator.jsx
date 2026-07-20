import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

export function TrendIndicator({ value, suffix = "%" }) {
    const numValue = Number(value) || 0;
    const isGrowth = numValue >= 0;

    return (
        <div className={`inline-flex items-center gap-1 text-[11px] font-bold font-sans px-2 py-0.5 rounded-full ${
            isGrowth 
                ? "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/20" 
                : "text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/20"
        }`}>
            {isGrowth ? (
                <TrendingUp className="w-3.5 h-3.5" />
            ) : (
                <TrendingDown className="w-3.5 h-3.5" />
            )}
            <span dir="ltr">
                {isGrowth ? "+" : ""}
                {numValue}
                {suffix}
            </span>
        </div>
    );
}

export default TrendIndicator;
