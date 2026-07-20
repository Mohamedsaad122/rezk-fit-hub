import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import QUERY_KEYS from '@/constants/queryKeys';
import ROUTES from '@/constants/routes.constants';
import { toastService } from '@/services/toast.service';

/**
 * Custom hook wrapping auth state checks and profile updates.
 */
export const useCurrentUser = () => {
    const { user, isAuthenticated } = useAuthStore();
    const query = useQuery({
        queryKey: QUERY_KEYS.profile.me,
        queryFn: () => AuthService.getCurrentUser(),
        enabled: isAuthenticated,
    });

    return {
        ...query,
        user: query.data || user,
    };
};

/**
 * Mutation hook for login functionality.
 */
export const useLogin = () => {
    const loginUser = useAuthStore((state) => state.login);
    const navigate = useNavigate();
    
    return useMutation({
        mutationFn: (credentials) => AuthService.login(credentials),
        onSuccess: (data) => {
            loginUser(data);
            toastService.success('تم تسجيل الدخول بنجاح', `مرحباً بك مجدداً ${data.user.name}`);
            navigate(ROUTES.DASHBOARD);
        },
        onError: (error) => {
            toastService.error('فشل تسجيل الدخول', error.message || 'البريد الإلكتروني أو كلمة المرور غير صحيحة');
        }
    });
};

/**
 * Mutation hook for logging out.
 */
export const useLogout = () => {
    const logoutUser = useAuthStore((state) => state.logout);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: () => AuthService.logout(),
        onSuccess: () => {
            logoutUser();
            queryClient.clear();
            toastService.info('تم تسجيل الخروج بنجاح');
            navigate(ROUTES.LOGIN);
        },
        onError: () => {
            // Even if network logout fails, clear local session
            logoutUser();
            queryClient.clear();
            navigate(ROUTES.LOGIN);
        }
    });
};

/**
 * Mutation hook for forgot password request.
 */
export const useForgotPassword = () => {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (email) => AuthService.forgotPassword(email),
        onSuccess: (data, email) => {
            toastService.success('رمز التحقق أرسل بنجاح', 'يرجى مراجعة البريد الإلكتروني الخاص بك.');
            navigate(ROUTES.VERIFY_CODE, { state: { email } });
        },
        onError: (error) => {
            toastService.error('خطأ في طلب الاستعادة', error.message);
        }
    });
};

/**
 * Mutation hook for verifying password reset code.
 */
export const useVerifyCode = () => {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: ({ email, code }) => AuthService.verifyCode(email, code),
        onSuccess: (data, { email }) => {
            toastService.success('تم التحقق من الرمز بنجاح');
            navigate(ROUTES.RESET_PASSWORD, { 
                state: { email, token: data.token } 
            });
        },
        onError: (error) => {
            toastService.error('رمز التحقق غير صحيح', error.message);
        }
    });
};

/**
 * Mutation hook for resetting password.
 */
export const useResetPassword = () => {
    return useMutation({
        mutationFn: ({ email, password, token }) => AuthService.resetPassword(email, password, token),
        onSuccess: () => {
            toastService.success('تمت إعادة تعيين كلمة المرور', 'يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة.');
        },
        onError: (error) => {
            toastService.error('فشل إعادة تعيين كلمة المرور', error.message);
        }
    });
};

export const useRegister = () => {
    const loginUser = useAuthStore((state) => state.login);
    const navigate = useNavigate();
    
    return useMutation({
        mutationFn: (registerData) => AuthService.register(registerData),
        onSuccess: (data) => {
            loginUser(data);
            toastService.success('تم إنشاء الحساب بنجاح', `مرحباً بك ${data.user.name}`);
            navigate(ROUTES.DASHBOARD);
        },
        onError: (error) => {
            toastService.error('فشل إنشاء الحساب', error.message || 'حدث خطأ أثناء التسجيل');
        }
    });
};
