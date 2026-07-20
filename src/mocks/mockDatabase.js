import { clientsMock } from './clients.mock';
import { exerciseCategories } from './exercises.mock';
import { nutritionPlans } from './nutrition.mock';
import { calendarEventsMock } from './calendar.mock';
import { notificationsMock } from './notifications.mock';
import { tasksMock } from './tasks.mock';
import { detectConflicts } from '../modules/calendar/utils/conflict-detection';
import { getAvailableSlots as findAvailableSlots } from '../modules/calendar/utils/availability-engine';
import { generateRecurringInstances } from '../modules/calendar/utils/recurring-appointments';
import { initialConversations, initialMessages } from './messages.mock';
import { initialActivities } from './activity.mock';
import { documentsMock } from './documents.mock';
import { mediaMock } from './media.mock';
import { initialAdminUsers } from './adminUsers.mock';
import { initialBranches } from './branches.mock';
import { initialAuditLogs } from './auditLogs.mock';
import { eventBus } from '../realtime/event-bus';
import { SOCKET_EVENTS } from '../realtime/socket-events';
import { organizationsMock } from './organizations.mock';
import { teamsMock } from './teams.mock';
import { membersMock } from './members.mock';
import { invitationsMock } from './invitations.mock';
import { billingMock } from './billing.mock';
import { invoicesMock } from './invoices.mock';
import { paymentsMock } from './payments.mock';
import { transactionsMock } from './transactions.mock';
import { couponsMock } from './coupons.mock';
import { aiHistoryMock } from './ai-history.mock';
import { aiPromptsMock } from './ai-prompts.mock';
import { aiInsightsMock } from './ai-insights.mock';
import { integrationsMock } from './integrations.mock';
import { webhooksMock, webhookLogsMock } from './webhooks.mock';


// Seed initial clients with additional required contract fields
const initialClients = clientsMock.map((client, idx) => {
    const avatars = ["👩", "👨", "👩", "👨", "👩"];
    const emails = [
        "sara.ahmed@rezkfit.com",
        "mohamed.ali@rezkfit.com",
        "fatma.hassan@rezkfit.com",
        "ahmed.khaled@rezkfit.com",
        "nora.samy@rezkfit.com"
    ];
    const phones = [
        "+201011111111",
        "+201022222222",
        "+201033333333",
        "+201044444444",
        "+201055555555"
    ];
    const ages = [24, 29, 22, 31, 26];
    const currentWeights = [68.5, 88.0, 62.3, 94.5, 58.7];
    const targetWeights = [60.0, 78.0, 54.0, 80.0, 52.0];
    const statuses = ["نشط", "نشط", "معلق", "نشط", "منتهي"];
    const joinDates = ["2026-01-15", "2026-02-10", "2026-03-01", "2026-04-20", "2026-05-02"];
    const categoryIds = ["gym", "gym", "cardio", "cardio", "flexibility"];

    return {
        ...client,
        avatar: avatars[idx] || "👤",
        email: emails[idx] || `client${client.id}@rezkfit.com`,
        phone: phones[idx] || "+201000000000",
        age: ages[idx] || 25,
        currentWeight: currentWeights[idx] || 70.0,
        targetWeight: targetWeights[idx] || 65.0,
        subscriptionStatus: statuses[idx] || "نشط",
        joinDate: joinDates[idx] || "2026-06-01",
        assignedCategoryId: categoryIds[idx] || null
    };
});

// Seed initial nutrition plans with assigned clients and status
const initialNutritionPlans = nutritionPlans.map((plan, idx) => {
    const clientIds = [1, 2, 3, 4];
    return {
        ...plan,
        assignedClientId: clientIds[idx] || 1,
        status: idx === 3 ? "مسودة" : "نشط"
    };
});

// Deep clone helper to protect internal store references
const safeClone = (data) => {
    if (data === null || data === undefined) return data;
    if (typeof structuredClone === 'function') {
        try {
            return structuredClone(data);
        } catch {
            // fallback if clone fails on some symbols/functions
        }
    }
    return JSON.parse(JSON.stringify(data));
};

// Deep clone to ensure original fixtures are untouched
let activeTenantId = 1;
const mapTenant = (items) => {
    if (!Array.isArray(items)) return items;
    return items.map(item => ({ ...item, tenantId: item.tenantId || 1 }));
};

let dbClients = mapTenant(JSON.parse(JSON.stringify(initialClients)));
let dbExercises = mapTenant(JSON.parse(JSON.stringify(exerciseCategories)));
let dbNutrition = mapTenant(JSON.parse(JSON.stringify(initialNutritionPlans)));
let dbCalendarEvents = mapTenant(JSON.parse(JSON.stringify(calendarEventsMock)).map(e => {
    if (e.id === 2) {
        return { ...e, roomId: 'Room A', branchId: 1, coachId: 1, tenantId: 1 };
    }
    if (e.id === 1) {
        return { ...e, branchId: 1, coachId: 1, tenantId: 1 };
    }
    return e;
}));
let dbNotifications = mapTenant(JSON.parse(JSON.stringify(notificationsMock)));
let dbTasks = mapTenant(JSON.parse(JSON.stringify(tasksMock)));
let dbConversations = mapTenant(JSON.parse(JSON.stringify(initialConversations)));
let dbMessages = mapTenant(JSON.parse(JSON.stringify(initialMessages)));
let dbActivities = mapTenant(JSON.parse(JSON.stringify(initialActivities)));
let dbDocuments = mapTenant(JSON.parse(JSON.stringify(documentsMock)));
let dbMedia = mapTenant(JSON.parse(JSON.stringify(mediaMock)));
let dbOrganizations = mapTenant(JSON.parse(JSON.stringify(organizationsMock)));
let dbTeams = mapTenant(JSON.parse(JSON.stringify(teamsMock)));
let dbMembers = mapTenant(JSON.parse(JSON.stringify(membersMock)));
let dbInvitations = mapTenant(JSON.parse(JSON.stringify(invitationsMock)));
let activeOrganizationId = 1;
let dbBilling = mapTenant(JSON.parse(JSON.stringify(billingMock)));
let dbInvoices = mapTenant(JSON.parse(JSON.stringify(invoicesMock)));
let dbPayments = mapTenant(JSON.parse(JSON.stringify(paymentsMock)));
let dbTransactions = mapTenant(JSON.parse(JSON.stringify(transactionsMock)));
let dbCoupons = mapTenant(JSON.parse(JSON.stringify(couponsMock)));
let dbTaxRules = [
    { id: 1, tenantId: 1, country: 'SA', name: 'VAT', rate: 15, status: 'Active' },
    { id: 2, tenantId: 1, country: 'AE', name: 'VAT', rate: 5, status: 'Active' }
];
let dbRefunds = [];
let dbAIChats = mapTenant(JSON.parse(JSON.stringify(aiHistoryMock)));
let dbAIPrompts = JSON.parse(JSON.stringify(aiPromptsMock));
let dbAIInsights = mapTenant(JSON.parse(JSON.stringify(aiInsightsMock)));
let dbIntegrations = mapTenant(JSON.parse(JSON.stringify(integrationsMock)));
let dbWebhooks = mapTenant(JSON.parse(JSON.stringify(webhooksMock)));
let dbWebhookLogs = JSON.parse(JSON.stringify(webhookLogsMock));
let dbCalendarSyncLogs = [];
let dbDevices = [];
let dbSyncQueue = [];
let dbCacheEntries = [];
let dbDeveloperApps = [];
let dbApiKeys = [];
let dbOauthCodes = [];
let dbOauthTokens = [];
let dbApiLogs = [];
let dbRateLimits = new Map();
let dbSecurityLogs = [];
let dbActiveSessions = [];
let dbTrustedDevices = [];
let dbMfaSettings = new Map();
let dbSsoSettings = [];
let dbSecretsVault = [];
let dbEnterprisePolicy = null;
let dbSecurityConfig = null;
let dbWorkflows = [];
let dbWorkflowRuns = [];
let dbWorkflowTemplates = [];
let dbAutomationRules = [];
let dbApprovals = [];
let dbBackgroundJobs = [];
let dbAutomationLogs = [];

let dbDevOpsMetrics = [];
let dbDevOpsLogs = [];
let dbDevOpsTraces = [];
let dbDevOpsAlerts = [];
let dbDevOpsFeatureFlags = [];
let dbDevOpsReleases = [];
let dbDevOpsProfiling = [];

// Sprint 4.4 Collaboration Suite Mock Databases
let dbCollaborationComments = [
    {
        id: 1,
        entityType: 'Client',
        entityId: 1,
        text: 'يحتاج هذا المتدرب إلى زيادة تكرارات تمارين الصدر في الخطة القادمة.',
        author: 'الكوتش أحمد',
        authorAvatar: '👨‍و',
        parentId: null,
        timestamp: '2026-07-15T10:00:00Z',
        reactions: { '👍': [2] },
        isPinned: true,
        isResolved: false
    },
    {
        id: 2,
        entityType: 'Client',
        entityId: 1,
        text: 'تم تعديل السعرات الحرارية والبروتين بناءً على مقاييس الوزن الأخيرة.',
        author: 'سارة أحمد',
        authorAvatar: '👩‍⚕️',
        parentId: null,
        timestamp: '2026-07-15T12:00:00Z',
        reactions: {},
        isPinned: false,
        isResolved: false
    },
    {
        id: 3,
        entityType: 'Client',
        entityId: 1,
        text: 'ممتاز، سأقوم بمتابعة أدائه غداً.',
        author: 'الكوتش أحمد',
        authorAvatar: '👨‍و',
        parentId: 2,
        timestamp: '2026-07-15T12:30:00Z',
        reactions: {},
        isPinned: false,
        isResolved: false
    }
];
let dbCollaborationLocks = {}; // { [entityKey]: { entityType, entityId, isLocked, lockedBy, lockedByAvatar, lockedAt, timeoutAt } }
let dbMergeRequests = [];
let dbAdminUsers = mapTenant(JSON.parse(JSON.stringify(initialAdminUsers)));
let dbBranches = mapTenant(JSON.parse(JSON.stringify(initialBranches)));
let dbAuditLogs = mapTenant(JSON.parse(JSON.stringify(initialAuditLogs)));

// Sprint 4.5 Enterprise Reports, Export & Monitoring Mock Databases
let dbReports = mapTenant([
    {
        id: 1,
        name: 'ملخص الأداء التنفيذي للمشتركين والمدربين',
        module: 'Clients',
        filters: { status: 'نشط' },
        sorting: { field: 'name', order: 'asc' },
        grouping: null,
        data: [
            { name: 'محمد علي', progress: 85, workouts: 12, streak: 5 },
            { name: 'أحمد حسن', progress: 70, workouts: 8, streak: 3 }
        ],
        createdAt: '2026-07-16T10:00:00Z',
        createdBy: 'أحمد عبد الله',
        isFavorite: true,
        isTemplate: false
    }
]);

let dbReportTemplates = [
    {
        id: 1,
        name: 'Executive Summary (الملخص التنفيذي)',
        description: 'تقرير ملخص شامل عن أداء المشتركين، المهام الجارية، الحجوزات والنشاط العام.',
        module: 'Clients',
        filters: {},
        sorting: { field: 'progress', order: 'desc' }
    },
    {
        id: 2,
        name: 'Coach Performance (أداء المدربين)',
        description: 'إحصائيات المدربين، نسب إكمال الحصص، وأعداد المشتركين المسندين.',
        module: 'Calendar',
        filters: {},
        sorting: { field: 'clientCount', order: 'desc' }
    },
    {
        id: 3,
        name: 'Nutrition Performance (متابعة التغذية)',
        description: 'نسب الالتزام بالخطط الغذائية، وتوزيع السعرات الحرارية للمشتركين.',
        module: 'Nutrition',
        filters: {},
        sorting: { field: 'streak', order: 'desc' }
    },
    {
        id: 4,
        name: 'Attendance (حضور الحصص)',
        description: 'نسبة الحضور والغياب وجداول المواعيد اليومية والأسبوعية.',
        module: 'Calendar',
        filters: {},
        sorting: { field: 'date', order: 'asc' }
    },
    {
        id: 5,
        name: 'Revenue (تقرير الإيرادات والمبيعات)',
        description: 'إجمالي المبيعات، الاشتراكات الفعالة، والتدفقات النقدية اليومية.',
        module: 'Analytics',
        filters: {},
        sorting: { field: 'amount', order: 'desc' }
    },
    {
        id: 6,
        name: 'Client Progress (تقدم المشتركين)',
        description: 'تغيرات الوزن، نسب الدهون، ومستوى إكمال الخطط الرياضية.',
        module: 'Clients',
        filters: {},
        sorting: { field: 'progress', order: 'desc' }
    },
    {
        id: 7,
        name: 'Tasks (تقرير المهام الإدارية)',
        description: 'حالة المهام المسندة للمدربين، المهام المتأخرة والمهام المكتملة.',
        module: 'Tasks',
        filters: {},
        sorting: { field: 'dueDate', order: 'asc' }
    },
    {
        id: 8,
        name: 'System Health (صحة وأداء النظام)',
        description: 'تقرير دوري حول متوسط استجابة السيرفر، استخدام الذاكرة، وقنوات البث المباشر.',
        module: 'Audit Logs',
        filters: {},
        sorting: { field: 'timestamp', order: 'desc' }
    }
];

let dbScheduledReports = mapTenant([
    {
        id: 1,
        name: 'التقرير التنفيذي اليومي للمشتركين',
        module: 'Clients',
        filters: { status: 'نشط' },
        schedule: 'daily',
        format: 'pdf',
        recipients: ['admin@rezkfit.com'],
        retentionDays: 30,
        lastRun: '2026-07-16T09:00:00Z',
        nextRun: '2026-07-17T09:00:00Z',
        isActive: true,
        createdAt: '2026-07-15T00:00:00Z'
    }
]);

let dbExports = mapTenant([
    {
        id: 1,
        name: 'تصدير_المشتركين_النشطين_2026',
        format: 'csv',
        status: 'success',
        url: '/exports/active_clients_2026.csv',
        generatedAt: '2026-07-16T12:00:00Z',
        sizeBytes: 45210
    }
]);

let dbSystemHealth = {
    api: { status: 'Healthy', message: 'مستقر - متوسط زمن الاستجابة 85ms', latencyMs: 85, lastChecked: new Date().toISOString() },
    database: { status: 'Healthy', message: 'متصل - 12 مستخدم متزامن', latencyMs: 4, lastChecked: new Date().toISOString() },
    realtime: { status: 'Healthy', message: 'نشط - 8 قنوات بث مفتوحة', latencyMs: 12, lastChecked: new Date().toISOString() },
    notifications: { status: 'Healthy', message: 'في الخدمة - معدل تسليم 100%', latencyMs: 45, lastChecked: new Date().toISOString() },
    storage: { status: 'Healthy', message: 'سعة كافية - 42% مستخدم', latencyMs: 15, lastChecked: new Date().toISOString() },
    authentication: { status: 'Healthy', message: 'نشط ومحمي بـ JWT & MFA', latencyMs: 25, lastChecked: new Date().toISOString() },
    backgroundWorkers: { status: 'Healthy', message: 'خمول - 0 مهام في الانتظار', latencyMs: 5, lastChecked: new Date().toISOString() }
};

let dbMonitoringMetrics = {
    activeUsers: 48,
    activeCoaches: 6,
    onlineStaff: 3,
    todayRevenue: 2850,
    upcomingSessions: 14,
    systemLoad: 12,
    storageUsage: 42,
    apiResponseTime: 85,
    failedRequests: 0,
    queueSize: 0,
    timestamp: new Date().toISOString()
};

const generateAuditLog = (action, entity, details, user = "أحمد عبد الله", status = "Success") => {
    const newLog = {
        id: dbAuditLogs.length > 0 ? Math.max(...dbAuditLogs.map(l => l.id)) + 1 : 1,
        action,
        entity,
        user,
        date: new Date().toISOString(),
        ip: "192.168.1.10",
        device: "Chrome / Windows 11",
        status,
        details
    };
    dbAuditLogs.push(newLog);
    return newLog;
};


// Helper to auto-log system activity
const generateSystemActivity = (category, description, actor = "الكوتش أحمد", clientId = null) => {
    const newAct = {
        id: dbActivities.length > 0 ? Math.max(...dbActivities.map(a => a.id)) + 1 : 1,
        category, // Workout, Client, Nutrition, Appointment, Task, Notification, Message, Document, Exercise
        description,
        actor,
        clientId: clientId ? Number(clientId) : null,
        timestamp: new Date().toISOString()
    };
    dbActivities.unshift(newAct);
    eventBus.publish(SOCKET_EVENTS.ACTIVITY_CREATED, newAct);
    return newAct;
};

// In-memory helper to auto-generate notifications on system events
const generateSystemNotification = (title, description, type, priority = 'Normal', clientId = null, actionUrl = null, color = 'blue', icon = '🔔') => {
    const newNotif = {
        id: dbNotifications.length > 0 ? Math.max(...dbNotifications.map(n => n.id)) + 1 : 1,
        title,
        description,
        type,
        priority,
        status: 'Unread',
        createdAt: new Date().toISOString(),
        readAt: null,
        actionUrl,
        clientId,
        icon,
        color
    };
    dbNotifications.push(newNotif);
    
    // Auto log system activity
    generateSystemActivity("Notification", `${title}: ${description}`, "النظام", clientId);
    
    return newNotif;
};

