import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export const ReleaseTimeline = ({ releases = [], onRollback }) => {
    return (
        <div className="space-y-4 text-right rtl">
            {releases.length === 0 ? (
                <div className="text-center py-6 text-xs text-zinc-500">لا توجد عمليات إطلاق مسجلة.</div>
            ) : (
                <div className="relative border-r border-border/60 mr-2 pr-4 space-y-4">
                    {releases.map((release, idx) => {
                        const isCanary = release.channel === 'Canary';
                        const isDeployed = release.status === 'Deployed';
                        return (
                            <div key={release.id || idx} className="relative">
                                <span className={`absolute -right-[21px] top-1.5 h-2.5 w-2.5 rounded-full ${isDeployed ? 'bg-primary' : 'bg-red-500'}`} />
                                <div className="bg-muted/10 border p-3 rounded-lg text-right space-y-2">
                                    <div className="flex justify-between items-center flex-row-reverse">
                                        <div className="flex gap-1.5 flex-row-reverse items-center">
                                            <Badge variant="outline">{release.version}</Badge>
                                            <Badge className={isCanary ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-primary/10 text-primary border-primary/20'}>
                                                {release.channel}
                                            </Badge>
                                        </div>
                                        <span className="text-[9px] text-zinc-500">{new Date(release.deployedAt || Date.now()).toLocaleDateString('ar-EG')}</span>
                                    </div>
                                    <p className="text-xs text-zinc-300">{release.description}</p>
                                    <div className="flex items-center justify-between text-[9px] text-zinc-500 pt-2 border-t border-border/20 flex-row-reverse">
                                        <span>الحالة: {release.status}</span>
                                        {isDeployed && onRollback && (
                                            <Button 
                                                size="sm" 
                                                variant="outline" 
                                                className="h-6 text-[9px] text-rose-500 border-rose-500/20 hover:bg-rose-500/10"
                                                onClick={() => onRollback(release.id)}
                                            >
                                                <RefreshCw className="h-3 w-3 ml-1" />
                                                <span>استرجاع التحديث (Rollback)</span>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ReleaseTimeline;
