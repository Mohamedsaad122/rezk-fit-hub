import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { MessageService } from "@/services/message.service";
import { useClientDetails } from "@/hooks/use-clients";
import { useExercises } from "@/hooks/use-exercises";
import { useNutrition } from "@/hooks/use-nutrition";
import { useTasks } from "@/hooks/use-tasks";
import { useDocuments, useCreateDocument, useDeleteDocument, useUpdateDocument } from "@/hooks/use-documents";
import { formatBytes, getFileIcon } from "@/utils/file-utils";
import { downloadFile } from "@/utils/download-utils";
import { simulateFileUpload } from "@/utils/upload-utils";
import { getDocumentPreviewContent } from "@/utils/document-preview";
import { usePresenceStore } from "@/store/presence.store";
import { useMessagesThread, useSendMessage } from "@/hooks/use-messages";
import { formatRelativeTime } from "@/utils/relative-time";
import { FilePlus, Eye, Heart, Trash2, Download } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { CommentEngine } from "@/components/CommentEngine";
import { ActivityTimeline } from "@/components/ActivityTimeline";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import SEO from "@/components/SEO";
import ErrorState from "@/components/ErrorState";
import EmptyState from "@/components/EmptyState";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, Mail, Calendar, User, Target, Shield, Clock, ChefHat, Zap, Dumbbell, Activity, Send } from "lucide-react";
import { useCalendar } from '@/modules/calendar/hooks/use-calendar';

