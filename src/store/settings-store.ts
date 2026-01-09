import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserRole } from '@/features/auth/types';

export interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: 'Owner' | 'Admin' | 'Member';
    status: 'Active' | 'Invited';
}

export interface PlanDetails {
    name: string;
    price: string;
    interval: 'monthly' | 'yearly';
    features: string[];
    isActive: boolean;
}

export interface NotificationPreferences {
    email: boolean;
    marketing: boolean;
    security: boolean;
}

export interface PaymentMethod {
    brand: 'Visa' | 'MasterCard' | 'Amex' | 'Discover';
    last4: string;
    expiryMonth: number;
    expiryYear: number;
}

interface SettingsState {
    teamMembers: TeamMember[];
    plan: PlanDetails;
    notifications: NotificationPreferences;
    paymentMethod: PaymentMethod;

    // Actions
    addTeamMember: (member: Omit<TeamMember, 'id' | 'status'>) => void;
    removeTeamMember: (id: string) => void;
    upgradePlan: (newPlan: PlanDetails) => void;
    updateNotifications: (updates: Partial<NotificationPreferences>) => void;
    updatePaymentMethod: (method: PaymentMethod) => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            teamMembers: [
                {
                    id: '1',
                    name: 'Demo User',
                    email: 'demo@example.com',
                    role: 'Owner',
                    status: 'Active',
                },
                {
                    id: '2',
                    name: 'Sarah Wilson',
                    email: 'sarah@example.com',
                    role: 'Member',
                    status: 'Active',
                },
                {
                    id: '3',
                    name: 'Mike Brown',
                    email: 'mike@example.com',
                    role: 'Admin',
                    status: 'Invited',
                },
            ],
            plan: {
                name: 'Pro Plan',
                price: '$29',
                interval: 'monthly',
                features: ['Unlimited projects', 'Priority support', 'Advanced analytics', 'Custom domains'],
                isActive: true,
            },
            notifications: {
                email: true,
                marketing: false,
                security: true,
            },
            paymentMethod: {
                brand: 'Visa',
                last4: '4242',
                expiryMonth: 12,
                expiryYear: 2026,
            },

            addTeamMember: (member) =>
                set((state) => ({
                    teamMembers: [
                        ...state.teamMembers,
                        {
                            ...member,
                            id: Math.random().toString(36).substr(2, 9),
                            status: 'Invited',
                        },
                    ],
                })),

            removeTeamMember: (id) =>
                set((state) => ({
                    teamMembers: state.teamMembers.filter((m) => m.id !== id),
                })),

            upgradePlan: (newPlan) => set({ plan: newPlan }),

            updateNotifications: (updates) =>
                set((state) => ({
                    notifications: { ...state.notifications, ...updates },
                })),

            updatePaymentMethod: (method) => set({ paymentMethod: method }),
        }),
        {
            name: 'settings-storage',
        }
    )
);
