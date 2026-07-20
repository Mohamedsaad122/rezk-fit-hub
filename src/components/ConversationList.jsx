import React from 'react';
import { Search, MessageCircle } from 'lucide-react';
import ConversationCard from './ConversationCard';

export const ConversationList = ({
    conversations = [],
    activeId,
    searchQuery,
    onSearchChange,
    filterStatus,
    onFilterChange,
    onSelect,
    onPin,
    onArchive,
    onDelete,
    onMute,
    onFavorite,
    onMarkAllRead
}) => {
    return (
        <div className="flex flex-col h-full bg-card border border-border/40 rounded-xl overflow-hidden shadow-sm">
            {/* Header Search */}
            <div className="p-4 border-b border-border/40 space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                        <MessageCircle className="w-5 h-5 text-primary" />
                        محادثات المتدربين
                    </h3>
                    {onMarkAllRead && (
                        <button
                            onClick={onMarkAllRead}
                            className="text-xs text-primary hover:text-primary/80 transition-colors font-bold"
                            title="تحديد جميع المحادثات كمقروءة"
                        >
                            قراءة الكل
                        </button>
                    )}
                </div>
                
                <div className="relative">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="ابحث عن متدرب أو رسالة..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-3 pr-9 py-2 bg-muted/50 rounded-lg text-sm text-foreground placeholder:text-muted-foreground border border-border/40 focus:outline-none focus:border-primary/50 transition-colors"
                        aria-label="البحث في المحادثات"
                    />
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap border-b border-border/20 px-2 py-1 bg-muted/20 gap-1">
                <button
                    onClick={() => onFilterChange('All')}
                    className={`flex-1 py-1 text-[10px] font-semibold rounded transition-colors ${
                        filterStatus === 'All'
                            ? 'bg-card text-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                    الكل
                </button>
                <button
                    onClick={() => onFilterChange('Pinned')}
                    className={`flex-1 py-1 text-[10px] font-semibold rounded transition-colors ${
                        filterStatus === 'Pinned'
                            ? 'bg-card text-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                    المثبتة
                </button>
                <button
                    onClick={() => onFilterChange('Favorite')}
                    className={`flex-1 py-1 text-[10px] font-semibold rounded transition-colors ${
                        filterStatus === 'Favorite'
                            ? 'bg-card text-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                    المفضلة
                </button>
                <button
                    onClick={() => onFilterChange('Muted')}
                    className={`flex-1 py-1 text-[10px] font-semibold rounded transition-colors ${
                        filterStatus === 'Muted'
                            ? 'bg-card text-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                    المكتومة
                </button>
                <button
                    onClick={() => onFilterChange('Archived')}
                    className={`flex-1 py-1 text-[10px] font-semibold rounded transition-colors ${
                        filterStatus === 'Archived'
                            ? 'bg-card text-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                    المؤرشفة
                </button>
            </div>

            {/* Conversation list stream */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-[calc(100vh-290px)] scrollbar-thin">
                {conversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground space-y-2">
                        <span className="text-3xl">💬</span>
                        <p className="text-xs">لا يوجد محادثات مطابقة</p>
                    </div>
                ) : (
                    conversations.map((conv) => (
                        <ConversationCard
                            key={conv.id}
                            conversation={conv}
                            isActive={activeId === conv.id}
                            onSelect={() => onSelect(conv.id)}
                            onPin={() => onPin(conv.id)}
                            onArchive={() => onArchive(conv.id)}
                            onDelete={() => onDelete(conv.id)}
                            onMute={onMute ? () => onMute(conv.id) : undefined}
                            onFavorite={onFavorite ? () => onFavorite(conv.id) : undefined}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default ConversationList;
