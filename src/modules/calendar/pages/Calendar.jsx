import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, CheckCircle2, AlertTriangle, Sparkles, Sidebar, ClipboardList } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCalendar } from '../hooks/use-calendar';
import { useCalendarView, useCalendarDnD } from '../hooks/use-calendar-view';
import { generateWeekDays } from '../utils/calendar-utils';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorState } from '@/components/ErrorState';
import SEO from '@/components/SEO';
import { useTasks } from '@/hooks/use-tasks';
import { TaskDetailsDialog } from '@/components/TaskDetailsDialog';
import { TaskService } from '@/services/task.service';
import { useQueryClient } from '@tanstack/react-query';
import { useCalendarPresenceStore } from '@/store/calendar-presence.store';

// UI Components
import CalendarHeader from '../components/CalendarHeader';
import CalendarViewSwitcher from '../components/CalendarViewSwitcher';
import CalendarLegend from '../components/CalendarLegend';
import CalendarMiniCalendar from '../components/CalendarMiniCalendar';
import AppointmentFilters from '../components/AppointmentFilters';

// View Components
import CalendarMonthView from '../components/CalendarMonthView';
import CalendarWeekGrid from '../components/CalendarWeekView';
import CalendarDayView from '../components/CalendarDayView';
import CalendarAgendaView from '../components/CalendarAgendaView';

// Modals
import AppointmentDetailsDialog from '../components/AppointmentDetailsDialog';
import AddEditAppointmentDialog from '../components/AddEditAppointmentDialog';
import DeleteAppointmentDialog from '../components/DeleteAppointmentDialog';

