'use client';

import { useState, useRef } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { useSettingsStore, PaymentMethod, PlanDetails } from '@/store/settings-store';
import { toast } from 'sonner';
import {
    User,
    Bell,
    CreditCard,
    Users,
    Check,
    Shield,
    Mail,
    Building,
    Upload,
    Plus,
    Loader2,
    Trash2,
    X,
    ArrowRight
} from 'lucide-react';
import Image from 'next/image';

const TABS = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
] as const;

const AVAILABLE_PLANS = [
    {
        name: 'Starter Plan',
        price: '$0',
        interval: 'monthly' as const,
        features: ['Up to 3 projects', 'Community support', 'Basic analytics'],
        highlight: false,
    },
    {
        name: 'Pro Plan',
        price: '$29',
        interval: 'monthly' as const,
        features: ['Unlimited projects', 'Priority support', 'Advanced analytics', 'Custom domains'],
        highlight: true,
    },
    {
        name: 'Enterprise Plan',
        price: '$99',
        interval: 'monthly' as const,
        features: ['Unlimited everything', '24/7 Phone support', 'Dedicated manager', 'SSO'],
        highlight: false,
    },
];

type TabId = typeof TABS[number]['id'];

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<TabId>('profile');
    const { user, updateUser } = useAuthStore();
    const {
        teamMembers,
        addTeamMember,
        removeTeamMember,
        plan,
        upgradePlan,
        notifications,
        updateNotifications,
        paymentMethod,
        updatePaymentMethod
    } = useSettingsStore();

    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Profile State
    const [profileName, setProfileName] = useState(user?.name || '');

    // Team State
    const [isInviting, setIsInviting] = useState(false);
    const [newMemberEmail, setNewMemberEmail] = useState('');

    // Payment State
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    // Upgrade State
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [pendingPlan, setPendingPlan] = useState<typeof AVAILABLE_PLANS[0] | null>(null);

    const handleSaveProfile = async () => {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        updateUser({ name: profileName });
        toast.success('Profile updated successfully');
        setIsLoading(false);
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                toast.error('Image size should be less than 5MB');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                updateUser({ avatarUrl: base64String });
                toast.success('Avatar updated successfully');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInviteMember = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMemberEmail) return;

        addTeamMember({
            name: newMemberEmail.split('@')[0],
            email: newMemberEmail,
            role: 'Member'
        });
        toast.success(`Invited ${newMemberEmail} to the team`);
        setNewMemberEmail('');
        setIsInviting(false);
    };

    const handleSwitchPlan = (selectedPlan: typeof AVAILABLE_PLANS[0]) => {
        // If downgrading to free/starter, do it immediately
        if (selectedPlan.price === '$0') {
            const newPlan = { ...selectedPlan, isActive: true };
            upgradePlan(newPlan);
            toast.success(`Switched to ${selectedPlan.name}`);
            return;
        }

        // Otherwise open confirmation modal
        setPendingPlan(selectedPlan);
        setShowUpgradeModal(true);
    }

    const handleConfirmUpgrade = async () => {
        if (!pendingPlan) return;

        setIsLoading(true);
        // Simulate payment processing
        await new Promise(r => setTimeout(r, 2500));

        const newPlan = { ...pendingPlan, isActive: true };
        upgradePlan(newPlan);
        toast.success(`Successfully subscribed to ${pendingPlan.name}`);

        setIsLoading(false);
        setShowUpgradeModal(false);
        setPendingPlan(null);
    }

    return (
        <div className="space-y-6 relative">
            {/* Payment Method Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-6 relative animate-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setShowPaymentModal(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <CreditCard className="h-5 w-5 text-indigo-600" />
                            Update Payment Method
                        </h3>

                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            const form = e.currentTarget;
                            setIsLoading(true);
                            // Simulate processing
                            await new Promise(r => setTimeout(r, 2000));

                            const formData = new FormData(form);
                            const cardNumber = formData.get('number') as string;
                            const expiry = formData.get('expiry') as string;

                            // Simple validation/parsing
                            const last4 = cardNumber.slice(-4);
                            const [expMonth, expYear] = expiry.split('/').map(s => parseInt(s.trim()));

                            updatePaymentMethod({
                                brand: 'Visa', // Dummy brand logic
                                last4: last4 || '4242',
                                expiryMonth: expMonth || 12,
                                expiryYear: expYear || 2026
                            });

                            toast.success('Payment method verified and updated');
                            setIsLoading(false);
                            setShowPaymentModal(false);
                        }}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Card number</label>
                                    <input
                                        name="number"
                                        type="text"
                                        placeholder="0000 0000 0000 0000"
                                        required
                                        maxLength={19}
                                        className="block w-full rounded-md border-0 py-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Expiry date</label>
                                        <input
                                            name="expiry"
                                            type="text"
                                            placeholder="MM / YY"
                                            required
                                            maxLength={7}
                                            className="block w-full rounded-md border-0 py-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">CVC</label>
                                        <input
                                            name="cvc"
                                            type="text"
                                            placeholder="123"
                                            required
                                            maxLength={4}
                                            className="block w-full rounded-md border-0 py-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                                        {isLoading ? 'Processing...' : 'Save Payment Method'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Upgrade Confirmation Modal */}
            {showUpgradeModal && pendingPlan && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-6 relative animate-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setShowUpgradeModal(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-slate-900 mb-1">Confirm Subscription</h3>
                            <p className="text-sm text-slate-500">Review your new plan details.</p>
                        </div>

                        <div className="bg-slate-50 rounded-lg p-4 mb-6 border border-slate-100">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-medium text-slate-900">{pendingPlan.name}</span>
                                <span className="font-bold text-slate-900">{pendingPlan.price}/{pendingPlan.interval}</span>
                            </div>
                            <ul className="space-y-1">
                                {pendingPlan.features.slice(0, 3).map((f, i) => (
                                    <li key={i} className="text-xs text-slate-500 flex items-center gap-1">
                                        <Check className="h-3 w-3 text-green-500" /> {f}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="mb-6">
                            <h4 className="text-sm font-medium text-slate-900 mb-3">Payment Method</h4>
                            <div className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg">
                                <div className="h-6 w-10 bg-slate-100 rounded border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                                    {paymentMethod.brand}
                                </div>
                                <div className="text-sm text-slate-600">
                                    Ending in <span className="font-medium text-slate-900">{paymentMethod.last4}</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleConfirmUpgrade}
                            disabled={isLoading}
                            className="w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                            {isLoading ? 'Processing Payment...' : `Pay ${pendingPlan.price} & Subscribe`}
                        </button>
                    </div>
                </div>
            )}

            <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Settings</h2>
                <p className="text-muted-foreground text-slate-500">
                    Manage your account settings and preferences.
                </p>
            </div>

            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                <aside className="-mx-4 lg:w-1/5">
                    <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
                        {TABS.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-100 transition-colors w-full ${activeTab === tab.id
                                            ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-50'
                                            : 'text-slate-900'
                                        }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </nav>
                </aside>

                <div className="flex-1 lg:max-w-4xl">
                    {activeTab === 'profile' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl">
                            <div className="rounded-lg border border-slate-200 bg-white shadow-sm p-6">
                                <h3 className="text-lg font-medium leading-6 text-slate-900 mb-4">Profile Information</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-x-4">
                                        <div className="relative h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm ring-1 ring-slate-100">
                                            {user?.avatarUrl ? (
                                                <Image
                                                    src={user.avatarUrl}
                                                    alt="Profile"
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <span className="text-indigo-600 text-xl font-bold">
                                                    {user?.name?.charAt(0) || 'U'}
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleAvatarChange}
                                            />
                                            <button
                                                onClick={handleAvatarClick}
                                                className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 flex items-center gap-2 transition-all"
                                            >
                                                <Upload className="h-4 w-4" />
                                                Change avatar
                                            </button>
                                            <p className="mt-1 text-xs text-slate-500">JPG, GIF or PNG. 5MB max.</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
                                        <div className="sm:col-span-3">
                                            <label htmlFor="full-name" className="block text-sm font-medium leading-6 text-slate-900">
                                                Full Name
                                            </label>
                                            <div className="mt-2">
                                                <input
                                                    type="text"
                                                    id="full-name"
                                                    value={profileName}
                                                    onChange={(e) => setProfileName(e.target.value)}
                                                    className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                                                />
                                            </div>
                                        </div>

                                        <div className="sm:col-span-3">
                                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-slate-900">
                                                Email address
                                            </label>
                                            <div className="mt-2">
                                                <input
                                                    type="email"
                                                    value={user?.email || ''}
                                                    disabled
                                                    className="block w-full rounded-md border-0 py-1.5 text-slate-500 shadow-sm ring-1 ring-slate-200 bg-slate-50 sm:text-sm sm:leading-6 px-3 cursor-not-allowed"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6 flex items-center justify-end gap-x-6">
                                    <button
                                        onClick={handleSaveProfile}
                                        disabled={isLoading}
                                        className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-70"
                                    >
                                        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                                        {isLoading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'team' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl">
                            <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-slate-200 bg-slate-50/50">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-medium leading-6 text-slate-900">Team Members</h3>
                                            <p className="mt-1 text-sm text-slate-500">Manage who has access to your workspace.</p>
                                        </div>
                                        <button
                                            onClick={() => setIsInviting(!isInviting)}
                                            className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
                                        >
                                            <Plus className="h-4 w-4" />
                                            Invite user
                                        </button>
                                    </div>

                                    {isInviting && (
                                        <form onSubmit={handleInviteMember} className="mt-4 flex gap-2 animate-in fade-in slide-in-from-top-2">
                                            <input
                                                type="email"
                                                placeholder="Enter email address"
                                                required
                                                value={newMemberEmail}
                                                onChange={(e) => setNewMemberEmail(e.target.value)}
                                                className="block w-full max-w-sm rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                                            />
                                            <button type="submit" className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50">
                                                Send Invite
                                            </button>
                                        </form>
                                    )}
                                </div>
                                <ul role="list" className="divide-y divide-slate-100">
                                    {teamMembers.map((member) => (
                                        <li key={member.id} className="flex items-center justify-between gap-x-6 py-5 px-6 hover:bg-slate-50/50 transition-colors">
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-x-3">
                                                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-medium text-slate-600 overflow-hidden relative">
                                                        <span className="text-indigo-600 font-bold">
                                                            {member.name.charAt(0)}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm font-semibold leading-6 text-slate-900">
                                                        {member.name}
                                                    </p>
                                                    {member.role === 'Owner' && (
                                                        <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                                            Owner
                                                        </span>
                                                    )}
                                                    {member.status === 'Invited' && (
                                                        <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
                                                            Invited
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-slate-500 pl-11">
                                                    <p className="truncate">{member.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-none items-center gap-x-4">
                                                {member.role !== 'Owner' && (
                                                    <button
                                                        onClick={() => removeTeamMember(member.id)}
                                                        className="rounded-md p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                                        title="Remove member"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    {activeTab === 'billing' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div>
                                <h3 className="text-lg font-medium leading-6 text-slate-900">Subscription Plans</h3>
                                <p className="mt-1 text-sm text-slate-500">Choose the plan that's right for your growing team.</p>
                            </div>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                {AVAILABLE_PLANS.map((p) => {
                                    const isCurrent = plan.name === p.name;
                                    return (
                                        <div
                                            key={p.name}
                                            className={`relative flex flex-col rounded-2xl border bg-white p-6 shadow-sm transition-all hover:shadow-md ${p.highlight ? 'border-indigo-600 ring-1 ring-indigo-600' : 'border-slate-200'
                                                }`}
                                        >
                                            {p.highlight && (
                                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                                                    Most Popular
                                                </div>
                                            )}

                                            <div className="mb-4">
                                                <h3 className="text-lg font-semibold text-slate-900">{p.name}</h3>
                                                <div className="mt-2 flex items-baseline gap-1">
                                                    <span className="text-3xl font-bold tracking-tight text-slate-900">{p.price}</span>
                                                    <span className="text-sm font-semibold text-slate-500">/{p.interval}</span>
                                                </div>
                                            </div>

                                            <ul className="mb-6 space-y-3 flex-1">
                                                {p.features.map((feature) => (
                                                    <li key={feature} className="flex gap-3">
                                                        <Check className="h-5 w-5 flex-shrink-0 text-indigo-600" />
                                                        <span className="text-sm text-slate-600">{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>

                                            <button
                                                onClick={() => !isCurrent && handleSwitchPlan(p)}
                                                disabled={isCurrent}
                                                className={`mt-auto w-full rounded-lg px-3 py-2 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${isCurrent
                                                        ? 'bg-slate-100 text-slate-500 cursor-default'
                                                        : p.highlight
                                                            ? 'bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600'
                                                            : 'bg-white text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300'
                                                    }`}
                                            >
                                                {isCurrent ? 'Current Plan' : p.name === 'Enterprise Plan' ? 'Contact Sales' : 'Upgrade'}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="rounded-lg border border-slate-200 bg-white shadow-sm p-6 max-w-2xl">
                                <h3 className="text-lg font-medium leading-6 text-slate-900 mb-4">Payment Method</h3>
                                <div
                                    onClick={() => setShowPaymentModal(true)}
                                    className="flex items-center gap-4 p-4 border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group"
                                >
                                    <div className="h-8 w-12 bg-white rounded border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 shadow-sm">
                                        {paymentMethod.brand}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">•••• •••• •••• {paymentMethod.last4}</p>
                                        <p className="text-xs text-slate-500">Expires {paymentMethod.expiryMonth}/{paymentMethod.expiryYear}</p>
                                    </div>
                                    <button className="ml-auto text-sm font-medium text-slate-600 group-hover:text-indigo-600 transition-colors">Edit</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl">
                            <div className="rounded-lg border border-slate-200 bg-white shadow-sm p-6">
                                <h3 className="text-lg font-medium leading-6 text-slate-900 mb-6">Notification Preferences</h3>

                                <div className="space-y-6">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                                                <Mail className="h-4 w-4" /> Email Notifications
                                            </p>
                                            <p className="text-sm text-slate-500 mt-1">Receive emails about your account activity.</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={notifications.email}
                                                onChange={(e) => updateNotifications({ email: e.target.checked })}
                                            />
                                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 transition-colors"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-start justify-between border-t border-slate-100 pt-6">
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                                                <Building className="h-4 w-4" /> Marketing Emails
                                            </p>
                                            <p className="text-sm text-slate-500 mt-1">Receive emails about new products, features, and more.</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={notifications.marketing}
                                                onChange={(e) => updateNotifications({ marketing: e.target.checked })}
                                            />
                                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 transition-colors"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-start justify-between border-t border-slate-100 pt-6">
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                                                <Shield className="h-4 w-4" /> Security Alerts
                                            </p>
                                            <p className="text-sm text-slate-500 mt-1">Get notified about important security alerts.</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={notifications.security}
                                                onChange={(e) => updateNotifications({ security: e.target.checked })}
                                            />
                                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 transition-colors"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
