import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';
import { toastService } from '@/services/toast.service';
import { ArrowLeft, Plus, Trash2, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';
import ROUTES from '@/constants/routes.constants';
import { RuleRepository } from '@/repositories/rule.repository';
import { RuleEngineService } from '@/services/rule-engine.service';

export const RuleEngine = () => {
    const [rules, setRules] = useState([]);
    const [name, setName] = useState('');
    const [fieldName, setFieldName] = useState('price');
    const [operator, setOperator] = useState('GREATER_THAN');
    const [value, setValue] = useState('');
    
    // Formula testing
    const [formula, setFormula] = useState('x * 1.15');
    const [varX, setVarX] = useState('100');
    const [formulaResult, setFormulaResult] = useState(null);

    const fetchRules = async () => {
        try {
            const list = await RuleRepository.getRules();
            setRules(list);
        } catch {
            // ignore
        }
    };

    useEffect(() => {
        fetchRules();
    }, []);

    const handleCreateRule = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                name,
                triggerEvent: 'InvoiceGenerated',
                conditions: [{ field: fieldName, operator, value: Number(value) || value }],
                actions: [{ actionType: 'SendNotification', params: { text: 'تم تنشيط القاعدة التلقائية بنجاح' } }],
                status: 'Active',
                priority: 1
            };
            await RuleRepository.createRule(payload);
            setName('');
            setValue('');
            toastService.success('تمت إضافة قاعدة التحقق والشروط البرمجية بنجاح');
            fetchRules();
        } catch {
            toastService.error('فشل إضافة القاعدة');
        }
    };

    const handleDelete = async (id) => {
        try {
            await RuleRepository.deleteRule(id);
            toastService.success('تم حذف القاعدة المحددة بنجاح');
            fetchRules();
        } catch {
            toastService.error('فشل حذف القاعدة');
        }
    };

    const testFormula = () => {
        const val = RuleEngineService.evaluateFormula(formula, { x: Number(varX) });
        setFormulaResult(val);
    };

    return (
        <div className="container mx-auto p-6 space-y-6 text-right" dir="rtl">
            <SEO title="محرك القواعد والتحقق الشرطي" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-l from-red-500/10 via-primary/5 to-background p-6 rounded-xl border border-red-500/20 text-right">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 justify-start">
                        <Cpu className="h-6 w-6 text-red-500" />
                        محرك القواعد وصياغة المعادلات (Rule & Formula Engine)
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        صياغة قيود برمجية، شروط منطقية (IF / ELSE)، واختبار المعادلات الرياضية (Dynamic Formulas) لحساب الفواتير تلقائياً.
                    </p>
                </div>
                <Button asChild variant="outline" size="sm">
                    <Link to={ROUTES.SECURITY_CENTER} className="gap-1">
                        <ArrowLeft className="h-4 w-4" />
                        العودة للمركز
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs text-right">
                {/* Rule Creator */}
                <div className="space-y-6">
                    <Card className="border border-border">
                        <CardHeader>
                            <CardTitle className="text-base font-bold">إضافة قاعدة تفرع شرطي (Rule)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleCreateRule} className="space-y-4">
                                <div className="space-y-1">
                                    <label className="font-semibold block">اسم القاعدة:</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="مثال: شرط المبيعات الكبرى"
                                        className="w-full p-2 border bg-background text-foreground text-xs rounded"
                                        required
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="font-semibold block">المتغير (Field):</label>
                                    <select
                                        value={fieldName}
                                        onChange={(e) => setFieldName(e.target.value)}
                                        className="w-full p-2 border bg-background text-foreground text-xs rounded"
                                    >
                                        <option value="price">سعر الفاتورة (price)</option>
                                        <option value="clientId">معرف العميل (clientId)</option>
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label className="font-semibold block">المعامل الشرطي:</label>
                                    <select
                                        value={operator}
                                        onChange={(e) => setOperator(e.target.value)}
                                        className="w-full p-2 border bg-background text-foreground text-xs rounded"
                                    >
                                        <option value="GREATER_THAN">أكبر من (&gt;)</option>
                                        <option value="LESS_THAN">أصغر من (&lt;)</option>
                                        <option value="EQUALS">يساوي (==)</option>
                                        <option value="CONTAINS">يحتوي على</option>
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label className="font-semibold block">القيمة المراد مطابقتها:</label>
                                    <input
                                        type="text"
                                        value={value}
                                        onChange={(e) => setValue(e.target.value)}
                                        placeholder="مثال: 5000"
                                        className="w-full p-2 border bg-background text-foreground text-xs rounded"
                                        required
                                    />
                                </div>

                                <Button type="submit" className="w-full gap-1">
                                    <Plus className="h-4 w-4" />
                                    حفظ القاعدة الشرطية
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Formula Sandbox */}
                    <Card className="border border-border">
                        <CardHeader>
                            <CardTitle className="text-base font-bold">بيئة تجربة المعادلات (Formula Sandbox)</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1">
                                <label className="font-semibold block">المعادلة الرياضية:</label>
                                <input
                                    type="text"
                                    value={formula}
                                    onChange={(e) => setFormula(e.target.value)}
                                    placeholder="مثال: x * 1.15"
                                    className="w-full p-2 border bg-background text-foreground text-xs rounded font-mono text-left"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="font-semibold block">قيمة المتغير (x):</label>
                                <input
                                    type="number"
                                    value={varX}
                                    onChange={(e) => setVarX(e.target.value)}
                                    className="w-full p-2 border bg-background text-foreground text-xs rounded font-mono"
                                />
                            </div>

                            <Button onClick={testFormula} variant="outline" className="w-full">
                                حساب ناتج المعادلة
                            </Button>

                            {formulaResult !== null && (
                                <div className="p-3 bg-muted/40 border border-border rounded text-center font-mono font-bold text-primary">
                                    الناتج: {formulaResult}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* List rules */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border border-border">
                        <CardHeader>
                            <CardTitle className="text-base font-bold">القواعد النشطة في النظام</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {rules.length === 0 ? (
                                <div className="text-center py-16 text-muted-foreground">لا توجد قواعد مصاغة حالياً.</div>
                            ) : (
                                rules.map(rule => (
                                    <div key={rule.id} className="p-4 border border-border rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 flex-row-reverse bg-muted/5 font-mono">
                                        <div className="space-y-2 text-right">
                                            <div className="flex items-center gap-2 flex-row-reverse justify-end">
                                                <strong className="text-foreground text-sm">{rule.name}</strong>
                                                <Badge variant="default" className="text-[9px]">نشط</Badge>
                                            </div>
                                            <div className="text-[10px] text-muted-foreground">
                                                {rule.conditions.map((c, i) => (
                                                    <span key={i}>الشرط: {c.field} {c.operator} {c.value}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <Button size="xs" variant="destructive" onClick={() => handleDelete(rule.id)} className="gap-1">
                                            <Trash2 className="h-3.5 w-3.5" />
                                            إلغاء القاعدة
                                        </Button>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default RuleEngine;
