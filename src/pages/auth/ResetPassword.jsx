import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Dumbbell, KeyRound, AlertCircle, CheckCircle } from 'lucide-react';
import { useResetPassword } from '@/hooks/use-auth';
import { ResetPasswordRequestSchema } from '@/contracts/auth.contract';
import ROUTES from '@/constants/routes.constants';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ResetPassword() {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || '';
    const token = location.state?.token || '';

    const { mutate: resetPassword, isPending, error: mutationError } = useResetPassword();
    const [isSuccess, setIsSuccess] = useState(false);

    // Redirect to forgot password if no email/token exists in history state
    useEffect(() => {
        if (!email || !token) {
            navigate(ROUTES.FORGOT_PASSWORD, { replace: true });
        }
    }, [email, token, navigate]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(ResetPasswordRequestSchema),
        defaultValues: { password: '', confirmPassword: '' }
    });

    const onSubmit = (data) => {
        resetPassword({ email, password: data.password, token }, {
            onSuccess: () => {
                setIsSuccess(true);
            }
        });
    };

    const serverError = mutationError?.message || null;

    if (isSuccess) {
        return (
            <div className="w-full max-w-md px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card className="border-0 shadow-xl bg-gradient-card text-center">
                        <CardHeader>
                            <div className="flex justify-center mb-4">
                                <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center text-green-600 dark:text-green-400">
                                    <CheckCircle className="w-8 h-8" />
                                </div>
                            </div>
                            <CardTitle className="text-2xl font-bold">تم تعيين كلمة المرور</CardTitle>
                            <CardDescription className="text-base text-muted-foreground mt-2">
                                تم تعيين كلمة المرور الجديدة بنجاح. يمكنك الآن تسجيل الدخول إلى حسابك.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button 
                                onClick={() => navigate(ROUTES.LOGIN)}
                                className="w-full h-11 rounded-xl bg-gradient-primary text-white shadow-lg font-semibold"
                            >
                                الذهاب لتسجيل الدخول
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="flex justify-center mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-lg">
                        <Dumbbell className="w-8 h-8 text-white" />
                    </div>
                </div>

                <Card className="border-0 shadow-xl bg-gradient-card">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-2xl font-bold text-center">تعيين كلمة المرور</CardTitle>
                        <CardDescription className="text-sm text-muted-foreground text-center mt-1">
                            أدخل كلمة المرور الجديدة لحسابك.
                        </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="pt-4 space-y-4">
                        {serverError && (
                            <motion.div 
                                className="flex items-center gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span className="font-medium">{serverError}</span>
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-semibold">
                                    كلمة المرور الجديدة
                                </Label>
                                <div className="relative">
                                    <KeyRound className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        className={`pr-10 h-11 rounded-xl border-2 focus-visible:ring-primary ${errors.password ? 'border-destructive' : ''}`}
                                        {...register('password')}
                                    />
                                </div>
                                {errors.password && (
                                    <p className="text-xs text-destructive font-medium">{errors.password.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-sm font-semibold">
                                    تأكيد كلمة المرور
                                </Label>
                                <div className="relative">
                                    <KeyRound className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="••••••••"
                                        className={`pr-10 h-11 rounded-xl border-2 focus-visible:ring-primary ${errors.confirmPassword ? 'border-destructive' : ''}`}
                                        {...register('confirmPassword')}
                                    />
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-xs text-destructive font-medium">{errors.confirmPassword.message}</p>
                                )}
                            </div>

                            <Button 
                                type="submit" 
                                className="w-full h-11 rounded-xl bg-gradient-primary text-white shadow-lg font-semibold mt-4"
                                disabled={isPending}
                            >
                                {isPending ? 'جاري الحفظ...' : 'تحديث كلمة المرور'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
