import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import ROUTES from '@/constants/routes.constants';

export default function Unauthorized() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6 rtl">
            <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center mb-6">
                <ShieldAlert className="w-10 h-10 text-rose-500" />
            </div>
            <h1 className="text-2xl font-bold text-zinc-100 mb-2">غير مصرح بالدخول</h1>
            <p className="text-zinc-400 text-sm max-w-md mb-6">
                ليس لديك الصلاحيات اللازمة للوصول إلى هذه الصفحة. يرجى الاتصال بمسؤول النظام إذا كنت تعتقد أن هذا خطأ.
            </p>
            <Button onClick={() => navigate(ROUTES.DASHBOARD)} className="bg-primary text-white hover:bg-primary/90">
                العودة إلى لوحة التحكم
            </Button>
        </div>
    );
}