export default function Calendar() {
    const todayStr = "2026-07-13"; // Seed date context
    const queryClient = useQueryClient();

    const viewers = useCalendarPresenceStore(state => state.viewers);
    const cursors = useCalendarPresenceStore(state => state.cursors);

    const {
        currentView,
        selectedDate,
        collapsedPanels,
        setView,
        togglePanels
    } = useCalendarView();

    const [filters, setFilters] = useState({
        search: '',
        status: '',
        type: '',
        clientId: '',
        sortBy: 'Start Time'
    });

    // Dialog trigger states
    const [inspectingApt, setInspectingApt] = useState(null);
    const [editingApt, setEditingApt] = useState(null);
    const [deletingApt, setDeletingApt] = useState(null);

    const [isAddEditOpen, setIsAddEditOpen] = useState(false);
    const [isInspectOpen, setIsInspectOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDuplicate, setIsDuplicate] = useState(false);

    // Tasks state
    const [inspectingTask, setInspectingTask] = useState(null);
    const [isTaskDetailsOpen, setIsTaskDetailsOpen] = useState(false);

    // Responsive breakpoint switcher: force Agenda default view mode on mobile screens
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setView('Agenda');
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [setView]);

    // Build scoped query parameters based on view selections to fetch minimal required chunk dataset
    const getQueryOptions = () => {
        const options = { ...filters };
        if (currentView === 'Day') {
            options.date = selectedDate;
        } else if (currentView === 'Week') {
            const days = generateWeekDays(selectedDate);
            options.startDate = days[0];
            options.endDate = days[6];
        } else if (currentView === 'Month') {
            options.month = selectedDate.slice(0, 7);
        }
        return options;
    };

    // 1. Fetch scoped appointments matching active view dates
    const { 
        isLoading, 
        isError, 
        data: appointments = [], 
        refetch: refetchAppointments 
    } = useCalendar(getQueryOptions());

    // 2. Fetch all events separately to compute metrics summary card counts
    const { data: allEvents = [], refetch: refetchAll } = useCalendar();

    // 3. Fetch all tasks to display deadlines in left panel
    const { data: tasksData, refetch: refetchTasks } = useTasks({ limit: 100 });
    const tasksList = tasksData?.data || [];
    const pendingTasksWithDueDate = tasksList.filter(t => t.status !== 'Completed' && t.status !== 'Cancelled' && t.dueDate);

    const refetchAllQueries = () => {
        refetchAppointments();
        refetchAll();
        refetchTasks();
    };

    const { moveEvent, resizeEvent } = useCalendarDnD(allEvents);

    const todayFormatted = new Date(todayStr).toLocaleDateString('ar-EG', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });

    // --- Summary Metrics Calculations ---
    const weekStart = "2026-07-12";
    const weekEnd = "2026-07-18";
    const weekCount = allEvents.filter(e => e.date >= weekStart && e.date <= weekEnd).length;

    const metrics = {
        total: allEvents.length,
        scheduled: allEvents.filter(e => e.status === 'Scheduled').length,
        completed: allEvents.filter(e => e.status === 'Completed').length,
        cancelled: allEvents.filter(e => e.status === 'Cancelled').length
    };
    
    const completionRate = metrics.total > 0
        ? Math.round((metrics.completed / (metrics.total - metrics.cancelled || 1)) * 100)
        : 0;

    // --- Action Triggers ---
    const handleInspect = (apt) => {
        setInspectingApt(apt);
        setIsInspectOpen(true);
    };

    const handleEdit = (apt) => {
        setEditingApt(apt);
        setIsDuplicate(false);
        setIsAddEditOpen(true);
    };

    const handleDuplicate = (apt) => {
        setEditingApt(apt);
        setIsDuplicate(true);
        setIsAddEditOpen(true);
    };

    const handleDelete = (apt) => {
        setDeletingApt(apt);
        setIsDeleteOpen(true);
    };

    const handleEmptyCellClick = (date) => {
        setEditingApt({ date, startTime: '09:00', endTime: '10:00' });
        setIsDuplicate(false);
        setIsAddEditOpen(true);
    };

    const handleEmptySlotClick = (date, time) => {
        const parseTime = (t) => {
            if (!t) return 0;
            const [h, m] = t.split(':').map(Number);
            return h * 60 + m;
        };
        const formatTime = (minutes) => {
            const h = Math.floor(minutes / 60).toString().padStart(2, '0');
            const m = (minutes % 60).toString().padStart(2, '0');
            return `${h}:${m}`;
        };
        const endMinutes = parseTime(time) + 60;
        setEditingApt({ date, startTime: time, endTime: formatTime(endMinutes) });
        setIsDuplicate(false);
        setIsAddEditOpen(true);
    };

    const handleAddClick = () => {
        setEditingApt(null);
        setIsDuplicate(false);
        setIsAddEditOpen(true);
    };

    const handleTaskComplete = async (taskId) => {
        await TaskService.updateTask(taskId, { status: 'Completed' });
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
        refetchTasks();
    };

    return (
        <div className="min-h-full bg-gradient-to-br from-background via-muted/20 to-background rtl text-right">
            <SEO title="التقويم الاحترافي وجدول المواعيد" />

            {/* Banner Header */}
            <motion.section
                className="pt-28 pb-12 px-6 bg-gradient-to-r from-primary to-purple-600 text-white shadow-md relative overflow-hidden"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative z-10">
                    <div>
                        <h1 className="text-4xl font-bold mb-2 font-sans">التقويم والجدولة التفاعلية</h1>
                        <p className="text-lg opacity-90 font-sans">تصفح المواعيد بنظام يومي، أسبوعي أو شهري مع ميزات السحب والإفلات</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 flex flex-col items-start md:items-end border border-white/10">
                        <span className="text-xs opacity-75 mb-1 font-sans">اليوم الحالي</span>
                        <span className="text-lg font-bold font-sans">{todayFormatted}</span>
                    </div>
                </div>
                <div className="absolute inset-0 bg-grid-white/5 mask-gradient-to-b"></div>
            </motion.section>

            <div className="p-6 max-w-7xl mx-auto space-y-6">
                {/* Summary Metrics Row */}
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <Card className="hover-lift bg-gradient-card border border-border/60 shadow-sm">
                        <CardContent className="pt-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-xs text-muted-foreground font-sans font-semibold">جلسات اليوم</p>
                                    <h3 className="text-3xl font-bold mt-2 text-foreground font-sans">{allEvents.filter(e => e.date === todayStr).length}</h3>
                                </div>
                                <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500">
                                    <CalendarIcon className="w-5 h-5" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover-lift bg-gradient-card border border-border/60 shadow-sm">
                        <CardContent className="pt-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-xs text-muted-foreground font-sans font-semibold">جلسات هذا الأسبوع</p>
                                    <h3 className="text-3xl font-bold mt-2 text-foreground font-sans">{weekCount}</h3>
                                </div>
                                <div className="p-2 bg-purple-500/10 rounded-xl text-purple-500">
                                    <Clock className="w-5 h-5" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover-lift bg-gradient-card border border-border/60 shadow-sm">
                        <CardContent className="pt-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-xs text-muted-foreground font-sans font-semibold text-green-600">المكتملة</p>
                                    <h3 className="text-3xl font-bold mt-2 text-green-600 font-sans">{metrics.completed}</h3>
                                </div>
                                <div className="p-2 bg-green-500/10 rounded-xl text-green-500">
                                    <CheckCircle2 className="w-5 h-5" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover-lift bg-gradient-card border border-border/60 shadow-sm">
                        <CardContent className="pt-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-xs text-muted-foreground font-sans font-semibold text-destructive">الملغاة</p>
                                    <h3 className="text-3xl font-bold mt-2 text-destructive font-sans">{metrics.cancelled}</h3>
                                </div>
                                <div className="p-2 bg-destructive/10 rounded-xl text-destructive">
                                    <AlertTriangle className="w-5 h-5" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover-lift bg-gradient-card border border-border/60 shadow-sm">
                        <CardContent className="pt-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-xs text-muted-foreground font-sans font-semibold text-primary">نسبة الإكمال</p>
                                    <h3 className="text-3xl font-bold mt-2 text-primary font-sans">{completionRate}%</h3>
                                </div>
                                <div className="p-2 bg-primary/10 rounded-xl text-primary">
                                    <Sparkles className="w-5 h-5" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Sub-toolbar Controls */}
                <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-card border rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={togglePanels}
                            className={`h-10 px-3 rounded-xl border-border ${!collapsedPanels ? "bg-muted/80 text-foreground" : "text-muted-foreground"}`}
                            title="تبديل عرض اللوحة الجانبية"
                        >
                            <Sidebar className="w-4 h-4" />
                        </Button>
                        <CalendarViewSwitcher />

                        {viewers.length > 0 && (
                            <div className="flex items-center gap-1.5 border-r pr-4 border-border/80">
                                <span className="text-[10px] text-muted-foreground font-semibold font-sans">المتعاونون الآن:</span>
                                <div className="flex -space-x-1.5 overflow-hidden">
                                    {viewers.map((viewer, i) => (
                                        <div
                                            key={viewer.username || i}
                                            title={`${viewer.username} متصل بالتقويم`}
                                            className="inline-block h-6 w-6 rounded-full ring-2 ring-background flex items-center justify-center text-[10px] font-bold text-white font-sans shadow-sm"
                                            style={{ backgroundColor: viewer.color || '#ff4757' }}
                                        >
                                            {viewer.avatar || viewer.username.slice(0, 2)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <Button
                        type="button"
                        onClick={handleAddClick}
                        className="bg-primary hover:bg-primary/90 text-white rounded-xl h-10 font-semibold text-xs flex items-center gap-2 px-4 shadow-sm"
                    >
                        حجز موعد جديد
                    </Button>
                </div>

                {/* Main Split Layout container */}
                <div className="flex flex-col lg:flex-row gap-6 items-stretch">
                    {/* Left Collapsible Panel */}
                    <AnimatePresence initial={false}>
                        {!collapsedPanels && (
                            <motion.div
                                className="w-full lg:w-64 space-y-6 shrink-0"
                                initial={{ opacity: 0, width: 0, x: 20 }}
                                animate={{ opacity: 1, width: 256, x: 0 }}
                                exit={{ opacity: 0, width: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <CalendarMiniCalendar allEvents={allEvents} />
                                
                                {/* Task Deadlines Card */}
                                <Card className="border border-border/80 bg-card shadow-sm">
                                    <CardHeader className="p-4 pb-2 text-right">
                                        <CardTitle className="text-xs font-bold text-foreground flex items-center gap-1.5">
                                            <ClipboardList className="w-4 h-4 text-primary" />
                                            <span>استحقاق المهام</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-0 space-y-2 max-h-[220px] overflow-y-auto pr-1">
                                        {pendingTasksWithDueDate.length === 0 ? (
                                            <div className="text-center py-4 text-[10px] text-muted-foreground">
                                                لا توجد مهام معلقة بموعد.
                                            </div>
                                        ) : (
                                            pendingTasksWithDueDate.map(task => (
                                                <div 
                                                    key={task.id} 
                                                    onClick={() => {
                                                        setInspectingTask(task);
                                                        setIsTaskDetailsOpen(true);
                                                    }}
                                                    className="p-2 rounded bg-muted/30 border border-border/60 hover:bg-muted/50 cursor-pointer text-right transition-colors"
                                                >
                                                    <div className="flex justify-between items-center gap-1">
                                                        <h4 className="font-semibold text-[11px] text-foreground truncate max-w-[130px]">{task.title}</h4>
                                                        <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-border">
                                                            {task.priority === 'Critical' ? 'عاجلة' : task.priority === 'High' ? 'عالية' : 'عادية'}
                                                        </Badge>
                                                    </div>
                                                    <div className="text-[9px] text-muted-foreground mt-1">تاريخ الاستحقاق: {task.dueDate}</div>
                                                </div>
                                            ))
                                        )}
                                    </CardContent>
                                </Card>
                                
                                <CalendarLegend />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Right Grid Component */}
                    <div className="flex-grow space-y-6 min-w-0">
                        {/* Navigator Title */}
                        <CalendarHeader />

                        {/* Search & Filters */}
                        <AppointmentFilters
                            filters={filters}
                            onChange={setFilters}
                        />

                        {/* Scoped view renderer */}
                        <div className="relative" id="calendar-view-container">
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4 bg-card border rounded-2xl">
                                    <LoadingSpinner message="جاري تنشيط عرض المواعيد..." />
                                </div>
                            ) : isError ? (
                                <ErrorState onRetry={refetchAllQueries} />
                            ) : (
                                <div>
                                    {currentView === 'Month' && (
                                        <CalendarMonthView
                                            appointments={appointments}
                                            onInspect={handleInspect}
                                            onMove={moveEvent}
                                            onEmptyCellClick={handleEmptyCellClick}
                                        />
                                    )}

                                    {currentView === 'Week' && (
                                        <CalendarWeekGrid
                                            activeDays={generateWeekDays(selectedDate)}
                                            appointments={appointments}
                                            onInspect={handleInspect}
                                            onMove={moveEvent}
                                            onResize={resizeEvent}
                                            onEmptySlotClick={handleEmptySlotClick}
                                        />
                                    )}

                                    {currentView === 'Day' && (
                                        <CalendarDayView
                                            selectedDate={selectedDate}
                                            appointments={appointments}
                                            onInspect={handleInspect}
                                            onMove={moveEvent}
                                            onResize={resizeEvent}
                                            onEmptySlotClick={handleEmptySlotClick}
                                        />
                                    )}

                                    {currentView === 'Agenda' && (
                                        <CalendarAgendaView
                                            appointments={appointments}
                                            onInspect={handleInspect}
                                            onEdit={handleEdit}
                                            onDelete={handleDelete}
                                            onDuplicate={handleDuplicate}
                                        />
                                    )}
                                </div>
                            )}

                            {/* Live cursor indicators */}
                            {Object.entries(cursors).map(([name, data]) => {
                                if (!data.x || !data.y) return null;
                                return (
                                    <div
                                        key={name}
                                        className="absolute pointer-events-none z-50 transition-all duration-300 ease-out"
                                        style={{
                                            left: `${data.x}px`,
                                            top: `${data.y}px`,
                                        }}
                                    >
                                        <svg
                                            className="w-4 h-4 shadow-sm"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M4.5 3V17.2L8.9 12.8L14.7 21L17.7 18.9L12 11L18 10L4.5 3Z"
                                                fill={data.color || '#ff4757'}
                                                stroke="white"
                                                strokeWidth="2"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        <span
                                            className="absolute right-3 top-3 text-[9px] text-white px-1.5 py-0.5 rounded font-sans font-bold shadow-md whitespace-nowrap"
                                            style={{ backgroundColor: data.color || '#ff4757' }}
                                        >
                                            {name}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Dialog components */}
            <AppointmentDetailsDialog
                isOpen={isInspectOpen}
                onClose={() => setIsInspectOpen(false)}
                appointment={inspectingApt}
            />

            <AddEditAppointmentDialog
                isOpen={isAddEditOpen}
                onClose={() => setIsAddEditOpen(false)}
                appointment={editingApt}
                isDuplicate={isDuplicate}
            />

            <DeleteAppointmentDialog
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                appointment={deletingApt}
            />

            <TaskDetailsDialog
                open={isTaskDetailsOpen}
                onOpenChange={setIsTaskDetailsOpen}
                task={inspectingTask}
                onEdit={() => {
                    window.location.href = `/tasks`;
                }}
                onComplete={handleTaskComplete}
            />
        </div>
    );
}
