/**
 * Mock database profiles for authentication testing.
 */
export const mockUsers = {
    coach: {
        id: 101,
        name: "Rezk Naser",
        email: "coach@rezkfit.com",
        password: "123456",
        role: "coach",
        permissions: ["manage_exercises", "manage_nutrition", "view_dashboard"],
    },
    client: {
        id: 102,
        name: "أحمد محمد",
        email: "client@rezkfit.com",
        password: "123456",
        role: "client",
        permissions: ["view_exercises", "view_nutrition"],
    },
    trainee: {
        id: 102,
        name: "أحمد محمد",
        email: "trainee@rezkfit.com",
        password: "123456",
        role: "trainee",
        permissions: ["view_exercises", "view_nutrition"],
    },
    admin: {
        id: 103,
        name: "مدير النظام",
        email: "admin@rezkfit.com",
        password: "123456",
        role: "admin",
        permissions: ["all_access"],
    },
    nutritionist: {
        id: 104,
        name: "أخصائي التغذية",
        email: "nutritionist@rezkfit.com",
        password: "123456",
        role: "nutritionist",
        permissions: ["manage_nutrition", "view_dashboard"],
    },
    receptionist: {
        id: 105,
        name: "موظف الاستقبال",
        email: "receptionist@rezkfit.com",
        password: "123456",
        role: "receptionist",
        permissions: ["view_dashboard", "manage_appointments"],
    }
};

export default mockUsers;
