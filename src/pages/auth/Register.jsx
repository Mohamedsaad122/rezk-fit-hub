import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Dumbbell, Eye, EyeOff, Mail, AlertCircle, User, Phone, ShieldCheck } from 'lucide-react';
import { useRegister } from '@/hooks/use-auth';
import { RegisterRequestSchema } from '@/contracts/auth.contract';
import ROUTES from '@/constants/routes.constants';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Register() {
    const { mutate: registerUser, isPending, error: mutationError } = useRegister();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(RegisterRequestSchema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: '',
            role: 'trainee',
        }
    });

    const onSubmit = (data) => {
        registerUser(data);
    };

    const serverError = mutationError?.message || null;

    return (
        <div className="w-full max-w-lg px-4 py-8">
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
                        <CardTitle className="text-3xl font-bold">إنشاء حساب جديد</CardTitle>
                        <CardDescription className="text-base text-muted-foreground mt-2">
                            انضم إلينا في Rezk Fit Hub
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
                                <Label htmlFor="name" className="text-sm font-semibold">
                                    الاسم الكامل
                                </Label>
                                <div className="relative">
                                    <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="محمد أحمد"
                                        className={`pr-10 h-11 rounded-xl border-2 focus-visible:ring-primary ${errors.name ? 'border-destructive' : ''}`}
                                        {...register('name')}
                                    />
                                </div>
                                {errors.name && (
                                    <p className="text-xs text-destructive font-medium">{errors.name.message}</p>
                                )}
                            </div>

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
                                <Label htmlFor="phone" className="text-sm font-semibold">
                                    رقم الهاتف
                                </Label>
                                <div className="relative">
                                    <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="0591234567"
                                        className={`pr-10 h-11 rounded-xl border-2 focus-visible:ring-primary ${errors.phone ? 'border-destructive' : ''}`}
                                        {...register('phone')}
                                    />
                                </div>
                                {errors.phone && (
                                    <p className="text-xs text-destructive font-medium">{errors.phone.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="role" className="text-sm font-semibold">
                                    نوع الحساب
                                </Label>
                                <div className="relative">
                                    <ShieldCheck className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <select
                                        id="role"
                                        className={`w-full pr-10 pl-3 h-11 rounded-xl border-2 bg-background focus:outline-none focus:border-primary border-zinc-200 dark:border-zinc-800 ${errors.role ? 'border-destructive' : ''}`}
                                        {...register('role')}
                                    >
                                        <option value="trainee">متدرب (Trainee)</option>
                                        <option value="coach">مدرب (Coach)</option>
                                        <option value="nutritionist">أخصائي تغذية (Nutritionist)</option>
                                        <option value="receptionist">موظف استقبال (Receptionist)</option>
                                        <option value="admin">مدير النظام (Admin)</option>
                                    </select>
                                </div>
                                {errors.role && (
                                    <p className="text-xs text-destructive font-medium">{errors.role.message}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-sm font-semibold">
                                        كلمة المرور
                                    </Label>
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                        <Input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="••••••••"
                                            className={`pl-10 h-11 rounded-xl border-2 focus-visible:ring-primary ${errors.password ? 'border-destructive' : ''}`}
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
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                        <Input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            placeholder="••••••••"
                                            className={`pl-10 h-11 rounded-xl border-2 focus-visible:ring-primary ${errors.confirmPassword ? 'border-destructive' : ''}`}
                                            {...register('confirmPassword')}
                                        />
                                    </div>
                                    {errors.confirmPassword && (
                                        <p className="text-xs text-destructive font-medium">{errors.confirmPassword.message}</p>
                                    )}
                                </div>
                            </div>

                            <Button type="submit" className="w-full h-11 rounded-xl bg-gradient-primary text-white font-bold shadow-md hover:shadow-lg transition-all duration-300" disabled={isPending}>
                                {isPending ? 'جاري إنشاء الحساب...' : 'إنشاء حساب جديد'}
                            </Button>
                        </form>

                        <div className="text-center text-sm text-muted-foreground mt-4">
                            لديك حساب بالفعل؟{' '}
                            <Link to={ROUTES.LOGIN} className="text-primary hover:underline font-semibold">
                                تسجيل الدخول
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
