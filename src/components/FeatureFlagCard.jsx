import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ToggleLeft, ToggleRight, Info } from 'lucide-react';

export const FeatureFlagCard = ({ flag, onToggle }) => {
    const isActive = flag.status === 'Active';

    return (
        <Card className="border border-border">
            <CardHeader className="pb-2 text-right">
                <div className="flex items-center justify-between flex-row-reverse">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="p-0 h-auto hover:bg-transparent"
                        onClick={() => onToggle && onToggle(flag.key, { status: isActive ? 'Disabled' : 'Active' })}
                    >
                        {isActive ? (
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 flex items-center gap-1">
                                <ToggleRight className="h-4 w-4" />
                                مفعلة
                            </Badge>
                        ) : (
                            <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 flex items-center gap-1">
                                <ToggleLeft className="h-4 w-4" />
                                مغلقة
                            </Badge>
                        )}
                    </Button>
                    <CardTitle className="text-base font-bold text-foreground">{flag.label}</CardTitle>
                </div>
                <CardDescription className="text-xs mt-2 leading-relaxed">
                    {flag.description}
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
                <div className="text-[10px] text-muted-foreground flex items-center gap-1 justify-start">
                    <Info className="h-3.5 w-3.5" />
                    <span>معدل الإطلاق التدريجي: {flag.rolloutPercent}%</span>
                </div>
            </CardContent>
        </Card>
    );
};

export default FeatureFlagCard;
