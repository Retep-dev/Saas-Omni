'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class GlobalErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 mb-4">
                        <AlertCircle size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">Something went wrong</h2>
                    <p className="mt-2 text-slate-600 max-w-md">
                        We apologize for the inconvenience. The application encountered an unexpected error.
                    </p>
                    <button
                        onClick={() => this.setState({ hasError: false })}
                        className="mt-6 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                    >
                        Try again
                    </button>
                    {process.env.NODE_ENV === 'development' && this.state.error && (
                        <div className="mt-8 w-full max-w-2xl overflow-auto rounded-md bg-slate-900 p-4 text-left text-sm text-slate-200">
                            <pre>{this.state.error.message}</pre>
                            <pre className="mt-2 text-xs opacity-75">
                                {this.state.error.stack}
                            </pre>
                        </div>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}