// In-memory helper to auto-generate tasks on system events
const generateSystemTask = (title, description, category, priority = 'Medium', clientId = null, appointmentId = null, dueDate = null) => {
    const defaultDueDate = dueDate || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const newTask = {
        id: dbTasks.length > 0 ? Math.max(...dbTasks.map(t => t.id)) + 1 : 1,
        title,
        description: description || '',
        clientId: clientId ? Number(clientId) : null,
        appointmentId: appointmentId ? Number(appointmentId) : null,
        assignedTo: 'Coach',
        priority,
        status: 'Todo',
        category,
        startDate: new Date().toISOString().split('T')[0],
        dueDate: defaultDueDate,
        completedAt: null,
        estimatedMinutes: 30,
        actualMinutes: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    dbTasks.push(newTask);

    // Trigger Notification for Task Creation
    generateSystemNotification(
        "مهمة جديدة مجدولة",
        `تم إضافة مهمة جديدة: "${title}" لفئة ${category}.`,
        "Task Created",
        priority === 'Critical' ? 'Critical' : priority === 'High' ? 'High' : 'Normal',
        clientId,
        '/tasks',
        'purple',
        '📋'
    );

    return newTask;
};

export const mockDatabase = {
    reset: () => {
        activeTenantId = 1;
        activeOrganizationId = 1;
        dbOrganizations = mapTenant(JSON.parse(JSON.stringify(organizationsMock)));
        dbTeams = mapTenant(JSON.parse(JSON.stringify(teamsMock)));
        dbMembers = mapTenant(JSON.parse(JSON.stringify(membersMock)));
        dbInvitations = mapTenant(JSON.parse(JSON.stringify(invitationsMock)));
        dbBilling = mapTenant(JSON.parse(JSON.stringify(billingMock)));
        dbInvoices = mapTenant(JSON.parse(JSON.stringify(invoicesMock)));
        dbPayments = mapTenant(JSON.parse(JSON.stringify(paymentsMock)));
        dbTransactions = mapTenant(JSON.parse(JSON.stringify(transactionsMock)));
        dbCoupons = mapTenant(JSON.parse(JSON.stringify(couponsMock)));
        dbTaxRules = [
            { id: 1, tenantId: 1, country: 'SA', name: 'VAT', rate: 15, status: 'Active' },
            { id: 2, tenantId: 1, country: 'AE', name: 'VAT', rate: 5, status: 'Active' }
        ];
        dbRefunds = [];
        dbAIChats = mapTenant(JSON.parse(JSON.stringify(aiHistoryMock)));
        dbAIPrompts = JSON.parse(JSON.stringify(aiPromptsMock));
        dbAIInsights = mapTenant(JSON.parse(JSON.stringify(aiInsightsMock)));
        dbIntegrations = mapTenant(JSON.parse(JSON.stringify(integrationsMock)));
        dbWebhooks = mapTenant(JSON.parse(JSON.stringify(webhooksMock)));
        dbWebhookLogs = JSON.parse(JSON.stringify(webhookLogsMock));
        dbCalendarSyncLogs = [];
        dbClients = mapTenant(JSON.parse(JSON.stringify(initialClients)));
        dbExercises = mapTenant(JSON.parse(JSON.stringify(exerciseCategories)));
        dbNutrition = mapTenant(JSON.parse(JSON.stringify(initialNutritionPlans)));
        dbCalendarEvents = mapTenant(JSON.parse(JSON.stringify(calendarEventsMock)).map(e => {
            if (e.id === 2) {
                return { ...e, roomId: 'Room A', branchId: 1, coachId: 1, tenantId: 1 };
            }
            if (e.id === 1) {
                return { ...e, branchId: 1, coachId: 1, tenantId: 1 };
            }
            return e;
        }));
        dbNotifications = mapTenant(JSON.parse(JSON.stringify(notificationsMock)));
        dbTasks = mapTenant(JSON.parse(JSON.stringify(tasksMock)));
        dbConversations = mapTenant(JSON.parse(JSON.stringify(initialConversations)));
        dbMessages = mapTenant(JSON.parse(JSON.stringify(initialMessages)));
        dbActivities = mapTenant(JSON.parse(JSON.stringify(initialActivities)));
        dbDocuments = mapTenant(JSON.parse(JSON.stringify(documentsMock)));
        dbMedia = mapTenant(JSON.parse(JSON.stringify(mediaMock)));
        dbAdminUsers = mapTenant(JSON.parse(JSON.stringify(initialAdminUsers)));
        dbBranches = mapTenant(JSON.parse(JSON.stringify(initialBranches)));
        dbAuditLogs = mapTenant(JSON.parse(JSON.stringify(initialAuditLogs)));

        dbDevices = [];
        dbSyncQueue = [];
        dbCacheEntries = [];
        dbDeveloperApps = [];
        dbApiKeys = [];
        dbOauthCodes = [];
        dbOauthTokens = [];
        dbApiLogs = [];
        dbRateLimits.clear();
        dbSecurityLogs = [];
        dbActiveSessions = [];
        dbTrustedDevices = [];
        dbMfaSettings.clear();
        dbSsoSettings = [];
        dbSecretsVault = [];
        dbEnterprisePolicy = null;
        dbSecurityConfig = null;
        dbWorkflows = [];
        dbWorkflowRuns = [];
        dbWorkflowTemplates = [];
        dbAutomationRules = [];
        dbApprovals = [];
        dbBackgroundJobs = [];
        dbAutomationLogs = [];

        dbDevOpsMetrics = [
            { id: 1, tenantId: 1, key: 'system.cpu.usage', value: 12.5, unit: '%', timestamp: new Date().toISOString() },
            { id: 2, tenantId: 1, key: 'system.memory.used', value: 2048, unit: 'MB', timestamp: new Date().toISOString() },
            { id: 3, tenantId: 1, key: 'system.network.latency', value: 15, unit: 'ms', timestamp: new Date().toISOString() }
        ];
        dbDevOpsLogs = [
            { id: 1, tenantId: 1, timestamp: new Date().toISOString(), level: 'Info', category: 'Application', message: 'تم تشغيل خادم المنصة بنجاح.', context: {} },
            { id: 2, tenantId: 1, timestamp: new Date().toISOString(), level: 'Warning', category: 'Database', message: 'تحذير: استعلام بطيء في قاعدة البيانات.', context: { queryTimeMs: 420 } },
            { id: 3, tenantId: 1, timestamp: new Date().toISOString(), level: 'Info', category: 'Security', message: 'نجاح تسجيل دخول المسؤول أحمد عبد الله.', context: { ip: '192.168.1.1' } }
        ];
        dbDevOpsTraces = [
            { id: 1, tenantId: 1, traceId: 'tr-001', parentId: null, name: 'GET /api/clients', correlationId: 'c-100', startTime: new Date().toISOString(), durationMs: 45, status: 'Success', tags: { tenantId: '1' } },
            { id: 2, tenantId: 1, traceId: 'tr-002', parentId: 'tr-001', name: 'db.query SELECT * FROM clients', correlationId: 'c-100', startTime: new Date().toISOString(), durationMs: 12, status: 'Success', tags: {} }
        ];
        dbDevOpsAlerts = [
            { id: 1, tenantId: 1, title: 'ارتفاع معدل استهلاك الذاكرة', message: 'معدل استهلاك الذاكرة تجاوز 85%', severity: 'Warning', status: 'Active', category: 'System', createdAt: new Date().toISOString() },
            { id: 2, tenantId: 1, title: 'فشل مزامنة الموردين الخارجيين', message: 'فشل مزامنة تقويم Google لأكثر من 5 محاولات متتالية', severity: 'Critical', status: 'Active', category: 'API', createdAt: new Date().toISOString() }
        ];
        dbDevOpsFeatureFlags = [
            { id: 1, tenantId: 1, key: 'nutritionModule', label: 'وحدة استشارات التغذية (Nutrition Module)', description: 'تتيح للمدربين تصميم ومتابعة جداول الحمية الغذائية للمتدربين.', status: 'Active', rolloutPercent: 100 },
            { id: 2, tenantId: 1, key: 'analyticsDashboard', label: 'لوحة التحكم والتحليلات الإدارية (Analytics)', description: 'تتيح عرض الرسوم والتقارير المالية والتدفقات النقدية.', status: 'Active', rolloutPercent: 100 },
            { id: 3, tenantId: 1, key: 'betaRealtime', label: 'أدوات البث المباشر التجريبية (Beta Realtime)', description: 'ميزات البث الفوري والتواصل المباشر مع طاقم التدريب.', status: 'Active', rolloutPercent: 50 },
            { id: 4, tenantId: 1, key: 'exportPDF', label: 'محرك تصدير ملفات PDF (Export PDF Engine)', description: 'تصدير التقارير الإدارية والخطط التغذوية بصيغة PDF.', status: 'Active', rolloutPercent: 100 }
        ];
        dbDevOpsReleases = [
            { id: 1, tenantId: 1, version: '1.0.0', channel: 'Production', status: 'Deployed', description: 'Official Launch', deployedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() },
            { id: 2, tenantId: 1, version: '1.1.0', channel: 'Production', status: 'Deployed', description: 'Performance & offline updates', deployedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
            { id: 3, tenantId: 1, version: '1.2.0-canary', channel: 'Canary', status: 'Deployed', description: 'AI & Security portal updates', deployedAt: new Date().toISOString(), canaryWeight: 10 }
        ];
        dbDevOpsProfiling = [
            { id: 1, tenantId: 1, cpuUsage: 22, memoryUsedMB: 512, memoryTotalMB: 4096, timestamp: new Date().toISOString() },
            { id: 2, tenantId: 1, cpuUsage: 35, memoryUsedMB: 540, memoryTotalMB: 4096, timestamp: new Date().toISOString() }
        ];

        dbTenants = [
            { id: 1, name: 'Rezk Fit Hub Default', domain: 'default.rezkfit.com', status: 'Active', contactEmail: 'default@rezkfit.com', planId: 'Professional', createdAt: '2026-01-01T00:00:00Z' },
            { id: 2, name: 'Elite Fitness Center', domain: 'elite.rezkfit.com', status: 'Active', contactEmail: 'elite@rezkfit.com', planId: 'Starter', createdAt: '2026-03-01T00:00:00Z' },
            { id: 3, name: 'Saudi Iron Gym', domain: 'saudi.rezkfit.com', status: 'Suspended', contactEmail: 'saudi@saudigym.com', planId: 'Business', createdAt: '2026-05-15T00:00:00Z' }
        ];
        dbTenantSettings = [
            { tenantId: 1, companyName: 'Rezk Fit Hub', primaryColor: '#0ea5e9', secondaryColor: '#64748b', logo: '/logo.png', darkLogo: '/logo-dark.png', favicon: '/favicon.ico', typography: 'Inter', emailTemplate: '', reportBranding: true, invoiceBranding: true },
            { tenantId: 2, companyName: 'Elite Fitness', primaryColor: '#10b981', secondaryColor: '#3b82f6', logo: '/elite-logo.png', darkLogo: '/elite-logo-dark.png', favicon: '/elite-favicon.ico', typography: 'Outfit', emailTemplate: '', reportBranding: true, invoiceBranding: true },
            { tenantId: 3, companyName: 'Saudi Gym', primaryColor: '#f97316', secondaryColor: '#1e293b', logo: '/saudi-logo.png', darkLogo: '/saudi-logo-dark.png', favicon: '/saudi-favicon.ico', typography: 'Roboto', emailTemplate: '', reportBranding: true, invoiceBranding: true }
        ];
        dbSubscriptions = [
            { id: 1, tenantId: 1, planId: 'Professional', status: 'Active', startDate: '2026-01-01T00:00:00Z', endDate: '2027-01-01T00:00:00Z', limits: { users: 10, storageGb: 20, reportsEnabled: true, analyticsEnabled: true, realtimeEnabled: true, exportsEnabled: true, apiAccessEnabled: true } },
            { id: 2, tenantId: 2, planId: 'Starter', status: 'Active', startDate: '2026-03-01T00:00:00Z', endDate: '2027-03-01T00:00:00Z', limits: { users: 3, storageGb: 5, reportsEnabled: false, analyticsEnabled: true, realtimeEnabled: false, exportsEnabled: false, apiAccessEnabled: false } },
            { id: 3, tenantId: 3, planId: 'Business', status: 'Expired', startDate: '2026-05-15T00:00:00Z', endDate: '2026-07-01T00:00:00Z', limits: { users: 20, storageGb: 50, reportsEnabled: true, analyticsEnabled: true, realtimeEnabled: true, exportsEnabled: true, apiAccessEnabled: true } }
        ];
        dbLicenses = [
            { id: 1, tenantId: 1, licenseKey: 'LICENSE-KEY-REZKFIT-PROFESSIONAL-2026', status: 'Active', issuedAt: '2026-01-01T00:00:00Z', expiresAt: '2027-01-01T00:00:00Z', seatsCount: 10, deviceCount: 5, offlineData: null },
            { id: 2, tenantId: 2, licenseKey: 'LICENSE-KEY-ELITEFIT-STARTER-2026', status: 'Active', issuedAt: '2026-03-01T00:00:00Z', expiresAt: '2027-03-01T00:00:00Z', seatsCount: 3, deviceCount: 2, offlineData: null },
            { id: 3, tenantId: 3, licenseKey: 'LICENSE-KEY-SAUDIGYM-EXPIRED-2026', status: 'Expired', issuedAt: '2026-05-15T00:00:00Z', expiresAt: '2026-07-01T00:00:00Z', seatsCount: 20, deviceCount: 10, offlineData: null }
        ];

        dbCollaborationComments = [
            {
                id: 1,
                entityType: 'Client',
                entityId: 1,
                text: 'يحتاج هذا المتدرب إلى زيادة تكرارات تمارين الصدر في الخطة القادمة.',
                author: 'الكوتش أحمد',
                authorAvatar: '👨‍و',
                parentId: null,
                timestamp: '2026-07-15T10:00:00Z',
                reactions: { '👍': [2] },
                isPinned: true,
                isResolved: false
            },
            {
                id: 2,
                entityType: 'Client',
                entityId: 1,
                text: 'تم تعديل السعرات الحرارية والبروتين بناءً على مقاييس الوزن الأخيرة.',
                author: 'سارة أحمد',
                authorAvatar: '👩‍⚕️',
                parentId: null,
                timestamp: '2026-07-15T12:00:00Z',
                reactions: {},
                isPinned: false,
                isResolved: false
            },
            {
                id: 3,
                entityType: 'Client',
                entityId: 1,
                text: 'ممتاز، سأقوم بمتابعة أدائه غداً.',
                author: 'الكوتش أحمد',
                authorAvatar: '👨‍و',
                parentId: 2,
                timestamp: '2026-07-15T12:30:00Z',
                reactions: {},
                isPinned: false,
                isResolved: false
            }
        ];
        dbCollaborationLocks = {};
        dbMergeRequests = [];
    },
    clients: {
        getAll: () => safeClone(dbClients.filter(c => c.tenantId === activeTenantId)),
        getById: (id) => safeClone(dbClients.find(c => c.id === Number(id) && c.tenantId === activeTenantId) || null),
        create: (data) => {
            const newClient = {
                id: dbClients.length > 0 ? Math.max(...dbClients.map(c => c.id)) + 1 : 1,
                avatar: data.avatar || "👤",
                progress: Number(data.progress ?? 0),
                workouts: Number(data.workouts ?? 0),
                streak: Number(data.streak ?? 0),
                subscriptionStatus: data.subscriptionStatus || "نشط",
                joinDate: data.joinDate || new Date().toISOString().split('T')[0],
                assignedCategoryId: data.assignedCategoryId || null,
                tenantId: activeTenantId,
                ...data
            };
            dbClients.push(newClient);
            
            // Auto log activity
            generateSystemActivity("Client", `تم تسجيل المتدرب الجديد ${newClient.name} بنجاح.`, "الكوتش أحمد", newClient.id);
            generateAuditLog("Client Created", "Clients", `تم تسجيل متدرب جديد: ${newClient.name}`);


            // Auto generate notifications
            generateSystemNotification(
                "متدرب جديد",
                `تم تسجيل المتدرب الجديد ${newClient.name} بنجاح.`,
                "Client Created",
                "Normal",
                newClient.id,
                `/clients/${newClient.id}`,
                "indigo",
                "👤"
            );
            
            // Auto generate tasks
            generateSystemTask(
                "مراجعة الملف التعريفي والهدف", 
                "الاطلاع على معلومات المتدرب الجديد وتصميم التخطيط الأولي له.", 
                "Assessment", 
                "Medium", 
                newClient.id
            );

            if (newClient.assignedCategoryId) {
                generateSystemActivity("Workout", `تم تعيين برنامج تمارين (${newClient.assignedCategoryId}) للمتدرب ${newClient.name}.`, "الكوتش أحمد", newClient.id);

                generateSystemNotification(
                    "تم تعيين برنامج تمارين",
                    `تم تعيين فئة التمارين (${newClient.assignedCategoryId}) للمتدرب ${newClient.name}.`,
                    "Workout Assigned",
                    "Normal",
                    newClient.id,
                    `/clients/${newClient.id}`,
                    "purple",
                    "💪"
                );
                
                generateSystemTask(
                    "تصميم ومتابعة جدول التمارين", 
                    `التحقق من التزام المتدرب بجدول تمارين (${newClient.assignedCategoryId}) ومستواه البدني.`, 
                    "Workout", 
                    "High", 
                    newClient.id
                );
            }

            return safeClone(newClient);
        },
        update: (id, data) => {
            const index = dbClients.findIndex(c => c.id === Number(id));
            if (index !== -1) {
                const oldClient = dbClients[index];
                dbClients[index] = {
                    ...dbClients[index],
                    ...data,
                    id: Number(id) // ensure id stays numeric and unchanged
                };
                const updatedClient = dbClients[index];

                // Auto log activity
                generateSystemActivity("Client", `تم تحديث بيانات المتدرب ${updatedClient.name}.`, "الكوتش أحمد", Number(id));

                // Auto generate notifications
                generateSystemNotification(
                    "تحديث بيانات متدرب",
                    `تم تحديث بيانات المتدرب ${updatedClient.name}.`,
                    "Client Updated",
                    "Normal",
                    Number(id),
                    `/clients/${id}`,
                    "blue",
                    "📝"
                );
                
                if (data.assignedCategoryId && data.assignedCategoryId !== oldClient.assignedCategoryId) {
                    generateSystemActivity("Workout", `تم تعيين برنامج تمارين (${data.assignedCategoryId}) للمتدرب ${updatedClient.name}.`, "الكوتش أحمد", Number(id));

                    generateSystemNotification(
                        "تم تعيين برنامج تمارين",
                        `تم تعيين فئة التمارين (${data.assignedCategoryId}) للمتدرب ${updatedClient.name}.`,
                        "Workout Assigned",
                        "Normal",
                        Number(id),
                        `/clients/${id}`,
                        "purple",
                        "💪"
                    );

                    generateSystemTask(
                        "تصميم ومتابعة جدول التمارين", 
                        `التحقق من التزام المتدرب بجدول تمارين (${data.assignedCategoryId}) ومستواه البدني.`, 
                        "Workout", 
                        "High", 
                        Number(id)
                    );
                }

                return safeClone(dbClients[index]);
            }
            return null;
        },
        delete: (id) => {
            const index = dbClients.findIndex(c => c.id === Number(id));
            if (index !== -1) {
                const client = dbClients[index];
                dbClients.splice(index, 1);
                generateAuditLog("Client Deleted", "Clients", `تم حذف المتدرب: ${client.name} من النظام`);

                // Also clean up client assignment from nutrition plans
                dbNutrition = dbNutrition.map(plan => {
                    if (plan.assignedClientId === Number(id)) {
                        return { ...plan, assignedClientId: null };
                    }
                    return plan;
                });

                // Auto log activity
                generateSystemActivity("Client", `تم إزالة المتدرب ${client.name} من النظام.`, "الكوتش أحمد", null);

                // Auto generate notifications
                generateSystemNotification(
                    "حذف متدرب",
                    `تم إزالة المتدرب ${client.name} من النظام.`,
                    "Client Deleted",
                    "High",
                    null,
                    null,
                    "red",
                    "🗑️"
                );

                return true;
            }
            return false;
        }
    },

    exercises: {
        getAllCategories: () => safeClone(dbExercises),
        getExercisesByCategory: (categoryId) => {
            const category = dbExercises.find(c => c.id === categoryId);
            return category ? safeClone(category.exercises) : [];
        },
        createExercise: (categoryId, data) => {
            let maxId = 0;
            dbExercises.forEach(cat => {
                cat.exercises.forEach(ex => {
                    if (ex.id > maxId) maxId = ex.id;
                });
            });
            const newExercise = {
                id: maxId + 1,
                ...data,
                participants: Number(data.participants ?? 0)
            };
            const category = dbExercises.find(c => c.id === categoryId);
            if (category) {
                category.exercises.push(newExercise);
                return safeClone(newExercise);
            }
            return null;
        },
        updateExercise: (id, data) => {
            for (const category of dbExercises) {
                const index = category.exercises.findIndex(e => e.id === Number(id));
                if (index !== -1) {
                    category.exercises[index] = {
                        ...category.exercises[index],
                        ...data,
                        id: Number(id)
                    };
                    return safeClone(category.exercises[index]);
                }
            }
            return null;
        },
        deleteExercise: (id) => {
            for (const category of dbExercises) {
                const index = category.exercises.findIndex(e => e.id === Number(id));
                if (index !== -1) {
                    category.exercises.splice(index, 1);
                    return true;
                }
            }
            return false;
        }
    },

    nutrition: {
        getAllPlans: () => safeClone(dbNutrition),
        getById: (id) => safeClone(dbNutrition.find(p => p.id === Number(id)) || null),
        createPlan: (data) => {
            const newPlan = {
                id: dbNutrition.length > 0 ? Math.max(...dbNutrition.map(p => p.id)) + 1 : 1,
                participants: Number(data.participants ?? 0),
                calories: Number(data.calories ?? 2000),
                ...data
            };
            dbNutrition.push(newPlan);

            // Auto generate notification if assigned to client
            if (newPlan.assignedClientId) {
                generateSystemActivity("Nutrition", `تم تعيين الخطة الغذائية الجديدة (${newPlan.name}) للمتدرب.`, "أخصائي التغذية", newPlan.assignedClientId);

                generateSystemNotification(
                    "تم تعيين خطة غذائية",
                    `تم تعيين الخطة الغذائية الجديدة (${newPlan.name}) للمتدرب.`,
                    "Nutrition Assigned",
                    "Normal",
                    newPlan.assignedClientId,
                    `/clients/${newPlan.assignedClientId}`,
                    "orange",
                    "🍎"
                );

                generateSystemTask(
                    "متابعة الالتزام بالنظام الغذائي", 
                    `التأكد من التزام المتدرب بالوجبات الغذائية المخصصة له والسعرات الحرارية اليومية.`, 
                    "Nutrition", 
                    "High", 
                    newPlan.assignedClientId
                );
            }

            return safeClone(newPlan);
        },
        updatePlan: (id, data) => {
            const index = dbNutrition.findIndex(p => p.id === Number(id));
            if (index !== -1) {
                const oldPlan = dbNutrition[index];
                dbNutrition[index] = {
                    ...dbNutrition[index],
                    ...data,
                    id: Number(id)
                };
                const updatedPlan = dbNutrition[index];

                // Auto log activity
                if (updatedPlan.assignedClientId && updatedPlan.assignedClientId !== oldPlan.assignedClientId) {
                    generateSystemActivity("Nutrition", `تم تعيين الخطة الغذائية (${updatedPlan.name}) للمتدرب.`, "أخصائي التغذية", updatedPlan.assignedClientId);
                } else {
                    generateSystemActivity("Nutrition", `تم تحديث الخطة الغذائية (${updatedPlan.name}).`, "أخصائي التغذية", updatedPlan.assignedClientId);
                }

                // Auto generate notification on assignment updates
                if (updatedPlan.assignedClientId && updatedPlan.assignedClientId !== oldPlan.assignedClientId) {
                    generateSystemNotification(
                        "تحديث الخطة الغذائية",
                        `تم تعيين الخطة الغذائية (${updatedPlan.name}) للمتدرب.`,
                        "Nutrition Assigned",
                        "Normal",
                        updatedPlan.assignedClientId,
                        `/clients/${updatedPlan.assignedClientId}`,
                        "orange",
                        "🍎"
                    );

                    generateSystemTask(
                        "متابعة الالتزام بالنظام الغذائي", 
                        `التأكد من التزام المتدرب بالوجبات الغذائية المخصصة له والسعرات الحرارية اليومية.`, 
                        "Nutrition", 
                        "High", 
                        updatedPlan.assignedClientId
                    );
                } else if (data.name && data.name !== oldPlan.name && updatedPlan.assignedClientId) {
                    generateSystemNotification(
                        "تحديث الخطة الغذائية",
                        `تم تعديل تفاصيل الخطة الغذائية (${updatedPlan.name}).`,
                        "Nutrition Updated",
                        "Low",
                        updatedPlan.assignedClientId,
                        `/clients/${updatedPlan.assignedClientId}`,
                        "teal",
                        "🥗"
                    );
                }

                return safeClone(dbNutrition[index]);
            }
            return null;
        },
        deletePlan: (id) => {
            const index = dbNutrition.findIndex(p => p.id === Number(id));
            if (index !== -1) {
                dbNutrition.splice(index, 1);
                return true;
            }
            return false;
        }
    },
    calendarEvents: {
        getAll: (filters = {}) => {
            const now = Date.now();
            let list = dbCalendarEvents.map(e => {
                if (e.lock && e.lock.isLocked && e.lock.timeoutAt && now > Number(e.lock.timeoutAt)) {
                    return { ...e, lock: { isLocked: false, lockedBy: null, lockedAt: null, timeoutAt: null } };
                }
                return e;
            });

            if (filters.search) {
                const term = filters.search.toLowerCase().trim();
                list = list.filter(e => 
                    e.title.toLowerCase().includes(term) || 
                    e.description.toLowerCase().includes(term) ||
                    (e.notes && e.notes.toLowerCase().includes(term))
                );
            }
            if (filters.status) {
                list = list.filter(e => e.status === filters.status);
            }
            if (filters.type) {
                list = list.filter(e => e.type === filters.type);
            }
            if (filters.coachId) {
                list = list.filter(e => String(e.coachId) === String(filters.coachId));
            }
            if (filters.clientId) {
                list = list.filter(e => String(e.clientId) === String(filters.clientId));
            }
            if (filters.roomId) {
                list = list.filter(e => String(e.roomId) === String(filters.roomId));
            }
            if (filters.equipmentId) {
                list = list.filter(e => String(e.equipmentId) === String(filters.equipmentId));
            }
            if (filters.branchId) {
                list = list.filter(e => String(e.branchId) === String(filters.branchId));
            }
            if (filters.nutritionistId) {
                list = list.filter(e => String(e.nutritionistId) === String(filters.nutritionistId));
            }
            if (filters.date) {
                list = list.filter(e => e.date === filters.date);
            }
            if (filters.month) {
                list = list.filter(e => e.date.startsWith(filters.month));
            }
            if (filters.startDate && filters.endDate) {
                list = list.filter(e => e.date >= filters.startDate && e.date <= filters.endDate);
            }

            // Apply Sorting
            if (filters.sortBy) {
                if (filters.sortBy === 'Newest') {
                    list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
                } else if (filters.sortBy === 'Oldest') {
                    list.sort((a, b) => (a.createdAt || '').localeCompare(b.createdAt || ''));
                } else if (filters.sortBy === 'Start Time') {
                    list.sort((a, b) => a.startTime.localeCompare(b.startTime));
                } else if (filters.sortBy === 'End Time') {
                    list.sort((a, b) => a.endTime.localeCompare(b.endTime));
                } else if (filters.sortBy === 'Status') {
                    list.sort((a, b) => a.status.localeCompare(b.status));
                }
            } else {
                list.sort((a, b) => a.startTime.localeCompare(b.startTime));
            }

            return safeClone(list);
        },
        getById: (id) => {
            const e = dbCalendarEvents.find(e => e.id === Number(id));
            if (!e) return null;
            const now = Date.now();
            if (e.lock && e.lock.isLocked && e.lock.timeoutAt && now > Number(e.lock.timeoutAt)) {
                e.lock = { isLocked: false, lockedBy: null, lockedAt: null, timeoutAt: null };
            }
            return safeClone(e);
        },
        create: (data) => {
            const nextId = dbCalendarEvents.length > 0 ? Math.max(...dbCalendarEvents.map(e => e.id)) + 1 : 1;
            const parseTime = (t) => {
                if (!t) return 0;
                const [h, m] = t.split(':').map(Number);
                return h * 60 + m;
            };
            const computedDuration = data.startTime && data.endTime 
                ? (parseTime(data.endTime) - parseTime(data.startTime))
                : 60;

            const baseEvent = {
                id: nextId,
                description: data.description ?? '',
                status: data.status ?? 'Scheduled',
                coachId: data.coachId ?? 1,
                clientId: data.clientId ?? null,
                color: data.color ?? 'blue',
                notes: data.notes ?? '',
                duration: computedDuration,
                createdBy: data.createdBy ?? 'Coach',
                updatedBy: data.updatedBy ?? 'Coach',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                branchId: data.branchId ?? 1,
                roomId: data.roomId ?? null,
                equipmentId: data.equipmentId ?? null,
                nutritionistId: data.nutritionistId ?? null,
                isRecurring: !!data.isRecurring,
                recurringPattern: data.recurringPattern ?? null,
                lock: { isLocked: false, lockedBy: null, lockedAt: null, timeoutAt: null },
                ...data
            };

            if (baseEvent.isRecurring && baseEvent.recurringPattern) {
                const instances = generateRecurringInstances(baseEvent, baseEvent.recurringPattern, nextId, []);
                instances.forEach((inst, idx) => {
                    dbCalendarEvents.push(inst);
                    generateSystemActivity("Appointment", `تم جدولة تكرار: ${inst.title} بتاريخ ${inst.date}.`, "الكوتش أحمد", inst.clientId);
                    if (idx === 0) {
                        generateSystemTask(
                            `التحضير للقاء: ${inst.title}`,
                            `تحضير الجلسة المجدولة بتاريخ ${inst.date}`,
                            inst.type || 'Consultation',
                            'Medium',
                            inst.clientId,
                            inst.id,
                            inst.date
                        );
                    }
                });
                const firstResult = safeClone(instances[0]);
                eventBus.publish(SOCKET_EVENTS.APPOINTMENT_CREATED, firstResult);
                return firstResult;
            } else {
                dbCalendarEvents.push(baseEvent);
                generateSystemActivity("Appointment", `تم جدولة موعد جديد: ${baseEvent.title} بتاريخ ${baseEvent.date}.`, "الكوتش أحمد", baseEvent.clientId);
                generateAuditLog("Appointment Created", "Calendar", `تم حجز موعد جديد: ${baseEvent.title} بتاريخ ${baseEvent.date}`);

                generateSystemNotification(
                    "تم حجز موعد جديد",
                    `تم جدولة موعد جديد: ${baseEvent.title} بتاريخ ${baseEvent.date}.`,
                    "Appointment Reminder",
                    "Normal",
                    baseEvent.clientId,
                    '/calendar',
                    "blue",
                    "📅"
                );

                generateSystemTask(
                    `التحضير للقاء: ${baseEvent.title}`,
                    `تحضير الجلسة المجدولة بتاريخ ${baseEvent.date}`,
                    baseEvent.type || 'Consultation',
                    'Medium',
                    baseEvent.clientId,
                    baseEvent.id,
                    baseEvent.date
                );

                const finalResult = safeClone(baseEvent);
                eventBus.publish(SOCKET_EVENTS.APPOINTMENT_CREATED, finalResult);
                return finalResult;
            }
        },
        update: (id, data) => {
            const index = dbCalendarEvents.findIndex(e => e.id === Number(id));
            if (index !== -1) {
                const original = dbCalendarEvents[index];

                const now = Date.now();
                if (original.lock && original.lock.isLocked && original.lock.timeoutAt && now < Number(original.lock.timeoutAt)) {
                    if (data.updatedBy && data.updatedBy !== original.lock.lockedBy) {
                        return null;
                    }
                }

                const parseTime = (t) => {
                    if (!t) return 0;
                    const [h, m] = t.split(':').map(Number);
                    return h * 60 + m;
                };
                
                const finalStartTime = data.startTime ?? original.startTime;
                const finalEndTime = data.endTime ?? original.endTime;
                const computedDuration = (parseTime(finalEndTime) - parseTime(finalStartTime));

                dbCalendarEvents[index] = {
                    ...original,
                    ...data,
                    duration: computedDuration > 0 ? computedDuration : original.duration,
                    updatedBy: data.updatedBy ?? 'Coach',
                    updatedAt: new Date().toISOString(),
                    id: Number(id),
                    lock: { isLocked: false, lockedBy: null, lockedAt: null, timeoutAt: null }
                };
                const updated = dbCalendarEvents[index];

                if (data.status === 'Cancelled' && original.status !== 'Cancelled') {
                    generateSystemActivity("Appointment", `تم إلغاء الموعد المجدول: ${updated.title}.`, "الكوتش أحمد", updated.clientId);
                    generateSystemNotification(
                        "تم إلغاء الموعد",
                        `تم إلغاء الموعد الجدولة: ${updated.title}.`,
                        "Appointment Cancelled",
                        "Critical",
                        updated.clientId,
                        '/calendar',
                        "red",
                        "❌"
                    );
                } else if ((data.date && data.date !== original.date) || (data.startTime && data.startTime !== original.startTime)) {
                    generateSystemActivity("Appointment", `تم نقل موعد ${updated.title} إلى ${updated.date} في تمام الساعة ${updated.startTime}.`, "الكوتش أحمد", updated.clientId);
                    generateSystemNotification(
                        "تغيير موعد اللقاء",
                        `تم نقل موعد ${updated.title} إلى ${updated.date} في تمام الساعة ${updated.startTime}.`,
                        "Appointment Updated",
                        "High",
                        updated.clientId,
                        '/calendar',
                        "yellow",
                        "🔄"
                    );
                } else {
                    generateSystemActivity("Appointment", `تم تحديث الموعد المجدول: ${updated.title}.`, "الكوتش أحمد", updated.clientId);
                }
                generateAuditLog("Appointment Updated", "Calendar", `تم تحديث الموعد: ${updated.title}`);

                eventBus.publish(SOCKET_EVENTS.APPOINTMENT_UPDATED, updated);
                return updated;
            }
            return null;
        },
        delete: (id) => {
            const index = dbCalendarEvents.findIndex(e => e.id === Number(id));
            if (index !== -1) {
                const original = dbCalendarEvents[index];
                dbCalendarEvents.splice(index, 1);
                
                generateSystemActivity("Appointment", `تم إزالة الفعالية المجدولة: ${original.title}.`, "الكوتش أحمد", original.clientId);
                generateSystemNotification(
                    "تم إلغاء الموعد",
                    `تم إزالة الفعالية المجدولة: ${original.title}.`,
                    "Appointment Cancelled",
                    "Critical",
                    original.clientId,
                    '/calendar',
                    "red",
                    "❌"
                );
                eventBus.publish(SOCKET_EVENTS.APPOINTMENT_DELETED, { appointmentId: Number(id), id: Number(id) });
                return true;
            }
            return false;
        },
        getByDate: (dateStr) => {
            return safeClone(dbCalendarEvents.filter(e => e.date === dateStr && e.status !== 'Cancelled'));
        },
        getByMonth: (yearMonth) => {
            return safeClone(dbCalendarEvents.filter(e => e.date.startsWith(yearMonth) && e.status !== 'Cancelled'));
        },
        getByWeek: (startOfWeek, endOfWeek) => {
            return safeClone(dbCalendarEvents.filter(e => e.date >= startOfWeek && e.date <= endOfWeek && e.status !== 'Cancelled'));
        },
        lock: (id, username) => {
            const index = dbCalendarEvents.findIndex(e => e.id === Number(id));
            if (index !== -1) {
                const now = Date.now();
                dbCalendarEvents[index].lock = {
                    isLocked: true,
                    lockedBy: username || 'مستخدم آخر',
                    lockedAt: new Date().toISOString(),
                    timeoutAt: String(now + 60000)
                };
                const result = safeClone(dbCalendarEvents[index]);
                eventBus.publish(SOCKET_EVENTS.APPOINTMENT_LOCKED, {
                    appointmentId: Number(id),
                    username: result.lock.lockedBy,
                    timeoutAt: result.lock.timeoutAt
                });
                return result;
            }
            return null;
        },
        unlock: (id) => {
            const index = dbCalendarEvents.findIndex(e => e.id === Number(id));
            if (index !== -1) {
                dbCalendarEvents[index].lock = {
                    isLocked: false,
                    lockedBy: null,
                    lockedAt: null,
                    timeoutAt: null
                };
                const result = safeClone(dbCalendarEvents[index]);
                eventBus.publish(SOCKET_EVENTS.APPOINTMENT_UNLOCKED, {
                    appointmentId: Number(id)
                });
                return result;
            }
            return null;
        },
        checkConflicts: (eventData) => {
            const capacityConfig = { 1: 5, 2: 3 };
            return detectConflicts(eventData, dbCalendarEvents, capacityConfig);
        },
        getAvailableSlots: (date, resourceId, resourceType) => {
            return findAvailableSlots(date, resourceId, resourceType, dbCalendarEvents, {});
        },
        getAnalytics: () => {
            const total = dbCalendarEvents.length;
            const completed = dbCalendarEvents.filter(e => e.status === 'Completed').length;
            const cancelled = dbCalendarEvents.filter(e => e.status === 'Cancelled').length;
            const missed = dbCalendarEvents.filter(e => e.status === 'Missed').length;

            const nonCancelledTotal = total - cancelled;
            const attendanceRate = nonCancelledTotal > 0 ? Math.round((completed / nonCancelledTotal) * 100) : 0;
            const cancellationRate = total > 0 ? Math.round((cancelled / total) * 100) : 0;

            const uniqueDates = [...new Set(dbCalendarEvents.map(e => e.date))];
            const avgPerDay = uniqueDates.length > 0 ? Number((total / uniqueDates.length).toFixed(1)) : 0;

            const coachUtilization = { 3: 75, 6: 40 };
            const roomUtilization = { "Room A": 65, "Room B": 30 };

            const hourCounts = {};
            dbCalendarEvents.forEach(e => {
                if (e.startTime) {
                    const hour = e.startTime.split(':')[0] + ':00';
                    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
                }
            });
            let peakHour = "10:00";
            let maxCount = 0;
            Object.entries(hourCounts).forEach(([hr, count]) => {
                if (count > maxCount) {
                    maxCount = count;
                    peakHour = hr;
                }
            });

            return {
                total,
                completed,
                cancelled,
                missed,
                attendanceRate,
                cancellationRate,
                avgPerDay,
                coachUtilization,
                roomUtilization,
                peakHour
            };
        }
    },

    notifications: {
        getAll: () => safeClone(dbNotifications),
        getById: (id) => safeClone(dbNotifications.find(n => n.id === Number(id)) || null),
        create: (data) => {
            const newNotif = {
                id: dbNotifications.length > 0 ? Math.max(...dbNotifications.map(n => n.id)) + 1 : 1,
                priority: data.priority || "Normal",
                status: data.status || "Unread",
                createdAt: data.createdAt || new Date().toISOString(),
                readAt: data.readAt || null,
                actionUrl: data.actionUrl || null,
                clientId: data.clientId ? Number(data.clientId) : null,
                icon: data.icon || "🔔",
                color: data.color || "blue",
                ...data
            };
            dbNotifications.push(newNotif);
            return safeClone(newNotif);
        },
        update: (id, data) => {
            const index = dbNotifications.findIndex(n => n.id === Number(id));
            if (index !== -1) {
                dbNotifications[index] = {
                    ...dbNotifications[index],
                    ...data,
                    id: Number(id)
                };
                return safeClone(dbNotifications[index]);
            }
            return null;
        },
        delete: (id) => {
            const index = dbNotifications.findIndex(n => n.id === Number(id));
            if (index !== -1) {
                dbNotifications.splice(index, 1);
                return true;
            }
            return false;
        },
        markAllAsRead: () => {
            dbNotifications = dbNotifications.map(n => {
                if (n.status === 'Unread') {
                    return { ...n, status: 'Read', readAt: new Date().toISOString() };
                }
                return n;
            });
            return true;
        }
    },

    tasks: {
        getAll: () => safeClone(dbTasks),
        getById: (id) => safeClone(dbTasks.find(t => t.id === Number(id)) || null),
        create: (data) => {
            const newTask = {
                id: dbTasks.length > 0 ? Math.max(...dbTasks.map(t => t.id)) + 1 : 1,
                title: data.title,
                description: data.description || '',
                clientId: data.clientId ? Number(data.clientId) : null,
                appointmentId: data.appointmentId ? Number(data.appointmentId) : null,
                assignedTo: data.assignedTo || 'Coach',
                priority: data.priority || 'Medium',
                status: data.status || 'Todo',
                category: data.category || 'Reminder',
                startDate: data.startDate || new Date().toISOString().split('T')[0],
                dueDate: data.dueDate || null,
                completedAt: data.completedAt || null,
                estimatedMinutes: Number(data.estimatedMinutes || 0),
                actualMinutes: Number(data.actualMinutes || 0),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            dbTasks.push(newTask);
            
            // Auto log activity
            generateSystemActivity("Task", `تم إضافة مهمة جديدة: "${newTask.title}" لفئة ${newTask.category}.`, "الكوتش أحمد", newTask.clientId);
            generateAuditLog("Task Created", "Tasks", `تم إنشاء مهمة جديدة: ${newTask.title}`);


            // Notification on task created
            generateSystemNotification(
                "مهمة جديدة مجدولة",
                `تم إضافة مهمة جديدة: "${newTask.title}" لفئة ${newTask.category}.`,
                "Task Created",
                newTask.priority === 'Critical' ? 'Critical' : newTask.priority === 'High' ? 'High' : 'Normal',
                newTask.clientId,
                '/tasks',
                'purple',
                '📋'
            );

            return safeClone(newTask);
        },
        update: (id, data) => {
            const index = dbTasks.findIndex(t => t.id === Number(id));
            if (index !== -1) {
                const oldTask = dbTasks[index];
                
                let completedAtVal = data.completedAt || oldTask.completedAt;
                if (data.status === 'Completed' && oldTask.status !== 'Completed') {
                    completedAtVal = new Date().toISOString();
                } else if (data.status && data.status !== 'Completed') {
                    completedAtVal = null;
                }

                dbTasks[index] = {
                    ...oldTask,
                    ...data,
                    completedAt: completedAtVal,
                    updatedAt: new Date().toISOString(),
                    id: Number(id)
                };
                const updatedTask = dbTasks[index];

                // Notifications & Activity on updates
                if (updatedTask.status === 'Completed' && oldTask.status !== 'Completed') {
                    generateSystemActivity("Task", `تم اكتمال المهمة: "${updatedTask.title}" بنجاح.`, "الكوتش أحمد", updatedTask.clientId);
                    generateAuditLog("Task Completed", "Tasks", `تم إنجاز المهمة بنجاح: ${updatedTask.title}`);

                    generateSystemNotification(
                        "تم إنجاز المهمة",
                        `تم اكتمال المهمة: "${updatedTask.title}" بنجاح.`,
                        "Task Completed",
                        "Normal",
                        updatedTask.clientId,
                        '/tasks',
                        'green',
                        '✅'
                    );
                } else if (updatedTask.status === 'Overdue' && oldTask.status !== 'Overdue') {
                    generateSystemActivity("Task", `تنبيه: المهمة "${updatedTask.title}" متأخرة استحقاقاً.`, "الكوتش أحمد", updatedTask.clientId);

                    generateSystemNotification(
                        "مهمة متأخرة استحقاقاً",
                        `تنبيه: المهمة "${updatedTask.title}" قد تجاوزت تاريخ استحقاقها المجدول.`,
                        "Task Overdue",
                        "High",
                        updatedTask.clientId,
                        '/tasks',
                        'red',
                        '⚠️'
                    );
                } else if (data.assignedTo && data.assignedTo !== oldTask.assignedTo) {
                    generateSystemActivity("Task", `تم إعادة تعيين مهمة "${updatedTask.title}" إلى ${data.assignedTo}.`, "الكوتش أحمد", updatedTask.clientId);

                    generateSystemNotification(
                        "إعادة تعيين المهمة",
                        `تم إعادة تعيين مهمة "${updatedTask.title}" إلى ${data.assignedTo}.`,
                        "Task Reassigned",
                        "Normal",
                        updatedTask.clientId,
                        '/tasks',
                        'blue',
                        '👤'
                    );
                } else {
                    generateSystemActivity("Task", `تم تحديث المهمة: "${updatedTask.title}".`, "الكوتش أحمد", updatedTask.clientId);
                }
                if (updatedTask.status !== 'Completed' || oldTask.status === 'Completed') {
                    generateAuditLog("Task Updated", "Tasks", `تحديث بيانات المهمة: ${updatedTask.title}`);
                }

                return safeClone(dbTasks[index]);
            }
            return null;
        },
        delete: (id) => {
            const index = dbTasks.findIndex(t => t.id === Number(id));
            if (index !== -1) {
                dbTasks.splice(index, 1);
                return true;
            }
            return false;
        },
        bulkUpdate: (ids, data) => {
            if (!Array.isArray(ids)) return false;
            ids.forEach(id => {
                const index = dbTasks.findIndex(t => t.id === Number(id));
                if (index !== -1) {
                    const oldTask = dbTasks[index];
                    let completedAtVal = data.completedAt || oldTask.completedAt;
                    if (data.status === 'Completed' && oldTask.status !== 'Completed') {
                        completedAtVal = new Date().toISOString();
                    } else if (data.status && data.status !== 'Completed') {
                        completedAtVal = null;
                    }

                    dbTasks[index] = {
                        ...oldTask,
                        ...data,
                        completedAt: completedAtVal,
                        updatedAt: new Date().toISOString(),
                        id: Number(id)
                    };
                }
            });
            return true;
        },
        getStatistics: () => {
            const todayStr = new Date().toISOString().split('T')[0];
            dbTasks = dbTasks.map(t => {
                if (t.status !== 'Completed' && t.status !== 'Cancelled' && t.dueDate && t.dueDate < todayStr && t.status !== 'Overdue') {
                    // Trigger notification
                    generateSystemNotification(
                        "مهمة متأخرة استحقاقاً",
                        `تنبيه: المهمة "${t.title}" قد تجاوزت تاريخ استحقاقها المجدول.`,
                        "Task Overdue",
                        "High",
                        t.clientId,
                        '/tasks',
                        'red',
                        '⚠️'
                    );
                    return { ...t, status: 'Overdue', updatedAt: new Date().toISOString() };
                }
                return t;
            });

            const total = dbTasks.length;
            const todo = dbTasks.filter(t => t.status === 'Todo').length;
            const inProgress = dbTasks.filter(t => t.status === 'In Progress').length;
            const completed = dbTasks.filter(t => t.status === 'Completed').length;
            const cancelled = dbTasks.filter(t => t.status === 'Cancelled').length;
            const overdue = dbTasks.filter(t => t.status === 'Overdue').length;

            const nonCancelledTotal = total - cancelled;
            const completionRate = nonCancelledTotal > 0 ? Math.round((completed / nonCancelledTotal) * 100) : 0;

            return {
                total,
                todo,
                inProgress,
                completed,
                cancelled,
                overdue,
                completionRate
            };
        }
    },
    messages: {
        getAll: (conversationId) => {
            return safeClone(dbMessages.filter(m => m.conversationId === Number(conversationId)));
        },
        create: (data) => {
            const timestamp = new Date().toISOString();
            const newMessage = {
                id: dbMessages.length > 0 ? Math.max(...dbMessages.map(m => m.id)) + 1 : 1,
                sender: data.sender || 'Coach',
                text: data.text,
                timestamp,
                read: data.sender === 'Coach',
                conversationId: Number(data.conversationId),
                attachment: data.attachment || null,
                status: data.sender === 'Coach' ? 'sent' : 'read',
                seenAt: data.sender === 'Coach' ? null : timestamp,
                readers: data.sender === 'Coach' ? [] : [{ userId: 2, name: 'سارة أحمد', readAt: timestamp }],
                reactions: []
            };
            dbMessages.push(newMessage);

            // Update lastMessage
            const conv = dbConversations.find(c => c.id === Number(data.conversationId));
            if (conv) {
                conv.lastMessage = data.text;
                conv.lastMessageAt = newMessage.timestamp;
                if (data.sender !== 'Coach') {
                    conv.unreadCount += 1;
                }
            }

            // Auto log activity
            generateSystemActivity("Message", `تم إرسال رسالة: "${data.text.slice(0, 30)}..."`, data.sender === 'Coach' ? 'الكوتش أحمد' : (conv?.clientName || 'متدرب'), conv?.clientId);

            return safeClone(newMessage);
        },
        edit: (id, text) => {
            const index = dbMessages.findIndex(m => m.id === Number(id));
            if (index !== -1) {
                dbMessages[index].text = text;
                const convId = dbMessages[index].conversationId;
                const conv = dbConversations.find(c => c.id === convId);
                if (conv) {
                    const thread = dbMessages.filter(m => m.conversationId === convId);
                    const lastMsg = thread[thread.length - 1];
                    if (lastMsg.id === Number(id)) {
                        conv.lastMessage = text;
                    }
                }
                return safeClone(dbMessages[index]);
            }
            return null;
        },
        delete: (id) => {
            const index = dbMessages.findIndex(m => m.id === Number(id));
            if (index !== -1) {
                const deletedMsg = dbMessages[index];
                dbMessages.splice(index, 1);
                const convId = deletedMsg.conversationId;
                const conv = dbConversations.find(c => c.id === convId);
                if (conv) {
                    const thread = dbMessages.filter(m => m.conversationId === convId);
                    if (thread.length > 0) {
                        const lastMsg = thread[thread.length - 1];
                        conv.lastMessage = lastMsg.text;
                        conv.lastMessageAt = lastMsg.timestamp;
                    } else {
                        conv.lastMessage = "بدء محادثة جديدة";
                    }
                }
                return true;
            }
            return false;
        },
        addReaction: (id, userId, userName, emoji) => {
            const index = dbMessages.findIndex(m => m.id === Number(id));
            if (index !== -1) {
                const msg = dbMessages[index];
                if (!msg.reactions) msg.reactions = [];
                const reactObj = msg.reactions.find(r => r.emoji === emoji);
                if (reactObj) {
                    if (!reactObj.userIds.includes(Number(userId))) {
                        reactObj.userIds.push(Number(userId));
                        reactObj.count = reactObj.userIds.length;
                    }
                } else {
                    msg.reactions.push({ emoji, count: 1, userIds: [Number(userId)] });
                }
                return safeClone(msg);
            }
            return null;
        },
        removeReaction: (id, userId, emoji) => {
            const index = dbMessages.findIndex(m => m.id === Number(id));
            if (index !== -1) {
                const msg = dbMessages[index];
                if (!msg.reactions) msg.reactions = [];
                const reactObj = msg.reactions.find(r => r.emoji === emoji);
                if (reactObj) {
                    reactObj.userIds = reactObj.userIds.filter(uid => uid !== Number(userId));
                    reactObj.count = reactObj.userIds.length;
                    if (reactObj.count === 0) {
                        msg.reactions = msg.reactions.filter(r => r.emoji !== emoji);
                    }
                }
                return safeClone(msg);
            }
            return null;
        }
    },
    conversations: {
        getAll: (filters = {}) => {
            let list = dbConversations.map(c => ({
                lastSeen: null,
                isMuted: false,
                isFavorite: false,
                ...c
            }));
            if (filters.search) {
                const query = filters.search.toLowerCase();
                list = list.filter(c => c.clientName.toLowerCase().includes(query) || c.lastMessage.toLowerCase().includes(query));
            }
            if (filters.status === 'Pinned') {
                list = list.filter(c => c.isPinned);
            } else if (filters.status === 'Archived') {
                list = list.filter(c => c.isArchived);
            } else if (filters.status === 'Muted') {
                list = list.filter(c => c.isMuted);
            } else if (filters.status === 'Favorite') {
                list = list.filter(c => c.isFavorite);
            } else if (filters.status === 'Unread') {
                list = list.filter(c => c.unreadCount > 0);
            } else {
                list = list.filter(c => !c.isArchived);
            }
            list.sort((a, b) => {
                if (a.isPinned && !b.isPinned) return -1;
                if (!a.isPinned && b.isPinned) return 1;
                return new Date(b.lastMessageAt) - new Date(a.lastMessageAt);
            });
            return safeClone(list);
        },
        getById: (id) => {
            const c = dbConversations.find(c => c.id === Number(id));
            return c ? safeClone({ lastSeen: null, isMuted: false, isFavorite: false, ...c }) : null;
        },
        getOrCreateByClient: (clientId, clientName) => {
            const clientNum = Number(clientId);
            let conv = dbConversations.find(c => c.clientId === clientNum);
            if (!conv) {
                conv = {
                    id: dbConversations.length > 0 ? Math.max(...dbConversations.map(c => c.id)) + 1 : 1,
                    clientId: clientNum,
                    clientName: clientName || "متدرب",
                    clientAvatar: "👤",
                    lastMessage: "بدء محادثة جديدة",
                    lastMessageAt: new Date().toISOString(),
                    unreadCount: 0,
                    isPinned: false,
                    isArchived: false,
                    status: "offline",
                    typing: false,
                    lastSeen: null,
                    isMuted: false,
                    isFavorite: false
                };
                dbConversations.push(conv);
            }
            return safeClone(conv);
        },
        update: (id, data) => {
            const index = dbConversations.findIndex(c => c.id === Number(id));
            if (index !== -1) {
                dbConversations[index] = {
                    ...dbConversations[index],
                    ...data,
                    id: Number(id)
                };
                return safeClone(dbConversations[index]);
            }
            return null;
        },
        delete: (id) => {
            const index = dbConversations.findIndex(c => c.id === Number(id));
            if (index !== -1) {
                dbConversations.splice(index, 1);
                dbMessages = dbMessages.filter(m => m.conversationId !== Number(id));
                return true;
            }
            return false;
        },
        markAsRead: (id) => {
            const index = dbConversations.findIndex(c => c.id === Number(id));
            if (index !== -1) {
                dbConversations[index].unreadCount = 0;
                dbMessages = dbMessages.map(m => {
                    if (m.conversationId === Number(id)) {
                        return { ...m, read: true, status: 'read', seenAt: new Date().toISOString() };
                    }
                    return m;
                });
                return true;
            }
            return false;
        },
        markAllAsRead: () => {
            dbConversations = dbConversations.map(c => ({
                ...c,
                unreadCount: 0
            }));
            dbMessages = dbMessages.map(m => ({
                ...m,
                read: true,
                status: 'read',
                seenAt: m.seenAt || new Date().toISOString()
            }));
            return true;
        }
    },
    activities: {
        getAll: (filters = {}) => {
            let list = [...dbActivities];
            if (filters.search) {
                const query = filters.search.toLowerCase();
                list = list.filter(a => a.description.toLowerCase().includes(query) || a.actor.toLowerCase().includes(query));
            }
            if (filters.category && filters.category !== 'All') {
                list = list.filter(a => a.category === filters.category);
            }
            if (filters.clientId) {
                list = list.filter(a => a.clientId === Number(filters.clientId));
            }
            if (filters.entityType) {
                list = list.filter(a => a.category === filters.entityType && (!filters.entityId || String(a.clientId) === String(filters.entityId)));
            }
            return safeClone(list);
        },
        create: (data) => {
            const newAct = generateSystemActivity(data.category, data.description, data.actor, data.clientId);
            return safeClone(newAct);
        },
        getStatistics: () => {
            const total = dbActivities.length;
            const workout = dbActivities.filter(a => a.category === 'Workout').length;
            const client = dbActivities.filter(a => a.category === 'Client').length;
            const nutrition = dbActivities.filter(a => a.category === 'Nutrition').length;
            const appointment = dbActivities.filter(a => a.category === 'Appointment').length;
            const task = dbActivities.filter(a => a.category === 'Task').length;
            return {
                total,
                workout,
                client,
                nutrition,
                appointment,
                task
            };
        }
    },
    documents: {
        getAll: (filters = {}) => {
            let list = [...dbDocuments];

            // Filter out archived unless explicitly requested
            if (filters.isArchived !== undefined) {
                const searchArchived = String(filters.isArchived) === 'true';
                list = list.filter(d => d.isArchived === searchArchived);
            } else {
                list = list.filter(d => !d.isArchived);
            }

            if (filters.clientId) {
                list = list.filter(d => String(d.clientId) === String(filters.clientId));
            }
            if (filters.appointmentId) {
                list = list.filter(d => String(d.appointmentId) === String(filters.appointmentId));
            }
            if (filters.taskId) {
                list = list.filter(d => String(d.taskId) === String(filters.taskId));
            }
            if (filters.category && filters.category !== 'All') {
                list = list.filter(d => d.category === filters.category);
            }
            if (filters.isFavorite !== undefined) {
                const fav = String(filters.isFavorite) === 'true';
                list = list.filter(d => d.isFavorite === fav);
            }
            if (filters.owner && filters.owner !== 'All') {
                list = list.filter(d => d.owner === filters.owner);
            }
            if (filters.extension) {
                list = list.filter(d => d.extension.toLowerCase() === filters.extension.toLowerCase());
            }

            if (filters.search) {
                const term = filters.search.toLowerCase().trim();
                list = list.filter(d => 
                    d.name.toLowerCase().includes(term) ||
                    d.owner.toLowerCase().includes(term) ||
                    d.extension.toLowerCase().includes(term) ||
                    d.tags.some(t => t.toLowerCase().includes(term))
                );
            }

            // Sorting
            if (filters.sortBy) {
                if (filters.sortBy === 'Name') {
                    list.sort((a, b) => a.name.localeCompare(b.name));
                } else if (filters.sortBy === 'Size') {
                    list.sort((a, b) => b.size - a.size);
                } else {
                    // default: Newest
                    list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
                }
            } else {
                list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
            }

            return safeClone(list);
        },
        getById: (id) => safeClone(dbDocuments.find(d => String(d.id) === String(id)) || null),
        create: (data) => {
            const newDoc = {
                id: dbDocuments.length > 0 ? Math.max(...dbDocuments.map(d => Number(d.id) || 0)) + 1 : 1,
                name: data.name,
                url: data.url || 'https://example.com/files/uploaded_file',
                extension: data.extension || 'pdf',
                size: Number(data.size || 0),
                owner: data.owner || 'Coach',
                category: data.category || 'Other',
                tags: data.tags || [],
                isFavorite: !!data.isFavorite,
                isArchived: false,
                versions: data.versions || [
                    {
                        version: 1,
                        url: data.url || 'https://example.com/files/uploaded_file',
                        size: Number(data.size || 0),
                        updatedAt: new Date().toISOString(),
                        updatedBy: data.owner || 'Coach'
                    }
                ],
                clientId: data.clientId ? Number(data.clientId) : null,
                appointmentId: data.appointmentId ? Number(data.appointmentId) : null,
                taskId: data.taskId ? Number(data.taskId) : null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            dbDocuments.push(newDoc);
            generateAuditLog("Document Uploaded", "Documents", `تم رفع مستند جديد: ${newDoc.name}`);


            // Auto create media if image/video/audio
            const ext = newDoc.extension.toLowerCase();
            if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'mp4', 'mov', 'webm', 'mp3', 'wav'].includes(ext)) {
                const newMedia = {
                    id: dbMedia.length > 0 ? Math.max(...dbMedia.map(m => Number(m.id) || 0)) + 1 : 1,
                    documentId: newDoc.id,
                    zoomLevel: 1.0,
                    rotationAngle: 0,
                    filterEffect: 'none',
                    isFullscreen: false,
                    thumbnailGridUrl: ext === 'mp4' ? '' : newDoc.url
                };
                dbMedia.push(newMedia);
            }

            // Notification & Activity Log
            const clientObj = dbClients.find(c => c.id === newDoc.clientId);
            const clientName = clientObj ? clientObj.name : 'عام';
            generateSystemNotification(
                "تم رفع ملف جديد",
                `تم رفع الملف "${newDoc.name}" بنجاح فئة ${newDoc.category}.`,
                "File Uploaded",
                "Normal",
                newDoc.clientId,
                '/documents',
                'blue',
                '📁'
            );
            generateSystemActivity("Client", `تم رفع ملف جديد: "${newDoc.name}" للمتدرب: ${clientName}`, newDoc.owner === 'Coach' ? 'الكوتش أحمد' : clientName, newDoc.clientId);

            return safeClone(newDoc);
        },
        update: (id, data) => {
            const index = dbDocuments.findIndex(d => String(d.id) === String(id));
            if (index !== -1) {
                const oldDoc = dbDocuments[index];
                
                // If url or size is changing, add version
                let updatedVersions = [...(oldDoc.versions || [])];
                if ((data.url && data.url !== oldDoc.url) || (data.size && Number(data.size) !== oldDoc.size)) {
                    const nextVer = updatedVersions.length > 0 ? Math.max(...updatedVersions.map(v => v.version)) + 1 : 1;
                    updatedVersions.unshift({
                        version: nextVer,
                        url: data.url || oldDoc.url,
                        size: Number(data.size || oldDoc.size),
                        updatedAt: new Date().toISOString(),
                        updatedBy: data.owner || oldDoc.owner
                    });
                }

                dbDocuments[index] = {
                    ...oldDoc,
                    ...data,
                    versions: updatedVersions,
                    updatedAt: new Date().toISOString(),
                    id: oldDoc.id // preserve original type (number/string)
                };

                // Notification on share
                if (data.clientId && data.clientId !== oldDoc.clientId) {
                    generateSystemNotification(
                        "مشاركة ملف",
                        `تم مشاركة الملف "${oldDoc.name}" معك.`,
                        "File Shared",
                        "Normal",
                        data.clientId,
                        '/documents',
                        'green',
                        '🔗'
                    );
                }

                return safeClone(dbDocuments[index]);
            }
            return null;
        },
        delete: (id) => {
            const index = dbDocuments.findIndex(d => String(d.id) === String(id));
            if (index !== -1) {
                const deletedDoc = dbDocuments[index];
                dbDocuments.splice(index, 1);
                
                // Remove media link
                dbMedia = dbMedia.filter(m => String(m.documentId) !== String(id));

                generateSystemNotification(
                    "تم حذف ملف",
                    `تم حذف الملف "${deletedDoc.name}".`,
                    "File Deleted",
                    "Normal",
                    deletedDoc.clientId,
                    '/documents',
                    'red',
                    '🗑️'
                );

                return true;
            }
            return false;
        },
        duplicate: (id) => {
            const doc = dbDocuments.find(d => String(d.id) === String(id));
            if (!doc) return null;

            const nameParts = doc.name.split('.');
            const ext = nameParts.pop();
            const baseName = nameParts.join('.');
            const duplicatedName = `${baseName} - نسخة.${ext}`;

            const duplicatedDoc = {
                ...doc,
                id: dbDocuments.length > 0 ? Math.max(...dbDocuments.map(d => Number(d.id) || 0)) + 1 : 1,
                name: duplicatedName,
                isFavorite: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                versions: [
                    {
                        version: 1,
                        url: doc.url,
                        size: doc.size,
                        updatedAt: new Date().toISOString(),
                        updatedBy: doc.owner
                    }
                ]
            };
            dbDocuments.push(duplicatedDoc);

            // Create media if image/video/audio
            const docExt = ext.toLowerCase();
            if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'mp4', 'mov', 'webm', 'mp3', 'wav'].includes(docExt)) {
                const newMedia = {
                    id: dbMedia.length > 0 ? Math.max(...dbMedia.map(m => Number(m.id) || 0)) + 1 : 1,
                    documentId: duplicatedDoc.id,
                    zoomLevel: 1.0,
                    rotationAngle: 0,
                    filterEffect: 'none',
                    isFullscreen: false,
                    thumbnailGridUrl: docExt === 'mp4' ? '' : duplicatedDoc.url
                };
                dbMedia.push(newMedia);
            }

            return safeClone(duplicatedDoc);
        },
        getStorageUsage: () => {
            const limit = 5 * 1024 * 1024 * 1024; // 5 GB
            let used = 0;
            let images = 0;
            let pdf = 0;
            let documents = 0;
            let videos = 0;
            let audio = 0;
            let other = 0;

            dbDocuments.forEach(d => {
                if (d.isArchived) return; // archived files don't count toward active usage, or count them? Let's exclude them
                const size = Number(d.size || 0);
                used += size;

                const ext = d.extension.toLowerCase();
                if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(ext)) {
                    images += size;
                } else if (ext === 'pdf') {
                    pdf += size;
                } else if (['doc', 'docx', 'xls', 'xlsx', 'csv', 'txt'].includes(ext)) {
                    documents += size;
                } else if (['mp4', 'mov', 'webm', 'avi', 'mkv'].includes(ext)) {
                    videos += size;
                } else if (['mp3', 'wav', 'ogg', 'aac'].includes(ext)) {
                    audio += size;
                } else {
                    other += size;
                }
            });

            return {
                used,
                limit,
                breakdown: {
                    images,
                    pdf,
                    documents,
                    videos,
                    audio,
                    other
                }
            };
        }
    },
    media: {
        getAll: () => safeClone(dbMedia),
        getById: (id) => safeClone(dbMedia.find(m => String(m.id) === String(id)) || null),
        getByDocumentId: (docId) => {
            let m = dbMedia.find(item => String(item.documentId) === String(docId));
            if (!m) {
                const doc = dbDocuments.find(d => String(d.id) === String(docId));
                if (doc) {
                    m = {
                        id: dbMedia.length > 0 ? Math.max(...dbMedia.map(m => Number(m.id) || 0)) + 1 : 1,
                        documentId: doc.id,
                        zoomLevel: 1.0,
                        rotationAngle: 0,
                        filterEffect: 'none',
                        isFullscreen: false,
                        thumbnailGridUrl: ''
                    };
                    dbMedia.push(m);
                }
            }
            return safeClone(m || null);
        },
        update: (id, data) => {
            const index = dbMedia.findIndex(m => String(m.id) === String(id));
            if (index !== -1) {
                dbMedia[index] = {
                    ...dbMedia[index],
                    ...data,
                    id: dbMedia[index].id
                };
                return safeClone(dbMedia[index]);
            }
            return null;
        }
    },
    adminUsers: {
        getAll: (filters = {}) => {
            let list = [...dbAdminUsers];
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                list = list.filter(u => 
                    u.fullName.toLowerCase().includes(searchLower) || 
                    u.email.toLowerCase().includes(searchLower) ||
                    u.phone.includes(searchLower)
                );
            }
            if (filters.role && filters.role !== 'All') {
                list = list.filter(u => u.role === filters.role);
            }
            if (filters.status && filters.status !== 'All') {
                list = list.filter(u => u.status === filters.status);
            }
            if (filters.branch && filters.branch !== 'All') {
                list = list.filter(u => u.branch === filters.branch);
            }
            
            if (filters.sortBy) {
                if (filters.sortBy === 'NameAsc') {
                    list.sort((a, b) => a.fullName.localeCompare(b.fullName, 'ar'));
                } else if (filters.sortBy === 'NameDesc') {
                    list.sort((a, b) => b.fullName.localeCompare(a.fullName, 'ar'));
                } else if (filters.sortBy === 'Newest') {
                    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                }
            }

            const page = Number(filters.page || 1);
            const limit = Number(filters.limit || 10);
            const start = (page - 1) * limit;
            const end = start + limit;
            const paginated = list.slice(start, end);

            return {
                data: safeClone(paginated),
                meta: {
                    page,
                    limit,
                    total: list.length,
                    totalPages: Math.ceil(list.length / limit)
                }
            };
        },
        getById: (id) => safeClone(dbAdminUsers.find(u => u.id === Number(id)) || null),
        create: (data) => {
            const newUser = {
                ...data,
                id: dbAdminUsers.length > 0 ? Math.max(...dbAdminUsers.map(u => u.id)) + 1 : 1,
                createdAt: new Date().toISOString(),
                lastLogin: null
            };
            dbAdminUsers.push(newUser);
            generateAuditLog("User Created", "Users", `تم إنشاء مستخدم جديد في النظام: ${newUser.fullName}`);
            return safeClone(newUser);
        },
        update: (id, data) => {
            const idx = dbAdminUsers.findIndex(u => u.id === Number(id));
            if (idx !== -1) {
                const oldUser = dbAdminUsers[idx];
                dbAdminUsers[idx] = {
                    ...oldUser,
                    ...data,
                    id: oldUser.id
                };
                if (data.role && data.role !== oldUser.role) {
                    generateAuditLog("Role Changed", "RBAC", `تغيير دور المستخدم ${oldUser.fullName} من ${oldUser.role} إلى ${data.role}`);
                } else {
                    generateAuditLog("User Updated", "Users", `تحديث بيانات المستخدم: ${oldUser.fullName}`);
                }
                return safeClone(dbAdminUsers[idx]);
            }
            return null;
        },
        delete: (id) => {
            const idx = dbAdminUsers.findIndex(u => u.id === Number(id));
            if (idx !== -1) {
                const deleted = dbAdminUsers[idx];
                dbAdminUsers.splice(idx, 1);
                generateAuditLog("User Deleted", "Users", `حذف حساب المستخدم ${deleted.fullName} نهائياً من النظام`);
                return true;
            }
            return false;
        }
    },
    branches: {
        getAll: (filters = {}) => {
            let list = [...dbBranches];
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                list = list.filter(b => 
                    b.name.toLowerCase().includes(searchLower) || 
                    b.code.toLowerCase().includes(searchLower) ||
                    b.address.toLowerCase().includes(searchLower)
                );
            }
            if (filters.status && filters.status !== 'All') {
                list = list.filter(b => b.status === filters.status);
            }
            
            const page = Number(filters.page || 1);
            const limit = Number(filters.limit || 10);
            const start = (page - 1) * limit;
            const end = start + limit;
            const paginated = list.slice(start, end);

            return {
                data: safeClone(paginated),
                meta: {
                    page,
                    limit,
                    total: list.length,
                    totalPages: Math.ceil(list.length / limit)
                }
            };
        },
        getById: (id) => safeClone(dbBranches.find(b => b.id === Number(id)) || null),
        create: (data) => {
            const newBranch = {
                ...data,
                id: dbBranches.length > 0 ? Math.max(...dbBranches.map(b => b.id)) + 1 : 1
            };
            dbBranches.push(newBranch);
            generateAuditLog("Branch Created", "Branches", `تم إنشاء فرع جديد للنظام: ${newBranch.name}`);
            return safeClone(newBranch);
        },
        update: (id, data) => {
            const idx = dbBranches.findIndex(b => b.id === Number(id));
            if (idx !== -1) {
                dbBranches[idx] = {
                    ...dbBranches[idx],
                    ...data,
                    id: dbBranches[idx].id
                };
                generateAuditLog("Branch Updated", "Branches", `تم تحديث بيانات فرع: ${dbBranches[idx].name}`);
                return safeClone(dbBranches[idx]);
            }
            return null;
        },
        delete: (id) => {
            const idx = dbBranches.findIndex(b => b.id === Number(id));
            if (idx !== -1) {
                const deleted = dbBranches[idx];
                dbBranches.splice(idx, 1);
                generateAuditLog("Branch Deleted", "Branches", `حذف فرع ${deleted.name} نهائياً`);
                return true;
            }
            return false;
        }
    },
    auditLogs: {
        getAll: (filters = {}) => {
            let list = [...dbAuditLogs];
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                list = list.filter(l => 
                    l.action.toLowerCase().includes(searchLower) || 
                    l.details.toLowerCase().includes(searchLower) ||
                    l.user.toLowerCase().includes(searchLower)
                );
            }
            if (filters.entity && filters.entity !== 'All') {
                list = list.filter(l => l.entity === filters.entity);
            }
            if (filters.status && filters.status !== 'All') {
                list = list.filter(l => l.status === filters.status);
            }
            
            list.sort((a, b) => new Date(b.date) - new Date(a.date));

            const page = Number(filters.page || 1);
            const limit = Number(filters.limit || 10);
            const start = (page - 1) * limit;
            const end = start + limit;
            const paginated = list.slice(start, end);

            return {
                data: safeClone(paginated),
                meta: {
                    page,
                    limit,
                    total: list.length,
                    totalPages: Math.ceil(list.length / limit)
                }
            };
        },
        create: (data) => {
            const newLog = {
                ...data,
                id: dbAuditLogs.length > 0 ? Math.max(...dbAuditLogs.map(l => l.id)) + 1 : 1,
                date: new Date().toISOString()
            };
            dbAuditLogs.push(newLog);
            return safeClone(newLog);
        }
    },
    collaboration: {
        locks: {
            getAll: () => {
                const active = [];
                const now = new Date().getTime();
                Object.keys(dbCollaborationLocks).forEach(key => {
                    const lock = dbCollaborationLocks[key];
                    const timeoutTime = new Date(lock.timeoutAt).getTime();
                    if (now > timeoutTime) {
                        delete dbCollaborationLocks[key];
                    } else {
                        const remainingTime = Math.max(0, Math.round((timeoutTime - now) / 1000));
                        active.push({ ...lock, remainingTime });
                    }
                });
                return safeClone(active);
            },
            get: (entityType, entityId) => {
                const key = `${entityType}:${entityId}`;
                const lock = dbCollaborationLocks[key];
                if (!lock) return { isLocked: false };
                
                const now = new Date().getTime();
                const timeoutTime = new Date(lock.timeoutAt).getTime();
                if (now > timeoutTime) {
                    delete dbCollaborationLocks[key];
                    eventBus.publish(SOCKET_EVENTS.ENTITY_UNLOCKED, { entityType, entityId, key });
                    return { isLocked: false };
                }
                
                const remainingTime = Math.max(0, Math.round((timeoutTime - now) / 1000));
                return { ...safeClone(lock), remainingTime };
            },
            acquire: (entityType, entityId, username, avatar = '👤') => {
                const key = `${entityType}:${entityId}`;
                const currentLock = mockDatabase.collaboration.locks.get(entityType, entityId);
                
                if (currentLock.isLocked && currentLock.lockedBy !== username) {
                    return { success: false, lock: currentLock };
                }
                
                const now = new Date();
                const timeout = new Date(now.getTime() + 30 * 1000); // 30 seconds
                const lockData = {
                    entityKey: key,
                    entityType,
                    entityId,
                    isLocked: true,
                    lockedBy: username,
                    lockedByAvatar: avatar,
                    lockedAt: now.toISOString(),
                    timeoutAt: timeout.toISOString()
                };
                
                dbCollaborationLocks[key] = lockData;
                eventBus.publish(SOCKET_EVENTS.ENTITY_LOCKED, lockData);
                return { success: true, lock: { ...lockData, remainingTime: 30 } };
            },
            release: (entityType, entityId, username) => {
                const key = `${entityType}:${entityId}`;
                const lock = dbCollaborationLocks[key];
                if (lock) {
                    delete dbCollaborationLocks[key];
                    eventBus.publish(SOCKET_EVENTS.ENTITY_UNLOCKED, { entityType, entityId, key, unlockedBy: username });
                    return true;
                }
                return false;
            },
            renew: (entityType, entityId, username, avatar = '👤') => {
                return mockDatabase.collaboration.locks.acquire(entityType, entityId, username, avatar);
            }
        },
        comments: {
            getAllComments: () => safeClone(dbCollaborationComments),
            getAll: (entityType, entityId) => {
                const list = dbCollaborationComments.filter(c => 
                    c.entityType === entityType && 
                    String(c.entityId) === String(entityId)
                );
                return safeClone(list);
            },
            getById: (id) => safeClone(dbCollaborationComments.find(c => c.id === Number(id)) || null),
            create: (data) => {
                const newComment = {
                    id: dbCollaborationComments.length > 0 ? Math.max(...dbCollaborationComments.map(c => c.id)) + 1 : 1,
                    entityType: data.entityType,
                    entityId: data.entityId,
                    text: data.text,
                    author: data.author,
                    authorAvatar: data.authorAvatar || '👤',
                    parentId: data.parentId || null,
                    timestamp: new Date().toISOString(),
                    reactions: {},
                    isPinned: false,
                    isResolved: false
                };
                dbCollaborationComments.push(newComment);
                
                // Detect mentions in the text
                const mentionRegex = /@(\w+|[\u0600-\u06FF]+)/g;
                const matches = data.text.match(mentionRegex);
                if (matches) {
                    matches.forEach(m => {
                        const targetUser = m.replace('@', '');
                        // Generate a system notification
                        generateSystemNotification(
                            "منشن جديد",
                            `قام ${data.author} بالإشارة إليك في تعليق: "${data.text.substring(0, 30)}..."`,
                            "Mention Created",
                            "Normal",
                            null,
                            `/${data.entityType.toLowerCase()}s`
                        );
                        
                        eventBus.publish(SOCKET_EVENTS.MENTION_CREATED, {
                            commentId: newComment.id,
                            mentionedUser: targetUser,
                            author: data.author,
                            entityType: data.entityType,
                            entityId: data.entityId
                        });
                    });
                }
                
                generateSystemActivity(data.entityType, `أضاف ${data.author} تعليقاً جديداً`, data.author, data.entityId);
                
                eventBus.publish(SOCKET_EVENTS.COMMENT_CREATED, newComment);
                return safeClone(newComment);
            },
            update: (id, text) => {
                const idx = dbCollaborationComments.findIndex(c => c.id === Number(id));
                if (idx !== -1) {
                    dbCollaborationComments[idx].text = text;
                    dbCollaborationComments[idx].timestamp = new Date().toISOString();
                    const updated = dbCollaborationComments[idx];
                    eventBus.publish(SOCKET_EVENTS.COMMENT_UPDATED, updated);
                    return safeClone(updated);
                }
                return null;
            },
            delete: (id) => {
                const idx = dbCollaborationComments.findIndex(c => c.id === Number(id));
                if (idx !== -1) {
                    const deleted = dbCollaborationComments[idx];
                    dbCollaborationComments.splice(idx, 1);
                    dbCollaborationComments = dbCollaborationComments.filter(c => c.parentId !== Number(id));
                    eventBus.publish(SOCKET_EVENTS.COMMENT_DELETED, { id, entityType: deleted.entityType, entityId: deleted.entityId });
                    return true;
                }
                return false;
            },
            togglePin: (id, isPinned) => {
                const idx = dbCollaborationComments.findIndex(c => c.id === Number(id));
                if (idx !== -1) {
                    dbCollaborationComments[idx].isPinned = isPinned;
                    const updated = dbCollaborationComments[idx];
                    eventBus.publish(SOCKET_EVENTS.COMMENT_UPDATED, updated);
                    return safeClone(updated);
                }
                return null;
            },
            resolve: (id, isResolved) => {
                const idx = dbCollaborationComments.findIndex(c => c.id === Number(id));
                if (idx !== -1) {
                    dbCollaborationComments[idx].isResolved = isResolved;
                    const updated = dbCollaborationComments[idx];
                    eventBus.publish(SOCKET_EVENTS.COMMENT_UPDATED, updated);
                    return safeClone(updated);
                }
                return null;
            },
            addReaction: (id, username, emoji) => {
                const idx = dbCollaborationComments.findIndex(c => c.id === Number(id));
                if (idx !== -1) {
                    if (!dbCollaborationComments[idx].reactions) {
                        dbCollaborationComments[idx].reactions = {};
                    }
                    if (!dbCollaborationComments[idx].reactions[emoji]) {
                        dbCollaborationComments[idx].reactions[emoji] = [];
                    }
                    if (!dbCollaborationComments[idx].reactions[emoji].includes(username)) {
                        dbCollaborationComments[idx].reactions[emoji].push(username);
                    }
                    const updated = dbCollaborationComments[idx];
                    eventBus.publish(SOCKET_EVENTS.COMMENT_UPDATED, updated);
                    return safeClone(updated);
                }
                return null;
            },
            removeReaction: (id, username, emoji) => {
                const idx = dbCollaborationComments.findIndex(c => c.id === Number(id));
                if (idx !== -1) {
                    if (dbCollaborationComments[idx].reactions && dbCollaborationComments[idx].reactions[emoji]) {
                        dbCollaborationComments[idx].reactions[emoji] = dbCollaborationComments[idx].reactions[emoji].filter(u => u !== username);
                        if (dbCollaborationComments[idx].reactions[emoji].length === 0) {
                            delete dbCollaborationComments[idx].reactions[emoji];
                        }
                    }
                    const updated = dbCollaborationComments[idx];
                    eventBus.publish(SOCKET_EVENTS.COMMENT_UPDATED, updated);
                    return safeClone(updated);
                }
                return null;
            }
        },
        mergeRequests: {
            getAll: () => safeClone(dbMergeRequests),
            getForEntity: (entityType, entityId) => {
                return safeClone(dbMergeRequests.find(m => m.entityType === entityType && String(m.entityId) === String(entityId) && !m.resolved) || null);
            },
            create: (data) => {
                const newReq = {
                    id: dbMergeRequests.length > 0 ? Math.max(...dbMergeRequests.map(r => r.id)) + 1 : 1,
                    entityType: data.entityType,
                    entityId: data.entityId,
                    mine: data.mine,
                    theirs: data.theirs,
                    merged: data.merged,
                    resolved: false
                };
                dbMergeRequests.push(newReq);
                eventBus.publish(SOCKET_EVENTS.MERGE_REQUEST, newReq);
                return safeClone(newReq);
            },
            resolveConflict: (id, status, mergedData) => {
                const idx = dbMergeRequests.findIndex(m => m.id === Number(id));
                if (idx !== -1) {
                    dbMergeRequests[idx].resolved = true;
                    const req = dbMergeRequests[idx];
                    
                    if (status === 'accepted') {
                        // Apply merged data to the actual entity in database
                        if (req.entityType === 'Client') {
                            mockDatabase.clients.update(req.entityId, mergedData);
                        } else if (req.entityType === 'Task') {
                            mockDatabase.tasks.update(req.entityId, mergedData);
                        } else if (req.entityType === 'Document') {
                            mockDatabase.documents.update(req.entityId, mergedData);
                        } else if (req.entityType === 'Appointment') {
                            mockDatabase.calendarEvents.update(req.entityId, mergedData);
                        } else if (req.entityType === 'Nutrition') {
                            mockDatabase.nutrition.update(req.entityId, mergedData);
                        }
                        
                        eventBus.publish(SOCKET_EVENTS.MERGE_ACCEPTED, { id, entityType: req.entityType, entityId: req.entityId, mergedData });
                    } else {
                        eventBus.publish(SOCKET_EVENTS.MERGE_REJECTED, { id, entityType: req.entityType, entityId: req.entityId });
                    }
                    
                    return true;
                }
                return false;
            }
        }
    },
    reporting: {
        reports: {
            getAll: () => safeClone(dbReports),
            getById: (id) => safeClone(dbReports.find(r => r.id === Number(id)) || null),
            create: (data) => {
                const newReport = {
                    id: dbReports.length > 0 ? Math.max(...dbReports.map(r => r.id)) + 1 : 1,
                    name: data.name,
                    module: data.module,
                    filters: data.filters || {},
                    sorting: data.sorting,
                    grouping: data.grouping || null,
                    data: data.data || [],
                    createdAt: new Date().toISOString(),
                    createdBy: data.createdBy || 'أحمد عبد الله',
                    isFavorite: data.isFavorite || false,
                    isTemplate: data.isTemplate || false
                };
                dbReports.push(newReport);
                return safeClone(newReport);
            },
            update: (id, data) => {
                const idx = dbReports.findIndex(r => r.id === Number(id));
                if (idx !== -1) {
                    dbReports[idx] = { ...dbReports[idx], ...data };
                    return safeClone(dbReports[idx]);
                }
                return null;
            },
            delete: (id) => {
                const idx = dbReports.findIndex(r => r.id === Number(id));
                if (idx !== -1) {
                    dbReports.splice(idx, 1);
                    return true;
                }
                return false;
            }
        },
        templates: {
            getAll: () => safeClone(dbReportTemplates),
            getById: (id) => safeClone(dbReportTemplates.find(t => t.id === Number(id)) || null)
        },
        scheduler: {
            getAll: () => safeClone(dbScheduledReports),
            getById: (id) => safeClone(dbScheduledReports.find(s => s.id === Number(id)) || null),
            create: (data) => {
                const newSchedule = {
                    id: dbScheduledReports.length > 0 ? Math.max(...dbScheduledReports.map(s => s.id)) + 1 : 1,
                    name: data.name,
                    module: data.module,
                    filters: data.filters || {},
                    schedule: data.schedule,
                    format: data.format,
                    recipients: data.recipients || [],
                    retentionDays: Number(data.retentionDays || 30),
                    lastRun: null,
                    nextRun: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                    isActive: data.isActive !== false,
                    createdAt: new Date().toISOString()
                };
                dbScheduledReports.push(newSchedule);
                return safeClone(newSchedule);
            },
            update: (id, data) => {
                const idx = dbScheduledReports.findIndex(s => s.id === Number(id));
                if (idx !== -1) {
                    dbScheduledReports[idx] = { ...dbScheduledReports[idx], ...data };
                    return safeClone(dbScheduledReports[idx]);
                }
                return null;
            },
            delete: (id) => {
                const idx = dbScheduledReports.findIndex(s => s.id === Number(id));
                if (idx !== -1) {
                    dbScheduledReports.splice(idx, 1);
                    return true;
                }
                return false;
            }
        },
        exports: {
            getAll: () => safeClone(dbExports),
            create: (data) => {
                const newExport = {
                    id: dbExports.length > 0 ? Math.max(...dbExports.map(e => e.id)) + 1 : 1,
                    name: data.name,
                    format: data.format,
                    status: data.status || 'success',
                    url: data.url || `/exports/${data.name}.${data.format}`,
                    generatedAt: new Date().toISOString(),
                    sizeBytes: data.sizeBytes || Math.floor(Math.random() * 100000 + 5000)
                };
                dbExports.push(newExport);
                return safeClone(newExport);
            }
        },
        health: {
            get: () => safeClone(dbSystemHealth),
            updateStatus: (service, status, message, latencyMs) => {
                if (dbSystemHealth[service]) {
                    dbSystemHealth[service] = {
                        status,
                        message,
                        latencyMs: latencyMs ?? dbSystemHealth[service].latencyMs,
                        lastChecked: new Date().toISOString()
                    };
                    return safeClone(dbSystemHealth[service]);
                }
                return null;
            }
        },
        monitoring: {
            getMetrics: () => {
                dbMonitoringMetrics = {
                    ...dbMonitoringMetrics,
                    systemLoad: Math.max(5, Math.min(95, Math.round(dbMonitoringMetrics.systemLoad + (Math.random() * 10 - 5)))),
                    apiResponseTime: Math.max(30, Math.round(dbMonitoringMetrics.apiResponseTime + (Math.random() * 20 - 10))),
                    timestamp: new Date().toISOString()
                };
                return safeClone(dbMonitoringMetrics);
            }
        }
    },
    saas: {
        tenants: {
            getAll: () => safeClone(dbTenants),
            getById: (id) => safeClone(dbTenants.find(t => t.id === Number(id)) || null),
            create: (data) => {
                const newTenant = {
                    id: dbTenants.length > 0 ? Math.max(...dbTenants.map(t => t.id)) + 1 : 1,
                    createdAt: new Date().toISOString(),
                    ...data
                };
                dbTenants.push(newTenant);
                dbTenantSettings.push({
                    tenantId: newTenant.id,
                    companyName: newTenant.name,
                    primaryColor: '#0ea5e9',
                    secondaryColor: '#64748b',
                    logo: '/logo.png',
                    darkLogo: '/logo-dark.png',
                    favicon: '/favicon.ico',
                    typography: 'Inter',
                    emailTemplate: '',
                    reportBranding: true,
                    invoiceBranding: true
                });
                return safeClone(newTenant);
            },
            update: (id, data) => {
                const idx = dbTenants.findIndex(t => t.id === Number(id));
                if (idx !== -1) {
                    dbTenants[idx] = { ...dbTenants[idx], ...data };
                    return safeClone(dbTenants[idx]);
                }
                return null;
            },
            delete: (id) => {
                const idx = dbTenants.findIndex(t => t.id === Number(id));
                if (idx !== -1) {
                    dbTenants.splice(idx, 1);
                    return true;
                }
                return false;
            },
            getSettings: (tenantId) => safeClone(dbTenantSettings.find(s => s.tenantId === Number(tenantId)) || null),
            updateSettings: (tenantId, data) => {
                const idx = dbTenantSettings.findIndex(s => s.tenantId === Number(tenantId));
                if (idx !== -1) {
                    dbTenantSettings[idx] = { ...dbTenantSettings[idx], ...data };
                    return safeClone(dbTenantSettings[idx]);
                }
                return null;
            }
        },
        subscriptions: {
            getAll: () => safeClone(dbSubscriptions),
            get: (tenantId) => safeClone(dbSubscriptions.find(s => s.tenantId === Number(tenantId)) || null),
            create: (data) => {
                const newSub = {
                    id: dbSubscriptions.length > 0 ? Math.max(...dbSubscriptions.map(s => s.id)) + 1 : 1,
                    ...data
                };
                dbSubscriptions.push(newSub);
                return safeClone(newSub);
            },
            update: (tenantId, data) => {
                const idx = dbSubscriptions.findIndex(s => s.tenantId === Number(tenantId));
                if (idx !== -1) {
                    dbSubscriptions[idx] = { ...dbSubscriptions[idx], ...data };
                    return safeClone(dbSubscriptions[idx]);
                }
                return null;
            }
        },
        licenses: {
            getAll: () => safeClone(dbLicenses),
            get: (tenantId) => safeClone(dbLicenses.find(l => l.tenantId === Number(tenantId)) || null),
            create: (data) => {
                const newLicense = {
                    id: dbLicenses.length > 0 ? Math.max(...dbLicenses.map(l => l.id)) + 1 : 1,
                    ...data
                };
                dbLicenses.push(newLicense);
                return safeClone(newLicense);
            },
            update: (id, data) => {
                const idx = dbLicenses.findIndex(l => l.id === Number(id));
                if (idx !== -1) {
                    dbLicenses[idx] = { ...dbLicenses[idx], ...data };
                    return safeClone(dbLicenses[idx]);
                }
                return null;
            }
        },
        organizations: {
            getAll: () => safeClone(dbOrganizations.filter(o => o.tenantId === activeTenantId)),
            getById: (id) => safeClone(dbOrganizations.find(o => o.id === Number(id) && o.tenantId === activeTenantId) || null),
            create: (data) => {
                const newOrg = {
                    id: dbOrganizations.length > 0 ? Math.max(...dbOrganizations.map(o => o.id)) + 1 : 1,
                    tenantId: activeTenantId,
                    createdAt: new Date().toISOString(),
                    status: 'Active',
                    settings: {
                        timezone: 'Asia/Riyadh',
                        currency: 'SAR',
                        logoUrl: null,
                        primaryColor: '#0ea5e9',
                        ...data.settings
                    },
                    ...data
                };
                dbOrganizations.push(newOrg);
                generateAuditLog("Organization Created", "Organizations", `تم إنشاء منظمة جديدة: ${newOrg.name}`);
                eventBus.publish('ORGANIZATION_CREATED', newOrg);
                return safeClone(newOrg);
            },
            update: (id, data) => {
                const idx = dbOrganizations.findIndex(o => o.id === Number(id) && o.tenantId === activeTenantId);
                if (idx !== -1) {
                    dbOrganizations[idx] = { 
                        ...dbOrganizations[idx], 
                        ...data, 
                        settings: { ...dbOrganizations[idx].settings, ...data.settings } 
                    };
                    generateAuditLog("Organization Updated", "Organizations", `تحديث بيانات المنظمة: ${dbOrganizations[idx].name}`);
                    eventBus.publish('ORGANIZATION_UPDATED', dbOrganizations[idx]);
                    return safeClone(dbOrganizations[idx]);
                }
                return null;
            },
            delete: (id) => {
                const idx = dbOrganizations.findIndex(o => o.id === Number(id) && o.tenantId === activeTenantId);
                if (idx !== -1) {
                    dbOrganizations.splice(idx, 1);
                    return true;
                }
                return false;
            }
        },
        teams: {
            getAll: () => safeClone(dbTeams.filter(t => t.tenantId === activeTenantId && t.organizationId === activeOrganizationId)),
            getById: (id) => safeClone(dbTeams.find(t => t.id === Number(id) && t.tenantId === activeTenantId && t.organizationId === activeOrganizationId) || null),
            create: (data) => {
                const newTeam = {
                    id: dbTeams.length > 0 ? Math.max(...dbTeams.map(t => t.id)) + 1 : 1,
                    tenantId: activeTenantId,
                    organizationId: activeOrganizationId,
                    memberIds: [],
                    createdAt: new Date().toISOString(),
                    ...data
                };
                dbTeams.push(newTeam);
                generateAuditLog("Team Created", "Teams", `تم إنشاء فريق جديد: ${newTeam.name}`);
                eventBus.publish('TEAM_CREATED', newTeam);
                return safeClone(newTeam);
            },
            update: (id, data) => {
                const idx = dbTeams.findIndex(t => t.id === Number(id) && t.tenantId === activeTenantId && t.organizationId === activeOrganizationId);
                if (idx !== -1) {
                    dbTeams[idx] = { ...dbTeams[idx], ...data };
                    eventBus.publish('TEAM_UPDATED', dbTeams[idx]);
                    return safeClone(dbTeams[idx]);
                }
                return null;
            },
            delete: (id) => {
                const idx = dbTeams.findIndex(t => t.id === Number(id) && t.tenantId === activeTenantId && t.organizationId === activeOrganizationId);
                if (idx !== -1) {
                    const deleted = dbTeams[idx];
                    dbTeams.splice(idx, 1);
                    eventBus.publish('TEAM_DELETED', { id });
                    return true;
                }
                return false;
            }
        },
        members: {
            getAll: () => safeClone(dbMembers.filter(m => m.tenantId === activeTenantId && m.organizationId === activeOrganizationId)),
            getById: (id) => safeClone(dbMembers.find(m => m.id === Number(id) && m.tenantId === activeTenantId && m.organizationId === activeOrganizationId) || null),
            create: (data) => {
                const newMember = {
                    id: dbMembers.length > 0 ? Math.max(...dbMembers.map(m => m.id)) + 1 : 1,
                    tenantId: activeTenantId,
                    organizationId: activeOrganizationId,
                    joinedAt: new Date().toISOString(),
                    status: 'Active',
                    teamIds: [],
                    ...data
                };
                dbMembers.push(newMember);
                generateAuditLog("Member Joined", "Members", `انضم عضو جديد: ${newMember.name}`);
                eventBus.publish('MEMBER_JOINED', newMember);
                return safeClone(newMember);
            },
            update: (id, data) => {
                const idx = dbMembers.findIndex(m => m.id === Number(id) && m.tenantId === activeTenantId && m.organizationId === activeOrganizationId);
                if (idx !== -1) {
                    const old = dbMembers[idx];
                    dbMembers[idx] = { ...dbMembers[idx], ...data };
                    if (data.role && data.role !== old.role) {
                        generateAuditLog("Role Changed", "Members", `تغيير دور العضو ${dbMembers[idx].name} إلى ${data.role}`);
                        eventBus.publish('ROLE_CHANGED', dbMembers[idx]);
                    }
                    return safeClone(dbMembers[idx]);
                }
                return null;
            },
            delete: (id) => {
                const idx = dbMembers.findIndex(m => m.id === Number(id) && m.tenantId === activeTenantId && m.organizationId === activeOrganizationId);
                if (idx !== -1) {
                    dbMembers.splice(idx, 1);
                    eventBus.publish('MEMBER_REMOVED', { id });
                    return true;
                }
                return false;
            }
        },
        invitations: {
            getAll: () => safeClone(dbInvitations.filter(i => i.tenantId === activeTenantId && i.organizationId === activeOrganizationId)),
            getById: (id) => safeClone(dbInvitations.find(i => i.id === Number(id) && i.tenantId === activeTenantId && i.organizationId === activeOrganizationId) || null),
            create: (data) => {
                const newInvite = {
                    id: dbInvitations.length > 0 ? Math.max(...dbInvitations.map(i => i.id)) + 1 : 1,
                    tenantId: activeTenantId,
                    organizationId: activeOrganizationId,
                    sentAt: new Date().toISOString(),
                    status: 'Pending',
                    token: `TOKEN_INVITE_${Date.now()}`,
                    ...data
                };
                dbInvitations.push(newInvite);
                generateSystemNotification(
                    "دعوة انضمام جديدة",
                    `تم إرسال دعوة انضمام للبريد ${newInvite.email}`,
                    "Invitation Sent",
                    "Normal",
                    null,
                    "/admin/invitations"
                );
                eventBus.publish('INVITATION_SENT', newInvite);
                return safeClone(newInvite);
            },
            update: (id, data) => {
                const idx = dbInvitations.findIndex(i => i.id === Number(id) && i.tenantId === activeTenantId && i.organizationId === activeOrganizationId);
                if (idx !== -1) {
                    dbInvitations[idx] = { ...dbInvitations[idx], ...data };
                    if (data.status === 'Accepted') {
                        eventBus.publish('INVITATION_ACCEPTED', dbInvitations[idx]);
                    } else if (data.status === 'Declined') {
                        eventBus.publish('INVITATION_DECLINED', dbInvitations[idx]);
                    }
                    return safeClone(dbInvitations[idx]);
                }
                return null;
            },
            delete: (id) => {
                const idx = dbInvitations.findIndex(i => i.id === Number(id) && i.tenantId === activeTenantId && i.organizationId === activeOrganizationId);
                if (idx !== -1) {
                    dbInvitations.splice(idx, 1);
                    return true;
                }
                return false;
            }
        },
        billing: {
            get: () => safeClone(dbBilling.find(b => b.tenantId === activeTenantId) || null),
            update: (data) => {
                const idx = dbBilling.findIndex(b => b.tenantId === activeTenantId);
                if (idx !== -1) {
                    dbBilling[idx] = { ...dbBilling[idx], ...data, updatedAt: new Date().toISOString() };
                    return safeClone(dbBilling[idx]);
                } else {
                    const newBilling = {
                        id: dbBilling.length + 1,
                        tenantId: activeTenantId,
                        ...data,
                        updatedAt: new Date().toISOString()
                    };
                    dbBilling.push(newBilling);
                    return safeClone(newBilling);
                }
            }
        },
        invoices: {
            getAll: () => safeClone(dbInvoices.filter(i => i.tenantId === activeTenantId)),
            getById: (id) => safeClone(dbInvoices.find(i => i.id === Number(id) && i.tenantId === activeTenantId) || null),
            create: (data) => {
                const newInvoice = {
                    id: dbInvoices.length > 0 ? Math.max(...dbInvoices.map(i => i.id)) + 1 : 1,
                    tenantId: activeTenantId,
                    organizationId: activeOrganizationId,
                    invoiceNumber: `INV-2026-${String(dbInvoices.length + 1).padStart(3, '0')}`,
                    issueDate: new Date().toISOString(),
                    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
                    paymentHistory: [],
                    ...data
                };
                dbInvoices.push(newInvoice);
                generateSystemNotification(
                    "فاتورة جديدة",
                    `تم إصدار فاتورة جديدة رقم ${newInvoice.invoiceNumber} بمبلغ ${newInvoice.total} ${newInvoice.currency}`,
                    "Invoice Generated",
                    "Normal",
                    null,
                    "/billing/invoices"
                );
                eventBus.publish('INVOICE_GENERATED', newInvoice);
                return safeClone(newInvoice);
            },
            update: (id, data) => {
                const idx = dbInvoices.findIndex(i => i.id === Number(id) && i.tenantId === activeTenantId);
                if (idx !== -1) {
                    dbInvoices[idx] = { ...dbInvoices[idx], ...data };
                    return safeClone(dbInvoices[idx]);
                }
                return null;
            }
        },
        payments: {
            getAll: () => safeClone(dbPayments.filter(p => p.tenantId === activeTenantId)),
            getById: (id) => safeClone(dbPayments.find(p => p.id === Number(id) && p.tenantId === activeTenantId) || null),
            create: (data) => {
                const newPayment = {
                    id: dbPayments.length > 0 ? Math.max(...dbPayments.map(p => p.id)) + 1 : 1,
                    tenantId: activeTenantId,
                    timestamp: new Date().toISOString(),
                    status: data.status || 'Success',
                    ...data
                };
                dbPayments.push(newPayment);

                const invoice = dbInvoices.find(i => i.id === Number(data.invoiceId) && i.tenantId === activeTenantId);
                if (invoice) {
                    if (newPayment.status === 'Success') {
                        invoice.status = 'Paid';
                        invoice.paymentHistory.push({
                            paymentId: newPayment.id,
                            amount: newPayment.amount,
                            status: 'Success',
                            timestamp: newPayment.timestamp
                        });
                        eventBus.publish('INVOICE_PAID', invoice);
                        generateSystemNotification("تم الدفع بنجاح", `تم سداد الفاتورة ${invoice.invoiceNumber} بقيمة ${newPayment.amount}`, "Payment Success", "Normal", null, "/billing/invoices");

                        dbTransactions.push({
                            id: dbTransactions.length > 0 ? Math.max(...dbTransactions.map(t => t.id)) + 1 : 1,
                            tenantId: activeTenantId,
                            organizationId: activeOrganizationId,
                            amount: newPayment.amount,
                            type: 'Credit',
                            method: newPayment.method,
                            gateway: newPayment.gateway,
                            status: 'Success',
                            referenceToken: newPayment.gatewayToken || `ch_mock_${Date.now()}`,
                            timestamp: newPayment.timestamp
                        });
                    } else {
                        invoice.status = 'Failed';
                        eventBus.publish('PAYMENT_FAILED', { invoiceId: invoice.id });
                        generateSystemNotification("فشل سداد الفاتورة", `لم نتمكن من تحصيل مبلغ الفاتورة ${invoice.invoiceNumber}`, "Payment Failure", "High", null, "/billing/invoices");

                        dbTransactions.push({
                            id: dbTransactions.length > 0 ? Math.max(...dbTransactions.map(t => t.id)) + 1 : 1,
                            tenantId: activeTenantId,
                            organizationId: activeOrganizationId,
                            amount: newPayment.amount,
                            type: 'Credit',
                            method: newPayment.method,
                            gateway: newPayment.gateway,
                            status: 'Failed',
                            referenceToken: newPayment.gatewayToken || `ch_mock_${Date.now()}`,
                            timestamp: newPayment.timestamp
                        });
                    }
                }

                return safeClone(newPayment);
            }
        },
        transactions: {
            getAll: () => safeClone(dbTransactions.filter(t => t.tenantId === activeTenantId)),
            create: (data) => {
                const newTx = {
                    id: dbTransactions.length > 0 ? Math.max(...dbTransactions.map(t => t.id)) + 1 : 1,
                    tenantId: activeTenantId,
                    organizationId: activeOrganizationId,
                    timestamp: new Date().toISOString(),
                    ...data
                };
                dbTransactions.push(newTx);
                return safeClone(newTx);
            }
        },
        coupons: {
            getAll: () => safeClone(dbCoupons.filter(c => c.tenantId === activeTenantId)),
            getByCode: (code) => safeClone(dbCoupons.find(c => c.code === code.toUpperCase() && c.tenantId === activeTenantId) || null),
            create: (data) => {
                const newCoupon = {
                    id: dbCoupons.length > 0 ? Math.max(...dbCoupons.map(c => c.id)) + 1 : 1,
                    tenantId: activeTenantId,
                    usedCount: 0,
                    status: 'Active',
                    ...data
                };
                dbCoupons.push(newCoupon);
                return safeClone(newCoupon);
            },
            update: (id, data) => {
                const idx = dbCoupons.findIndex(c => c.id === Number(id) && c.tenantId === activeTenantId);
                if (idx !== -1) {
                    dbCoupons[idx] = { ...dbCoupons[idx], ...data };
                    return safeClone(dbCoupons[idx]);
                }
                return null;
            }
        },
        taxes: {
            getAll: () => safeClone(dbTaxRules.filter(t => t.tenantId === activeTenantId)),
            getForCountry: (country) => safeClone(dbTaxRules.find(t => t.country === country.toUpperCase() && t.tenantId === activeTenantId && t.status === 'Active') || null),
            create: (data) => {
                const newRule = {
                    id: dbTaxRules.length > 0 ? Math.max(...dbTaxRules.map(t => t.id)) + 1 : 1,
                    tenantId: activeTenantId,
                    status: 'Active',
                    ...data
                };
                dbTaxRules.push(newRule);
                return safeClone(newRule);
            }
        },
        refunds: {
            getAll: () => safeClone(dbRefunds.filter(r => r.tenantId === activeTenantId)),
            create: (data) => {
                const newRefund = {
                    id: dbRefunds.length > 0 ? Math.max(...dbRefunds.map(r => r.id)) + 1 : 1,
                    tenantId: activeTenantId,
                    status: 'Success',
                    timestamp: new Date().toISOString(),
                    ...data
                };
                dbRefunds.push(newRefund);

                const invoice = dbInvoices.find(i => i.id === Number(data.invoiceId) && i.tenantId === activeTenantId);
                if (invoice) {
                    invoice.status = 'Cancelled';
                    eventBus.publish('REFUND_COMPLETED', newRefund);
                    generateSystemNotification("تم استرداد الأموال", `تمت عملية الاسترجاع بقيمة ${newRefund.amount}`, "Refund Completed", "Normal", null, "/billing/invoices");

                    dbTransactions.push({
                        id: dbTransactions.length > 0 ? Math.max(...dbTransactions.map(t => t.id)) + 1 : 1,
                        tenantId: activeTenantId,
                        organizationId: activeOrganizationId,
                        amount: newRefund.amount,
                        type: 'Debit',
                        method: 'Stripe',
                        gateway: 'MockGateway',
                        status: 'Success',
                        referenceToken: `ref_mock_${Date.now()}`,
                        timestamp: newRefund.timestamp
                    });
                }
                return safeClone(newRefund);
            }
        },
        ai: {
            chats: {
                getAll: () => safeClone(dbAIChats.filter(c => c.tenantId === activeTenantId)),
                getById: (id) => safeClone(dbAIChats.find(c => c.id === Number(id) && c.tenantId === activeTenantId) || null),
                create: (data) => {
                    const newChat = {
                        id: dbAIChats.length > 0 ? Math.max(...dbAIChats.map(c => c.id)) + 1 : 1,
                        tenantId: activeTenantId,
                        messages: [],
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        ...data
                    };
                    dbAIChats.push(newChat);
                    return safeClone(newChat);
                },
                addMessage: (id, message) => {
                    const chat = dbAIChats.find(c => c.id === Number(id) && c.tenantId === activeTenantId);
                    if (chat) {
                        const newMsg = {
                            ...message,
                            timestamp: new Date().toISOString()
                        };
                        chat.messages.push(newMsg);
                        chat.updatedAt = new Date().toISOString();
                        eventBus.publish('STREAMING_RESPONSES', { sessionId: id, chunk: newMsg.content });
                        eventBus.publish('CONVERSATION_UPDATES', chat);
                        return safeClone(chat);
                    }
                    return null;
                }
            },
            prompts: {
                getAll: () => safeClone(dbAIPrompts),
                getById: (id) => safeClone(dbAIPrompts.find(p => p.id === Number(id)) || null),
                create: (data) => {
                    const newPrompt = {
                        id: dbAIPrompts.length > 0 ? Math.max(...dbAIPrompts.map(p => p.id)) + 1 : 1,
                        ...data
                    };
                    dbAIPrompts.push(newPrompt);
                    return safeClone(newPrompt);
                }
            },
            insights: {
                getAll: () => safeClone(dbAIInsights.filter(i => i.tenantId === activeTenantId)),
                create: (data) => {
                    const newInsight = {
                        id: dbAIInsights.length > 0 ? Math.max(...dbAIInsights.map(i => i.id)) + 1 : 1,
                        tenantId: activeTenantId,
                        timestamp: new Date().toISOString(),
                        ...data
                    };
                    dbAIInsights.push(newInsight);
                    generateSystemNotification(
                        newInsight.title,
                        newInsight.content,
                        "AI Insight Ready",
                        "Normal",
                        null,
                        "/ai/insights"
                    );
                    eventBus.publish('AI_PROCESSING_FINISHED', newInsight);
                    return safeClone(newInsight);
                }
            }
        },
        integrations: {
            getAll: () => safeClone(dbIntegrations.filter(i => i.tenantId === activeTenantId)),
            update: (id, data) => {
                const idx = dbIntegrations.findIndex(i => i.id === Number(id) && i.tenantId === activeTenantId);
                if (idx !== -1) {
                    dbIntegrations[idx] = { ...dbIntegrations[idx], ...data, lastSync: new Date().toISOString() };
                    return safeClone(dbIntegrations[idx]);
                }
                return null;
            }
        },
        webhooks: {
            getAll: () => safeClone(dbWebhooks.filter(w => w.tenantId === activeTenantId)),
            create: (data) => {
                const newWebhook = {
                    id: dbWebhooks.length > 0 ? Math.max(...dbWebhooks.map(w => w.id)) + 1 : 1,
                    tenantId: activeTenantId,
                    secret: `whsec_${Math.random().toString(36).substring(2, 12)}`,
                    status: 'Active',
                    createdAt: new Date().toISOString(),
                    ...data
                };
                dbWebhooks.push(newWebhook);
                return safeClone(newWebhook);
            },
            delete: (id) => {
                const idx = dbWebhooks.findIndex(w => w.id === Number(id) && w.tenantId === activeTenantId);
                if (idx !== -1) {
                    dbWebhooks.splice(idx, 1);
                    return true;
                }
                return false;
            },
            getLogs: () => safeClone(dbWebhookLogs),
            addLog: (data) => {
                const newLog = {
                    id: dbWebhookLogs.length > 0 ? Math.max(...dbWebhookLogs.map(l => l.id)) + 1 : 1,
                    timestamp: new Date().toISOString(),
                    ...data
                };
                dbWebhookLogs.push(newLog);
                return safeClone(newLog);
            }
        },
        calendarSync: {
            getLogs: () => safeClone(dbCalendarSyncLogs.filter(l => l.tenantId === activeTenantId)),
            createLog: (data) => {
                const newLog = {
                    id: dbCalendarSyncLogs.length > 0 ? Math.max(...dbCalendarSyncLogs.map(l => l.id)) + 1 : 1,
                    tenantId: activeTenantId,
                    timestamp: new Date().toISOString(),
                    ...data
                };
                dbCalendarSyncLogs.push(newLog);
                return safeClone(newLog);
            }
        },
        devices: {
            getAll: () => safeClone(dbDevices.filter(d => d.tenantId === activeTenantId)),
            create: (data) => {
                const newDevice = {
                    id: dbDevices.length > 0 ? Math.max(...dbDevices.map(d => d.id)) + 1 : 1,
                    tenantId: activeTenantId,
                    status: 'Active',
                    storageUsedBytes: 0,
                    lastSyncTime: new Date().toISOString(),
                    ...data
                };
                dbDevices.push(newDevice);
                return safeClone(newDevice);
            }
        },
        syncQueue: {
            getAll: () => safeClone(dbSyncQueue.filter(q => q.tenantId === activeTenantId)),
            create: (data) => {
                const newItem = {
                    id: dbSyncQueue.length > 0 ? Math.max(...dbSyncQueue.map(q => q.id)) + 1 : 1,
                    tenantId: activeTenantId,
                    status: 'Pending',
                    retries: 0,
                    priority: 1,
                    timestamp: new Date().toISOString(),
                    ...data
                };
                dbSyncQueue.push(newItem);
                return safeClone(newItem);
            },
            delete: (id) => {
                const idx = dbSyncQueue.findIndex(q => String(q.id) === String(id) && q.tenantId === activeTenantId);
                if (idx !== -1) {
                    dbSyncQueue.splice(idx, 1);
                    return true;
                }
                return false;
            },
            update: (id, data) => {
                const idx = dbSyncQueue.findIndex(q => String(q.id) === String(id) && q.tenantId === activeTenantId);
                if (idx !== -1) {
                    dbSyncQueue[idx] = { ...dbSyncQueue[idx], ...data };
                    return safeClone(dbSyncQueue[idx]);
                }
                return null;
            }
        },
        cache: {
            getAll: () => safeClone(dbCacheEntries.filter(c => c.tenantId === activeTenantId)),
            set: (key, data) => {
                const idx = dbCacheEntries.findIndex(c => c.key === key && c.tenantId === activeTenantId);
                const entry = {
                    key,
                    tenantId: activeTenantId,
                    value: data.value,
                    expiresAt: data.expiresAt || new Date(Date.now() + 1000 * 60 * 60).toISOString(),
                    sizeBytes: JSON.stringify(data.value).length,
                    version: data.version || 1
                };
                if (idx !== -1) {
                    dbCacheEntries[idx] = entry;
                } else {
                    dbCacheEntries.push(entry);
                }
                return safeClone(entry);
            },
            delete: (key) => {
                const idx = dbCacheEntries.findIndex(c => c.key === key && c.tenantId === activeTenantId);
                if (idx !== -1) {
                    dbCacheEntries.splice(idx, 1);
                    return true;
                }
                return false;
            }
        },
        developerApps: {
            getAll: () => safeClone(dbDeveloperApps.filter(a => a.tenantId === activeTenantId)),
            create: (data) => {
                const newApp = {
                    id: dbDeveloperApps.length > 0 ? Math.max(...dbDeveloperApps.map(a => a.id)) + 1 : 1,
                    tenantId: activeTenantId,
                    status: 'Active',
                    createdAt: new Date().toISOString(),
                    ...data
                };
                dbDeveloperApps.push(newApp);
                return safeClone(newApp);
            },
            delete: (id) => {
                const idx = dbDeveloperApps.findIndex(a => String(a.id) === String(id) && a.tenantId === activeTenantId);
                if (idx !== -1) {
                    dbDeveloperApps.splice(idx, 1);
                    return true;
                }
                return false;
            }
        },
        apiKeys: {
            getAll: () => safeClone(dbApiKeys.filter(k => k.tenantId === activeTenantId)),
            create: (data) => {
                const newKey = {
                    id: dbApiKeys.length > 0 ? Math.max(...dbApiKeys.map(k => k.id)) + 1 : 1,
                    tenantId: activeTenantId,
                    status: 'Active',
                    createdAt: new Date().toISOString(),
                    ...data
                };
                dbApiKeys.push(newKey);
                return safeClone(newKey);
            },
            revoke: (id) => {
                const idx = dbApiKeys.findIndex(k => String(k.id) === String(id) && k.tenantId === activeTenantId);
                if (idx !== -1) {
                    dbApiKeys[idx].status = 'Revoked';
                    return safeClone(dbApiKeys[idx]);
                }
                return null;
            }
        },
        oauth: {
            createCode: (data) => {
                dbOauthCodes.push(data);
                return safeClone(data);
            },
            getCode: (code) => {
                const res = dbOauthCodes.find(c => c.code === code);
                return res ? safeClone(res) : null;
            },
            createToken: (data) => {
                const newToken = {
                    accessToken: `at_${Math.random().toString(36).substring(2, 10)}`,
                    tokenType: 'Bearer',
                    expiresIn: 3600,
                    refreshToken: `rt_${Math.random().toString(36).substring(2, 10)}`,
                    scope: data.scope || null,
                    idToken: `id_${Math.random().toString(36).substring(2, 10)}`
                };
                dbOauthTokens.push(newToken);
                return safeClone(newToken);
            },
            revokeToken: (token) => {
                const idx = dbOauthTokens.findIndex(t => t.accessToken === token || t.refreshToken === token);
                if (idx !== -1) {
                    dbOauthTokens.splice(idx, 1);
                    return true;
                }
                return false;
            }
        },
        rateLimits: {
            check: (ip, limit, windowMs) => {
                const now = Date.now();
                const key = `${ip}`;
                const entry = dbRateLimits.get(key) || { count: 0, resetTime: now + windowMs };
                if (now > entry.resetTime) {
                    entry.count = 1;
                    entry.resetTime = now + windowMs;
                } else {
                    entry.count++;
                }
                dbRateLimits.set(key, entry);
                const remaining = Math.max(0, limit - entry.count);
                return {
                    ip,
                    limit,
                    windowMs,
                    remaining,
                    resetTime: new Date(entry.resetTime).toISOString()
                };
            }
        },
        apiLogs: {
            getAll: () => safeClone(dbApiLogs.filter(l => l.tenantId === activeTenantId)),
            create: (data) => {
                const newLog = {
                    id: dbApiLogs.length > 0 ? Math.max(...dbApiLogs.map(l => l.id)) + 1 : 1,
                    tenantId: activeTenantId,
                    timestamp: new Date().toISOString(),
                    ...data
                };
                dbApiLogs.push(newLog);
                return safeClone(newLog);
            }
        },
        securityLogs: {
            getAll: () => safeClone(dbSecurityLogs.filter(l => l.tenantId === activeTenantId)),
            create: (data) => {
                const newLog = {
                    id: dbSecurityLogs.length > 0 ? Math.max(...dbSecurityLogs.map(l => l.id)) + 1 : 1,
                    tenantId: activeTenantId,
                    timestamp: new Date().toISOString(),
                    riskScore: data.riskScore || 0,
                    ...data
                };
                dbSecurityLogs.push(newLog);
                return safeClone(newLog);
            }
        },
        securityConfig: {
            get: () => {
                if (!dbSecurityConfig) {
                    dbSecurityConfig = {
                        passwordMinLength: 8,
                        passwordRequireSpecialChar: true,
                        passwordRequireNumbers: true,
                        passwordRequireUppercase: true,
                        passwordHistoryCount: 5,
                        passwordExpirationDays: 90,
                        maxFailedAttempts: 5,
                        lockoutDurationMinutes: 15
                    };
                }
                return safeClone(dbSecurityConfig);
            },
            update: (data) => {
                dbSecurityConfig = { ...dbSecurityConfig, ...data };
                return safeClone(dbSecurityConfig);
            }
        },
        mfaSettings: {
            get: (userId) => {
                const key = `${userId}`;
                return safeClone(dbMfaSettings.get(key)) || null;
            },
            set: (userId, data) => {
                const key = `${userId}`;
                dbMfaSettings.set(key, data);
                return safeClone(data);
            }
        },
        activeSessions: {
            getAll: () => safeClone(dbActiveSessions.filter(s => s.tenantId === activeTenantId)),
            create: (data) => {
                const newSession = {
                    id: dbActiveSessions.length > 0 ? Math.max(...dbActiveSessions.map(s => s.id)) + 1 : 1,
                    tenantId: activeTenantId,
                    createdAt: new Date().toISOString(),
                    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                    isCurrent: true,
                    ...data
                };
                dbActiveSessions.push(newSession);
                return safeClone(newSession);
            },
            revoke: (id) => {
                const idx = dbActiveSessions.findIndex(s => String(s.id) === String(id) && s.tenantId === activeTenantId);
                if (idx !== -1) {
                    dbActiveSessions.splice(idx, 1);
                    return true;
                }
                return false;
            }
        },
        trustedDevices: {
            getAll: () => safeClone(dbTrustedDevices.filter(d => d.tenantId === activeTenantId)),
            create: (data) => {
                const newDevice = {
                    id: dbTrustedDevices.length > 0 ? Math.max(...dbTrustedDevices.map(d => d.id)) + 1 : 1,
                    tenantId: activeTenantId,
                    trustedAt: new Date().toISOString(),
                    rememberUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                    ...data
                };
                dbTrustedDevices.push(newDevice);
                return safeClone(newDevice);
            },
            delete: (id) => {
                const idx = dbTrustedDevices.findIndex(d => String(d.id) === String(id) && d.tenantId === activeTenantId);
                if (idx !== -1) {
                    dbTrustedDevices.splice(idx, 1);
                    return true;
                }
                return false;
            }
        },
        secretsVault: {
            getAll: () => safeClone(dbSecretsVault.filter(s => s.tenantId === activeTenantId)),
            create: (data) => {
                const newSecret = {
                    id: dbSecretsVault.length > 0 ? Math.max(...dbSecretsVault.map(s => s.id)) + 1 : 1,
                    tenantId: activeTenantId,
                    version: 1,
                    lastRotatedAt: new Date().toISOString(),
                    history: [],
                    ...data
                };
                dbSecretsVault.push(newSecret);
                return safeClone(newSecret);
            },
            rotate: (id, newValue) => {
                const idx = dbSecretsVault.findIndex(s => String(s.id) === String(id) && s.tenantId === activeTenantId);
                if (idx !== -1) {
                    const current = dbSecretsVault[idx];
                    current.history.push({
                        version: current.version,
                        value: current.value,
                        rotatedAt: current.lastRotatedAt
                    });
                    current.value = newValue;
                    current.version++;
                    current.lastRotatedAt = new Date().toISOString();
                    return safeClone(current);
                }
                return null;
            }
        },
        enterprisePolicy: {
            get: () => {
                if (!dbEnterprisePolicy) {
                    dbEnterprisePolicy = {
                        tenantId: activeTenantId,
                        ipAllowList: [],
                        blockedCountries: [],
                        workingHoursStart: null,
                        workingHoursEnd: null,
                        blockWeekendLogin: false,
                        deviceRestricted: false
                    };
                }
                return safeClone(dbEnterprisePolicy);
            },
            update: (data) => {
                dbEnterprisePolicy = { ...dbEnterprisePolicy, ...data };
                return safeClone(dbEnterprisePolicy);
            }
        },
        workflows: {
            getAll: () => safeClone(dbWorkflows.filter(w => w.tenantId === activeTenantId)),
            create: (data) => {
                const newWf = {
                    id: dbWorkflows.length > 0 ? Math.max(...dbWorkflows.map(w => w.id)) + 1 : 1,
                    tenantId: activeTenantId,
                    status: 'Draft',
                    version: 1,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    ...data
                };
                dbWorkflows.push(newWf);
                return safeClone(newWf);
            },
            delete: (id) => {
                const idx = dbWorkflows.findIndex(w => String(w.id) === String(id) && w.tenantId === activeTenantId);
                if (idx !== -1) {
                    dbWorkflows.splice(idx, 1);
                    return true;
                }
                return false;
            }
        },
        workflowTemplates: {
            getAll: () => safeClone(dbWorkflowTemplates.filter(t => t.tenantId === activeTenantId)),
            create: (data) => {
                const newTpl = {
                    id: dbWorkflowTemplates.length > 0 ? Math.max(...dbWorkflowTemplates.map(t => t.id)) + 1 : 1,
                    tenantId: activeTenantId,
                    createdAt: new Date().toISOString(),
                    ...data
                };
                dbWorkflowTemplates.push(newTpl);
                return safeClone(newTpl);
            },
            delete: (id) => {
                const idx = dbWorkflowTemplates.findIndex(t => String(t.id) === String(id) && t.tenantId === activeTenantId);
                if (idx !== -1) {
                    dbWorkflowTemplates.splice(idx, 1);
                    return true;
                }
                return false;
            }
        },
        executionLogs: {
            getAll: () => safeClone(dbAutomationLogs.filter(l => l.tenantId === activeTenantId)),
            create: (data) => {
                const newLog = {
                    id: dbAutomationLogs.length > 0 ? Math.max(...dbAutomationLogs.map(l => l.id)) + 1 : 1,
                    tenantId: activeTenantId,
                    timestamp: new Date().toISOString(),
                    ...data
                };
                dbAutomationLogs.push(newLog);
                return safeClone(newLog);
            }
        },
        devopsMetrics: {
            getAll: () => safeClone(dbDevOpsMetrics.filter(m => m.tenantId === activeTenantId)),
            create: (data) => {
                const newMetric = {
                    id: dbDevOpsMetrics.length > 0 ? Math.max(...dbDevOpsMetrics.map(m => m.id)) + 1 : 1,
                    tenantId: activeTenantId,
                    timestamp: new Date().toISOString(),
                    ...data
                };
                dbDevOpsMetrics.push(newMetric);
                return safeClone(newMetric);
            }
        },
        devopsLogs: {
            getAll: () => safeClone(dbDevOpsLogs.filter(l => l.tenantId === activeTenantId)),
            create: (data) => {
                const newLog = {
                    id: dbDevOpsLogs.length > 0 ? Math.max(...dbDevOpsLogs.map(l => l.id)) + 1 : 1,
                    tenantId: activeTenantId,
                    timestamp: new Date().toISOString(),
                    ...data
                };
                dbDevOpsLogs.push(newLog);
                return safeClone(newLog);
            }
        },
        devopsTraces: {
            getAll: () => safeClone(dbDevOpsTraces.filter(t => t.tenantId === activeTenantId)),
            create: (data) => {
                const newTrace = {
                    id: dbDevOpsTraces.length > 0 ? Math.max(...dbDevOpsTraces.map(t => t.id)) + 1 : 1,
                    tenantId: activeTenantId,
                    timestamp: new Date().toISOString(),
                    ...data
                };
                dbDevOpsTraces.push(newTrace);
                return safeClone(newTrace);
            }
        },
        devopsAlerts: {
            getAll: () => safeClone(dbDevOpsAlerts.filter(a => a.tenantId === activeTenantId)),
            create: (data) => {
                const newAlert = {
                    id: dbDevOpsAlerts.length > 0 ? Math.max(...dbDevOpsAlerts.map(a => a.id)) + 1 : 1,
                    tenantId: activeTenantId,
                    status: 'Active',
                    createdAt: new Date().toISOString(),
                    ...data
                };
                dbDevOpsAlerts.push(newAlert);
                return safeClone(newAlert);
            },
            updateStatus: (id, status, resolvedAt = null) => {
                const idx = dbDevOpsAlerts.findIndex(a => String(a.id) === String(id) && a.tenantId === activeTenantId);
                if (idx !== -1) {
                    dbDevOpsAlerts[idx].status = status;
                    if (resolvedAt) {
                        dbDevOpsAlerts[idx].resolvedAt = resolvedAt;
                    }
                    dbDevOpsAlerts[idx].updatedAt = new Date().toISOString();
                    return safeClone(dbDevOpsAlerts[idx]);
                }
                return null;
            }
        },
        devopsFeatureFlags: {
            getAll: () => safeClone(dbDevOpsFeatureFlags.filter(f => f.tenantId === activeTenantId)),
            create: (data) => {
                const newFlag = {
                    id: dbDevOpsFeatureFlags.length > 0 ? Math.max(...dbDevOpsFeatureFlags.map(f => f.id)) + 1 : 1,
                    tenantId: activeTenantId,
                    status: 'Disabled',
                    rolloutPercent: 100,
                    ...data
                };
                dbDevOpsFeatureFlags.push(newFlag);
                return safeClone(newFlag);
            },
            update: (key, data) => {
                const idx = dbDevOpsFeatureFlags.findIndex(f => f.key === key && f.tenantId === activeTenantId);
                if (idx !== -1) {
                    dbDevOpsFeatureFlags[idx] = { ...dbDevOpsFeatureFlags[idx], ...data };
                    return safeClone(dbDevOpsFeatureFlags[idx]);
                }
                return null;
            }
        },
        devopsReleases: {
            getAll: () => safeClone(dbDevOpsReleases.filter(r => r.tenantId === activeTenantId)),
            create: (data) => {
                const newRelease = {
                    id: dbDevOpsReleases.length > 0 ? Math.max(...dbDevOpsReleases.map(r => r.id)) + 1 : 1,
                    tenantId: activeTenantId,
                    createdAt: new Date().toISOString(),
                    ...data
                };
                dbDevOpsReleases.push(newRelease);
                return safeClone(newRelease);
            },
            rollback: (id) => {
                const idx = dbDevOpsReleases.findIndex(r => String(r.id) === String(id) && r.tenantId === activeTenantId);
                if (idx !== -1) {
                    dbDevOpsReleases[idx].status = 'RolledBack';
                    dbDevOpsReleases[idx].rolledBackAt = new Date().toISOString();
                    return safeClone(dbDevOpsReleases[idx]);
                }
                return null;
            }
        },
        devopsProfiling: {
            getAll: () => safeClone(dbDevOpsProfiling.filter(p => p.tenantId === activeTenantId)),
            create: (data) => {
                const newProfiling = {
                    id: dbDevOpsProfiling.length > 0 ? Math.max(...dbDevOpsProfiling.map(p => p.id)) + 1 : 1,
                    tenantId: activeTenantId,
                    timestamp: new Date().toISOString(),
                    ...data
                };
                dbDevOpsProfiling.push(newProfiling);
                return safeClone(newProfiling);
            }
        },
        workflowRuns: {
            getAll: () => safeClone(dbWorkflowRuns.filter(r => r.tenantId === activeTenantId)),
            create: (data) => {
                const newRun = {
                    id: dbWorkflowRuns.length > 0 ? Math.max(...dbWorkflowRuns.map(r => r.id)) + 1 : 1,
                    tenantId: activeTenantId,
                    status: 'Running',
                    executedNodes: [],
                    startTime: new Date().toISOString(),
                    ...data
                };
                dbWorkflowRuns.push(newRun);
                return safeClone(newRun);
            },
            updateStatus: (id, status, error = null) => {
                const idx = dbWorkflowRuns.findIndex(r => String(r.id) === String(id) && r.tenantId === activeTenantId);
                if (idx !== -1) {
                    dbWorkflowRuns[idx].status = status;
                    dbWorkflowRuns[idx].error = error;
                    dbWorkflowRuns[idx].endTime = new Date().toISOString();
                    return safeClone(dbWorkflowRuns[idx]);
                }
                return null;
            }
        },
        approvals: {
            getAll: () => safeClone(dbApprovals.filter(a => a.tenantId === activeTenantId)),
            create: (data) => {
                const newAp = {
                    id: dbApprovals.length > 0 ? Math.max(...dbApprovals.map(a => a.id)) + 1 : 1,
                    tenantId: activeTenantId,
                    status: 'Pending',
                    currentLevel: 1,
                    responses: [],
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    ...data
                };
                dbApprovals.push(newAp);
                return safeClone(newAp);
            },
            update: (id, status, data) => {
                const idx = dbApprovals.findIndex(a => String(a.id) === String(id) && a.tenantId === activeTenantId);
                if (idx !== -1) {
                    dbApprovals[idx] = { ...dbApprovals[idx], ...data, status, updatedAt: new Date().toISOString() };
                    return safeClone(dbApprovals[idx]);
                }
                return null;
            }
        },
        automationRules: {
            getAll: () => safeClone(dbAutomationRules.filter(r => r.tenantId === activeTenantId)),
            create: (data) => {
                const newRule = {
                    id: dbAutomationRules.length > 0 ? Math.max(...dbAutomationRules.map(r => r.id)) + 1 : 1,
                    tenantId: activeTenantId,
                    status: 'Active',
                    priority: 1,
                    createdAt: new Date().toISOString(),
                    ...data
                };
                dbAutomationRules.push(newRule);
                return safeClone(newRule);
            },
            delete: (id) => {
                const idx = dbAutomationRules.findIndex(r => String(r.id) === String(id) && r.tenantId === activeTenantId);
                if (idx !== -1) {
                    dbAutomationRules.splice(idx, 1);
                    return true;
                }
                return false;
            }
        },
        backgroundJobs: {
            getAll: () => safeClone(dbBackgroundJobs.filter(j => j.tenantId === activeTenantId)),
            create: (data) => {
                const newJob = {
                    id: dbBackgroundJobs.length > 0 ? Math.max(...dbBackgroundJobs.map(j => j.id)) + 1 : 1,
                    tenantId: activeTenantId,
                    status: 'Pending',
                    attempts: 0,
                    createdAt: new Date().toISOString(),
                    ...data
                };
                dbBackgroundJobs.push(newJob);
                return safeClone(newJob);
            },
            getPending: () => {
                const job = dbBackgroundJobs.find(j => j.status === 'Pending' && j.tenantId === activeTenantId);
                return job ? safeClone(job) : null;
            },
            update: (id, data) => {
                const idx = dbBackgroundJobs.findIndex(j => String(j.id) === String(id) && j.tenantId === activeTenantId);
                if (idx !== -1) {
                    dbBackgroundJobs[idx] = { ...dbBackgroundJobs[idx], ...data };
                    return safeClone(dbBackgroundJobs[idx]);
                }
                return null;
            }
        },
        automationLogs: {
            getAll: () => safeClone(dbAutomationLogs.filter(l => l.tenantId === activeTenantId)),
            create: (data) => {
                const newLog = {
                    id: dbAutomationLogs.length > 0 ? Math.max(...dbAutomationLogs.map(l => l.id)) + 1 : 1,
                    tenantId: activeTenantId,
                    timestamp: new Date().toISOString(),
                    ...data
                };
                dbAutomationLogs.push(newLog);
                return safeClone(newLog);
            }
        },
        tenantContext: {
            setActiveTenantId: (id) => {
                activeTenantId = Number(id);
            },
            getActiveTenantId: () => activeTenantId,
            setActiveOrganizationId: (id) => {
                activeOrganizationId = Number(id);
            },
            getActiveOrganizationId: () => activeOrganizationId
        }
    }
};

