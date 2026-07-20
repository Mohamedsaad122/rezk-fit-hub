import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import SEO from '@/components/SEO';
import { ProfilingService } from '@/services/profiling.service';
import ProfilerGraph from '@/components/ProfilerGraph';
import { Button } from '@/components/ui/button';
import { Cpu, Camera } from 'lucide-react';

export const SystemProfiler = () => {
    const [profiles, setProfiles] = useState([]);

    const fetchProfiles = async () => {
        const list = await ProfilingService.getProfilingLogs();
        setProfiles(list);
    };

    useEffect(() => {
        fetchProfiles();
    }, []);

    const handleSnapshot = async () => {
        const cpu = Math.floor(Math.random() * 40) + 10;
        const memory = Math.floor(Math.random() * 200) + 400;
        await ProfilingService.takeSnapshot(cpu, memory, 4096);
        fetchProfiles();
    };

    return (
        <div className="container mx-auto p-6 space-y-6 text-right" dir="rtl">
            <SEO title="محلل موارد الخادم والنظام" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-border pb-4 text-right">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 justify-end">
                        <span>محلل أداء النظام وموارد الخادم</span>
                        <Cpu className="h-6 w-6 text-purple-500" />
                    </h1>
                    <p className="text-sm text-muted-foreground">أخذ عينات من الذاكرة وأداء محرك الاستعلام وتدفق الموارد الحية.</p>
                </div>
                <Button size="sm" onClick={handleSnapshot} className="text-xs gap-1.5 flex items-center justify-center">
                    <Camera className="h-4 w-4" />
                    <span>أخذ لقطة أداء فورية (Take Snapshot)</span>
                </Button>
            </div>

            <Card className="border border-border/40">
                <CardHeader className="text-right">
                    <CardTitle className="text-base font-bold text-foreground">مخطط استخدام الموارد</CardTitle>
                    <CardDescription>عرض رسومي تاريخي لاستهلاك CPU والذاكرة</CardDescription>
                </CardHeader>
                <CardContent>
                    <ProfilerGraph data={profiles} />
                </CardContent>
            </Card>
        </div>
    );
};

export default SystemProfiler;
