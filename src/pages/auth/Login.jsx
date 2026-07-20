import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Dumbbell, Eye, EyeOff, KeyRound, Mail, AlertCircle, Info } from 'lucide-react';
import { useLogin } from '@/hooks/use-auth';
import { LoginRequestSchema } from '@/contracts/auth.contract';
import ROUTES from '@/constants/routes.constants';
import AppConfig from '@/config/app.config';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Login() {
    const { mutate: login, isPending, error: mutationError } = useLogin();
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(LoginRequestSchema),
        defaultValues: {
            email: '',
            password: '',
        }
    });

    const onSubmit = (data) => {
        login(data);
    };

    const fillDemoCredentials = (email, password) => {
        setValue('email', email);
        setValue('password', password);
    };

    const serverError = mutationError?.message || null;

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
                    <CardHeader className="text-center pb-2">
                        <CardTitle className="text-3xl font-bold">تسجيل الدخول</CardTitle>
                        <CardDescription className="text-base text-muted-foreground mt-2">
                            نظام التدريب الإلكتروني - Rezk Fit Hub
                        </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-6 pt-4">
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
                                <Label htmlFor="email" className="text-sm font-semibold">
                                    البريد الإلكتروني
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        className={`pr-10 h-11 rounded-xl border-2 focus-visible:ring-primary ${errors.email ? 'border-destructive' : ''}`}
                                        {...register('email')}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-xs text-destructive font-medium">{errors.email.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label htmlFor="password" className="text-sm font-semibold">
                                        كلمة المرور
                                    </Label>
                                    <Link 
                                        to={ROUTES.FORGOT_PASSWORD} 
                                        className="text-xs text-primary hover:underline font-semibold"
                                    >
                                        نسيت كلمة المرور؟
                                    </Link>
                                </div>
                                <div className="relative">
                                    <KeyRound className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        className={`pr-10 pl-10 h-11 rounded-xl border-2 focus-visible:ring-primary ${errors.password ? 'border-destructive' : ''}`}
                                        {...register('password')}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground hover:text-foreground"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-xs text-destructive font-medium">{errors.password.message}</p>
                                )}
                            </div>

                            <Button 
                                type="submit" 
                                className="w-full h-11 rounded-xl bg-gradient-primary text-white shadow-lg font-semibold mt-6"
                                disabled={isPending}
                            >
                                {isPending ? 'جاري التحقق...' : 'دخول'}
                            </Button>
                        </form>

                        {/* Floating Demo Credentials Box */}
                        {AppConfig.enableMock && (
                            <div className="p-4 rounded-xl bg-muted/50 border border-border space-y-3">
                                <div className="flex items-center gap-2 text-sm text-primary font-bold">
                                    <Info className="w-4 h-4" />
                                    <span>الحسابات التجريبية (Demo Accounts)</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                                    <button
                                        type="button"
                                        onClick={() => fillDemoCredentials('coach@rezkfit.com', '123456')}
                                        className="p-2 rounded-lg bg-card border hover:border-primary transition-all font-semibold"
                                    >
                                        المدرب (Coach)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => fillDemoCredentials('client@rezkfit.com', '123456')}
                                        className="p-2 rounded-lg bg-card border hover:border-primary transition-all font-semibold"
                                    >
                                        المتدرب (Client)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => fillDemoCredentials('admin@rezkfit.com', '123456')}
                                        className="p-2 rounded-lg bg-card border hover:border-primary transition-all font-semibold"
                                    >
                                        المدير (Admin)
                                    </button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
