import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Search, Filter, Phone, Mail, Calendar, User, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useClients, useDeleteClient } from "@/hooks/use-clients";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import SEO from "@/components/SEO";
import ErrorState from "@/components/ErrorState";
import EmptyState from "@/components/EmptyState";
import AddEditClientDialog from "@/components/AddEditClientDialog";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";
import { useDebounce } from "@/hooks/use-debounce";

const getStatusColor = (status) => {
    switch (status) {
        case "نشط": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
        case "معلق": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
        case "منتهي": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
        default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
};

export default function Clients() {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState(null);
    
    const debouncedSearch = useDebounce(searchTerm, 300);
    const limit = 6;

    // Reset page to 1 when filters change
    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, selectedStatus]);

    const { isLoading, isError, data, refetch } = useClients({
        page,
        limit,
        search: debouncedSearch,
        status: selectedStatus || undefined
    });

    // Query active clients count separately
    const { data: activeClientsRes } = useClients({
        limit: 1,
        status: "نشط"
    });
    
    const clients = data?.data || [];
    const meta = data?.meta || { page: 1, limit, total: 0, totalPages: 1 };
    const activeClientsCount = activeClientsRes?.meta?.total || 0;

    const totalPages = data?.meta?.totalPages;

    // Handle Delete-on-Last-Page Safety
    useEffect(() => {
        if (typeof totalPages === 'number') {
            if (totalPages > 0 && page > totalPages) {
                setPage(totalPages);
            } else if (totalPages === 0 && page > 1) {
                setPage(1);
            }
        }
    }, [totalPages, page]);

    const { mutate: deleteClient, isPending: isDeletePending } = useDeleteClient();
    
    // Dialog state
    const [isAddEditOpen, setIsAddEditOpen] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    const [deletingClient, setDeletingClient] = useState(null);

    const handleAddClick = () => {
        setEditingClient(null);
        setIsAddEditOpen(true);
    };

    const handleEditClick = (e, client) => {
        e.preventDefault();
        e.stopPropagation();
        setEditingClient(client);
        setIsAddEditOpen(true);
    };

    const handleDeleteClick = (e, client) => {
        e.preventDefault();
        e.stopPropagation();
        setDeletingClient(client);
    };

    const confirmDelete = () => {
        if (deletingClient) {
            deleteClient(deletingClient.id, {
                onSuccess: () => {
                    setDeletingClient(null);
                }
            });
        }
    };

    return (
        <div className="min-h-full bg-gradient-to-br from-background via-muted/20 to-background">
            <SEO title="إدارة المتدربين" />
            
            {/* Header */}
            <motion.section
                className="pt-28 pb-12 px-6 bg-gradient-primary text-white"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="max-w-7xl ml-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">إدارة المتدربين</h1>
                        <p className="text-xl opacity-90">متابعة الاشتراكات والبرامج وتتبع مستويات التقدم</p>
                    </div>

                    <Button
                        size="lg"
                        variant="secondary"
                        onClick={handleAddClick}
                        className="bg-white text-primary hover:bg-white/90 px-6 py-3 rounded-xl shadow-lg font-semibold shrink-0"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        إضافة متدرب جديد
                    </Button>
                </div>
            </motion.section>

            <div className="p-6 max-w-7xl ml-auto space-y-8">
                {isLoading ? (
                    <div className="flex items-center justify-center min-h-[400px]">
                        <LoadingSpinner message="جاري تحميل قائمة المتدربين..." />
                    </div>
                ) : isError ? (
                    <ErrorState onRetry={refetch} />
                ) : (
                    <>
                        {/* Stats Widgets */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                            <Card className="border-0 shadow-md bg-gradient-card">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-semibold text-muted-foreground">إجمالي المتدربين</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold">{meta.total}</div>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-md bg-gradient-card">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-semibold text-muted-foreground font-sans">المتدربين النشطين</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold text-green-600 dark:text-green-400">{activeClientsCount}</div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Search and Filters */}
                        <motion.div
                            className="flex flex-col md:flex-row gap-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="البحث بالاسم، البريد الإلكتروني، أو رقم الهاتف..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 h-12 rounded-xl border-2 focus:border-primary text-right"
                                />
                            </div>

                            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                                <Button
                                    variant={selectedStatus === null ? "default" : "outline"}
                                    onClick={() => setSelectedStatus(null)}
                                    className="rounded-xl shrink-0"
                                >
                                    <Filter className="w-4 h-4 mr-2" />
                                    الكل
                                </Button>

                                <Button
                                    variant={selectedStatus === "نشط" ? "default" : "outline"}
                                    onClick={() => setSelectedStatus("نشط")}
                                    className="rounded-xl shrink-0 text-green-600 dark:text-green-400"
                                >
                                    نشط
                                </Button>

                                <Button
                                    variant={selectedStatus === "معلق" ? "default" : "outline"}
                                    onClick={() => setSelectedStatus("معلق")}
                                    className="rounded-xl shrink-0 text-yellow-600 dark:text-yellow-400"
                                >
                                    معلق
                                </Button>

                                <Button
                                    variant={selectedStatus === "منتهي" ? "default" : "outline"}
                                    onClick={() => setSelectedStatus("منتهي")}
                                    className="rounded-xl shrink-0 text-red-600 dark:text-red-400"
                                >
                                    منتهي
                                </Button>
                            </div>
                        </motion.div>

                        {/* Clients Grid */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {clients.map((client, index) => (
                                <motion.div
                                    key={client.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.4, delay: index * 0.05 }}
                                >
                                    <div className="relative group">
                                        <Link to={`/clients/${client.id}`} className="block">
                                            <Card className="hover-lift bg-gradient-card border-0 shadow-md h-full relative overflow-hidden">
                                                <CardHeader className="pb-4">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white text-2xl shadow-md">
                                                                {client.avatar || "👩"}
                                                            </div>
                                                            <div>
                                                                 <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">{client.name}</CardTitle>
                                                                <CardDescription className="text-xs">{client.goal}</CardDescription>
                                                            </div>
                                                        </div>
                                                        <div className="w-16 h-8 shrink-0"></div>
                                                    </div>
                                                </CardHeader>

                                                <CardContent className="space-y-4">
                                                    <div className="space-y-2 text-xs text-muted-foreground">
                                                        <div className="flex items-center gap-2">
                                                            <Mail className="w-3.5 h-3.5" />
                                                            <span>{client.email}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Phone className="w-3.5 h-3.5" />
                                                            <span>{client.phone}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <User className="w-3.5 h-3.5" />
                                                            <span>العمر: {client.age} سنة</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="w-3.5 h-3.5" />
                                                            <span>انضم بتاريخ: {client.joinDate}</span>
                                                        </div>
                                                    </div>

                                                    <div className="pt-2 border-t space-y-2">
                                                        <div className="flex justify-between items-center text-xs">
                                                            <span className="text-muted-foreground">الوزن الحالي vs المستهدف:</span>
                                                            <span className="font-semibold">{client.currentWeight} كجم / {client.targetWeight} كجم</span>
                                                        </div>
                                                        
                                                        <div className="space-y-1">
                                                            <div className="flex justify-between items-center text-xs">
                                                                <span>نسبة الالتزام</span>
                                                                <span className="font-semibold">{client.progress}%</span>
                                                            </div>
                                                            <Progress value={client.progress} className="h-1.5" />
                                                        </div>
                                                    </div>

                                                    <div className="flex justify-between items-center pt-2">
                                                        <Badge className={getStatusColor(client.subscriptionStatus)}>
                                                            {client.subscriptionStatus}
                                                        </Badge>
                                                        <span className="text-xs text-primary font-semibold flex items-center gap-1 group-hover:translate-x-[-4px] transition-transform">
                                                            <span>عرض التفاصيل</span>
                                                            <ArrowRight className="w-3 h-3" />
                                                        </span>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </Link>

                                        {/* Action buttons outside anchor tag to ensure W3C accessibility compliance */}
                                        <div className="absolute top-4 left-4 flex gap-1 z-10">
                                            <Button 
                                                size="sm" 
                                                variant="ghost" 
                                                onClick={(e) => handleEditClick(e, client)}
                                                className="w-8 h-8 p-0"
                                            >
                                                <Edit className="w-4 h-4 text-muted-foreground" />
                                            </Button>
                                            <Button 
                                                size="sm" 
                                                variant="ghost" 
                                                onClick={(e) => handleDeleteClick(e, client)}
                                                className="w-8 h-8 p-0 text-destructive"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        {meta.totalPages >= 1 && (
                            <div className="flex items-center justify-between border-t border-muted/50 pt-6 mt-8 flex-col sm:flex-row gap-4">
                                <div className="text-sm text-muted-foreground">
                                    عرض {clients.length} من أصل {meta.total} متدرب
                                    (صفحة {meta.page} من {meta.totalPages})
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={meta.page <= 1}
                                        aria-label="الصفحة السابقة"
                                        className="rounded-xl border-2"
                                    >
                                        السابق
                                    </Button>
                                    <span className="text-sm font-semibold px-4 py-2 bg-muted/50 rounded-xl" aria-current="page">
                                        {meta.page} / {meta.totalPages}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                                        disabled={meta.page >= meta.totalPages}
                                        aria-label="الصفحة التالية"
                                        className="rounded-xl border-2"
                                    >
                                        التالي
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Empty State */}
                        {clients.length === 0 && (
                            <EmptyState 
                                icon="👥"
                                title="لا يوجد متدربين"
                                description="جرب تعديل خيارات البحث أو الفلترة، أو قم بإضافة متدرب جديد."
                            />
                        )}
                    </>
                )}
            </div>

            {/* Add / Edit Dialog */}
            <AddEditClientDialog
                isOpen={isAddEditOpen}
                onClose={() => setIsAddEditOpen(false)}
                client={editingClient}
            />

            {/* Confirm Delete Dialog */}
            <ConfirmDeleteDialog
                isOpen={!!deletingClient}
                onClose={() => setDeletingClient(null)}
                onConfirm={confirmDelete}
                title={`حذف المتدرب ${deletingClient?.name}`}
                description={`هل أنت متأكد من رغبتك في حذف المتدرب "${deletingClient?.name}"؟ سيؤدي ذلك إلى إنهاء اشتراكه وإلغاء تخصيص الأنظمة الغذائية التابعة له.`}
                isPending={isDeletePending}
            />
        </div>
    );
}