let dbTenants = [
    { id: 1, name: 'Rezk Fit Hub Default', domain: 'default.rezkfit.com', status: 'Active', contactEmail: 'default@rezkfit.com', planId: 'Professional', createdAt: '2026-01-01T00:00:00Z' },
    { id: 2, name: 'Elite Fitness Center', domain: 'elite.rezkfit.com', status: 'Active', contactEmail: 'elite@rezkfit.com', planId: 'Starter', createdAt: '2026-03-01T00:00:00Z' },
    { id: 3, name: 'Saudi Iron Gym', domain: 'saudi.rezkfit.com', status: 'Suspended', contactEmail: 'saudi@saudigym.com', planId: 'Business', createdAt: '2026-05-15T00:00:00Z' }
];

let dbTenantSettings = [
    { tenantId: 1, companyName: 'Rezk Fit Hub', primaryColor: '#0ea5e9', secondaryColor: '#64748b', logo: '/logo.png', darkLogo: '/logo-dark.png', favicon: '/favicon.ico', typography: 'Inter', emailTemplate: '', reportBranding: true, invoiceBranding: true },
    { tenantId: 2, companyName: 'Elite Fitness', primaryColor: '#10b981', secondaryColor: '#3b82f6', logo: '/elite-logo.png', darkLogo: '/elite-logo-dark.png', favicon: '/elite-favicon.ico', typography: 'Outfit', emailTemplate: '', reportBranding: true, invoiceBranding: true },
    { tenantId: 3, companyName: 'Saudi Gym', primaryColor: '#f97316', secondaryColor: '#1e293b', logo: '/saudi-logo.png', darkLogo: '/saudi-logo-dark.png', favicon: '/saudi-favicon.ico', typography: 'Roboto', emailTemplate: '', reportBranding: true, invoiceBranding: true }
];

