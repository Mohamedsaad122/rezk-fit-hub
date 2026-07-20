import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useReportsExports } from '@/hooks/use-reports';
import { toastService } from '@/services/toast.service';
import { FileSpreadsheet, FileCode, FileText, Download, Loader2 } from 'lucide-react';

export const ExportDialog = ({ open, onOpenChange, reportName, headers, dataRows, fields }) => {
    const [format, setFormat] = useState('csv'); // 'csv' | 'xlsx' | 'pdf'
    const [isExporting, setIsExporting] = useState(false);
    const { exportReport } = useReportsExports();

    const handleExport = async () => {
        if (!dataRows || dataRows.length === 0) {
            toastService.error('لا توجد بيانات لتصديرها');
            return;
        }

        setIsExporting(true);
        try {
            await exportReport({
                name: reportName || 'تقرير_غير_معنون',
                format,
                headers,
                dataRows,
                fields
            });
            toastService.success('تم تصدير الملف وتنزيله بنجاح');
            onOpenChange(false);
        } catch (error) {
            console.error(error);
            toastService.error('فشل في تصدير التقرير');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[420px] text-right font-sans" dir="rtl">
                <DialogHeader className="text-right">
                    <DialogTitle className="text-xl font-bold flex items-center gap-2 justify-start text-foreground">
                        <Download className="h-5 w-5 text-primary" />
                        تصدير بيانات التقرير
                    </DialogTitle>
                </DialogHeader>

                <div className="py-6 space-y-4">
                    <p className="text-sm text-muted-foreground">
                        اختر صيغة الملف المفضلة لتصدير التقرير الحالي:
                    </p>

                    <div className="grid grid-cols-3 gap-3">
                        <button
                            type="button"
                            onClick={() => setFormat('csv')}
                            className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                                format === 'csv'
                                    ? 'border-primary bg-primary/5 text-primary'
                                    : 'border-muted hover:border-muted-foreground text-muted-foreground'
                            }`}
                        >
                            <FileCode className="h-8 w-8 mb-2" />
                            <span className="text-xs font-semibold">CSV</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setFormat('xlsx')}
                            className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                                format === 'xlsx'
                                    ? 'border-primary bg-primary/5 text-primary'
                                    : 'border-muted hover:border-muted-foreground text-muted-foreground'
                            }`}
                        >
                            <FileSpreadsheet className="h-8 w-8 mb-2" />
                            <span className="text-xs font-semibold">Excel (xlsx)</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setFormat('pdf')}
                            className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                                format === 'pdf'
                                    ? 'border-primary bg-primary/5 text-primary'
                                    : 'border-muted hover:border-muted-foreground text-muted-foreground'
                            }`}
                        >
                            <FileText className="h-8 w-8 mb-2" />
                            <span className="text-xs font-semibold">PDF</span>
                        </button>
                    </div>
                </div>

                <DialogFooter className="sm:justify-start gap-2 flex-row-reverse">
                    <Button
                        type="button"
                        onClick={handleExport}
                        disabled={isExporting}
                        className="flex items-center gap-2"
                    >
                        {isExporting ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                جاري التصدير...
                            </>
                        ) : (
                            <>
                                <Download className="h-4 w-4" />
                                تصدير الملف
                            </>
                        )}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isExporting}
                    >
                        إلغاء
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ExportDialog;
