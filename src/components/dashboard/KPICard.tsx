import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCountUp } from '@/hooks/use-count-up';

interface KPICardProps {
    title: string;
    value: number | string;
    prefix?: string;
    suffix?: string;
    decimals?: number;
    change: string;
    changeType: 'positive' | 'negative' | 'neutral';
    icon: LucideIcon;
}

export function KPICard({
    title,
    value,
    prefix = '',
    suffix = '',
    decimals = 0,
    change,
    changeType,
    icon: Icon
}: KPICardProps) {
    const numericValue = typeof value === 'number' ? value : 0;
    const animatedValue = useCountUp(numericValue, 2000);

    // Format the value
    const displayValue = typeof value === 'number'
        ? `${prefix}${animatedValue.toLocaleString(undefined, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        })}${suffix}`
        : value;

    return (
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">{title}</p>
                <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                    <Icon size={20} />
                </div>
            </div>
            <div className="mt-4">
                <h3 className="text-2xl font-bold text-slate-900">
                    {displayValue}
                </h3>
                <p
                    className={cn(
                        'mt-1 text-sm font-medium',
                        changeType === 'positive' && 'text-green-600',
                        changeType === 'negative' && 'text-red-600',
                        changeType === 'neutral' && 'text-slate-600'
                    )}
                >
                    {change}
                </p>
            </div>
        </div>
    );
}