let dbSubscriptions = [
    { id: 1, tenantId: 1, planId: 'Professional', status: 'Active', startDate: '2026-01-01T00:00:00Z', endDate: '2027-01-01T00:00:00Z', limits: { users: 10, storageGb: 20, reportsEnabled: true, analyticsEnabled: true, realtimeEnabled: true, exportsEnabled: true, apiAccessEnabled: true } },
    { id: 2, tenantId: 2, planId: 'Starter', status: 'Active', startDate: '2026-03-01T00:00:00Z', endDate: '2027-03-01T00:00:00Z', limits: { users: 3, storageGb: 5, reportsEnabled: false, analyticsEnabled: true, realtimeEnabled: false, exportsEnabled: false, apiAccessEnabled: false } },
    { id: 3, tenantId: 3, planId: 'Business', status: 'Expired', startDate: '2026-05-15T00:00:00Z', endDate: '2026-07-01T00:00:00Z', limits: { users: 20, storageGb: 50, reportsEnabled: true, analyticsEnabled: true, realtimeEnabled: true, exportsEnabled: true, apiAccessEnabled: true } }
];

let dbLicenses = [
    { id: 1, tenantId: 1, licenseKey: 'LICENSE-KEY-REZKFIT-PROFESSIONAL-2026', status: 'Active', issuedAt: '2026-01-01T00:00:00Z', expiresAt: '2027-01-01T00:00:00Z', seatsCount: 10, deviceCount: 5, offlineData: null },
    { id: 2, tenantId: 2, licenseKey: 'LICENSE-KEY-ELITEFIT-STARTER-2026', status: 'Active', issuedAt: '2026-03-01T00:00:00Z', expiresAt: '2027-03-01T00:00:00Z', seatsCount: 3, deviceCount: 2, offlineData: null },
    { id: 3, tenantId: 3, licenseKey: 'LICENSE-KEY-SAUDIGYM-EXPIRED-2026', status: 'Expired', issuedAt: '2026-05-15T00:00:00Z', expiresAt: '2026-07-01T00:00:00Z', seatsCount: 20, deviceCount: 10, offlineData: null }
];

