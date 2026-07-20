import React from 'react';
import { Link } from 'react-router-dom';
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle,
    DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
    Calendar, 
    Clock, 
    User, 
    Tag, 
    ClipboardList,
    AlertCircle,
    Play,
    Edit3
} from "lucide-react";
import { TaskPriorityBadge } from "./TaskPriorityBadge";
import { TaskStatusBadge } from "./TaskStatusBadge";
import { TaskTimeline } from "./TaskTimeline";
import { useDocuments } from "@/hooks/use-documents";
import { getFileIcon } from "@/utils/file-utils";
import { downloadFile } from "@/utils/download-utils";
import { CommentEngine } from "./CommentEngine";
import { ActivityTimeline } from "./ActivityTimeline";


const CATEGORY_LABELS = {
    Workout: 'برنامج رياضي',
    Nutrition: 'برنامج غذائي',
    Assessment: 'تقييم بدني',
    Consultation: 'استشارة',
    'Follow Up': 'متابعة دورية',
    'Phone Call': 'مكالمة هاتفية',
    Meeting: 'اجتماع عمل',
    Administrative: 'عمل إداري',
    Reminder: 'تذكير'
};

export const TaskDetailsDialog = ({ open, onOpenChange, task, onEdit, onComplete }) => {
    const { data: attachments = [] } = useDocuments(
        task ? { taskId: task.id } : { enabled: false }
    );

    if (!task) return null;

    const formattedCategory = CATEGORY_LABELS[task.category] || task.category;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="rtl text-right sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader className="border-b border-border pb-4">
                    <div className="flex items-center gap-2 text-muted-foreground text-xs mb-2">
                        <Tag className="w-3.5 h-3.5" />
                        <span>{formattedCategory}</span>
                        <span className="w-1 h-1 rounded-full bg-muted-foreground/30"></span>
                        <span>تعيين إلى: {task.assignedTo === 'Coach' ? 'المدرب' : task.assignedTo}</span>
                    </div>
                    <DialogTitle className="text-xl font-bold text-foreground leading-tight">
                        {task.title}
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground">
                        رقم المهمة المرجعي: #{task.id}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Status & Priority Badges */}
                    <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-xs text-muted-foreground">حالة المهمة:</span>
                        <TaskStatusBadge status={task.status} />
                        <span className="text-xs text-muted-foreground mr-3">الأولوية:</span>
                        <TaskPriorityBadge priority={task.priority} />
                    </div>

                    {/* Task Description */}
                    {task.description && (
                        <div className="p-3 bg-muted/30 rounded-xl border border-border/60">
                            <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
                                {task.description}
                            </p>
                        </div>
                    )}

                    {/* Task Metadata Details Grid */}
                    <div className="grid grid-cols-2 gap-4 text-xs">
                        <div className="flex items-start gap-2 text-muted-foreground">
                            <Calendar className="w-4 h-4 text-primary shrink-0" />
                            <div>
                                <p className="font-semibold text-foreground">تاريخ البدء</p>
                                <p>{task.startDate || 'غير محدد'}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-2 text-muted-foreground">
                            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                            <div>
                                <p className="font-semibold text-foreground">تاريخ الاستحقاق</p>
                                <p>{task.dueDate || 'غير محدد'}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-2 text-muted-foreground">
                            <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                            <div>
                                <p className="font-semibold text-foreground">الوقت المقدر</p>
                                <p>{task.estimatedMinutes ? `${task.estimatedMinutes} دقيقة` : 'غير محدد'}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-2 text-muted-foreground">
                            <Play className="w-4 h-4 text-emerald-500 shrink-0" />
                            <div>
                                <p className="font-semibold text-foreground">الوقت المستغرق</p>
                                <p>{task.actualMinutes ? `${task.actualMinutes} دقيقة` : 'لا يوجد'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Associated Trainee Profile */}
                    {task.clientId && (
                        <div className="border-t border-border pt-4">
                            <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1">
                                <User className="w-3.5 h-3.5 text-primary" />
                                المتدرب المرتبط
                            </h4>
                            <div className="flex items-center justify-between p-3 rounded-lg border border-border/80 bg-background/50">
                                <div>
                                    <p className="text-sm font-bold text-foreground">معلومات المتدرب</p>
                                    <p className="text-xs text-muted-foreground">رقم المتدرب المرجعي: #{task.clientId}</p>
                                </div>
                                <Button asChild variant="outline" size="sm" className="h-8 text-xs gap-1">
                                    <Link to={`/clients/${task.clientId}`}>
                                        عرض الملف الشخصي
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Task Attachments / Files */}
                    {attachments.length > 0 && (
                        <div className="border-t border-border pt-4">
                            <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1">
                                🔗 <span>الملفات المرفقة بالمهمة ({attachments.length})</span>
                            </h4>
                            <div className="space-y-1.5">
                                {attachments.map(file => (
                                    <div key={file.id} className="flex justify-between items-center bg-muted/20 border px-3 py-2 rounded-xl text-xs">
                                        <span className="truncate max-w-[240px] font-medium" title={file.name}>
                                            {getFileIcon(file.extension)} {file.name}
                                        </span>
                                        <Button 
                                            size="sm" 
                                            variant="ghost" 
                                            className="text-primary hover:bg-primary/5 h-7 px-2 text-[10px]"
                                            onClick={() => downloadFile(file)}
                                        >
                                            تحميل
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Timeline History */}
                    <div className="border-t border-border pt-4">
                        <h4 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1">
                            <ClipboardList className="w-3.5 h-3.5 text-primary" />
                            تاريخ وسجل المهمة
                        </h4>
                        <TaskTimeline task={task} />
                    </div>

                    {/* Sprint 4.4 Collaboration Section */}
                    <div className="border-t border-border pt-4 space-y-4">
                        <h4 className="text-xs font-semibold text-foreground flex items-center gap-1">
                            💬 <span>النقاش والتعليقات المتبادلة</span>
                        </h4>
                        <CommentEngine entityType="Task" entityId={task.id} />
                    </div>

                    <div className="border-t border-border pt-4">
                        <h4 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1">
                            🕒 <span>سجل النشاطات الفورية للمهمة</span>
                        </h4>
                        <ActivityTimeline entityType="Task" entityId={task.id} />
                    </div>
                </div>

                <div className="flex gap-2 justify-end border-t border-border pt-4 mt-2">
                    {task.status !== 'Completed' && task.status !== 'Cancelled' && (
                        <Button 
                            onClick={() => {
                                onComplete && onComplete(task.id);
                                onOpenChange(false);
                            }}
                            className="bg-gradient-primary hover:opacity-90 text-white text-xs h-9 px-4 rounded-lg"
                        >
                            إنجاز المهمة
                        </Button>
                    )}
                    <Button 
                        onClick={() => {
                            onEdit && onEdit(task);
                            onOpenChange(false);
                        }}
                        variant="secondary" 
                        className="text-xs h-9 px-4 rounded-lg gap-1 border border-border"
                    >
                        <Edit3 className="w-3.5 h-3.5" />
                        تعديل البيانات
                    </Button>
                    <Button 
                        onClick={() => onOpenChange(false)}
                        variant="outline" 
                        className="text-xs h-9 px-4 rounded-lg border border-border"
                    >
                        إغلاق
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default TaskDetailsDialog;
