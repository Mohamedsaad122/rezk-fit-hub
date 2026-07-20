import React, { useState } from 'react';
import { ReportBuilder } from '@/components/ReportBuilder';
import { SavedReports } from '@/components/SavedReports';
import SEO from '@/components/SEO';
import { FileBarChart2 } from 'lucide-react';

export const Reports = () => {
    const [tab, setTab] = useState('builder'); // 'builder' | 'saved'

    return (
        <div className="container mx-auto p-6 space-y-6" dir="rtl">
            <SEO title="مركز التقارير والمخرجات" description="مركز التقارير المجدولة والمخرجات الإحصائية لـ Rezk Fit Hub." />

            {/* Header banner */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-l from-primary/10 via-primary/5 to-background p-6 rounded-xl border border-primary/20 text-right">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 justify-start">
                        <FileBarChart2 className="h-6 w-6 text-primary" />
                        مركز التقارير والمخرجات الذكية
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        إعداد التقارير الإحصائية، تصدير ملفات Excel/PDF، وجدولة المخرجات التلقائية للإدارة.
                    </p>
                </div>
            </div>

            {/* Subpages toggle bar */}
            <div className="flex gap-2 bg-muted/30 p-1 rounded-lg border border-border/50 max-w-sm">
                <button
                    onClick={() => setTab('builder')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-all ${
                        tab === 'builder'
                            ? 'bg-background text-primary shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                    منشئ التقارير
                </button>
                <button
                    onClick={() => setTab('saved')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-all ${
                        tab === 'saved'
                            ? 'bg-background text-primary shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                    التقارير المحفوظة والمجدولة
                </button>
            </div>

            {/* Active section */}
            <div>
                {tab === 'builder' ? <ReportBuilder /> : <SavedReports />}
            </div>
        </div>
    );
};

export default Reports;
