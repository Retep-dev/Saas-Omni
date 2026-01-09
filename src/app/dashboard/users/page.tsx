'use client';

import { DataTable } from '@/components/ui/DataTable';
import { Avatar } from '@/components/ui/Avatar';

// Mock Data
const users = [
    {
        id: 1,
        name: 'Lindsay Walton',
        email: 'lindsay.walton@example.com',
        role: 'Member',
        status: 'Active',
        lastActive: '3 hours ago',
    },
    {
        id: 2,
        name: 'Courtney Henry',
        email: 'courtney.henry@example.com',
        role: 'Admin',
        status: 'Active',
        lastActive: '1 hour ago',
    },
    {
        id: 3,
        name: 'Tom Cook',
        email: 'tom.cook@example.com',
        role: 'Member',
        status: 'Offline',
        lastActive: '1 day ago',
    },
    {
        id: 4,
        name: 'Whitney Francis',
        email: 'whitney.francis@example.com',
        role: 'Member',
        status: 'Active',
        lastActive: '5 mins ago',
    },
    {
        id: 5,
        name: 'Leonard Krasner',
        email: 'leonard.krasner@example.com',
        role: 'Admin',
        status: 'Offline',
        lastActive: '2 days ago',
    },
    {
        id: 6,
        name: 'Floyd Miles',
        email: 'floyd.miles@example.com',
        role: 'Member',
        status: 'Active',
        lastActive: 'Just now',
    },
];

export default function UsersPage() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                    User Management
                </h2>
                <p className="mt-2 text-slate-600">
                    Manage your team members and their account permissions here.
                </p>
            </div>

            <DataTable
                title="Users"
                data={users}
                columns={[
                    {
                        header: 'Name',
                        accessorKey: 'name',
                        cell: (user) => (
                            <div className="flex items-center gap-3">
                                <Avatar fallback={user.name.charAt(0)} />
                                <div className="flex flex-col">
                                    <span className="font-medium text-slate-900">{user.name}</span>
                                    <span className="text-slate-500">{user.email}</span>
                                </div>
                            </div>
                        ),
                    },
                    {
                        header: 'Role',
                        accessorKey: 'role',
                        cell: (user) => (
                            <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
                                {user.role}
                            </span>
                        ),
                    },
                    {
                        header: 'Status',
                        accessorKey: 'status',
                        cell: (user) => (
                            <div className="flex items-center gap-2">
                                <div
                                    className={`h-2 w-2 rounded-full ${user.status === 'Active' ? 'bg-green-500' : 'bg-slate-300'
                                        }`}
                                />
                                <span className="text-slate-700">{user.status}</span>
                            </div>
                        ),
                    },
                    {
                        header: 'Last Active',
                        accessorKey: 'lastActive',
                    },
                ]}
            />
        </div>
    );
}
