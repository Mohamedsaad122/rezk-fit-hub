import { AuthRepository } from '@/repositories/auth.repository';

/**
 * Service acting as business layer between controllers and repository actions for Authentication / Session.
 */
export const AuthService = {
    login: (credentials) => {
        return AuthRepository.login(credentials);
    },

    logout: () => {
        return AuthRepository.logout();
    },

    refreshSession: (refreshToken) => {
        return AuthRepository.refreshSession(refreshToken);
    },

    forgotPassword: (email) => {
        return AuthRepository.forgotPassword(email);
    },

    verifyCode: (email, code) => {
        return AuthRepository.verifyCode(email, code);
    },

    resetPassword: (email, password, token) => {
        return AuthRepository.resetPassword(email, password, token);
    },

    getCurrentUser: () => {
        return AuthRepository.getCurrentUser();
    },

    register: (registerData) => {
        return AuthRepository.register(registerData);
    }
};

export default AuthService;
