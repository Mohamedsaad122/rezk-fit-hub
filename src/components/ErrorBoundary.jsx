import React, { Component } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { logger } from '@/utils/logger';

/**
 * Reusable Error Boundary catching runtime rendering exceptions and preventing blank pages.
 */
export class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        logger.error("ErrorBoundary caught an exception:", error, errorInfo);
    }

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen w-full flex items-center justify-center bg-background p-4 rtl">
                    <Card className="max-w-md w-full border-0 shadow-2xl bg-gradient-card">
                        <CardHeader className="text-center pb-2">
                            <div className="flex justify-center mb-4">
                                <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
                                    <AlertCircle className="w-6 h-6" />
                                </div>
                            </div>
                            <CardTitle className="text-2xl font-bold">حدث خطأ في النظام</CardTitle>
                            <CardDescription className="text-muted-foreground mt-2">
                                واجه التطبيق خطأً غير متوقع أثناء معالجة هذه الصفحة.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-4">
                            <div className="text-xs text-muted-foreground p-3 rounded-lg bg-muted border font-mono overflow-auto max-h-32 text-left ltr">
                                {this.state.error?.toString() || "Unknown rendering exception"}
                            </div>
                            <Button 
                                onClick={this.handleReload}
                                className="w-full bg-gradient-primary text-white shadow-lg font-semibold h-11 rounded-xl"
                            >
                                إعادة تحميل الصفحة
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
