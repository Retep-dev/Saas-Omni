'use client';

import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { KPICard } from '@/components/dashboard/KPICard';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { useAuthStore } from '@/store/auth-store';
import { BarChart3, Users, DollarSign, Activity } from 'lucide-react';

export default function DashboardPage() {
    const user = useAuthStore((state) => state.user);

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                    Welcome back, {user?.name || 'User'}
                </h2>
                <p className="mt-2 text-slate-600">
                    Here's what's happening with your projects today.
                </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <KPICard
                    title="Total Revenue"
                    value={45231.89}
                    prefix="$"
                    decimals={2}
                    change="+20.1% from last month"
                    changeType="positive"
                    icon={DollarSign}
                />
                <KPICard
                    title="Active Users"
                    value={2350}
                    prefix="+"
                    change="+180.1% from last month"
                    changeType="positive"
                    icon={Users}
                />
                <KPICard
                    title="Sales"
                    value={12234}
                    prefix="+"
                    change="+19% from last month"
                    changeType="positive"
                    icon={BarChart3}
                />
                <KPICard
                    title="Active Now"
                    value={573}
                    prefix="+"
                    change="+201 since last hour"
                    changeType="positive"
                    icon={Activity}
                />
            </div>

            <div className="grid gap-6 lg:grid-cols-7">
                <div className="lg:col-span-4">
                    <RevenueChart />
                </div>
                <div className="lg:col-span-3">
                    <ActivityFeed />
                </div>
            </div>
        </div>
    );
}
