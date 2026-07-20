import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Search, Grid, List, Download, Eye, Trash2, Heart, 
    Archive, MoreVertical, Edit2, Share2, Plus, RefreshCw, FolderSync 
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
    Dialog, DialogContent, DialogDescription, DialogFooter, 
    DialogHeader, DialogTitle 
} from "@/components/ui/dialog";
import { 
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
    DropdownMenuSeparator, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { useDocuments, useCreateDocument, useUpdateDocument, useDeleteDocument, useDuplicateDocument, useStorageUsage } from '@/hooks/use-documents';
import { useClients } from '@/hooks/use-clients';
import { formatBytes, getFileIcon, getFileTypeLabel } from '@/utils/file-utils';
import { getDocumentPreviewContent } from '@/utils/document-preview';
import { downloadFile } from '@/utils/download-utils';
import { simulateFileUpload } from '@/utils/upload-utils';
import SEO from "@/components/SEO";
import { useEntityLock } from '@/hooks/use-collaboration';
import { LockWarningBanner } from '@/components/LockWarningBanner';
import { CommentEngine } from '@/components/CommentEngine';
import { ActivityTimeline } from '@/components/ActivityTimeline';

export default function Documents() {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const owner = 'All';
    const [isFavorite, setIsFavorite] = useState(undefined);
    const [isArchived, setIsArchived] = useState(false);
    const [clientId, setClientId] = useState(null);
    const [sortBy, setSortBy] = useState('Newest');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

    // Mutations and Queries
    const { data: documents = [], isLoading } = useDocuments({
        search, category, owner, isFavorite, isArchived, clientId, sortBy
    });
    const { data: storage } = useStorageUsage();
    const { data: clientsRes } = useClients();
    const clients = clientsRes?.data || [];

    const uploadMutation = useCreateDocument();
    const updateMutation = useUpdateDocument();
    const deleteMutation = useDeleteDocument();
    const duplicateMutation = useDuplicateDocument();

    // Local dialog states
    const [previewDoc, setPreviewDoc] = useState(null);
    const [renameDoc, setRenameDoc] = useState(null);
    const [newName, setNewName] = useState('');
    const [shareDoc, setShareDoc] = useState(null);
    const [selectedClientId, setSelectedClientId] = useState('none');

    const { lockData, isLockedByOther, forceUnlock } = useEntityLock(
        'Document',
        renameDoc?.id,
        !!renameDoc,
        'الكوتش أحمد',
        '👨‍و'
    );
    
    // Upload local states
    const [uploadProgress, setUploadProgress] = useState(null);
    const [uploadingName, setUploadingName] = useState('');

    const handleUploadClick = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingName(file.name);
        setUploadProgress(0);

        simulateFileUpload(file, (progress) => {
            setUploadProgress(progress);
        }).then((meta) => {
            uploadMutation.mutate({
                name: meta.name,
                url: meta.url,
                extension: meta.extension,
                size: meta.size,
                owner: 'Coach',
                category: category === 'All' ? 'Other' : category,
                clientId: clientId ? Number(clientId) : null
            }, {
                onSettled: () => {
                    setUploadProgress(null);
                    setUploadingName('');
                }
            });
        });
    };

    const handleRename = () => {
        if (!newName.trim() || !renameDoc) return;
        
        let formattedName = newName.trim();
        if (!formattedName.endsWith(`.${renameDoc.extension}`)) {
            formattedName += `.${renameDoc.extension}`;
        }

        updateMutation.mutate({
            id: renameDoc.id,
            data: { name: formattedName }
        }, {
            onSuccess: () => {
                setRenameDoc(null);
                setNewName('');
            }
        });
    };

    const handleShare = () => {
        if (!shareDoc) return;
        const targetClientId = selectedClientId === 'none' ? null : Number(selectedClientId);
        updateMutation.mutate({
            id: shareDoc.id,
            data: { clientId: targetClientId }
        }, {
            onSuccess: () => {
                setShareDoc(null);
                setSelectedClientId('none');
            }
        });
    };

    const toggleFavorite = (doc) => {
        updateMutation.mutate({
            id: doc.id,
            data: { isFavorite: !doc.isFavorite }
        });
    };

    const toggleArchive = (doc) => {
        updateMutation.mutate({
            id: doc.id,
            data: { isArchived: !doc.isArchived }
        });
    };

    const storagePercent = storage ? Math.min(100, Math.round((storage.used / storage.limit) * 100)) : 0;

    return (
        <div className="min-h-full bg-gradient-to-br from-background via-muted/20 to-background pt-28 pb-12 px-6">
            <SEO title="إدارة الملفات والوثائق" />

            <div className="max-w-7xl mx-auto space-y-8 text-right rtl">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">إدارة الملفات والوثائق</h1>
                        <p className="text-muted-foreground mt-1">تخزين، معاينة، ومشاركة التقارير والخطط مع المتدربين</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl cursor-pointer shadow-md text-xs font-bold transition-all">
                            <Plus className="w-4 h-4" />
                            <span>رفع مستند جديد</span>
                            <input 
                                type="file" 
                                className="hidden" 
                                onChange={handleUploadClick} 
                                disabled={uploadProgress !== null}
                            />
                        </label>
                    </div>
                </div>

                {/* Storage usage summary */}
                <Card className="border-0 shadow-md bg-gradient-card">
                    <CardContent className="py-6">
                        <div className="grid md:grid-cols-4 gap-6 items-center">
                            <div className="md:col-span-1 space-y-2">
                                <span className="text-xs text-muted-foreground font-semibold block">المساحة التخزينية المستخدمة</span>
                                <span className="text-2xl font-bold text-primary block">
                                    {storage ? formatBytes(storage.used) : '0 Bytes'} / {storage ? formatBytes(storage.limit) : '5 GB'}
                                </span>
                                <Progress value={storagePercent} className="h-2 bg-muted" />
                                <span className="text-[10px] text-muted-foreground block">{storagePercent}% مستنفذ من السعة الإجمالية</span>
                            </div>

                            <div className="md:col-span-3 grid grid-cols-3 md:grid-cols-6 gap-4 text-center">
                                <div className="p-3 bg-muted/30 rounded-xl space-y-1">
                                    <span className="text-[10px] text-muted-foreground block font-bold">الصور</span>
                                    <span className="text-xs font-bold text-foreground block">{storage ? formatBytes(storage.breakdown.images) : '0 B'}</span>
                                </div>
                                <div className="p-3 bg-muted/30 rounded-xl space-y-1">
                                    <span className="text-[10px] text-muted-foreground block font-bold">PDF</span>
                                    <span className="text-xs font-bold text-foreground block">{storage ? formatBytes(storage.breakdown.pdf) : '0 B'}</span>
                                </div>
                                <div className="p-3 bg-muted/30 rounded-xl space-y-1">
                                    <span className="text-[10px] text-muted-foreground block font-bold">المستندات</span>
                                    <span className="text-xs font-bold text-foreground block">{storage ? formatBytes(storage.breakdown.documents) : '0 B'}</span>
                                </div>
                                <div className="p-3 bg-muted/30 rounded-xl space-y-1">
                                    <span className="text-[10px] text-muted-foreground block font-bold">الفيديوهات</span>
                                    <span className="text-xs font-bold text-foreground block">{storage ? formatBytes(storage.breakdown.videos) : '0 B'}</span>
                                </div>
                                <div className="p-3 bg-muted/30 rounded-xl space-y-1">
                                    <span className="text-[10px] text-muted-foreground block font-bold">الصوتيات</span>
                                    <span className="text-xs font-bold text-foreground block">{storage ? formatBytes(storage.breakdown.audio) : '0 B'}</span>
                                </div>
                                <div className="p-3 bg-muted/30 rounded-xl space-y-1">
                                    <span className="text-[10px] text-muted-foreground block font-bold">أخرى</span>
                                    <span className="text-xs font-bold text-foreground block">{storage ? formatBytes(storage.breakdown.other) : '0 B'}</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Uploading progress card */}
                {uploadProgress !== null && (
                    <Card className="border border-primary/40 bg-primary/5 animate-pulse">
                        <CardContent className="py-4 flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="flex items-center gap-3">
                                <RefreshCw className="w-5 h-5 text-primary animate-spin shrink-0" />
                                <div>
                                    <span className="text-xs font-bold block">جاري رفع الملف: {uploadingName}</span>
                                    <span className="text-[10px] text-muted-foreground">الرجاء الانتظار حتى اكتمال المعالجة والرفع...</span>
                                </div>
                            </div>
                            <div className="w-full md:w-48 space-y-1">
                                <Progress value={uploadProgress} className="h-1.5 bg-muted" />
                                <span className="text-[9px] text-primary font-bold float-left">{uploadProgress}%</span>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Filters Bar */}
                <Card className="border-0 shadow-md bg-gradient-card">
                    <CardContent className="py-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {/* Search */}
                            <div className="relative md:col-span-2">
                                <Search className="w-4 h-4 text-muted-foreground absolute top-3 right-3" />
                                <Input 
                                    placeholder="ابحث باسم الملف، الوسوم، المالك..." 
                                    className="pr-9 rounded-xl border-2 focus-visible:ring-primary text-xs"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>

                            {/* Category */}
                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger className="rounded-xl border-2 text-xs font-semibold">
                                    <SelectValue placeholder="الفئة" />
                                </SelectTrigger>
                                <SelectContent className="text-xs font-medium">
                                    <SelectItem value="All">جميع الفئات</SelectItem>
                                    <SelectItem value="Medical Reports">التقارير الطبية</SelectItem>
                                    <SelectItem value="Nutrition PDFs">ملفات التغذية</SelectItem>
                                    <SelectItem value="Workout PDFs">ملفات التمارين</SelectItem>
                                    <SelectItem value="Measurements Files">ملفات القياسات</SelectItem>
                                    <SelectItem value="Progress Photos">صور التقدم</SelectItem>
                                    <SelectItem value="Images">الصور العامة</SelectItem>
                                    <SelectItem value="Videos">الفيديوهات</SelectItem>
                                    <SelectItem value="Audio">الملفات الصوتية</SelectItem>
                                    <SelectItem value="Other">ملفات أخرى</SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Client */}
                            <Select value={clientId === null ? 'all' : String(clientId)} onValueChange={(val) => setClientId(val === 'all' ? null : Number(val))}>
                                <SelectTrigger className="rounded-xl border-2 text-xs font-semibold">
                                    <SelectValue placeholder="المتدرب" />
                                </SelectTrigger>
                                <SelectContent className="text-xs font-medium">
                                    <SelectItem value="all">جميع المتدربين</SelectItem>
                                    {clients.map(c => (
                                        <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Sort By */}
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="rounded-xl border-2 text-xs font-semibold">
                                    <SelectValue placeholder="ترتيب حسب" />
                                </SelectTrigger>
                                <SelectContent className="text-xs font-medium">
                                    <SelectItem value="Newest">الأحدث رفعاً</SelectItem>
                                    <SelectItem value="Name">الاسم هجائياً</SelectItem>
                                    <SelectItem value="Size">حجم الملف</SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Favorites / Archives toggles */}
                            <div className="flex gap-2">
                                <Button 
                                    variant={isFavorite ? "default" : "outline"} 
                                    className="rounded-xl flex-1 border-2 text-xs h-9 px-2 gap-1"
                                    onClick={() => setIsFavorite(prev => prev === true ? undefined : true)}
                                >
                                    <Heart className="w-3.5 h-3.5" />
                                    <span>المفضلة</span>
                                </Button>

                                <Button 
                                    variant={isArchived ? "default" : "outline"} 
                                    className="rounded-xl flex-1 border-2 text-xs h-9 px-2 gap-1"
                                    onClick={() => setIsArchived(prev => !prev)}
                                >
                                    <Archive className="w-3.5 h-3.5" />
                                    <span>الأرشيف</span>
                                </Button>
                            </div>
                        </div>

                        {/* View toggle & details info */}
                        <div className="flex justify-between items-center pt-2 border-t text-xs">
                            <span className="text-muted-foreground font-semibold">
                                تم العثور على <span className="text-primary font-bold">{documents.length}</span> مستند
                            </span>

                            <div className="flex items-center gap-1.5">
                                <Button 
                                    size="icon" 
                                    variant={viewMode === 'grid' ? 'default' : 'ghost'} 
                                    className="w-8 h-8 rounded-lg"
                                    onClick={() => setViewMode('grid')}
                                >
                                    <Grid className="w-4 h-4" />
                                </Button>
                                <Button 
                                    size="icon" 
                                    variant={viewMode === 'list' ? 'default' : 'ghost'} 
                                    className="w-8 h-8 rounded-lg"
                                    onClick={() => setViewMode('list')}
                                >
                                    <List className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Grid / List render content */}
                {isLoading ? (
                    <div className="text-center py-20 text-muted-foreground flex flex-col items-center gap-3">
                        <RefreshCw className="w-8 h-8 text-primary animate-spin" />
                        <span className="text-xs font-semibold">جاري جلب الملفات...</span>
                    </div>
                ) : documents.length === 0 ? (
                    <Card className="border-0 shadow-lg text-center p-16 bg-gradient-card">
                        <span className="text-6xl block mb-4">📂</span>
                        <h3 className="font-bold text-lg text-foreground">لا يوجد مستندات مطابقة</h3>
                        <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-2">
                            لم نجد أي ملفات مطابقة للفلاتر النشطة. يمكنك تعديل خيارات البحث أو رفع مستند جديد لتسجيله.
                        </p>
                    </Card>
                ) : viewMode === 'grid' ? (
                    /* Grid Layout */
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {documents.map((doc) => {
                            const clientOwner = clients.find(c => c.id === doc.clientId);
                            return (
                                <motion.div 
                                    key={doc.id}
                                    layout
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="group bg-card border rounded-2xl p-4 shadow-sm hover:shadow-md hover-lift transition-all relative flex flex-col justify-between min-h-[190px]"
                                >
                                    {/* Top favorite & category metadata */}
                                    <div className="flex justify-between items-start">
                                        <Badge variant="secondary" className="px-2 py-0.5 text-[9px] font-semibold bg-muted/40 text-muted-foreground">
                                            {getFileTypeLabel(doc.extension)}
                                        </Badge>
                                        <div className="flex items-center gap-1">
                                            <Button 
                                                size="icon" 
                                                variant="ghost" 
                                                className={`w-7 h-7 p-0 rounded-full hover:bg-muted ${doc.isFavorite ? 'text-rose-500 hover:text-rose-600' : 'text-muted-foreground hover:text-foreground'}`}
                                                onClick={() => toggleFavorite(doc)}
                                            >
                                                <Heart className={`w-4 h-4 ${doc.isFavorite ? 'fill-rose-500' : ''}`} />
                                            </Button>
                                            
                                            {/* Dropdown Menu actions */}
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button size="icon" variant="ghost" className="w-7 h-7 p-0 rounded-full hover:bg-muted">
                                                        <MoreVertical className="w-4 h-4 text-muted-foreground" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="text-right rtl text-xs font-semibold">
                                                    <DropdownMenuItem onClick={() => setPreviewDoc(doc)} className="flex items-center justify-end gap-2 cursor-pointer">
                                                        <span>معاينة الملف</span>
                                                        <Eye className="w-3.5 h-3.5 text-blue-500" />
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => downloadFile(doc)} className="flex items-center justify-end gap-2 cursor-pointer">
                                                        <span>تحميل الملف</span>
                                                        <Download className="w-3.5 h-3.5 text-emerald-500" />
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => { setRenameDoc(doc); setNewName(doc.name); }} className="flex items-center justify-end gap-2 cursor-pointer">
                                                        <span>إعادة التسمية</span>
                                                        <Edit2 className="w-3.5 h-3.5 text-amber-500" />
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => duplicateMutation.mutate(doc.id)} className="flex items-center justify-end gap-2 cursor-pointer">
                                                        <span>تكرار الملف</span>
                                                        <FolderSync className="w-3.5 h-3.5 text-purple-500" />
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => { setShareDoc(doc); setSelectedClientId(doc.clientId ? String(doc.clientId) : 'none'); }} className="flex items-center justify-end gap-2 cursor-pointer">
                                                        <span>مشاركة وتعيين متدرب</span>
                                                        <Share2 className="w-3.5 h-3.5 text-primary" />
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => toggleArchive(doc)} className="flex items-center justify-end gap-2 cursor-pointer">
                                                        <span>{doc.isArchived ? 'إلغاء الأرشفة' : 'أرشفة الملف'}</span>
                                                        <Archive className="w-3.5 h-3.5 text-zinc-500" />
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => deleteMutation.mutate(doc.id)} className="flex items-center justify-end gap-2 cursor-pointer text-destructive hover:bg-destructive/10">
                                                        <span>حذف نهائي</span>
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>

                                    {/* Icon & File name details */}
                                    <div className="my-3 flex items-center gap-3 cursor-pointer" onClick={() => setPreviewDoc(doc)}>
                                        <span className="text-4xl filter drop-shadow">{getFileIcon(doc.extension)}</span>
                                        <div className="min-w-0 flex-1">
                                            <h4 className="font-bold text-xs text-foreground truncate group-hover:text-primary transition-colors" title={doc.name}>
                                                {doc.name}
                                            </h4>
                                            <span className="text-[10px] text-muted-foreground block mt-0.5">{formatBytes(doc.size)}</span>
                                        </div>
                                    </div>

                                    {/* Bottom client binding and owner */}
                                    <div className="pt-2 border-t flex justify-between items-center text-[10px] text-muted-foreground font-semibold">
                                        <span>بواسطة: {doc.owner === 'Coach' ? 'الكوتش أحمد' : 'المتدرب'}</span>
                                        {clientOwner ? (
                                            <Badge variant="outline" className="text-[9px] max-w-[120px] truncate">
                                                👤 {clientOwner.name}
                                            </Badge>
                                        ) : (
                                            <span className="text-[9px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-md">ملف عام</span>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    /* List Layout */
                    <Card className="border-0 shadow-md bg-gradient-card">
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-right border-collapse text-xs">
                                    <thead>
                                        <tr className="border-b bg-muted/30 text-muted-foreground">
                                            <th className="p-3">اسم المستند</th>
                                            <th className="p-3">الفئة</th>
                                            <th className="p-3">الحجم</th>
                                            <th className="p-3">المالك</th>
                                            <th className="p-3">المتدرب</th>
                                            <th className="p-3">تاريخ الرفع</th>
                                            <th className="p-3 text-center">الإجراءات</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {documents.map((doc) => {
                                            const clientOwner = clients.find(c => c.id === doc.clientId);
                                            return (
                                                <tr key={doc.id} className="border-b hover:bg-muted/15 transition-colors group">
                                                    <td className="p-3 font-semibold text-foreground flex items-center gap-2">
                                                        <span className="text-xl shrink-0">{getFileIcon(doc.extension)}</span>
                                                        <span className="truncate max-w-[200px] hover:text-primary cursor-pointer" onClick={() => setPreviewDoc(doc)}>
                                                            {doc.name}
                                                        </span>
                                                        {doc.isFavorite && <Heart className="w-3 h-3 text-rose-500 fill-rose-500 shrink-0" />}
                                                    </td>
                                                    <td className="p-3 text-muted-foreground">{getFileTypeLabel(doc.extension)}</td>
                                                    <td className="p-3 font-medium text-foreground">{formatBytes(doc.size)}</td>
                                                    <td className="p-3 text-muted-foreground">{doc.owner === 'Coach' ? 'الكوتش أحمد' : 'المتدرب'}</td>
                                                    <td className="p-3">
                                                        {clientOwner ? (
                                                            <Badge variant="outline" className="text-[10px]">{clientOwner.name}</Badge>
                                                        ) : (
                                                            <span className="text-muted-foreground italic">ملف عام</span>
                                                        )}
                                                    </td>
                                                    <td className="p-3 text-muted-foreground">{new Date(doc.createdAt).toLocaleDateString('ar-EG')}</td>
                                                    <td className="p-3 text-center">
                                                        <div className="flex items-center justify-center gap-1.5">
                                                            <Button size="icon" variant="ghost" className="w-7 h-7 rounded-lg text-muted-foreground hover:text-primary" onClick={() => setPreviewDoc(doc)} title="معاينة">
                                                                <Eye className="w-3.5 h-3.5" />
                                                            </Button>
                                                            <Button size="icon" variant="ghost" className="w-7 h-7 rounded-lg text-muted-foreground hover:text-emerald-500" onClick={() => downloadFile(doc)} title="تحميل">
                                                                <Download className="w-3.5 h-3.5" />
                                                            </Button>
                                                            <Button size="icon" variant="ghost" className="w-7 h-7 rounded-lg text-muted-foreground hover:text-rose-500" onClick={() => toggleFavorite(doc)} title="تفضيل">
                                                                <Heart className={`w-3.5 h-3.5 ${doc.isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
                                                            </Button>
                                                            
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button size="icon" variant="ghost" className="w-7 h-7 rounded-lg text-muted-foreground hover:text-foreground">
                                                                        <MoreVertical className="w-3.5 h-3.5" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end" className="text-right rtl text-xs font-semibold">
                                                                    <DropdownMenuItem onClick={() => { setRenameDoc(doc); setNewName(doc.name); }} className="flex items-center justify-end gap-2 cursor-pointer">
                                                                        <span>إعادة التسمية</span>
                                                                        <Edit2 className="w-3.5 h-3.5 text-amber-500" />
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={() => duplicateMutation.mutate(doc.id)} className="flex items-center justify-end gap-2 cursor-pointer">
                                                                        <span>تكرار الملف</span>
                                                                        <FolderSync className="w-3.5 h-3.5 text-purple-500" />
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={() => { setShareDoc(doc); setSelectedClientId(doc.clientId ? String(doc.clientId) : 'none'); }} className="flex items-center justify-end gap-2 cursor-pointer">
                                                                        <span>مشاركة مع متدرب</span>
                                                                        <Share2 className="w-3.5 h-3.5 text-primary" />
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={() => toggleArchive(doc)} className="flex items-center justify-end gap-2 cursor-pointer">
                                                                        <span>{doc.isArchived ? 'إلغاء الأرشفة' : 'أرشفة المستند'}</span>
                                                                        <Archive className="w-3.5 h-3.5 text-zinc-500" />
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem onClick={() => deleteMutation.mutate(doc.id)} className="flex items-center justify-end gap-2 cursor-pointer text-destructive hover:bg-destructive/10">
                                                                        <span>حذف نهائي</span>
                                                                        <Trash2 className="w-3.5 h-3.5" />
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Dialogs */}

            {/* 1. Preview Dialog */}
            <Dialog open={!!previewDoc} onOpenChange={(open) => !open && setPreviewDoc(null)}>
                <DialogContent className="rtl text-right max-w-3xl font-sans max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl border-0">
                    <DialogHeader className="border-b pb-2 flex flex-row items-center justify-between">
                        <DialogTitle className="text-lg font-bold text-foreground">معاينة مستند: {previewDoc?.name}</DialogTitle>
                    </DialogHeader>
                    
                    <div className="py-4">
                        {previewDoc && getDocumentPreviewContent(previewDoc)}
                    </div>

                    {/* Sprint 4.4 Document Collaboration: Comments & Timelines */}
                    {previewDoc && (
                        <div className="border-t pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h4 className="text-sm font-bold text-foreground flex items-center gap-1">
                                    💬 <span>النقاش والتعليقات</span>
                                </h4>
                                <CommentEngine entityType="Document" entityId={previewDoc.id} />
                            </div>
                            <div className="space-y-4 border-r pr-4">
                                <h4 className="text-sm font-bold text-foreground flex items-center gap-1">
                                    🕒 <span>سجل النشاطات الفورية للمستند</span>
                                </h4>
                                <ActivityTimeline entityType="Document" entityId={previewDoc.id} />
                            </div>
                        </div>
                    )}

                    <DialogFooter className="flex gap-2 justify-start border-t pt-3 mt-4">
                        <Button variant="outline" className="rounded-xl text-xs font-bold" onClick={() => setPreviewDoc(null)}>إغلاق</Button>
                        <Button className="rounded-xl text-xs font-bold gap-1 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => { downloadFile(previewDoc); setPreviewDoc(null); }}>
                            <Download className="w-3.5 h-3.5" />
                            تحميل الملف
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* 2. Rename Dialog */}
            <Dialog open={!!renameDoc} onOpenChange={(open) => !open && setRenameDoc(null)}>
                <DialogContent className="rtl text-right max-w-md font-sans rounded-2xl shadow-xl border-0">
                    <DialogHeader className="border-b pb-2">
                        <DialogTitle className="text-base font-bold text-foreground">إعادة تسمية المستند</DialogTitle>
                        <DialogDescription className="text-xs">يرجى كتابة اسم الملف الجديد. سيتم المحافظة على لاحقة الملف تلقائياً.</DialogDescription>
                    </DialogHeader>
                    
                    {renameDoc && (
                        <LockWarningBanner
                            lockData={lockData}
                            isLockedByOther={isLockedByOther}
                            forceUnlock={forceUnlock}
                        />
                    )}

                    <div className="py-4 space-y-2">
                        <Input 
                            value={newName} 
                            onChange={(e) => setNewName(e.target.value)} 
                            placeholder="الاسم الجديد للمستند..." 
                            className="rounded-xl border-2 text-xs"
                            disabled={isLockedByOther}
                        />
                    </div>

                    <DialogFooter className="flex gap-2 justify-start border-t pt-3">
                        <Button variant="outline" className="rounded-xl text-xs font-bold" onClick={() => setRenameDoc(null)}>إلغاء</Button>
                        <Button 
                            className="rounded-xl text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/95" 
                            onClick={handleRename}
                            disabled={isLockedByOther}
                        >
                            تحديث الاسم
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* 3. Share & Assign Client Dialog */}
            <Dialog open={!!shareDoc} onOpenChange={(open) => !open && setShareDoc(null)}>
                <DialogContent className="rtl text-right max-w-md font-sans rounded-2xl shadow-xl border-0">
                    <DialogHeader className="border-b pb-2">
                        <DialogTitle className="text-base font-bold text-foreground">مشاركة الملف وتعيين متدرب</DialogTitle>
                        <DialogDescription className="text-xs">سيتمكن المتدرب المحدد من الوصول إلى هذا الملف ومعاينته من حسابه الخاص.</DialogDescription>
                    </DialogHeader>
                    
                    <div className="py-4 space-y-2">
                        <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                            <SelectTrigger className="rounded-xl border-2 text-xs font-semibold">
                                <SelectValue placeholder="اختر المتدرب لمشاركة الملف..." />
                            </SelectTrigger>
                            <SelectContent className="text-xs font-medium">
                                <SelectItem value="none">ملف عام (لا يتبع لأي متدرب)</SelectItem>
                                {clients.map(c => (
                                    <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter className="flex gap-2 justify-start border-t pt-3">
                        <Button variant="outline" className="rounded-xl text-xs font-bold" onClick={() => setShareDoc(null)}>إلغاء</Button>
                        <Button className="rounded-xl text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/95" onClick={handleShare}>تأكيد المشاركة</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
