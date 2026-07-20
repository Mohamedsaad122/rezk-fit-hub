import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Save, CheckCircle } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { toastService } from '@/services/toast.service';
import SEO from '@/components/SEO';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

const profileSchema = z.object({
    name: z.string().min(2, 'الاسم يجب أن يتكون من حرفين على الأقل'),
    email: z.string().min(1, 'البريد الإلكتروني مطلوب').email('صيغة البريد الإلكتروني غير صحيحة'),
});

export default function Profile() {
    const { user, updateUser } = useAuthStore();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isDirty }
    } = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: user?.name || '',
            email: user?.email || '',
        }
    });

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            // Simulate API put call
            await new Promise(resolve => setTimeout(resolve, 600));
            updateUser(data);
            toastService.success('تم تحديث الملف الشخصي بنجاح');
        } catch (error) {
            toastService.error('فشل تحديث الملف الشخصي', error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-full bg-gradient-to-br from-background via-muted/20 to-background pt-28 pb-12 px-6">
            <SEO title="الملف الشخصي" />

            <div className="max-w-3xl mx-auto space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-3xl font-bold text-foreground">الملف الشخصي</h1>
                    <p className="text-muted-foreground mt-1">عرض وتعديل معلومات حسابك الأساسية</p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Sidebar Profile Info Summary */}
                    <motion.div
                        className="md:col-span-1"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <Card className="border-0 shadow-md bg-gradient-card text-center">
                            <CardContent className="pt-6 space-y-4">
                                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-primary flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                                    {user?.name?.charAt(0) || 'U'}
                                </div>
                                <div>
                                    <h2 className="font-bold text-lg">{user?.name}</h2>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {user?.role === 'coach' ? 'مدرب شخصي معتمد' : user?.role === 'admin' ? 'مدير النظام' : 'متدرب'}
                                    </p>
                                </div>

                                <div className="pt-4 border-t flex flex-col items-center gap-2 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1.5">
                                        <Shield className="w-3.5 h-3.5 text-primary" />
                                        <span>الصلاحيات كاملة</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                                        <span>الحساب نشط</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Edit Form */}
                    <motion.div
                        className="md:col-span-2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <Card className="border-0 shadow-md bg-gradient-card">
                            <CardHeader>
                                <CardTitle>المعلومات الشخصية</CardTitle>
                                <CardDescription>تأكد من صحة بريدك الإلكتروني لتلقي التحديثات والتقارير</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">الاسم الكامل</Label>
                                        <div className="relative">
                                            <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                id="name"
                                                className={`pr-10 h-11 rounded-xl border-2 focus-visible:ring-primary ${errors.name ? 'border-destructive' : ''}`}
                                                {...register('name')}
                                            />
                                        </div>
                                        {errors.name && (
                                            <p className="text-xs text-destructive font-medium">{errors.name.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">البريد الإلكتروني</Label>
                                        <div className="relative">
                                            <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                id="email"
                                                type="email"
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
                                        className="rounded-xl h-11 bg-gradient-primary text-white shadow-md font-semibold px-6 flex items-center gap-2 mr-auto"
                                        disabled={isSubmitting || !isDirty}
                                    >
                                        <Save className="w-4 h-4" />
                                        {isSubmitting ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
