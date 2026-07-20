import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { GitMerge, Check, X } from 'lucide-react';

export const MergeConflictDialog = ({ isOpen, mergeRequest, onResolve }) => {
    const [selectedValues, setSelectedValues] = useState({});

    useEffect(() => {
        if (mergeRequest) {
            const initial = {};
            Object.keys(mergeRequest.mine).forEach(key => {
                initial[key] = mergeRequest.merged[key] || mergeRequest.mine[key];
            });
            setSelectedValues(initial);
        }
    }, [mergeRequest]);

    if (!mergeRequest) return null;

    const handleSelectField = (field, source) => {
        const val = source === 'mine' ? mergeRequest.mine[field] : mergeRequest.theirs[field];
        setSelectedValues(prev => ({
            ...prev,
            [field]: val
        }));
    };

    const handleAccept = () => {
        onResolve(mergeRequest.id, 'accepted', selectedValues);
    };

    const handleReject = () => {
        onResolve(mergeRequest.id, 'rejected');
    };

    const fields = Object.keys(mergeRequest.mine).filter(k => k !== 'id' && k !== 'createdAt' && k !== 'updatedAt');

    return (
        <Dialog open={isOpen} onOpenChange={() => {}}>
            <DialogContent className="max-w-3xl rounded-2xl text-right dir-rtl">
                <DialogHeader className="flex flex-row-reverse items-center justify-between border-b pb-4">
                    <DialogTitle className="text-lg font-bold flex items-center gap-2 flex-row-reverse text-red-600">
                        <GitMerge className="w-5 h-5 text-red-600" />
                        حل تعارض تعديل البيانات المتزامن
                    </DialogTitle>
                </DialogHeader>

                <div className="py-4 space-y-4">
                    <p className="text-sm text-zinc-500">
                        قام مستخدم آخر بتحديث هذا العنصر في نفس الوقت الذي قمت فيه بالتعديل. يرجى اختيار التغييرات المناسبة لدمجها:
                    </p>

                    <div className="border border-border rounded-xl overflow-hidden">
                        <div className="grid grid-cols-4 bg-muted p-3 text-xs font-bold text-muted-foreground border-b border-border text-center">
                            <div>القرار الحالي</div>
                            <div>تعديل الطرف الآخر (Theirs)</div>
                            <div>تعديلك الحالي (Mine)</div>
                            <div className="text-right">الحقل</div>
                        </div>

                        <div className="divide-y divide-border max-h-80 overflow-y-auto">
                            {fields.map(field => {
                                const isDifferent = String(mergeRequest.mine[field]) !== String(mergeRequest.theirs[field]);
                                return (
                                    <div key={field} className={`grid grid-cols-4 p-3 text-xs items-center text-center hover:bg-zinc-50/50 ${isDifferent ? 'bg-amber-500/5' : ''}`}>
                                        {/* Current Result Selection */}
                                        <div className="font-semibold text-primary">
                                            {String(selectedValues[field] ?? '')}
                                        </div>

                                        {/* Theirs */}
                                        <div>
                                            <button
                                                type="button"
                                                onClick={() => handleSelectField(field, 'theirs')}
                                                className={`px-3 py-1.5 rounded-lg border transition ${selectedValues[field] === mergeRequest.theirs[field] ? 'bg-primary text-white border-primary' : 'bg-background hover:bg-muted border-border'}`}
                                            >
                                                {String(mergeRequest.theirs[field] ?? '')}
                                            </button>
                                        </div>

                                        {/* Mine */}
                                        <div>
                                            <button
                                                type="button"
                                                onClick={() => handleSelectField(field, 'mine')}
                                                className={`px-3 py-1.5 rounded-lg border transition ${selectedValues[field] === mergeRequest.mine[field] ? 'bg-primary text-white border-primary' : 'bg-background hover:bg-muted border-border'}`}
                                            >
                                                {String(mergeRequest.mine[field] ?? '')}
                                            </button>
                                        </div>

                                        {/* Field Name */}
                                        <div className="text-right font-semibold text-zinc-600 pl-2">
                                            {field}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <DialogFooter className="flex justify-between items-center border-t pt-4">
                    <Button variant="ghost" className="text-zinc-500" onClick={handleReject}>
                        <X className="w-4 h-4 ml-1" />
                        إلغاء التعديلات
                    </Button>
                    <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={handleAccept}>
                        <Check className="w-4 h-4 ml-1" />
                        تأكيد الدمج والحفظ
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default MergeConflictDialog;
