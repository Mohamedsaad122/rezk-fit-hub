import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Dumbbell, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import { useForgotPassword } from '@/hooks/use-auth';
import { ForgotPasswordRequestSchema } from '@/contracts/auth.contract';
import ROUTES from '@/constants/routes.constants';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ForgotPassword() {
    const { mutate: forgotPassword, isPending, error: mutationError } = useForgotPassword();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(ForgotPasswordRequestSchema),
        defaultValues: { email: '' }
    });

    const onSubmit = (data) => {
        forgotPassword(data.email);
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
                    <CardHeader className="pb-2">
                        <div className="flex items-center gap-2 mb-2">
                            <Link to={ROUTES.LOGIN} className="text-muted-foreground hover:text-foreground">
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <CardTitle className="text-2xl font-bold">استعادة كلمة المرور</CardTitle>
                        </div>
                        <CardDescription className="text-sm text-muted-foreground mt-1">
                            أدخل بريدك الإلكتروني وسنرسل لك رمزاً لإعادة تعيين كلمة المرور.
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

                            <Button 
                                type="submit" 
                                className="w-full h-11 rounded-xl bg-gradient-primary text-white shadow-lg font-semibold mt-4"
                                disabled={isPending}
                            >
                                {isPending ? 'جاري الإرسال...' : 'إرسال الرمز'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
