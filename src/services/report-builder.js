import { mockDatabase } from '@/mocks/mockDatabase';

export const ReportBuilder = {
    /**
     * Generate report data dynamically based on the target module, filters, sorting, and grouping.
     * @param {string} module - Clients, Calendar, Tasks, Nutrition, Exercises, Messages, Analytics, Documents, Audit Logs, Notifications
     * @param {Object} filters - Key-value search filters
     * @param {Object} sorting - { field, order: 'asc'|'desc' }
     * @param {string} grouping - Optional grouping key
     * @returns {Array<Object>} - Consolidated report rows
     */
    generateReportData: (module, filters = {}, sorting = null, grouping = null) => {
        let rawData = [];

        // 1. Fetch raw data based on module
        switch (module) {
            case 'Clients': {
                rawData = mockDatabase.clients.getAll().map(c => ({
                    id: c.id,
                    name: c.name,
                    progress: c.progress,
                    workouts: c.workouts,
                    streak: c.streak,
                    goal: c.goal,
                    email: c.email,
                    phone: c.phone,
                    age: c.age,
                    currentWeight: c.currentWeight,
                    targetWeight: c.targetWeight,
                    subscriptionStatus: c.subscriptionStatus,
                    joinDate: c.joinDate
                }));
                break;
            }
            case 'Calendar': {
                rawData = mockDatabase.calendarEvents.getAll().map(e => ({
                    id: e.id,
                    title: e.title,
                    date: e.date,
                    startTime: e.startTime,
                    endTime: e.endTime,
                    status: e.status,
                    type: e.type,
                    coachId: e.coachId,
                    coachName: e.coachName || 'الكوتش أحمد',
                    clientName: e.clientName || 'سارة أحمد'
                }));
                break;
            }
            case 'Tasks': {
                rawData = mockDatabase.tasks.getAll().map(t => ({
                    id: t.id,
                    title: t.title,
                    assignedTo: t.assignedTo,
                    priority: t.priority,
                    status: t.status,
                    category: t.category,
                    startDate: t.startDate,
                    dueDate: t.dueDate
                }));
                break;
            }
            case 'Nutrition': {
                rawData = mockDatabase.nutrition.getAll().map(n => ({
                    id: n.id,
                    name: n.name,
                    duration: n.duration,
                    participants: n.participants,
                    calories: n.calories,
                    protein: n.macros?.protein?.value || 30,
                    carbs: n.macros?.carbs?.value || 40,
                    fats: n.macros?.fats?.value || 30
                }));
                break;
            }
            case 'Exercises': {
                rawData = mockDatabase.exercises.getAll().map(e => ({
                    id: e.id,
                    name: e.name,
                    category: e.category,
                    difficulty: e.difficulty,
                    durationMinutes: e.durationMinutes || 15,
                    sets: e.sets || 3,
                    reps: e.reps || 12
                }));
                break;
            }
            case 'Messages': {
                rawData = mockDatabase.messages.getAll().map(m => ({
                    id: m.id,
                    senderName: m.senderName,
                    receiverName: m.receiverName,
                    content: m.content,
                    timestamp: m.timestamp,
                    isRead: m.isRead
                }));
                break;
            }
            case 'Analytics': {
                // Mock revenue history details
                rawData = [
                    { date: '2026-07-01', amount: 500, category: 'اشتراك شهري', client: 'علي أحمد' },
                    { date: '2026-07-05', amount: 1200, category: 'تدريب شخصي كوتش', client: 'منى محمود' },
                    { date: '2026-07-10', amount: 800, category: 'متابعة تغذية دايت', client: 'حسين إبراهيم' },
                    { date: '2026-07-15', amount: 350, category: 'تجديد باقة سباحة', client: 'سارة خالد' }
                ];
                break;
            }
            case 'Documents': {
                rawData = mockDatabase.documents.getAll().map(d => ({
                    id: d.id,
                    name: d.name,
                    type: d.type,
                    sizeBytes: d.sizeBytes,
                    uploadedBy: d.uploadedBy,
                    uploadedAt: d.uploadedAt
                }));
                break;
            }
            case 'Audit Logs': {
                rawData = mockDatabase.auditLogs.getAll().data.map(l => ({
                    id: l.id,
                    action: l.action,
                    entity: l.entity,
                    user: l.user,
                    date: l.date,
                    status: l.status,
                    details: l.details
                }));
                break;
            }
            case 'Notifications': {
                rawData = mockDatabase.notifications.getAll().map(n => ({
                    id: n.id,
                    title: n.title,
                    message: n.message,
                    type: n.type,
                    isRead: n.isRead,
                    createdAt: n.createdAt
                }));
                break;
            }
            default:
                break;
        }

        // 2. Apply Filters
        if (filters && Object.keys(filters).length > 0) {
            rawData = rawData.filter(row => {
                return Object.entries(filters).every(([key, value]) => {
                    if (value === undefined || value === null || value === '' || value === 'All') return true;
                    const rowVal = row[key];
                    if (rowVal === undefined || rowVal === null) return false;

                    // Support string prefix/match
                    if (typeof rowVal === 'string' && typeof value === 'string') {
                        return rowVal.toLowerCase().includes(value.toLowerCase());
                    }
                    // Support numbers/exact match
                    return String(rowVal) === String(value);
                });
            });
        }

        // 3. Apply Sorting
        if (sorting && sorting.field) {
            const { field, order } = sorting;
            rawData.sort((a, b) => {
                const valA = a[field];
                const valB = b[field];
                if (valA === undefined || valA === null) return 1;
                if (valB === undefined || valB === null) return -1;

                if (typeof valA === 'string' && typeof valB === 'string') {
                    return order === 'asc' 
                        ? valA.localeCompare(valB, 'ar') 
                        : valB.localeCompare(valA, 'ar');
                }
                return order === 'asc' 
                    ? Number(valA) - Number(valB) 
                    : Number(valB) - Number(valA);
            });
        }

        // 4. Apply Grouping (if specified, we tag rows or return them grouped. In a flat engine we can just return grouped-sorted rows)
        if (grouping) {
            rawData.sort((a, b) => {
                const groupA = String(a[grouping] || '');
                const groupB = String(b[grouping] || '');
                return groupA.localeCompare(groupB, 'ar');
            });
        }

        return rawData;
    }
};

export default ReportBuilder;
