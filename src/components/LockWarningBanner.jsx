import React from 'react';
import { Lock, Unlock } from 'lucide-react';
import { Button } from './ui/button';

export const LockWarningBanner = ({ lockData, isLockedByOther, forceUnlock }) => {
    if (!isLockedByOther) return null;

    return (
        <div className="bg-red-500/10 border border-red-500/20 text-red-700 px-4 py-3 rounded-xl flex items-center justify-between gap-3 mb-4 text-right animate-in fade-in">
            <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500/10 text-red-600">
                    <Lock className="w-4 h-4" />
                </div>
                <div>
                    <span className="font-bold block text-sm">
                        يتم تعديل هذا العنصر بواسطة مستخدم آخر
                    </span>
                    <span className="text-xs text-zinc-500">
                        المستخدم الحالي: <strong>{lockData.lockedBy}</strong> ({lockData.lockedByAvatar || '👤'}).
                        تم قفل الحفظ مؤقتاً لتجنب تضارب التعديلات.
                        {lockData.remainingTime !== undefined && (
                            <span className="mr-1 text-red-600 font-semibold">
                                (تنتهي الصلاحية خلال {lockData.remainingTime} ثانية)
                            </span>
                        )}
                    </span>
                </div>
            </div>
            {forceUnlock && (
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-lg border-red-500/30 hover:bg-red-500/10 text-red-600 text-xs flex items-center gap-1.5"
                    onClick={forceUnlock}
                >
                    <Unlock className="w-3.5 h-3.5" />
                    تجاوز القفل
                </Button>
            )}
        </div>
    );
};

export default LockWarningBanner;
