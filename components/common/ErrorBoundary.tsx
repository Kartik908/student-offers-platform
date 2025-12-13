'use client';

import React, { Component, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // Log to Sentry if it's loaded (deferred initialization)
        if (typeof window !== 'undefined' && (window as any).Sentry) {
            (window as any).Sentry.captureException(error, {
                contexts: {
                    react: {
                        componentStack: errorInfo.componentStack,
                    },
                },
                tags: {
                    errorBoundary: true,
                },
            });
        }

        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Production-safe error message
            const isProduction = process.env.NODE_ENV === 'production';

            return (
                <div className="min-h-screen flex items-center justify-center p-4 bg-background">
                    <div className="max-w-md w-full text-center space-y-6">
                        <div className="flex justify-center">
                            <div className="rounded-full bg-destructive/10 p-4">
                                <AlertCircle className="h-12 w-12 text-destructive" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h1 className="text-2xl font-semibold">Something went wrong</h1>
                            <p className="text-muted-foreground">
                                {isProduction
                                    ? "We encountered an unexpected error. Our team has been notified. Please try refreshing the page."
                                    : "We encountered an unexpected error. Please try refreshing the page or check the console for details."
                                }
                            </p>
                        </div>

                        {/* Only show error details in development */}
                        {!isProduction && this.state.error && (
                            <div className="mt-4 p-4 bg-muted rounded-lg text-left">
                                <p className="text-xs font-semibold mb-2 text-foreground">Error Details (Dev Only):</p>
                                <p className="text-xs font-mono text-destructive break-all">
                                    {this.state.error.message}
                                </p>
                            </div>
                        )}

                        <Button onClick={this.handleReset} className="gap-2">
                            <RefreshCw className="h-4 w-4" />
                            Refresh Page
                        </Button>

                        {/* Help text for production */}
                        {isProduction && (
                            <p className="text-xs text-muted-foreground mt-4">
                                Please check back in a few moments. We're working on it!
                            </p>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
