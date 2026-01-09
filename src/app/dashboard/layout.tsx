import { Sidebar } from '@/components/layout/Sidebar';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute>
            <div className="flex h-screen bg-slate-50">
                <Sidebar />
                <main className="flex-1 overflow-y-auto px-4 py-8 md:ml-64 md:px-8">
                    {children}
                </main>
            </div>
        </ProtectedRoute>
    );
}
