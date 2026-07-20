import React from 'react';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

export const ApprovalTimeline = ({ approval }) => {
    if (!approval) return null;

    const maxLevels = approval.maxLevels || 1;
    const responses = approval.responses || [];

    return (
        <div className="space-y-4 text-right text-xs">
            <h4 className="font-bold text-foreground">جدول مسار التوقيعات والاعتماد ({responses.length} / {maxLevels})</h4>
            <div className="relative border-r-2 border-border pr-4 space-y-4">
                {Array.from({ length: maxLevels }).map((_, idx) => {
                    const level = idx + 1;
                    const response = responses.find(r => r.level === level);
                    const isCurrent = approval.currentLevel === level && approval.status === 'Pending';

                    return (
                        <div key={level} className="relative pr-6">
                            {/* Bullet icon */}
                            <div className="absolute right-[-23px] top-1">
                                {response ? (
                                    response.decision === 'Approved' ? (
                                        <CheckCircle2 className="h-4 w-4 text-emerald-500 bg-background" />
                                    ) : (
                                        <XCircle className="h-4 w-4 text-red-500 bg-background" />
                                    )
                                ) : isCurrent ? (
                                    <Clock className="h-4 w-4 text-amber-500 bg-background animate-pulse" />
                                ) : (
                                    <div className="h-3 w-3 bg-muted border border-border rounded-full" />
                                )}
                            </div>

                            {/* Content */}
                            <div className="space-y-1">
                                <strong className="text-foreground">المرحلة {level}</strong>
                                {response ? (
                                    <div className="text-[10px] text-muted-foreground">
                                        <span>تم الاعتماد بواسطة: <strong className="font-mono text-foreground">{response.approver}</strong></span>
                                        <span className="block">القرار: <strong className={response.decision === 'Approved' ? 'text-emerald-500' : 'text-red-500'}>{response.decision}</strong></span>
                                        {response.comment && <span className="block bg-muted/20 p-1.5 rounded mt-1 italic">&ldquo;{response.comment}&rdquo;</span>}
                                    </div>
                                ) : isCurrent ? (
                                    <span className="text-[10px] text-amber-500 block">بانتظار موافقة المسؤول المخول...</span>
                                ) : (
                                    <span className="text-[10px] text-muted-foreground block">مرحلة معلقة</span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ApprovalTimeline;
