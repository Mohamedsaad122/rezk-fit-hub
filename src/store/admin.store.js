import { create } from 'zustand';

const defaultSettings = {
    general: {
        siteName: "Rezk Fit Hub",
        supportEmail: "support@rezkfit.com",
        contactPhone: "+966110002233"
    },
    security: {
        passwordExpiryDays: 90,
        enableTwoFactor: true,
        sessionTimeoutMinutes: 30
    },
    notifications: {
        emailAlerts: true,
        smsAlerts: false,
        pushAlerts: true
    },
    appearance: {
        theme: "dark",
        primaryColor: "violet",
        sidebarCollapsed: false
    },
    localization: {
        defaultLanguage: "ar",
        timezone: "Asia/Riyadh",
        dateFormat: "YYYY-MM-DD"
    }
};

const defaultPermissionMatrix = {
    "Super Admin": {
        Dashboard: ["View", "Create", "Update", "Delete", "Export", "Manage"],
        Clients: ["View", "Create", "Update", "Delete", "Export", "Manage"],
        Calendar: ["View", "Create", "Update", "Delete", "Export", "Manage"],
        Tasks: ["View", "Create", "Update", "Delete", "Export", "Manage"],
        Exercises: ["View", "Create", "Update", "Delete", "Export", "Manage"],
        Nutrition: ["View", "Create", "Update", "Delete", "Export", "Manage"],
        Analytics: ["View", "Create", "Update", "Delete", "Export", "Manage"],
        Messages: ["View", "Create", "Update", "Delete", "Export", "Manage"],
        Documents: ["View", "Create", "Update", "Delete", "Export", "Manage"],
        Notifications: ["View", "Create", "Update", "Delete", "Export", "Manage"],
        Settings: ["View", "Create", "Update", "Delete", "Export", "Manage"],
        Users: ["View", "Create", "Update", "Delete", "Export", "Manage"],
        Roles: ["View", "Create", "Update", "Delete", "Export", "Manage"],
        "Audit Logs": ["View", "Create", "Update", "Delete", "Export", "Manage"]
    },
    "Admin": {
        Dashboard: ["View", "Export"],
        Clients: ["View", "Create", "Update", "Delete", "Export"],
        Calendar: ["View", "Create", "Update", "Delete"],
        Tasks: ["View", "Create", "Update", "Delete"],
        Exercises: ["View", "Create", "Update"],
        Nutrition: ["View", "Create", "Update"],
        Analytics: ["View", "Export"],
        Messages: ["View", "Create"],
        Documents: ["View", "Create", "Update", "Delete", "Export"],
        Notifications: ["View", "Create"],
        Settings: ["View"],
        Users: ["View", "Create", "Update"],
        Roles: ["View"],
        "Audit Logs": ["View"]
    },
    "Coach": {
        Dashboard: ["View"],
        Clients: ["View", "Create", "Update"],
        Calendar: ["View", "Create", "Update", "Delete"],
        Tasks: ["View", "Create", "Update"],
        Exercises: ["View", "Create", "Update", "Delete", "Manage"],
        Nutrition: ["View"],
        Analytics: ["View"],
        Messages: ["View", "Create"],
        Documents: ["View", "Create", "Update"],
        Notifications: ["View", "Create"],
        Settings: [],
        Users: [],
        Roles: [],
        "Audit Logs": []
    },
    "Nutritionist": {
        Dashboard: ["View"],
        Clients: ["View", "Create", "Update"],
        Calendar: ["View", "Create", "Update"],
        Tasks: ["View", "Create", "Update"],
        Exercises: ["View"],
        Nutrition: ["View", "Create", "Update", "Delete", "Export", "Manage"],
        Analytics: ["View"],
        Messages: ["View", "Create"],
        Documents: ["View", "Create", "Update"],
        Notifications: ["View", "Create"],
        Settings: [],
        Users: [],
        Roles: [],
        "Audit Logs": []
    },
    "Receptionist": {
        Dashboard: ["View"],
        Clients: ["View"],
        Calendar: ["View", "Create", "Update"],
        Tasks: ["View", "Create"],
        Exercises: ["View"],
        Nutrition: ["View"],
        Analytics: [],
        Messages: ["View", "Create"],
        Documents: ["View"],
        Notifications: ["View"],
        Settings: [],
        Users: [],
        Roles: [],
        "Audit Logs": []
    }
};

export const useAdminStore = create((set) => ({
    settings: JSON.parse(JSON.stringify(defaultSettings)),
    permissionMatrix: JSON.parse(JSON.stringify(defaultPermissionMatrix)),
    
    updateSettings: (category, data) => set((state) => ({
        settings: {
            ...state.settings,
            [category]: {
                ...state.settings[category],
                ...data
            }
        }
    })),
    
    togglePermission: (role, moduleName, permission) => set((state) => {
        const currentPermissions = state.permissionMatrix[role]?.[moduleName] || [];
        let updated;
        if (currentPermissions.includes(permission)) {
            updated = currentPermissions.filter(p => p !== permission);
        } else {
            updated = [...currentPermissions, permission];
        }
        
        return {
            permissionMatrix: {
                ...state.permissionMatrix,
                [role]: {
                    ...state.permissionMatrix[role],
                    [moduleName]: updated
                }
            }
        };
    }),

    resetStore: () => set({
        settings: JSON.parse(JSON.stringify(defaultSettings)),
        permissionMatrix: JSON.parse(JSON.stringify(defaultPermissionMatrix))
    })
}));

export default useAdminStore;