const isolateCollections = [
    'clients', 'exercises', 'nutrition', 'calendarEvents', 'tasks',
    'notifications', 'messages', 'conversations', 'activities',
    'documents', 'media', 'adminUsers', 'branches', 'auditLogs'
];

isolateCollections.forEach(collectionKey => {
    const original = mockDatabase[collectionKey];
    if (!original) return;

    if (original.getAll) {
        const origGetAll = original.getAll;
        original.getAll = (...args) => {
            const res = origGetAll(...args);
            if (Array.isArray(res)) {
                return res.filter(item => item && (item.tenantId === undefined || item.tenantId === activeTenantId));
            }
            if (res && res.data && Array.isArray(res.data)) {
                return {
                    ...res,
                    data: res.data.filter(item => item && (item.tenantId === undefined || item.tenantId === activeTenantId))
                };
            }
            return res;
        };
    }

    if (original.getById) {
        const origGetById = original.getById;
        original.getById = (id, ...args) => {
            const item = origGetById(id, ...args);
            if (item && (item.tenantId === undefined || item.tenantId === activeTenantId)) {
                return item;
            }
            return null;
        };
    }

    if (original.create) {
        const origCreate = original.create;
        original.create = (data, ...args) => {
            const dataWithTenant = { ...data, tenantId: activeTenantId };
            return origCreate(dataWithTenant, ...args);
        };
    }
});

if (mockDatabase.reporting) {
    const reportCollections = ['reports', 'scheduler', 'exports'];
    reportCollections.forEach(key => {
        const original = mockDatabase.reporting[key];
        if (!original) return;

        if (original.getAll) {
            const origGetAll = original.getAll;
            original.getAll = (...args) => {
                const res = origGetAll(...args);
                if (Array.isArray(res)) {
                    return res.filter(item => item && (item.tenantId === undefined || item.tenantId === activeTenantId));
                }
                return res;
            };
        }
        
        if (original.getById) {
            const origGetById = original.getById;
            original.getById = (id, ...args) => {
                const item = origGetById(id, ...args);
                if (item && (item.tenantId === undefined || item.tenantId === activeTenantId)) {
                    return item;
                }
                return null;
            };
        }

        if (original.create) {
            const origCreate = original.create;
            original.create = (data, ...args) => {
                const dataWithTenant = { ...data, tenantId: activeTenantId };
                return origCreate(dataWithTenant, ...args);
            };
        }
    });
}

export default mockDatabase;

