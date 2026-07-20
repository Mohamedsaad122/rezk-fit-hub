import { API_ENDPOINTS } from '@/constants/api.constants';
import api from '@/api/axios';
import { ApiError } from '@/api/errors';
import AppConfig from '@/config/app.config';
import mockUsers from '@/mocks/auth.mock';
import { simulateApi } from '@/utils/mockApi.helper';
import { parseApiResponse } from '@/utils/parseApiResponse';
import { LoginResponseSchema, UserSchema } from '@/contracts/auth.contract';
import { z } from 'zod';
import { useAuthStore } from '@/store/auth.store';

/**
 * Standardized Auth Repository.
 * Handles user sessions, login credentials, resets, and code verification.
 */
export const AuthRepository = {
    login: async (credentials) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => {
                const { email, password } = credentials;
                
                // Search match across mock profiles
                const matchedProfileKey = Object.keys(mockUsers).find(
                    key => mockUsers[key].email.toLowerCase() === email.toLowerCase()
                );
                
                if (matchedProfileKey && mockUsers[matchedProfileKey].password === password) {
                    const userProfile = { ...mockUsers[matchedProfileKey] };
                    delete userProfile.password; // Strip raw credentials
                    
                    return {
                        user: userProfile,
                        accessToken: `mock-jwt-accessToken-${userProfile.role}-payload-98765`,
                        refreshToken: `mock-jwt-refreshToken-${userProfile.role}-payload-12345`,
                    };
                }
                
                throw new ApiError('البريد الإلكتروني أو كلمة المرور غير صحيحة', 400, 'INVALID_CREDENTIALS');
            }, { minDelay: 400, maxDelay: 800 });
        } else {
            const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
            result = response.data;
        }

        return parseApiResponse(LoginResponseSchema, result, 'Auth Login');
    },

    logout: async () => {
        if (AppConfig.enableMock) {
            return simulateApi(() => true, { minDelay: 150, maxDelay: 300 });
        }
        
        await api.post(API_ENDPOINTS.AUTH.LOGOUT);
        return true;
    },

    refreshSession: async (refreshToken) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => ({
                accessToken: "mock-jwt-accessToken-refreshed-payload-55555",
                refreshToken: refreshToken,
            }), { minDelay: 200, maxDelay: 400 });
        } else {
            const response = await api.post(API_ENDPOINTS.AUTH.REFRESH, { refreshToken });
            result = response.data;
        }

        const RefreshResponseSchema = z.object({
            accessToken: z.string(),
            refreshToken: z.string().optional()
        });
        return parseApiResponse(RefreshResponseSchema, result, 'Auth Refresh Session');
    },

    forgotPassword: async (email) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => {
                const matched = Object.values(mockUsers).some(
                    u => u.email.toLowerCase() === email.toLowerCase()
                );
                
                if (matched) {
                    return { success: true, message: 'تم إرسال رمز التحقق إلى بريدك الإلكتروني' };
                }
                throw new ApiError('البريد الإلكتروني غير مسجل لدينا', 404, 'EMAIL_NOT_FOUND');
            }, { minDelay: 300, maxDelay: 500 });
        } else {
            const response = await api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
            result = response.data;
        }

        const SimpleResponseSchema = z.object({
            success: z.boolean(),
            message: z.string()
        });
        return parseApiResponse(SimpleResponseSchema, result, 'Forgot Password');
    },

    verifyCode: async (email, code) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => {
                if (code === '1234') {
                    return { success: true, token: 'mock-verification-reset-token-77777' };
                }
                throw new ApiError('رمز التحقق غير صحيح', 400, 'INVALID_VERIFICATION_CODE');
            }, { minDelay: 300, maxDelay: 500 });
        } else {
            const response = await api.post(API_ENDPOINTS.AUTH.VERIFY_CODE, { email, code });
            result = response.data;
        }

        const VerifyResponseSchema = z.object({
            success: z.boolean(),
            token: z.string()
        });
        return parseApiResponse(VerifyResponseSchema, result, 'Verify Code');
    },

    resetPassword: async (email, password, token) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => {
                const matchedProfileKey = Object.keys(mockUsers).find(
                    key => mockUsers[key].email.toLowerCase() === email.toLowerCase()
                );
                
                if (matchedProfileKey) {
                    mockUsers[matchedProfileKey].password = password;
                    return { success: true, message: 'تم إعادة تعيين كلمة المرور بنجاح' };
                }
                throw new ApiError('حدث خطأ في إعادة التعيين. الرمز منتهي الصلاحية.', 400, 'EXPIRED_TOKEN');
            }, { minDelay: 400, maxDelay: 600 });
        } else {
            const response = await api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, { email, password, token });
            result = response.data;
        }

        const SimpleResponseSchema = z.object({
            success: z.boolean(),
            message: z.string()
        });
        return parseApiResponse(SimpleResponseSchema, result, 'Reset Password');
    },

    getCurrentUser: async () => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => {
                // Get the current user from the state store to support dynamic session restore
                const storeUser = useAuthStore.getState().user;
                if (storeUser) {
                    return storeUser;
                }
                const userProfile = { ...mockUsers.coach };
                delete userProfile.password;
                return userProfile;
            }, { minDelay: 100, maxDelay: 200 });
        } else {
            const response = await api.get(API_ENDPOINTS.AUTH.ME);
            result = response.data;
        }

        return parseApiResponse(UserSchema, result, 'Auth Current User');
    },

    register: async (registerData) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => {
                const { name, email, role } = registerData;
                const newUserKey = `user-${Date.now()}`;
                
                // Add the user to our local mock database
                mockUsers[newUserKey] = {
                    id: newUserKey,
                    name,
                    email,
                    role,
                    permissions: role === 'admin' ? ['*'] : [],
                };
                
                const userProfile = { ...mockUsers[newUserKey] };
                return {
                    user: userProfile,
                    accessToken: `mock-jwt-accessToken-${role}-payload-${newUserKey}`,
                    refreshToken: `mock-jwt-refreshToken-${role}-payload-${newUserKey}`,
                };
            }, { minDelay: 300, maxDelay: 500 });
        } else {
            const response = await api.post(API_ENDPOINTS.AUTH.REGISTER || '/auth/register', registerData);
            result = response.data;
        }

        return parseApiResponse(LoginResponseSchema, result, 'Auth Register');
    }
};

export default AuthRepository;
