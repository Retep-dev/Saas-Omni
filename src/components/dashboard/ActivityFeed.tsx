import { Avatar } from '@/components/ui/Avatar'; // Will create a simple Avatar component or use a placeholder

const activities = [
    {
        id: 1,
        user: 'Alice Smith',
        action: 'created a new project',
        target: 'Marketing Campaign 2024',
        time: '2 hours ago',
    },
    {
        id: 2,
        user: 'Bob Jones',
        action: 'updated the status of',
        target: 'Website Redesign',
        time: '4 hours ago',
    },
    {
        id: 3,
        user: 'Carol White',
        action: 'commented on',
        target: 'Q1 Financial Report',
        time: '5 hours ago',
    },
    {
        id: 4,
        user: 'Dave Brown',
        action: 'deployed',
        target: 'v1.2.0 to Production',
        time: '6 hours ago',
    },
];

export function ActivityFeed() {
    return (
        <div className="rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
            <div className="border-b border-slate-100 px-6 py-4">
                <h3 className="text-base font-semibold leading-6 text-slate-900">
                    Recent Activity
                </h3>
            </div>
            <ul role="list" className="divide-y divide-slate-100">
                {activities.map((activity) => (
                    <li key={activity.id} className="px-6 py-4">
                        <div className="flex items-start gap-3">
                            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                                {activity.user.charAt(0)}
                            </div>
                            <div className="flex flex-col">
                                <p className="text-sm font-medium text-slate-900">
                                    {activity.user}{' '}
                                    <span className="font-normal text-slate-500">
                                        {activity.action}
                                    </span>{' '}
                                    <span className="font-medium text-indigo-600">
                                        {activity.target}
                                    </span>
                                </p>
                                <p className="text-xs text-slate-400">{activity.time}</p>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
            <div className="border-t border-slate-100 bg-slate-50 px-6 py-4 rounded-b-xl">
                <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                    View all activity
                </a>
            </div>
        </div>
    );
}
