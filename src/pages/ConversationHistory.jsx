import React, { useState } from 'react';
import { useAIChat } from '@/hooks/use-ai-chat';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';
import { toastService } from '@/services/toast.service';
import { History, Send, Bot, User } from 'lucide-react';

export const ConversationHistory = () => {
    const { sessions, activeSessionId, setActiveSessionId, streamingMessage, createSession, sendMessage } = useAIChat();
    const [msgContent, setMsgContent] = useState('');
    const [newSessionTitle, setNewSessionTitle] = useState('');

    const activeSession = sessions.find(s => s.id === activeSessionId) || null;

    const handleCreateSession = async (e) => {
        e.preventDefault();
        if (!newSessionTitle.trim()) return;

        try {
            await createSession(newSessionTitle);
            setNewSessionTitle('');
            toastService.success('تم فتح جلسة محادثة جديدة');
        } catch (error) {
            console.error(error);
            toastService.error('فشل إنشاء محادثة جديدة');
        }
    };

    const handleSendMsg = async (e) => {
        e.preventDefault();
        if (!activeSessionId || !msgContent.trim()) return;

        const originalMsg = msgContent;
        setMsgContent('');
        try {
            await sendMessage({ sessionId: activeSessionId, content: originalMsg });
        } catch (error) {
            console.error(error);
            toastService.error('فشل إرسال الرسالة');
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-6 text-right" dir="rtl">
            <SEO title="سجل المحادثات الذكية والمساعد" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-l from-primary/10 via-primary/5 to-background p-6 rounded-xl border border-primary/20 text-right">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 justify-start">
                        <History className="h-6 w-6 text-primary" />
                        سجلات المحادثات والدردشة الذكية
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        إجراء محادثات تفاعلية واسترجاع التوصيات السابقة مع خوادم الذكاء الاصطناعي.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Threads Sidebar */}
                <div className="lg:col-span-1 space-y-4">
                    <Card className="border border-border">
                        <CardHeader className="p-4 text-right">
                            <CardTitle className="text-sm font-bold">بدء محادثة جديدة</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <form onSubmit={handleCreateSession} className="flex gap-2">
                                <input
                                    type="text"
                                    value={newSessionTitle}
                                    onChange={(e) => setNewSessionTitle(e.target.value)}
                                    placeholder="العنوان (مثال: خطة تمرين)"
                                    className="flex-1 p-2 rounded border bg-background text-xs"
                                    required
                                />
                                <Button type="submit" size="xs">إنشاء</Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Sessions List */}
                    <Card className="border border-border">
                        <CardHeader className="p-4 text-right">
                            <CardTitle className="text-sm font-bold">جلسات المحادثة السابقة</CardTitle>
                        </CardHeader>
                        <CardContent className="p-2 pt-0 space-y-1.5 max-h-[400px] overflow-y-auto">
                            {sessions.map(session => (
                                <button
                                    key={session.id}
                                    onClick={() => setActiveSessionId(session.id)}
                                    className={`w-full p-2.5 rounded-lg text-right text-xs transition-colors block
                                        ${activeSessionId === session.id 
                                            ? 'bg-primary/10 font-bold text-primary' 
                                            : 'hover:bg-muted/10 text-muted-foreground'
                                        }
                                    `}
                                >
                                    {session.title}
                                </button>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Active Chat Panel */}
                <Card className="lg:col-span-3 border border-border flex flex-col justify-between h-[500px]">
                    <CardHeader className="p-4 border-b border-border text-right">
                        <CardTitle className="text-base font-bold flex items-center gap-1.5 flex-row-reverse justify-end">
                            <Bot className="h-5 w-5 text-primary shrink-0" />
                            {activeSession ? activeSession.title : 'حدد جلسة محادثة للبدء'}
                        </CardTitle>
                    </CardHeader>

                    {/* Message Area */}
                    <CardContent className="p-4 flex-1 overflow-y-auto space-y-4 text-right text-sm">
                        {activeSession ? (
                            <>
                                {activeSession.messages.map((msg, idx) => (
                                    <div 
                                        key={idx} 
                                        className={`flex gap-3 max-w-[80%] rounded-xl p-3 justify-start items-start
                                            ${msg.role === 'user' 
                                                ? 'bg-primary/10 text-foreground mr-auto flex-row' 
                                                : 'bg-muted/20 text-foreground ml-auto flex-row-reverse'
                                            }
                                        `}
                                    >
                                        <div className="p-1.5 rounded-full bg-background border border-border shrink-0">
                                            {msg.role === 'user' ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5 text-primary" />}
                                        </div>
                                        <div className="leading-relaxed whitespace-pre-wrap">{msg.content}</div>
                                    </div>
                                ))}

                                {/* Live Streaming Response */}
                                {streamingMessage && (
                                    <div className="flex gap-3 max-w-[80%] rounded-xl p-3 bg-muted/20 text-foreground ml-auto flex-row-reverse">
                                        <div className="p-1.5 rounded-full bg-background border border-border shrink-0">
                                            <Bot className="h-3.5 w-3.5 text-primary" />
                                        </div>
                                        <div className="leading-relaxed whitespace-pre-wrap border-l-2 border-primary pl-2">
                                            {streamingMessage}
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center text-muted-foreground py-20">الرجاء اختيار أو إنشاء جلسة دردشة للبدء بالنقاش الفني.</div>
                        )}
                    </CardContent>

                    {/* Input bar */}
                    {activeSession && (
                        <div className="p-4 border-t border-border bg-muted/20">
                            <form onSubmit={handleSendMsg} className="flex gap-2">
                                <input
                                    type="text"
                                    value={msgContent}
                                    onChange={(e) => setMsgContent(e.target.value)}
                                    placeholder="اكتب رسالتك للمساعد الذكي هنا..."
                                    className="flex-1 p-2 rounded border bg-background text-sm text-foreground"
                                    required
                                />
                                <Button type="submit" size="sm" className="gap-1">
                                    <Send className="h-3.5 w-3.5" />
                                    إرسال
                                </Button>
                            </form>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default ConversationHistory;
