import axios from 'axios';

// إعداد Axios للتطبيق
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://api.training-system.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor للطلبات - إضافة التوكن إذا كان متوفراً
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor للاستجابات - معالجة الأخطاء العامة
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // إزالة التوكن والإعادة لصفحة الدخول
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// واجهات البرمجة للتمارين
export const exercisesAPI = {
  // جلب جميع التمارين
  getAll: () => api.get('/exercises'),
  
  // جلب تمرين بالمعرف
  getById: (id: string) => api.get(`/exercises/${id}`),
  
  // إنشاء تمرين جديد
  create: (exercise: any) => api.post('/exercises', exercise),
  
  // تحديث تمرين
  update: (id: string, exercise: any) => api.put(`/exercises/${id}`, exercise),
  
  // حذف تمرين
  delete: (id: string) => api.delete(`/exercises/${id}`),
  
  // جلب التمارين حسب الفئة
  getByCategory: (category: string) => api.get(`/exercises/category/${category}`),
};

// واجهات البرمجة للأنظمة الغذائية
export const nutritionAPI = {
  // جلب جميع الأنظمة الغذائية
  getAll: () => api.get('/nutrition-plans'),
  
  // جلب نظام غذائي بالمعرف
  getById: (id: string) => api.get(`/nutrition-plans/${id}`),
  
  // إنشاء نظام غذائي جديد
  create: (plan: any) => api.post('/nutrition-plans', plan),
  
  // تحديث نظام غذائي
  update: (id: string, plan: any) => api.put(`/nutrition-plans/${id}`, plan),
  
  // حذف نظام غذائي
  delete: (id: string) => api.delete(`/nutrition-plans/${id}`),
};

// واجهات البرمجة للمتدربين
export const traineesAPI = {
  // جلب جميع المتدربين
  getAll: () => api.get('/trainees'),
  
  // جلب متدرب بالمعرف
  getById: (id: string) => api.get(`/trainees/${id}`),
  
  // إنشاء متدرب جديد
  create: (trainee: any) => api.post('/trainees', trainee),
  
  // تحديث بيانات متدرب
  update: (id: string, trainee: any) => api.put(`/trainees/${id}`, trainee),
  
  // حذف متدرب
  delete: (id: string) => api.delete(`/trainees/${id}`),
  
  // جلب إحصائيات متدرب
  getStats: (id: string) => api.get(`/trainees/${id}/stats`),
};

// واجهات البرمجة للإحصائيات
export const statsAPI = {
  // جلب الإحصائيات العامة
  getOverview: () => api.get('/stats/overview'),
  
  // جلب الإحصائيات الشهرية
  getMonthly: () => api.get('/stats/monthly'),
  
  // جلب أفضل المتدربين
  getTopTrainees: () => api.get('/stats/top-trainees'),
  
  // جلب النشاطات الأخيرة
  getRecentActivities: () => api.get('/stats/recent-activities'),
};

// تصدير مثيل axios الأساسي للاستخدام المخصص
export default api;