import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { HelmetProvider } from "react-helmet-async";
import { Layout } from "@/components/Layout";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import ErrorBoundary from "@/components/ErrorBoundary";
import GuestRoute from "@/components/auth/GuestRoute";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import RoleRoute from "@/components/auth/RoleRoute";
import PublicRoute from "@/components/auth/PublicRoute";
import ROUTES from "@/constants/routes.constants";
import { useNetworkStore } from "@/store/network.store";
import { NetworkIndicator } from "@/components/NetworkIndicator";
import { MaintenanceMode } from "@/pages/MaintenanceMode";
import { SocketService } from "@/realtime/socket.service";
import { initQuerySynchronizer } from "@/realtime/query-synchronizer";
import { mockRealtime } from "@/realtime/mockRealtime";
import { RealtimeDevPanel } from "@/components/RealtimeDevPanel";
import { usePresenceManager } from "@/hooks/use-presence-manager";
import { OfflineManager } from "@/infrastructure/offline-manager";
import { OfflineBanner } from "@/components/offline/OfflineComponents";

// Lazy load pages for optimized bundle chunks
const Home = lazy(() => import("./pages/Home"));
const Exercises = lazy(() => import("./pages/Exercises"));
const Nutrition = lazy(() => import("./pages/Nutrition"));
const Calendar = lazy(() => import("./modules/calendar/pages/Calendar"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Login = lazy(() => import("./pages/auth/Login"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const VerifyCode = lazy(() => import("./pages/auth/VerifyCode"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));
const Register = lazy(() => import("./pages/auth/Register"));
const Unauthorized = lazy(() => import("./pages/auth/Unauthorized"));
const Profile = lazy(() => import("./pages/Profile"));
const Clients = lazy(() => import("./pages/Clients"));
const ClientDetails = lazy(() => import("./pages/ClientDetails"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Tasks = lazy(() => import("./pages/Tasks"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Messages = lazy(() => import("./pages/Messages"));
const Activity = lazy(() => import("./pages/Activity"));
const Documents = lazy(() => import("./pages/Documents"));
const MediaLibrary = lazy(() => import("./pages/MediaLibrary"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Settings = lazy(() => import("./pages/Settings"));
const AdminUsers = lazy(() => import("./pages/AdminUsers"));
const AdminBranches = lazy(() => import("./pages/AdminBranches"));
const AdminRBAC = lazy(() => import("./pages/AdminRBAC"));
const AdminAuditLogs = lazy(() => import("./pages/AdminAuditLogs"));
const Collaboration = lazy(() => import("./pages/Collaboration"));
const Reports = lazy(() => import("./pages/Reports"));
const Monitoring = lazy(() => import("./pages/Monitoring"));
const SystemHealth = lazy(() => import("./pages/SystemHealth"));
const Tenants = lazy(() => import("./pages/Tenants"));
const Subscriptions = lazy(() => import("./pages/Subscriptions"));
const Licenses = lazy(() => import("./pages/Licenses"));
const Branding = lazy(() => import("./pages/Branding"));
const FeatureFlags = lazy(() => import("./pages/FeatureFlags"));
const Organizations = lazy(() => import("./pages/Organizations"));
const OrganizationDetails = lazy(() => import("./pages/OrganizationDetails"));
const Teams = lazy(() => import("./pages/Teams"));
const TeamDetails = lazy(() => import("./pages/TeamDetails"));
const Members = lazy(() => import("./pages/Members"));
const Invitations = lazy(() => import("./pages/Invitations"));
const Billing = lazy(() => import("./pages/Billing"));
const Invoices = lazy(() => import("./pages/Invoices"));
const InvoiceDetails = lazy(() => import("./pages/InvoiceDetails"));
const Payments = lazy(() => import("./pages/Payments"));
const Transactions = lazy(() => import("./pages/Transactions"));
const Coupons = lazy(() => import("./pages/Coupons"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Taxes = lazy(() => import("./pages/Taxes"));
const AIHub = lazy(() => import("./pages/AIHub"));
const CoachAssistant = lazy(() => import("./pages/CoachAssistant"));
const NutritionAssistant = lazy(() => import("./pages/NutritionAssistant"));
const WorkoutGenerator = lazy(() => import("./pages/WorkoutGenerator"));
const AIInsights = lazy(() => import("./pages/AIInsights"));
const PromptLibrary = lazy(() => import("./pages/PromptLibrary"));
const ConversationHistory = lazy(() => import("./pages/ConversationHistory"));
const Integrations = lazy(() => import("./pages/Integrations"));
const ProviderSettings = lazy(() => import("./pages/ProviderSettings"));
const WebhookLogs = lazy(() => import("./pages/WebhookLogs"));
const StorageProviders = lazy(() => import("./pages/StorageProviders"));
const CalendarSync = lazy(() => import("./pages/CalendarSync"));
const EmailProviders = lazy(() => import("./pages/EmailProviders"));
const SMSProviders = lazy(() => import("./pages/SMSProviders"));
const IntegrationHealth = lazy(() => import("./pages/IntegrationHealth"));
const OfflineCenter = lazy(() => import("./pages/OfflineCenter"));
const SyncCenter = lazy(() => import("./pages/SyncCenter"));
const ConflictCenter = lazy(() => import("./pages/ConflictCenter"));
const DeviceManager = lazy(() => import("./pages/DeviceManager"));
const DeveloperPortal = lazy(() => import("./pages/DeveloperPortal"));
const APIKeys = lazy(() => import("./pages/APIKeys"));
const OAuthApps = lazy(() => import("./pages/OAuthApps"));
const GraphQLPlayground = lazy(() => import("./pages/GraphQLPlayground"));
const ApiLogs = lazy(() => import("./pages/ApiLogs"));
const UsageDashboard = lazy(() => import("./pages/UsageDashboard"));
const RateLimits = lazy(() => import("./pages/RateLimits"));
const SDKDownloads = lazy(() => import("./pages/SDKDownloads"));
const SecurityCenter = lazy(() => import("./pages/SecurityCenter"));
const SecurityDashboard = lazy(() => import("./pages/SecurityDashboard"));
const ActiveSessions = lazy(() => import("./pages/ActiveSessions"));
const TrustedDevices = lazy(() => import("./pages/TrustedDevices"));
const MFASettings = lazy(() => import("./pages/MFASettings"));
const SSOSettings = lazy(() => import("./pages/SSOSettings"));
const PasswordPolicies = lazy(() => import("./pages/PasswordPolicies"));
const SecretsVault = lazy(() => import("./pages/SecretsVault"));
const ComplianceCenter = lazy(() => import("./pages/ComplianceCenter"));
const RiskCenter = lazy(() => import("./pages/RiskCenter"));
const WorkflowBuilder = lazy(() => import("./pages/WorkflowBuilder"));
const WorkflowTemplates = lazy(() => import("./pages/WorkflowTemplates"));
const WorkflowExecutions = lazy(() => import("./pages/WorkflowExecutions"));
const WorkflowHistory = lazy(() => import("./pages/WorkflowHistory"));
const AutomationCenter = lazy(() => import("./pages/AutomationCenter"));
const RuleEngine = lazy(() => import("./pages/RuleEngine"));
const Approvals = lazy(() => import("./pages/Approvals"));
const ApprovalDetails = lazy(() => import("./pages/ApprovalDetails"));
const Schedules = lazy(() => import("./pages/Schedules"));
const BackgroundJobs = lazy(() => import("./pages/BackgroundJobs"));

const ObservabilityCenter = lazy(() => import("./pages/ObservabilityCenter"));
const MetricsDashboard = lazy(() => import("./pages/MetricsDashboard"));
const LogsExplorer = lazy(() => import("./pages/LogsExplorer"));
const TraceExplorer = lazy(() => import("./pages/TraceExplorer"));
const AlertsCenter = lazy(() => import("./pages/AlertsCenter"));
const HealthDashboard = lazy(() => import("./pages/HealthDashboard"));
const ReleaseManager = lazy(() => import("./pages/ReleaseManager"));
const SystemProfiler = lazy(() => import("./pages/SystemProfiler"));
const TelemetryDashboard = lazy(() => import("./pages/TelemetryDashboard"));

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000,
            gcTime: 10 * 60 * 1000,
            retry: (failureCount, error) => {
                // Never retry authentication or authorization errors
                if (error && (error.status === 401 || error.status === 403)) {
                    return false;
                }

                // Match specific keys or config fields for modules retry rules
                const queryKey = error?.config?.queryKey || [];
                if (queryKey.includes('auth')) return false;
                if (queryKey.includes('analytics') || queryKey.includes('stats')) {
                    return failureCount < 3;
                }
                if (queryKey.includes('notifications')) {
                    return failureCount < 2;
                }
                if (queryKey.includes('documents')) {
                    return failureCount < 1;
                }

                return failureCount < 1;
            },
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
        },
    },
});

const AppContent = () => {
    const { isMaintenance, setOffline } = useNetworkStore();
    const activeQueryClient = useQueryClient();

    // Global Presence and Idle tracker
    usePresenceManager();

    useEffect(() => {
        // Establish real-time connection
        SocketService.connect();

        // Initialize cache query synchronizer
        initQuerySynchronizer(activeQueryClient);

        // Start mock realtime events emulator if running in mock mode
        mockRealtime.start();

        // Initialize OfflineManager
        OfflineManager.init();

        const handleOnline = () => setOffline(false);
        const handleOffline = () => setOffline(true);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            SocketService.disconnect();
            mockRealtime.stop();
            OfflineManager.destroy();
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, [setOffline, activeQueryClient]);

    if (isMaintenance) {
        return <MaintenanceMode />;
    }

    return (
        <BrowserRouter>
            <Layout>
                <OfflineBanner />
                <ErrorBoundary>
                    <Suspense fallback={
                        <div className="flex items-center justify-center min-h-[400px] w-full">
                            <LoadingSpinner message="جاري تحميل الصفحة..." />
                        </div>
                    }>
                        <Routes>
                            {/* Guest Routes */}
                            <Route element={<GuestRoute />}>
                                <Route path={ROUTES.LOGIN} element={<Login />} />
                                <Route path={ROUTES.REGISTER} element={<Register />} />
                                <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
                                <Route path={ROUTES.VERIFY_CODE} element={<VerifyCode />} />
                                <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />
                            </Route>

                            {/* Protected Routes */}
                            <Route element={<ProtectedRoute />}>
                                <Route path={ROUTES.HOME} element={<Home />} />
                                <Route path={ROUTES.UNAUTHORIZED} element={<Unauthorized />} />
                                <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
                                <Route path={ROUTES.PROFILE} element={<Profile />} />
                                <Route path={ROUTES.NOTIFICATIONS} element={<Notifications />} />
                                <Route path={ROUTES.TASKS} element={<Tasks />} />
                                <Route path={ROUTES.MESSAGES} element={<Messages />} />
                                <Route path={ROUTES.SETTINGS} element={<Settings />} />
                                <Route path={ROUTES.CALENDAR} element={<Calendar />} />

                                {/* Admin Only */}
                                <Route element={<RoleRoute allowedRoles={['admin']} />}>
                                    <Route path={ROUTES.ADMIN_USERS} element={<AdminUsers />} />
                                    <Route path={ROUTES.ADMIN_BRANCHES} element={<AdminBranches />} />
                                    <Route path={ROUTES.ADMIN_RBAC} element={<AdminRBAC />} />
                                    <Route path={ROUTES.ADMIN_AUDIT_LOGS} element={<AdminAuditLogs />} />
                                    <Route path={ROUTES.ADMIN_TENANTS} element={<Tenants />} />
                                    <Route path={ROUTES.ADMIN_SUBSCRIPTIONS} element={<Subscriptions />} />
                                    <Route path={ROUTES.ADMIN_LICENSES} element={<Licenses />} />
                                    <Route path={ROUTES.ADMIN_BRANDING} element={<Branding />} />
                                    <Route path={ROUTES.ADMIN_FEATURE_FLAGS} element={<FeatureFlags />} />
                                    <Route path={ROUTES.OBSERVABILITY_CENTER} element={<ObservabilityCenter />} />
                                    <Route path={ROUTES.METRICS_DASHBOARD} element={<MetricsDashboard />} />
                                    <Route path={ROUTES.LOGS_EXPLORER} element={<LogsExplorer />} />
                                    <Route path={ROUTES.TRACE_EXPLORER} element={<TraceExplorer />} />
                                    <Route path={ROUTES.ALERTS_CENTER} element={<AlertsCenter />} />
                                    <Route path={ROUTES.HEALTH_DASHBOARD} element={<HealthDashboard />} />
                                    <Route path={ROUTES.RELEASE_MANAGER} element={<ReleaseManager />} />
                                    <Route path={ROUTES.SYSTEM_PROFILER} element={<SystemProfiler />} />
                                    <Route path={ROUTES.TELEMETRY_DASHBOARD} element={<TelemetryDashboard />} />
                                    <Route path={ROUTES.MONITORING} element={<Monitoring />} />
                                    <Route path={ROUTES.SYSTEM_HEALTH} element={<SystemHealth />} />
                                    <Route path={ROUTES.RULE_ENGINE} element={<RuleEngine />} />
                                    <Route path={ROUTES.AUTOMATION_CENTER} element={<AutomationCenter />} />
                                    <Route path={ROUTES.BACKGROUND_JOBS} element={<BackgroundJobs />} />
                                    <Route path={ROUTES.COLLABORATION} element={<Collaboration />} />
                                    <Route path={ROUTES.WORKFLOW_BUILDER} element={<WorkflowBuilder />} />
                                    <Route path={ROUTES.WORKFLOW_TEMPLATES} element={<WorkflowTemplates />} />
                                    <Route path={ROUTES.WORKFLOW_EXECUTIONS} element={<WorkflowExecutions />} />
                                    <Route path={ROUTES.WORKFLOW_HISTORY} element={<WorkflowHistory />} />
                                    <Route path={ROUTES.INTEGRATIONS} element={<Integrations />} />
                                    <Route path={ROUTES.PROVIDER_SETTINGS} element={<ProviderSettings />} />
                                    <Route path={ROUTES.WEBHOOK_LOGS} element={<WebhookLogs />} />
                                    <Route path={ROUTES.STORAGE_PROVIDERS} element={<StorageProviders />} />
                                    <Route path={ROUTES.CALENDAR_SYNC} element={<CalendarSync />} />
                                    <Route path={ROUTES.EMAIL_PROVIDERS} element={<EmailProviders />} />
                                    <Route path={ROUTES.SMS_PROVIDERS} element={<SMSProviders />} />
                                    <Route path={ROUTES.INTEGRATION_HEALTH} element={<IntegrationHealth />} />
                                    <Route path={ROUTES.DEVELOPER_PORTAL} element={<DeveloperPortal />} />
                                    <Route path={ROUTES.API_KEYS} element={<APIKeys />} />
                                    <Route path={ROUTES.OAUTH_APPS} element={<OAuthApps />} />
                                    <Route path={ROUTES.GRAPHQL_PLAYGROUND} element={<GraphQLPlayground />} />
                                    <Route path={ROUTES.API_LOGS} element={<ApiLogs />} />
                                    <Route path={ROUTES.USAGE_DASHBOARD} element={<UsageDashboard />} />
                                    <Route path={ROUTES.RATE_LIMITS} element={<RateLimits />} />
                                    <Route path={ROUTES.SDK_DOWNLOADS} element={<SDKDownloads />} />
                                    <Route path={ROUTES.SECURITY_CENTER} element={<SecurityCenter />} />
                                    <Route path={ROUTES.SECURITY_DASHBOARD} element={<SecurityDashboard />} />
                                    <Route path={ROUTES.ACTIVE_SESSIONS} element={<ActiveSessions />} />
                                    <Route path={ROUTES.TRUSTED_DEVICES} element={<TrustedDevices />} />
                                    <Route path={ROUTES.MFA_SETTINGS} element={<MFASettings />} />
                                    <Route path={ROUTES.SSO_SETTINGS} element={<SSOSettings />} />
                                    <Route path={ROUTES.PASSWORD_POLICIES} element={<PasswordPolicies />} />
                                    <Route path={ROUTES.SECRETS_VAULT} element={<SecretsVault />} />
                                    <Route path={ROUTES.COMPLIANCE_CENTER} element={<ComplianceCenter />} />
                                    <Route path={ROUTES.RISK_CENTER} element={<RiskCenter />} />
                                    <Route path={ROUTES.SCHEDULES} element={<Schedules />} />
                                    <Route path={ROUTES.APPROVALS} element={<Approvals />} />
                                    <Route path={ROUTES.APPROVAL_DETAILS} element={<ApprovalDetails />} />
                                </Route>

                                {/* Coach / Nutritionist / Receptionist / Admin */}
                                <Route element={<RoleRoute allowedRoles={['admin', 'coach', 'nutritionist', 'receptionist']} />}>
                                    <Route path={ROUTES.CLIENTS} element={<Clients />} />
                                    <Route path={ROUTES.CLIENT_DETAILS} element={<ClientDetails />} />
                                    <Route path={ROUTES.DOCUMENTS} element={<Documents />} />
                                    <Route path={ROUTES.MEDIA} element={<MediaLibrary />} />
                                    <Route path={ROUTES.ACTIVITY} element={<Activity />} />
                                </Route>

                                {/* Coach / Admin */}
                                <Route element={<RoleRoute allowedRoles={['admin', 'coach']} />}>
                                    <Route path={ROUTES.EXERCISES} element={<Exercises />} />
                                    <Route path={ROUTES.ORGANIZATIONS} element={<Organizations />} />
                                    <Route path={ROUTES.ORGANIZATION_DETAILS} element={<OrganizationDetails />} />
                                    <Route path={ROUTES.TEAMS} element={<Teams />} />
                                    <Route path={ROUTES.TEAM_DETAILS} element={<TeamDetails />} />
                                    <Route path={ROUTES.MEMBERS} element={<Members />} />
                                    <Route path={ROUTES.INVITATIONS} element={<Invitations />} />
                                    <Route path={ROUTES.REPORTS} element={<Reports />} />
                                    <Route path={ROUTES.ANALYTICS} element={<Analytics />} />
                                    <Route path={ROUTES.BILLING} element={<Billing />} />
                                    <Route path={ROUTES.INVOICES} element={<Invoices />} />
                                    <Route path={ROUTES.INVOICE_DETAILS} element={<InvoiceDetails />} />
                                    <Route path={ROUTES.PAYMENTS} element={<Payments />} />
                                    <Route path={ROUTES.TRANSACTIONS} element={<Transactions />} />
                                    <Route path={ROUTES.COUPONS} element={<Coupons />} />
                                    <Route path={ROUTES.CHECKOUT} element={<Checkout />} />
                                    <Route path={ROUTES.TAXES} element={<Taxes />} />
                                    <Route path={ROUTES.AI_HUB} element={<AIHub />} />
                                    <Route path={ROUTES.AI_COACH} element={<CoachAssistant />} />
                                    <Route path={ROUTES.AI_WORKOUT} element={<WorkoutGenerator />} />
                                    <Route path={ROUTES.AI_INSIGHTS} element={<AIInsights />} />
                                    <Route path={ROUTES.AI_PROMPTS} element={<PromptLibrary />} />
                                    <Route path={ROUTES.AI_HISTORY} element={<ConversationHistory />} />
                                    <Route path={ROUTES.OFFLINE_CENTER} element={<OfflineCenter />} />
                                    <Route path={ROUTES.SYNC_CENTER} element={<SyncCenter />} />
                                    <Route path={ROUTES.CONFLICT_CENTER} element={<ConflictCenter />} />
                                    <Route path={ROUTES.DEVICE_MANAGER} element={<DeviceManager />} />
                                </Route>

                                {/* Nutritionist / Coach / Admin */}
                                <Route element={<RoleRoute allowedRoles={['admin', 'nutritionist', 'coach']} />}>
                                    <Route path={ROUTES.NUTRITION} element={<Nutrition />} />
                                    <Route path={ROUTES.AI_NUTRITION} element={<NutritionAssistant />} />
                                </Route>
                            </Route>

                            {/* Fallback */}
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </Suspense>
                </ErrorBoundary>
            </Layout>
        </BrowserRouter>
    );
};

const App = () => (
    <QueryClientProvider client={queryClient}>
        <HelmetProvider>
            <ThemeProvider>
                <TooltipProvider>
                    <Toaster />
                    <Sonner />
                    <NetworkIndicator />
                    <RealtimeDevPanel />
                    <AppContent />
                </TooltipProvider>
            </ThemeProvider>
        </HelmetProvider>
    </QueryClientProvider>
);

export default App;