const getStatusColor = (status) => {
    switch (status) {
        case "نشط": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
        case "معلق": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
        case "منتهي": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
        default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
};

function ClientMessagesTab({ clientId, clientName }) {
    const [msgText, setMsgText] = useState('');

    const { data: conversation } = useQuery({
        queryKey: ['conversations', 'client', Number(clientId)],
        queryFn: () => MessageService.getOrCreateByClient(Number(clientId), clientName)
    });

    const conversationId = conversation?.id;

    const { data: messages = [], isLoading } = useMessagesThread(conversationId);
    const sendMessageMutation = useSendMessage();

    const handleSend = (e) => {
        e.preventDefault();
        if (!msgText.trim() || sendMessageMutation.isPending) return;
        sendMessageMutation.mutate({
            conversationId,
            text: msgText
        });
        setMsgText('');
    };

    const onlineUsers = usePresenceStore((state) => state.onlineUsers);
    const typingUsers = usePresenceStore((state) => conversationId ? (state.typingUsers[conversationId] || []) : []);

    const userPresence = onlineUsers[clientId];
    const activeStatus = userPresence ? userPresence.status : (conversation ? conversation.status : 'offline');
    const activeLastSeen = userPresence ? userPresence.lastSeen : (conversation ? conversation.lastSeen : null);
    const isTyping = typingUsers.length > 0;

    const getStatusText = (statusVal) => {
        switch (statusVal) {
            case 'online': return 'نشط الآن';
            case 'away': return 'بالخارج';
            case 'busy': return 'مشغول';
            case 'offline':
            default: return activeLastSeen ? `آخر ظهور ${formatRelativeTime(activeLastSeen)}` : 'غير متصل';
        }
    };

    const getStatusColor = (statusVal) => {
        switch (statusVal) {
            case 'online': return 'bg-emerald-500';
            case 'away': return 'bg-amber-500';
            case 'busy': return 'bg-red-500';
            case 'offline':
            default: return 'bg-zinc-400';
        }
    };

    return (
        <Card className="border-0 shadow-md bg-gradient-card">
            <CardHeader className="pb-3 border-b border-border/20 flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <span>محادثة فورية مع {clientName}</span>
                    </CardTitle>
                    <div className="flex items-center gap-1.5 mt-1">
                        <span className={`w-2.5 h-2.5 rounded-full border border-card ${getStatusColor(activeStatus)}`} />
                        <span className="text-[10px] text-muted-foreground font-semibold">{getStatusText(activeStatus)}</span>
                    </div>
                </div>
                {conversation?.unreadCount > 0 && (
                    <Badge variant="destructive" className="animate-pulse text-[10px] px-2 py-0.5">
                        {conversation.unreadCount} غير مقروءة
                    </Badge>
                )}
            </CardHeader>
            <CardContent className="p-4 flex flex-col h-[400px]">
                <div className="flex-1 overflow-y-auto space-y-2 mb-4 p-2 bg-muted/20 rounded-lg max-h-[290px] scrollbar-thin">
                    {isLoading ? (
                        <div className="text-center py-10 text-xs text-muted-foreground">جاري تحميل الرسائل...</div>
                    ) : messages.length === 0 ? (
                        <div className="text-center py-10 text-xs text-muted-foreground">لا يوجد رسائل سابقة. ابدأ المحادثة الآن!</div>
                    ) : (
                        messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'Coach' ? 'justify-start' : 'justify-end'}`}>
                                <div className={`max-w-[80%] rounded-lg p-2.5 text-xs ${
                                    msg.sender === 'Coach' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
                                }`}>
                                    <p>{msg.text}</p>
                                    <span className="text-[8px] opacity-75 mt-1 block text-left">
                                        {new Date(msg.timestamp).toLocaleTimeString('ar', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}

                    {isTyping && (
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground bg-muted/40 p-2 rounded-lg max-w-[180px] animate-pulse">
                            <span className="flex gap-0.5">
                                <span className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce"></span>
                                <span className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                <span className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.4s]"></span>
                            </span>
                            <span>{clientName} يكتب...</span>
                        </div>
                    )}
                </div>

                <form onSubmit={handleSend} className="flex gap-2">
                    <input
                        type="text"
                        placeholder="اكتب رسالة سريعة..."
                        value={msgText}
                        onChange={(e) => setMsgText(e.target.value)}
                        className="flex-1 px-3 py-2 bg-muted/50 rounded-lg text-xs border focus:outline-none"
                    />
                    <button
                        type="submit"
                        disabled={!msgText.trim() || sendMessageMutation.isPending}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs flex items-center gap-1.5"
                    >
                        <Send className="w-3.5 h-3.5 rotate-180" />
                        إرسال
                    </button>
                </form>
            </CardContent>
        </Card>
    );
}

function ClientTasksTab({ clientId }) {
    const { data: tasksData, isLoading, updateTask } = useTasks({ clientId: Number(clientId) });
    const tasks = tasksData?.data || [];

    const pendingTasks = tasks.filter(t => t.status !== 'Completed' && t.status !== 'Cancelled');
    const completedTasks = tasks.filter(t => t.status === 'Completed');

    const handleCompleteToggle = async (task) => {
        const nextStatus = task.status === 'Completed' ? 'Todo' : 'Completed';
        await updateTask({ id: task.id, data: { status: nextStatus } });
    };

    if (isLoading) {
        return <div className="p-10 text-center text-xs text-muted-foreground">جاري تحميل المهام...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Task stats card */}
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted/20 border border-border/60 rounded-xl">
                    <span className="text-xs text-muted-foreground block">مهام قيد الانتظار</span>
                    <span className="text-xl font-bold text-foreground">{pendingTasks.length}</span>
                </div>
                <div className="p-4 bg-muted/20 border border-border/60 rounded-xl">
                    <span className="text-xs text-muted-foreground block">مهام مكتملة</span>
                    <span className="text-xl font-bold text-emerald-600">{completedTasks.length}</span>
                </div>
            </div>

            {/* Current Pending list */}
            <Card className="border-0 shadow-md bg-gradient-card">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base font-bold text-foreground">المهام الحالية والمتابعات المعلقة</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {pendingTasks.length === 0 ? (
                        <div className="text-center py-6 text-xs text-muted-foreground">لا توجد مهام معلقة لهذا المتدرب.</div>
                    ) : (
                        pendingTasks.map(task => (
                            <div key={task.id} className="flex items-center justify-between p-3 rounded-lg border border-border/60 bg-muted/10">
                                <div className="space-y-1">
                                    <h4 className="font-semibold text-xs text-foreground">{task.title}</h4>
                                    <p className="text-[10px] text-muted-foreground">استحقاق: {task.dueDate || 'بدون تاريخ'}</p>
                                </div>
                                <Button 
                                    onClick={() => handleCompleteToggle(task)}
                                    size="sm"
                                    className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-300 dark:hover:bg-emerald-950/40 text-[10px] h-7 px-2"
                                >
                                    إنجاز
                                </Button>
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>

            {/* Completed history */}
            <Card className="border-0 shadow-md bg-gradient-card">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base font-bold text-muted-foreground">سجل المهام المنجزة</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {completedTasks.length === 0 ? (
                        <div className="text-center py-6 text-xs text-muted-foreground">لا توجد مهام مكتملة بعد.</div>
                    ) : (
                        completedTasks.map(task => (
                            <div key={task.id} className="flex items-center justify-between p-3 rounded-lg border border-border/40 bg-muted/20 opacity-70">
                                <div className="space-y-0.5">
                                    <h4 className="font-semibold text-xs text-foreground line-through">{task.title}</h4>
                                    <p className="text-[9px] text-muted-foreground">اكتمل في: {task.completedAt ? new Date(task.completedAt).toLocaleDateString('ar-EG') : 'تم'}</p>
                                </div>
                                <Button 
                                    onClick={() => handleCompleteToggle(task)}
                                    size="sm"
                                    variant="ghost"
                                    className="text-amber-600 hover:text-amber-700 text-[10px] h-7 px-2"
                                >
                                    تراجع
                                </Button>
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

function ClientDocumentsTab({ clientId }) {
    const [subCategory, setSubCategory] = useState('All');
    const [previewDoc, setPreviewDoc] = useState(null);
    const [uploadingName, setUploadingName] = useState('');
    const [uploadProgress, setUploadProgress] = useState(null);
    const [uploadCategory, setUploadCategory] = useState('Other');

    const { data: documents = [], isLoading } = useDocuments({ clientId: Number(clientId) });
    const createMutation = useCreateDocument();
    const deleteMutation = useDeleteDocument();
    const updateMutation = useUpdateDocument();

    const handleUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingName(file.name);
        setUploadProgress(0);

        simulateFileUpload(file, (progress) => {
            setUploadProgress(progress);
        }).then((meta) => {
            createMutation.mutate({
                name: meta.name,
                url: meta.url,
                extension: meta.extension,
                size: meta.size,
                owner: 'Coach',
                category: uploadCategory,
                clientId: Number(clientId)
            }, {
                onSettled: () => {
                    setUploadProgress(null);
                    setUploadingName('');
                }
            });
        });
    };

    const toggleFavorite = (doc) => {
        updateMutation.mutate({
            id: doc.id,
            data: { isFavorite: !doc.isFavorite }
        });
    };

    // Filter local list by subCategory
    const filteredDocs = subCategory === 'All' 
        ? documents 
        : documents.filter(d => d.category === subCategory);

    return (
        <div className="space-y-6 text-right rtl">
            {/* Category selection bar */}
            <div className="flex flex-wrap gap-1.5 border-b pb-3">
                {[
                    { id: 'All', label: 'جميع الملفات' },
                    { id: 'Progress Photos', label: 'صور التقدم' },
                    { id: 'Medical Reports', label: 'تقارير طبية' },
                    { id: 'Nutrition PDFs', label: 'ملفات التغذية' },
                    { id: 'Workout PDFs', label: 'ملفات التمارين' },
                    { id: 'Measurements Files', label: 'ملفات القياسات' },
                    { id: 'Client Images', label: 'صور المتدرب' }
                ].map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setSubCategory(cat.id)}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-all font-semibold ${
                            subCategory === cat.id 
                                ? 'bg-primary text-primary-foreground border-primary' 
                                : 'bg-muted/40 text-muted-foreground hover:bg-muted border-transparent'
                        }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Direct Upload Controls */}
            <div className="p-4 bg-muted/20 border border-border/60 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs font-bold text-muted-foreground">فئة الرفع:</span>
                    <select 
                        value={uploadCategory} 
                        onChange={(e) => setUploadCategory(e.target.value)}
                        className="text-xs px-2.5 py-1.5 rounded-lg border bg-background"
                    >
                        <option value="Progress Photos">صور التقدم (Progress Photos)</option>
                        <option value="Medical Reports">تقارير طبية (Medical Reports)</option>
                        <option value="Nutrition PDFs">ملفات التغذية (Nutrition PDFs)</option>
                        <option value="Workout PDFs">ملفات التمارين (Workout PDFs)</option>
                        <option value="Measurements Files">ملفات القياسات (Measurements Files)</option>
                        <option value="Client Images">صور المتدرب (Client Images)</option>
                        <option value="Other">أخرى (Other)</option>
                    </select>
                </div>

                <label className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground hover:bg-primary/95 rounded-lg cursor-pointer text-xs font-bold transition-all shadow-sm">
                    <FilePlus className="w-4 h-4" />
                    رفع ملف مباشر
                    <input type="file" className="hidden" onChange={handleUpload} disabled={uploadProgress !== null} />
                </label>
            </div>

            {/* Upload progress indicator */}
            {uploadProgress !== null && (
                <div className="p-3 border border-primary/30 bg-primary/5 rounded-xl space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-semibold">
                        <span>جاري رفع: {uploadingName}</span>
                        <span className="text-primary">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-1" />
                </div>
            )}

            {/* Files list */}
            {isLoading ? (
                <div className="text-center py-10 text-xs text-muted-foreground">جاري تحميل ملفات المتدرب...</div>
            ) : filteredDocs.length === 0 ? (
                <Card className="border-0 shadow-md p-10 text-center bg-gradient-card">
                    <span className="text-4xl block mb-2">📁</span>
                    <p className="text-xs text-muted-foreground">لا يوجد ملفات مرفقة ضمن هذه الفئة.</p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredDocs.map(doc => (
                        <div key={doc.id} className="flex items-center justify-between p-3.5 rounded-xl border bg-card hover:shadow-md transition-all group">
                            <div className="flex items-center gap-3 min-w-0" onClick={() => setPreviewDoc(doc)}>
                                <span className="text-3xl shrink-0 cursor-pointer">{getFileIcon(doc.extension)}</span>
                                <div className="min-w-0">
                                    <h4 className="font-bold text-xs text-foreground truncate cursor-pointer hover:text-primary transition-colors" title={doc.name}>
                                        {doc.name}
                                    </h4>
                                    <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground mt-0.5 font-semibold">
                                        <span>{formatBytes(doc.size)}</span>
                                        <span>•</span>
                                        <span>{new Date(doc.createdAt).toLocaleDateString('ar-EG')}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-1">
                                <Button 
                                    size="icon" 
                                    variant="ghost" 
                                    className={`w-7 h-7 p-0 rounded-full ${doc.isFavorite ? 'text-rose-500 hover:text-rose-600' : 'text-muted-foreground'}`}
                                    onClick={() => toggleFavorite(doc)}
                                >
                                    <Heart className={`w-3.5 h-3.5 ${doc.isFavorite ? 'fill-rose-500' : ''}`} />
                                </Button>
                                <Button 
                                    size="icon" 
                                    variant="ghost" 
                                    className="w-7 h-7 p-0 rounded-full text-muted-foreground hover:text-primary"
                                    onClick={() => setPreviewDoc(doc)}
                                    title="معاينة"
                                >
                                    <Eye className="w-3.5 h-3.5" />
                                </Button>
                                <Button 
                                    size="icon" 
                                    variant="ghost" 
                                    className="w-7 h-7 p-0 rounded-full text-muted-foreground hover:text-emerald-500"
                                    onClick={() => downloadFile(doc)}
                                    title="تحميل"
                                >
                                    <Download className="w-3.5 h-3.5" />
                                </Button>
                                <Button 
                                    size="icon" 
                                    variant="ghost" 
                                    className="w-7 h-7 p-0 rounded-full text-muted-foreground hover:text-destructive"
                                    onClick={() => deleteMutation.mutate(doc.id)}
                                    title="حذف"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Inline Preview Dialog inside Client Detail Page */}
            <Dialog open={!!previewDoc} onOpenChange={(open) => !open && setPreviewDoc(null)}>
                <DialogContent className="rtl text-right max-w-3xl font-sans max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl border-0">
                    <DialogHeader className="border-b pb-2 flex flex-row items-center justify-between">
                        <DialogTitle className="text-lg font-bold text-foreground">معاينة مستند: {previewDoc?.name}</DialogTitle>
                    </DialogHeader>
                    
                    <div className="py-4">
                        {previewDoc && getDocumentPreviewContent(previewDoc)}
                    </div>

                    <DialogFooter className="flex gap-2 justify-start border-t pt-3">
                        <Button variant="outline" className="rounded-xl text-xs font-bold" onClick={() => setPreviewDoc(null)}>إغلاق</Button>
                        <Button className="rounded-xl text-xs font-bold gap-1 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => { downloadFile(previewDoc); setPreviewDoc(null); }}>
                            <Download className="w-3.5 h-3.5" />
                            تحميل الملف
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function ClientAppointmentsTab({ clientId }) {
    const { data: allEvents = [], isLoading } = useCalendar();
    
    // Scoped client appointments
    const clientEvents = allEvents.filter(e => String(e.clientId) === String(clientId));
    
    const completed = clientEvents.filter(e => e.status === 'Completed').length;
    const cancelled = clientEvents.filter(e => e.status === 'Cancelled').length;
    const missed = clientEvents.filter(e => e.status === 'Missed').length;
    const scheduled = clientEvents.filter(e => e.status === 'Scheduled' || e.status === 'In Progress').length;

    const nonCancelledTotal = clientEvents.length - cancelled;
    const attendanceRate = nonCancelledTotal > 0 ? Math.round((completed / nonCancelledTotal) * 100) : 0;

    if (isLoading) {
        return <div className="p-10 text-center text-xs text-muted-foreground">جاري تحميل المواعيد...</div>;
    }

    return (
        <div className="space-y-6 text-right rtl">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <Card className="bg-muted/10 border border-border/60 p-4 rounded-xl text-center">
                    <span className="text-xs text-muted-foreground block">إجمالي المواعيد</span>
                    <span className="text-xl font-bold text-foreground">{clientEvents.length}</span>
                </Card>
                <Card className="bg-muted/10 border border-border/60 p-4 rounded-xl text-center">
                    <span className="text-xs text-muted-foreground block text-emerald-600">نسبة الحضور والالتزام</span>
                    <span className="text-xl font-bold text-emerald-600">{attendanceRate}%</span>
                </Card>
                <Card className="bg-muted/10 border border-border/60 p-4 rounded-xl text-center">
                    <span className="text-xs text-muted-foreground block text-destructive font-sans">جلسات فائتة (Missed)</span>
                    <span className="text-xl font-bold text-destructive">{missed}</span>
                </Card>
                <Card className="bg-muted/10 border border-border/60 p-4 rounded-xl text-center">
                    <span className="text-xs text-muted-foreground block text-blue-600">مواعيد قادمة</span>
                    <span className="text-xl font-bold text-blue-600">{scheduled}</span>
                </Card>
            </div>

            <Card className="border-0 shadow-md bg-gradient-card">
                <CardHeader>
                    <CardTitle className="text-base font-bold text-foreground">سجل وجدول مواعيد المتدرب</CardTitle>
                    <CardDescription>الجدول الزمني للحصص التدريبية واللقاءات السابقة والقادمة</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {clientEvents.length === 0 ? (
                        <div className="text-center py-8 text-xs text-muted-foreground">لا توجد مواعيد مجدولة لهذا المتدرب بعد.</div>
                    ) : (
                        <div className="relative border-r-2 border-primary/20 pr-4 mr-2 space-y-6">
                            {clientEvents.map((apt) => {
                                let badgeColor = "bg-blue-100 text-blue-800";
                                if (apt.status === "Completed") badgeColor = "bg-green-100 text-green-800";
                                else if (apt.status === "Cancelled") badgeColor = "bg-red-100 text-red-800";
                                else if (apt.status === "Missed") badgeColor = "bg-amber-100 text-amber-800";
                                
                                return (
                                    <div key={apt.id} className="relative">
                                        <span className="absolute -right-[21px] top-1.5 w-2 h-2 rounded-full bg-primary border-2 border-background ring-4 ring-primary/10"></span>
                                        
                                        <div className="p-3 bg-muted/10 rounded-xl border border-border/40 space-y-1.5">
                                            <div className="flex justify-between items-start gap-2">
                                                <h4 className="font-bold text-xs text-foreground">{apt.title}</h4>
                                                <Badge className={`text-[8px] px-1.5 py-0 ${badgeColor}`}>{apt.status}</Badge>
                                            </div>
                                            <p className="text-[10px] text-muted-foreground leading-relaxed">{apt.description || 'لا يوجد وصف مضاف.'}</p>
                                            <div className="flex justify-between items-center text-[9px] text-muted-foreground pt-1 border-t border-border/20">
                                                <span>التاريخ والوقت: {apt.date} • {apt.startTime} - {apt.endTime}</span>
                                                {apt.roomId && <span>الغرفة: {apt.roomId}</span>}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default function ClientDetails() {
    const { clientId } = useParams();
    const { isLoading: isClientLoading, isError: isClientError, data: client, refetch } = useClientDetails(clientId);
    const { data: categories = [] } = useExercises();
    const { data: plansData } = useNutrition();
    const plans = plansData?.data || [];

    const [activeTab, setActiveTab] = useState("overview");

    if (isClientLoading) {
        return (
            <div className="flex items-center justify-center min-h-[500px] bg-background">
                <LoadingSpinner message="جاري تحميل بيانات المتدرب التفصيلية..." />
            </div>
        );
    }

    if (isClientError || !client) {
        return (
            <div className="p-6 max-w-4xl mx-auto pt-28">
                <ErrorState onRetry={refetch} title="عذراً، لم يتم العثور على المتدرب" message="قد يكون المعرف غير صحيح أو تم حذف المتدرب." />
            </div>
        );
    }

    // Match workout category
    const matchedCategory = categories.find(c => c.id === client.assignedCategoryId) || null;

    // Match nutrition plan
    const matchedNutritionPlan = plans.find(p => p.assignedClientId === client.id) || null;

    const weightLogs = [
        { date: "1 يونيو 2026", weight: client.currentWeight + 2.5, fat: 22 },
        { date: "15 يونيو 2026", weight: client.currentWeight + 1.2, fat: 21 },
        { date: "1 يوليو 2026", weight: client.currentWeight, fat: 19.8 }
    ];

    const recentActivities = [
        { id: 1, type: "تمارين", text: "أكمل جلسة الكارديو اليومية بنجاح", time: "منذ ساعتين", icon: Dumbbell, color: "text-blue-500" },
        { id: 2, type: "تغذية", text: "سجل وجبة الغداء الصحية (بروتين وأرز)", time: "منذ 4 ساعات", icon: ChefHat, color: "text-green-500" },
        { id: 3, type: "أداء", text: "حقق رقماً قياسياً جديداً في الجري مستمراً لمدة 35 دقيقة", time: "منذ يوم واحد", icon: Activity, color: "text-purple-500" }
    ];

    return (
        <div className="min-h-full bg-gradient-to-br from-background via-muted/20 to-background pt-28 pb-12 px-6">
            <SEO title={`ملف المتدرب - ${client.name}`} />

            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center gap-4">
                    <Link to="/clients">
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted shrink-0">
                            <ArrowRight className="w-5 h-5 text-foreground" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">ملف المتدرب التفصيلي</h1>
                        <p className="text-muted-foreground mt-1">متابعة الأداء اليومي وخطط التغذية والتدريب</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column: Personal info Summary */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="border-0 shadow-md bg-gradient-card">
                            <CardContent className="pt-8 text-center space-y-4">
                                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-primary flex items-center justify-center text-white text-4xl shadow-lg border-4 border-background">
                                    {client.avatar || "👩"}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">{client.name}</h2>
                                    <Badge className={`${getStatusColor(client.subscriptionStatus)} mt-2 px-3 py-0.5`}>
                                        {client.subscriptionStatus}
                                    </Badge>
                                </div>

                                <div className="pt-6 border-t space-y-3 text-sm text-right text-muted-foreground">
                                    <div className="flex items-center gap-3">
                                        <Mail className="w-4 h-4 text-primary shrink-0" />
                                        <span className="truncate">{client.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Phone className="w-4 h-4 text-primary shrink-0" />
                                        <span>{client.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <User className="w-4 h-4 text-primary shrink-0" />
                                        <span>العمر: {client.age || 25} سنة</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-4 h-4 text-primary shrink-0" />
                                        <span>الاشتراك: {client.subscriptionStatus}</span>
                                    </div>
                                    <div className="flex items-center gap-3 pt-2">
                                        <Target className="w-4 h-4 text-orange-500 shrink-0" />
                                        <span className="font-semibold text-foreground">الهدف: {client.goal}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-md bg-gradient-card">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-purple-500" />
                                    <span>النشاطات الأخيرة للمتدرب</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {recentActivities.map((act) => (
                                    <div key={act.id} className="flex gap-3 items-start bg-muted/20 p-2.5 rounded-xl text-xs">
                                        <div className={`p-2 rounded-full bg-background ${act.color} shrink-0`}>
                                            <act.icon className="w-3.5 h-3.5" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-foreground">{act.type}</p>
                                            <p className="text-muted-foreground mt-0.5">{act.text}</p>
                                            <span className="text-[10px] text-muted-foreground mt-1 block">{act.time}</span>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Tabbed View */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex border-b border-border/80">
                            <button
                                onClick={() => setActiveTab("overview")}
                                className={`pb-3 text-sm font-bold border-b-2 px-4 transition-colors ${
                                    activeTab === "overview" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                نظرة عامة والخطط
                            </button>
                            <button
                                onClick={() => setActiveTab("tasks")}
                                className={`pb-3 text-sm font-bold border-b-2 px-4 transition-colors ${
                                    activeTab === "tasks" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                المهام والمتابعات
                            </button>
                            <button
                                onClick={() => setActiveTab("documents")}
                                className={`pb-3 text-sm font-bold border-b-2 px-4 transition-colors ${
                                    activeTab === "documents" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                الملفات والوثائق
                            </button>
                            <button
                                onClick={() => setActiveTab("appointments")}
                                className={`pb-3 text-sm font-bold border-b-2 px-4 transition-colors ${
                                    activeTab === "appointments" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                المواعيد والجدولة
                            </button>
                            <button
                                onClick={() => setActiveTab("messages")}
                                className={`pb-3 text-sm font-bold border-b-2 px-4 transition-colors ${
                                    activeTab === "messages" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                المراسلات والرسائل
                            </button>
                            <button
                                onClick={() => setActiveTab("collaboration")}
                                className={`pb-3 text-sm font-bold border-b-2 px-4 transition-colors ${
                                    activeTab === "collaboration" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                التعليقات والتعاون
                            </button>
                        </div>

                        {activeTab === "overview" ? (
                            <div className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <Card className="border-0 shadow-md bg-gradient-card">
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                                <Target className="w-5 h-5 text-orange-500" />
                                                <span>تتبع الوزن</span>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex justify-between items-center text-center">
                                                <div>
                                                    <span className="text-xs text-muted-foreground block">الوزن الحالي</span>
                                                    <span className="text-2xl font-bold text-primary">{client.currentWeight} كجم</span>
                                                </div>
                                                <div>
                                                    <span className="text-xs text-muted-foreground block">الوزن المستهدف</span>
                                                    <span className="text-2xl font-bold text-orange-500">{client.targetWeight} كجم</span>
                                                </div>
                                                <div>
                                                    <span className="text-xs text-muted-foreground block">المتبقي</span>
                                                    <span className="text-2xl font-bold text-foreground">
                                                        {Math.abs(client.currentWeight - client.targetWeight).toFixed(1)} كجم
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-2 pt-2 border-t">
                                                <span className="text-xs font-semibold text-muted-foreground block">سجل القراءات السابقة:</span>
                                                {weightLogs.map((log, i) => (
                                                    <div key={i} className="flex justify-between text-xs p-2 rounded-lg bg-muted/40">
                                                        <span>{log.date}</span>
                                                        <span className="font-semibold text-foreground">{log.weight} كجم (دهون: {log.fat}%)</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-0 shadow-md bg-gradient-card">
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                                <Shield className="w-5 h-5 text-green-500" />
                                                <span>الالتزام والأداء</span>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <span className="text-xs text-muted-foreground block">الالتزام بالبرنامج</span>
                                                    <span className="text-3xl font-bold text-green-500">{client.progress}%</span>
                                                </div>
                                                <div className="text-left">
                                                    <span className="text-xs text-muted-foreground block">سلسلة الالتزام (Streak)</span>
                                                    <span className="text-3xl font-bold text-orange-500 flex items-center justify-end gap-1">
                                                        <Zap className="w-5 h-5 text-orange-500 animate-pulse" />
                                                        {client.streak} يوم
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <Progress value={client.progress} className="h-2" />
                                                <span className="text-[10px] text-muted-foreground text-left block">
                                                    التمارين المنجزة هذا الشهر: {client.workouts} تمرين
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {matchedCategory ? (
                                    <Card className="border-0 shadow-md bg-gradient-card">
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-lg font-bold flex items-center gap-2 text-primary">
                                                <Dumbbell className="w-5 h-5" />
                                                <span>البرنامج التدريبي المخصص</span>
                                            </CardTitle>
                                            <CardDescription>{matchedCategory.name} — {matchedCategory.description}</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid gap-3 max-h-60 overflow-y-auto">
                                                {matchedCategory.exercises.map((exercise) => (
                                                    <div key={exercise.id} className="flex justify-between items-center bg-muted/30 p-3 rounded-xl">
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-2xl">{exercise.image}</span>
                                                            <div>
                                                                <h4 className="font-bold text-sm">{exercise.name}</h4>
                                                                <p className="text-xs text-muted-foreground">{exercise.sets}</p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="w-3.5 h-3.5" />
                                                                {exercise.duration}
                                                            </span>
                                                            <Badge variant="secondary" className="px-2 py-0.5 text-[10px]">
                                                                {exercise.difficulty}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <Card className="border-0 shadow-md bg-gradient-card">
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-lg font-bold flex items-center gap-2 text-primary">
                                                <Dumbbell className="w-5 h-5" />
                                                <span>البرنامج التدريبي المخصص</span>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="pt-6">
                                            <EmptyState 
                                                icon="🏋️"
                                                title="لا يوجد برنامج تدريبي مخصص"
                                                description="لم يتم تعيين أي برنامج تدريبي لهذا المتدرب بعد."
                                            />
                                        </CardContent>
                                    </Card>
                                )}

                                {matchedNutritionPlan ? (
                                    <Card className="border-0 shadow-md bg-gradient-card">
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-lg font-bold flex items-center gap-2 text-accent">
                                                <ChefHat className="w-5 h-5 text-accent" />
                                                <span>النظام الغذائي المخصص</span>
                                            </CardTitle>
                                            <CardDescription>{matchedNutritionPlan.name} — {matchedNutritionPlan.description}</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <span className="text-xs text-muted-foreground block">السعرات المستهدفة</span>
                                                    <span className="text-2xl font-bold text-accent">{matchedNutritionPlan.calories} سعرة</span>
                                                </div>

                                                <div className="flex gap-4 text-xs text-center">
                                                    <div className="p-2 bg-red-100/40 dark:bg-red-950/20 rounded-lg">
                                                        <span className="text-[10px] block">بروتين</span>
                                                        <span className="font-bold text-red-600 dark:text-red-400">{matchedNutritionPlan.macros?.protein?.value ?? 0}%</span>
                                                    </div>
                                                    <div className="p-2 bg-yellow-100/40 dark:bg-yellow-950/20 rounded-lg">
                                                        <span className="text-[10px] block">كربوهيدرات</span>
                                                        <span className="font-bold text-yellow-600 dark:text-yellow-400">{matchedNutritionPlan.macros?.carbs?.value ?? 0}%</span>
                                                    </div>
                                                    <div className="p-2 bg-blue-100/40 dark:bg-blue-950/20 rounded-lg">
                                                        <span className="text-[10px] block">دهون</span>
                                                        <span className="font-bold text-blue-600 dark:text-blue-400">{matchedNutritionPlan.macros?.fats?.value ?? 0}%</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                                {matchedNutritionPlan.meals?.map((meal, mealIndex) => (
                                                    <div key={mealIndex} className="flex justify-between items-center text-xs p-2.5 rounded-lg bg-muted/40">
                                                        <div className="flex items-center gap-1">
                                                            <span className="font-bold text-foreground">{meal.name}</span>
                                                            <span className="text-muted-foreground">•</span>
                                                            <span>{meal.time}</span>
                                                        </div>
                                                        <span className="font-bold text-accent">{meal.calories} سعرة</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <Card className="border-0 shadow-md bg-gradient-card">
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-lg font-bold flex items-center gap-2 text-accent">
                                                <ChefHat className="w-5 h-5 text-accent" />
                                                <span>النظام الغذائي المخصص</span>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="pt-6">
                                            <EmptyState 
                                                icon="🍎"
                                                title="لا يوجد نظام غذائي مخصص"
                                                description="لم يتم تعيين أي نظام غذائي لهذا المتدرب بعد."
                                            />
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        ) : activeTab === "tasks" ? (
                            <ClientTasksTab clientId={clientId} />
                        ) : activeTab === "documents" ? (
                            <ClientDocumentsTab clientId={clientId} />
                        ) : activeTab === "appointments" ? (
                            <ClientAppointmentsTab clientId={clientId} />
                        ) : activeTab === "collaboration" ? (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-right">
                                <div className="lg:col-span-2">
                                    <CommentEngine entityType="Client" entityId={clientId} />
                                </div>
                                <div>
                                    <Card className="rounded-2xl border-border bg-card">
                                        <CardHeader className="pb-3 text-right">
                                            <CardTitle className="text-base font-bold text-foreground">الخط الزمني للنشاطات</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <ActivityTimeline entityType="Client" entityId={clientId} />
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        ) : (
                            <ClientMessagesTab clientId={clientId} clientName={client.name} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
