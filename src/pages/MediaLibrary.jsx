import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Music, Maximize2, ZoomIn, ZoomOut, RotateCw, 
    Heart, Download, Grid, Play, 
    ArrowLeft, ArrowRight, RefreshCw, Sliders, X
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDocuments, useUpdateDocument } from '@/hooks/use-documents';
import { useMediaByDocumentId, useUpdateMedia } from '@/hooks/use-media';
import { getFileIcon, formatBytes } from '@/utils/file-utils';
import { getImageTransformStyle, getFilterClass } from '@/utils/image-utils';
import { downloadFile } from '@/utils/download-utils';
import SEO from "@/components/SEO";

export default function MediaLibrary() {
    // We only fetch media files: Images, Videos, Audio
    const { data: documents = [], isLoading } = useDocuments();
    const mediaFiles = documents.filter(doc => 
        ['jpg', 'jpeg', 'png', 'gif', 'svg', 'mp4', 'mov', 'webm', 'mp3', 'wav', 'ogg', 'aac'].includes(doc.extension.toLowerCase())
    );

    const updateDocMutation = useUpdateDocument();

    const [selectedDoc, setSelectedDoc] = useState(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Fetch media settings for selected document
    const { data: mediaSettings } = useMediaByDocumentId(selectedDoc?.id);
    const updateMediaMutation = useUpdateMedia();

    const handleZoomIn = () => {
        if (!mediaSettings) return;
        const nextZoom = Math.min(3, (mediaSettings.zoomLevel || 1.0) + 0.25);
        updateMediaMutation.mutate({
            id: mediaSettings.id,
            data: { zoomLevel: nextZoom }
        });
    };

    const handleZoomOut = () => {
        if (!mediaSettings) return;
        const nextZoom = Math.max(0.5, (mediaSettings.zoomLevel || 1.0) - 0.25);
        updateMediaMutation.mutate({
            id: mediaSettings.id,
            data: { zoomLevel: nextZoom }
        });
    };

    const handleRotate = () => {
        if (!mediaSettings) return;
        const nextRotation = ((mediaSettings.rotationAngle || 0) + 90) % 360;
        updateMediaMutation.mutate({
            id: mediaSettings.id,
            data: { rotationAngle: nextRotation }
        });
    };

    const handleFilterChange = (filter) => {
        if (!mediaSettings) return;
        updateMediaMutation.mutate({
            id: mediaSettings.id,
            data: { filterEffect: filter }
        });
    };

    const toggleFavorite = (doc) => {
        updateDocMutation.mutate({
            id: doc.id,
            data: { isFavorite: !doc.isFavorite }
        }, {
            onSuccess: () => {
                if (selectedDoc && selectedDoc.id === doc.id) {
                    setSelectedDoc(prev => ({ ...prev, isFavorite: !prev.isFavorite }));
                }
            }
        });
    };

    const nextMedia = () => {
        if (mediaFiles.length === 0) return;
        const idx = mediaFiles.findIndex(m => m.id === selectedDoc?.id);
        const nextIdx = (idx + 1) % mediaFiles.length;
        setSelectedDoc(mediaFiles[nextIdx]);
    };

    const prevMedia = () => {
        if (mediaFiles.length === 0) return;
        const idx = mediaFiles.findIndex(m => m.id === selectedDoc?.id);
        const prevIdx = (idx - 1 + mediaFiles.length) % mediaFiles.length;
        setSelectedDoc(mediaFiles[prevIdx]);
    };

    // Auto set first item
    React.useEffect(() => {
        if (mediaFiles.length > 0 && !selectedDoc) {
            setSelectedDoc(mediaFiles[0]);
        }
    }, [mediaFiles, selectedDoc]);

    const isImage = selectedDoc ? ['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(selectedDoc.extension.toLowerCase()) : false;
    const isVideo = selectedDoc ? ['mp4', 'mov', 'webm'].includes(selectedDoc.extension.toLowerCase()) : false;
    const isAudio = selectedDoc ? ['mp3', 'wav', 'ogg', 'aac'].includes(selectedDoc.extension.toLowerCase()) : false;

    return (
        <div className="min-h-full bg-gradient-to-br from-background via-muted/20 to-background pt-28 pb-12 px-6">
            <SEO title="مكتبة الوسائط والمعارض" />

            <div className="max-w-7xl mx-auto space-y-8 text-right rtl">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-foreground">مكتبة الوسائط والمعارض</h1>
                    <p className="text-muted-foreground mt-1">عرض الصور، الفيديوهات، والتعليمات الصوتية للمتدربين</p>
                </div>

                {isLoading ? (
                    <div className="text-center py-20 text-muted-foreground flex flex-col items-center gap-3">
                        <RefreshCw className="w-8 h-8 text-primary animate-spin" />
                        <span className="text-xs font-semibold">جاري تحميل الوسائط...</span>
                    </div>
                ) : mediaFiles.length === 0 ? (
                    <Card className="border-0 shadow-lg text-center p-16 bg-gradient-card">
                        <span className="text-6xl block mb-4">🎥</span>
                        <h3 className="font-bold text-lg text-foreground">مكتبة الوسائط فارغة</h3>
                        <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-2">
                            لم نجد أي صور أو فيديوهات أو مقاطع صوتية مضافة. قم برفع ملف وسائط من صفحة المستندات للبدء.
                        </p>
                    </Card>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Right: Active media viewer */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card className="border-0 shadow-lg bg-gradient-card overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="relative bg-zinc-950 flex items-center justify-center h-[420px] group overflow-hidden">
                                        {/* Prev / Next arrows */}
                                        <button 
                                            onClick={prevMedia}
                                            className="absolute right-4 z-20 w-9 h-9 rounded-full bg-black/40 hover:bg-black/75 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <ArrowRight className="w-5 h-5" />
                                        </button>
                                        <button 
                                            onClick={nextMedia}
                                            className="absolute left-4 z-20 w-9 h-9 rounded-full bg-black/40 hover:bg-black/75 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <ArrowLeft className="w-5 h-5" />
                                        </button>

                                        {/* Media Content renderer */}
                                        <div className="w-full h-full flex items-center justify-center p-6 select-none overflow-hidden">
                                            {isImage && selectedDoc && (
                                                <img 
                                                    src={selectedDoc.url} 
                                                    alt={selectedDoc.name} 
                                                    style={mediaSettings ? getImageTransformStyle(mediaSettings.rotationAngle, mediaSettings.zoomLevel) : {}}
                                                    className={`max-h-full max-w-full object-contain rounded-lg shadow-2xl ${mediaSettings ? getFilterClass(mediaSettings.filterEffect) : ''}`}
                                                />
                                            )}
                                            {isVideo && selectedDoc && (
                                                <video 
                                                    src={selectedDoc.url} 
                                                    controls 
                                                    className="max-h-full max-w-full rounded-lg"
                                                />
                                            )}
                                            {isAudio && selectedDoc && (
                                                <div className="flex flex-col items-center justify-center text-white space-y-4 w-full">
                                                    <span className="text-6xl animate-pulse">🎵</span>
                                                    <p className="text-xs truncate max-w-xs">{selectedDoc.name}</p>
                                                    <audio 
                                                        src={selectedDoc.url} 
                                                        controls 
                                                        className="w-full max-w-md"
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        {/* Action floating bar */}
                                        {isImage && mediaSettings && (
                                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/75 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-4 z-20 shadow-lg text-white">
                                                <button onClick={handleZoomIn} className="p-1 hover:text-primary transition-colors" title="تكبير">
                                                    <ZoomIn className="w-4 h-4" />
                                                </button>
                                                <button onClick={handleZoomOut} className="p-1 hover:text-primary transition-colors" title="تصغير">
                                                    <ZoomOut className="w-4 h-4" />
                                                </button>
                                                <button onClick={handleRotate} className="p-1 hover:text-primary transition-colors" title="تدوير">
                                                    <RotateCw className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => setIsFullscreen(true)} className="p-1 hover:text-primary transition-colors" title="ملء الشاشة">
                                                    <Maximize2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Selected media metadata */}
                                    {selectedDoc && (
                                        <div className="p-4 border-t border-border/40 space-y-3">
                                            <div className="flex justify-between items-center">
                                                <h3 className="font-bold text-sm text-foreground truncate max-w-md">{selectedDoc.name}</h3>
                                                <div className="flex gap-2">
                                                    <Button 
                                                        size="sm" 
                                                        variant="ghost" 
                                                        className={`h-8 w-8 p-0 rounded-full ${selectedDoc.isFavorite ? 'text-rose-500 hover:text-rose-600' : 'text-muted-foreground'}`}
                                                        onClick={() => toggleFavorite(selectedDoc)}
                                                    >
                                                        <Heart className={`w-4 h-4 ${selectedDoc.isFavorite ? 'fill-rose-500' : ''}`} />
                                                    </Button>
                                                    <Button 
                                                        size="sm" 
                                                        variant="ghost" 
                                                        className="h-8 w-8 p-0 rounded-full text-muted-foreground hover:text-foreground"
                                                        onClick={() => downloadFile(selectedDoc)}
                                                    >
                                                        <Download className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-2 items-center text-[10px] text-muted-foreground font-semibold">
                                                <span>حجم الملف: {formatBytes(selectedDoc.size)}</span>
                                                <span>•</span>
                                                <span>تاريخ الرفع: {new Date(selectedDoc.createdAt).toLocaleDateString('ar-EG')}</span>
                                                <span>•</span>
                                                <Badge variant="outline" className="text-[9px]">{getFileIcon(selectedDoc.extension)} {selectedDoc.extension.toUpperCase()}</Badge>
                                            </div>

                                            {/* Filters adjuster for images */}
                                            {isImage && mediaSettings && (
                                                <div className="pt-3 border-t border-border/20 flex flex-col md:flex-row md:items-center gap-3">
                                                    <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1">
                                                        <Sliders className="w-3.5 h-3.5" />
                                                        تأثيرات الفلتر البصري:
                                                    </span>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {['none', 'grayscale', 'sepia', 'invert', 'blur', 'contrast'].map(f => (
                                                            <button
                                                                key={f}
                                                                onClick={() => handleFilterChange(f)}
                                                                className={`text-[9px] px-2.5 py-1 rounded-full border transition-all font-bold ${
                                                                    mediaSettings.filterEffect === f 
                                                                        ? 'bg-primary text-primary-foreground border-primary' 
                                                                        : 'bg-muted/40 text-muted-foreground hover:bg-muted border-transparent'
                                                                }`}
                                                            >
                                                                {f === 'none' ? 'طبيعي' : f === 'grayscale' ? 'رمادي' : f === 'sepia' ? 'عتيق' : f === 'invert' ? 'معكوس' : f === 'blur' ? 'ضبابي' : 'تباين'}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Left: Media gallery lists & thumbnails */}
                        <div className="space-y-6">
                            <Card className="border-0 shadow-lg bg-gradient-card">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base font-bold flex items-center gap-2">
                                        <Grid className="w-4 h-4 text-primary" />
                                        <span>شبكة معارض الميديا</span>
                                    </CardTitle>
                                    <CardDescription>انقر على أي ملف لمعاينته والتحكم به</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-3 gap-3 max-h-[460px] overflow-y-auto pr-1">
                                        {mediaFiles.map((doc) => {
                                            const active = selectedDoc?.id === doc.id;
                                            const docIsImage = ['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(doc.extension.toLowerCase());
                                            const docIsVideo = ['mp4', 'mov', 'webm'].includes(doc.extension.toLowerCase());
                                            
                                            return (
                                                <div 
                                                    key={doc.id}
                                                    onClick={() => setSelectedDoc(doc)}
                                                    className={`aspect-square rounded-xl bg-zinc-950/80 cursor-pointer overflow-hidden border-2 transition-all relative group flex items-center justify-center ${
                                                        active ? 'border-primary scale-95 shadow-md' : 'border-transparent hover:border-muted-foreground/30'
                                                    }`}
                                                >
                                                    {docIsImage ? (
                                                        <img 
                                                            src={doc.url} 
                                                            alt={doc.name} 
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                                        />
                                                    ) : docIsVideo ? (
                                                        <div className="flex flex-col items-center justify-center text-white text-xs">
                                                            <Play className="w-5 h-5 text-primary fill-primary animate-pulse" />
                                                            <span className="text-[8px] text-muted-foreground mt-1 uppercase">{doc.extension}</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center text-white text-xs">
                                                            <Music className="w-5 h-5 text-amber-500" />
                                                            <span className="text-[8px] text-muted-foreground mt-1 uppercase">{doc.extension}</span>
                                                        </div>
                                                    )}
                                                    
                                                    {/* Hover info label */}
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-1.5">
                                                        <span className="text-[8px] text-white font-bold truncate w-full">{doc.name}</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}
            </div>

            {/* Fullscreen Overlay dialog */}
            <AnimatePresence>
                {isFullscreen && selectedDoc && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/95 z-[999] flex flex-col justify-between p-6 rtl text-right"
                    >
                        <div className="flex justify-between items-center text-white">
                            <h4 className="font-bold text-sm truncate max-w-xl">{selectedDoc.name}</h4>
                            <Button 
                                size="icon" 
                                variant="ghost" 
                                className="text-white hover:bg-white/10 rounded-full"
                                onClick={() => setIsFullscreen(false)}
                            >
                                <X className="w-6 h-6" />
                            </Button>
                        </div>

                        <div className="flex-1 flex items-center justify-center overflow-hidden">
                            {isImage && (
                                <img 
                                    src={selectedDoc.url} 
                                    alt={selectedDoc.name} 
                                    style={mediaSettings ? getImageTransformStyle(mediaSettings.rotationAngle, mediaSettings.zoomLevel) : {}}
                                    className={`max-h-[85vh] max-w-[90vw] object-contain ${mediaSettings ? getFilterClass(mediaSettings.filterEffect) : ''}`}
                                />
                            )}
                        </div>

                        {/* Fullscreen Action bar */}
                        {isImage && mediaSettings && (
                            <div className="flex justify-center items-center gap-4 bg-zinc-900/80 backdrop-blur border border-zinc-800 px-6 py-3 rounded-full mx-auto text-white shadow-xl">
                                <button onClick={handleZoomIn} className="p-1.5 hover:text-primary transition-all">
                                    <ZoomIn className="w-5 h-5" />
                                </button>
                                <button onClick={handleZoomOut} className="p-1.5 hover:text-primary transition-all">
                                    <ZoomOut className="w-5 h-5" />
                                </button>
                                <button onClick={handleRotate} className="p-1.5 hover:text-primary transition-all">
                                    <RotateCw className="w-5 h-5" />
                                </button>
                                <button onClick={() => downloadFile(selectedDoc)} className="p-1.5 hover:text-primary transition-all">
                                    <Download className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
