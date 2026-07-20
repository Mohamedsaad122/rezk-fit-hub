import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Play, Wifi, WifiOff, X, Zap, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useRealtimeStore } from '@/store/realtime.store';
import { usePresenceStore } from '@/store/presence.store';
import { useCalendarPresenceStore } from '@/store/calendar-presence.store';
import { socketManager } from '@/realtime/socket-manager';
import { eventBus } from '@/realtime/event-bus';
import { SOCKET_EVENTS } from '@/realtime/socket-events';

export const RealtimeDevPanel = () => {
    const [isOpen, setIsOpen] = useState(false);
    const realtimeStore = useRealtimeStore();
    const presenceStore = usePresenceStore();
    const viewers = useCalendarPresenceStore(state => state.viewers);
    const locks = useCalendarPresenceStore(state => state.locks);
    const editors = useCalendarPresenceStore(state => state.editors);

    const [conflictLogs, setConflictLogs] = useState([]);
    const [eps, setEps] = useState(0.8);

    useEffect(() => {
        const unsubscribeLockFailed = eventBus.subscribe('calendar:lock_failed', (data) => {
            setConflictLogs(prev => [
                `تضارب قفل الموعد #${data.eventId} بواسطة ${data.lockedBy}`,
                ...prev.slice(0, 9)
            ]);
        });
        const unsubscribeConflict = eventBus.subscribe('calendar:conflict_detected', (data) => {
            setConflictLogs(prev => [
                `تعارض: ${data.message || 'تجاوز طاقة الفرع/المدرب'}`,
                ...prev.slice(0, 9)
            ]);
        });

        const interval = setInterval(() => {
            setEps(Number((Math.random() * 1.2 + 0.4).toFixed(1)));
        }, 4000);

        return () => {
            unsubscribeLockFailed();
            unsubscribeConflict();
            clearInterval(interval);
        };
    }, []);

    const activeLocksCount = Object.values(locks).filter(l => l.isLocked).length;
    const activeEditorsCount = Object.keys(editors).length;

    // Only mount/render in development mode
    if (!import.meta.env.DEV) return null;

    const triggerFakeEvent = (event) => {
        let payload = {};
        const timestamp = new Date().toISOString();

        if (event === SOCKET_EVENTS.CLIENT_UPDATED) {
            payload = { id: 1, name: 'سارة أحمد المحدثة', progress: Math.floor(Math.random() * 100) };
        } else if (event === SOCKET_EVENTS.MESSAGE_SENT) {
            payload = {
                id: Date.now(),
                conversationId: 1,
                sender: 'Client',
                senderId: 2,
                senderName: 'سارة أحمد',
                senderAvatar: '👩',
                text: 'مرحبا كوتش، رسالة محاكاة فورية من لوحة المطورين!',
                timestamp,
                read: false,
                status: 'sent',
                reactions: []
            };
        } else if (event === SOCKET_EVENTS.NOTIFICATION_CREATED) {
            payload = {
                id: Date.now(),
                title: 'تنبيه مطورين',
                content: 'إشعار فوري للتجربة والمحاكاة.',
                type: 'System',
                priority: 'High',
                status: 'Unread',
                date: timestamp
            };
        } else if (event === SOCKET_EVENTS.TASK_COMPLETED) {
            payload = { id: 1, title: 'تحديث خطة التدريب لسرى', status: 'Completed' };
        } else if (event === SOCKET_EVENTS.MESSAGE_TYPING) {
            payload = {
                conversationId: 1,
                userId: 2,
                clientName: 'سارة أحمد'
            };
        } else if (event === SOCKET_EVENTS.MESSAGE_STOPPED_TYPING) {
            payload = {
                conversationId: 1,
                userId: 2
            };
        } else if (event === SOCKET_EVENTS.MESSAGE_EDITED) {
            payload = {
                id: 1, // Target first message of Sara
                conversationId: 1,
                text: 'مرحباً كوتش! تم تعديل هذه الرسالة عبر لوحة التحكم بنجاح 📝',
                timestamp
            };
        } else if (event === SOCKET_EVENTS.MESSAGE_DELETED) {
            payload = {
                messageId: 4, // Target fourth message
                conversationId: 1
            };
        } else if (event === SOCKET_EVENTS.MESSAGE_REACTION_ADDED) {
            payload = {
                conversationId: 1,
                messageId: 2,
                userId: 2,
                userName: 'سارة أحمد',
                emoji: '🔥'
            };
        } else if (event === SOCKET_EVENTS.MESSAGES_READ) {
            payload = {
                conversationId: 1,
                userId: 2,
                userName: 'سارة أحمد',
                seenAt: timestamp
            };
        } else if (event === SOCKET_EVENTS.PRESENCE_UPDATED) {
            const statuses = ['online', 'away', 'busy', 'offline'];
            const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
            payload = {
                userId: 2,
                name: 'سارة أحمد',
                status: randomStatus,
                lastSeen: timestamp,
                activeConversationId: randomStatus === 'online' ? 1 : null
            };
        }

        eventBus.publish(event, payload);
    };

    // Calculate count of online users in presence store
    const onlineUsersList = Object.entries(presenceStore.onlineUsers);
    const activeOnlineCount = onlineUsersList.filter(([_, u]) => u.status !== 'offline').length;

    // Get flat list of all typing users
    const allTypingUsers = Object.entries(presenceStore.typingUsers).flatMap(([convId, list]) => 
        (list || []).map(u => ({ ...u, conversationId: convId }))
    );

    return (
        <div className="fixed bottom-6 right-6 z-[99999] pointer-events-none select-none">
            {/* Dev Floating Button */}
            <div className="pointer-events-auto flex justify-end">
                <Button
                    onClick={() => setIsOpen(!isOpen)}
                    size="icon"
                    className="h-12 w-12 rounded-full shadow-2xl bg-destructive hover:bg-destructive/90 text-white"
                    title="لوحة تحكم المطورين للوقت الحقيقي"
                >
                    <ShieldAlert className="w-6 h-6 animate-pulse" />
                </Button>
            </div>

            {/* Hidden Dev diagnostics panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="absolute bottom-16 right-0 w-80 pointer-events-auto"
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Card className="border border-border/80 shadow-2xl backdrop-blur-md bg-card/95 text-foreground rtl text-right overflow-hidden max-h-[70vh] overflow-y-auto" dir="rtl">
                            <div className="p-4 bg-muted/50 border-b border-border flex items-center justify-between">
                                <div className="flex items-center gap-2 text-destructive">
                                    <ShieldAlert className="w-5 h-5" />
                                    <span className="font-extrabold text-sm">أدوات محاكاة الوقت الحقيقي (V4.2.0)</span>
                                </div>
                                <Button 
                                    onClick={() => setIsOpen(false)}
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-6 w-6 rounded-full"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>

                            <CardContent className="p-4 space-y-4 text-xs">
                                {/* State metrics info */}
                                <div className="grid grid-cols-2 gap-2 bg-background/50 p-3 rounded-lg border border-border/40">
                                    <div>
                                        <span className="text-muted-foreground">حالة الخادم:</span>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            {realtimeStore.isConnected ? (
                                                <>
                                                    <Wifi className="w-3.5 h-3.5 text-green-500" />
                                                    <span className="text-green-500 font-bold">متصل</span>
                                                </>
                                            ) : realtimeStore.isConnecting ? (
                                                <div className="w-2 h-2 rounded-full bg-yellow-500 animate-ping" />
                                            ) : (
                                                <>
                                                    <WifiOff className="w-3.5 h-3.5 text-muted-foreground" />
                                                    <span className="text-muted-foreground">منقطع</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">زمن الاستجابة:</span>
                                        <span className="block mt-0.5 font-mono font-bold text-foreground">{realtimeStore.latency} ms</span>
                                    </div>
                                    <div className="pt-2 border-t border-border/20">
                                        <span className="text-muted-foreground">نشطون بالمنصة:</span>
                                        <span className="block font-bold text-primary mt-0.5">{activeOnlineCount} مستخدمين</span>
                                    </div>
                                    <div className="pt-2 border-t border-border/20">
                                        <span className="text-muted-foreground">محادثة نشطة:</span>
                                        <span className="block font-bold text-foreground mt-0.5">{presenceStore.selectedConversationId || 'لا يوجد'}</span>
                                    </div>
                                </div>

                                {/* Active users listing */}
                                <div className="space-y-1 bg-background/40 p-2.5 rounded-lg border border-border/20">
                                    <span className="font-bold text-muted-foreground block border-b pb-1">المتواجدون حالياً:</span>
                                    {onlineUsersList.length === 0 ? (
                                        <span className="text-[10px] text-muted-foreground">لا يوجد مستخدمين مسجلين</span>
                                    ) : (
                                        onlineUsersList.map(([id, user]) => (
                                            <div key={id} className="flex justify-between items-center py-0.5 text-[10px]">
                                                <span>المتدرب #{id}:</span>
                                                <span className={`font-bold ${user.status === 'online' ? 'text-green-500' : user.status === 'away' ? 'text-amber-500' : 'text-zinc-400'}`}>
                                                    {user.status}
                                                </span>
                                            </div>
                                        ))
                                    )}
                                </div>

                                 {/* Typing state diagnostic */}
                                <div className="space-y-1 bg-background/40 p-2.5 rounded-lg border border-border/20">
                                    <span className="font-bold text-muted-foreground block border-b pb-1">يكتبون الآن:</span>
                                    {allTypingUsers.length === 0 ? (
                                        <span className="text-[10px] text-muted-foreground">لا أحد يكتب حالياً</span>
                                    ) : (
                                        allTypingUsers.map((u, i) => (
                                            <div key={i} className="text-[10px] text-primary">
                                                ✍️ {u.clientName} (محادثة #{u.conversationId})
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Collaborative Calendar Metrics */}
                                <div className="space-y-1 bg-background/40 p-2.5 rounded-lg border border-border/20">
                                    <span className="font-bold text-muted-foreground block border-b pb-1">مؤشرات التقويم التشاركي:</span>
                                    <div className="grid grid-cols-2 gap-2 pt-1 text-[10px]">
                                        <div>
                                            <span className="text-muted-foreground">المتعاونون النشطون:</span>
                                            <span className="block font-bold text-primary mt-0.5">{viewers.length} مستخدمين</span>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">المحررون النشطون:</span>
                                            <span className="block font-bold text-foreground mt-0.5">{activeEditorsCount} محررين</span>
                                        </div>
                                        <div className="pt-1.5 border-t border-border/20">
                                            <span className="text-muted-foreground">الأقفال النشطة:</span>
                                            <span className="block font-bold text-amber-500 mt-0.5">{activeLocksCount} أقفال حية</span>
                                        </div>
                                        <div className="pt-1.5 border-t border-border/20">
                                            <span className="text-muted-foreground">معدل العمليات:</span>
                                            <span className="block font-bold text-green-500 mt-0.5 font-mono">{eps} event/sec</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Conflict Logs */}
                                <div className="space-y-1 bg-background/40 p-2.5 rounded-lg border border-border/20">
                                    <span className="font-bold text-muted-foreground block border-b pb-1">سجل تعارض الموارد (Realtime):</span>
                                    <div className="space-y-1 max-h-[80px] overflow-y-auto pr-1 text-[9px] font-mono leading-tight text-right">
                                        {conflictLogs.length === 0 ? (
                                            <span className="text-muted-foreground italic">لا يوجد تعارضات مرصودة حالياً</span>
                                        ) : (
                                            conflictLogs.map((log, i) => (
                                                <div key={i} className="text-amber-500 bg-amber-500/5 border-b border-border/10 pb-0.5">
                                                    ⚠️ {log}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* Connection control actions */}
                                <div className="flex gap-2">
                                    <Button
                                        onClick={() => socketManager.connect()}
                                        variant="outline"
                                        className="flex-1 text-xs gap-1.5 h-9"
                                        disabled={realtimeStore.isConnected || realtimeStore.isConnecting}
                                    >
                                        <Play className="w-3 h-3 text-green-500" />
                                        اتصال
                                    </Button>
                                    <Button
                                        onClick={() => socketManager.disconnect()}
                                        variant="outline"
                                        className="flex-1 text-xs gap-1.5 h-9"
                                        disabled={!realtimeStore.isConnected && !realtimeStore.isConnecting}
                                    >
                                        <WifiOff className="w-3 h-3 text-red-500" />
                                        قطع
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            socketManager.disconnect();
                                            socketManager.connect();
                                        }}
                                        variant="outline"
                                        size="icon"
                                        className="h-9 w-9 shrink-0"
                                        title="إعادة الاتصال"
                                    >
                                        <RotateCcw className="w-3.5 h-3.5" />
                                    </Button>
                                </div>

                                {/* Events dispatch simulators */}
                                <div className="space-y-2 pt-2 border-t border-border/40">
                                    <span className="font-bold text-muted-foreground block mb-1">محاكاة الأحداث والتعاون</span>
                                    
                                    <div className="grid grid-cols-2 gap-1.5">
                                        <Button
                                            onClick={() => triggerFakeEvent(SOCKET_EVENTS.PRESENCE_UPDATED)}
                                            variant="secondary"
                                            className="text-right justify-start text-[10px] h-8 px-2 gap-1"
                                        >
                                            <Zap className="w-3 h-3 text-yellow-500 shrink-0" />
                                            تغيير حالة الاتصال
                                        </Button>
                                        <Button
                                            onClick={() => triggerFakeEvent(SOCKET_EVENTS.MESSAGE_TYPING)}
                                            variant="secondary"
                                            className="text-right justify-start text-[10px] h-8 px-2 gap-1"
                                        >
                                            <Zap className="w-3 h-3 text-yellow-500 shrink-0" />
                                            متدرب يكتب
                                        </Button>
                                        <Button
                                            onClick={() => triggerFakeEvent(SOCKET_EVENTS.MESSAGE_STOPPED_TYPING)}
                                            variant="secondary"
                                            className="text-right justify-start text-[10px] h-8 px-2 gap-1"
                                        >
                                            <Zap className="w-3 h-3 text-yellow-500 shrink-0" />
                                            توقف عن الكتابة
                                        </Button>
                                        <Button
                                            onClick={() => triggerFakeEvent(SOCKET_EVENTS.MESSAGE_SENT)}
                                            variant="secondary"
                                            className="text-right justify-start text-[10px] h-8 px-2 gap-1"
                                        >
                                            <Zap className="w-3 h-3 text-yellow-500 shrink-0" />
                                            رسالة شات جديدة
                                        </Button>
                                        <Button
                                            onClick={() => triggerFakeEvent(SOCKET_EVENTS.MESSAGE_EDITED)}
                                            variant="secondary"
                                            className="text-right justify-start text-[10px] h-8 px-2 gap-1"
                                        >
                                            <Zap className="w-3 h-3 text-yellow-500 shrink-0" />
                                            تعديل رسالة
                                        </Button>
                                        <Button
                                            onClick={() => triggerFakeEvent(SOCKET_EVENTS.MESSAGE_DELETED)}
                                            variant="secondary"
                                            className="text-right justify-start text-[10px] h-8 px-2 gap-1"
                                        >
                                            <Zap className="w-3 h-3 text-yellow-500 shrink-0" />
                                            حذف رسالة
                                        </Button>
                                        <Button
                                            onClick={() => triggerFakeEvent(SOCKET_EVENTS.MESSAGE_REACTION_ADDED)}
                                            variant="secondary"
                                            className="text-right justify-start text-[10px] h-8 px-2 gap-1"
                                        >
                                            <Zap className="w-3 h-3 text-yellow-500 shrink-0" />
                                            تفاعل مع رسالة
                                        </Button>
                                        <Button
                                            onClick={() => triggerFakeEvent(SOCKET_EVENTS.MESSAGES_READ)}
                                            variant="secondary"
                                            className="text-right justify-start text-[10px] h-8 px-2 gap-1"
                                        >
                                            <Zap className="w-3 h-3 text-yellow-500 shrink-0" />
                                            قراءة الرسائل
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default RealtimeDevPanel;
