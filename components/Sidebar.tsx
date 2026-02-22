'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    Home,
    Building2,
    Users,
    Calculator,
    MessageSquare,
    Settings,
    LayoutDashboard,
    Receipt,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const routes = [
    {
        label: 'Dashboard',
        icon: LayoutDashboard,
        href: '/dashboard',
        color: 'text-sky-500',
    },
    {
        label: 'Properties',
        icon: Building2,
        href: '/dashboard/properties',
        color: 'text-violet-500',
    },
    {
        label: 'Tenants',
        icon: Users,
        href: '/dashboard/tenants',
        color: 'text-pink-500',
    },
    {
        label: 'Accounting',
        icon: Calculator,
        href: '/dashboard/accounting',
        color: 'text-orange-500',
    },
    {
        label: 'Messages',
        icon: MessageSquare,
        href: '/dashboard/messages',
        color: 'text-green-500',
    },
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <div className="hidden md:flex h-full w-64 flex-col bg-white border-r">
            <div className="p-6">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <Home className="h-6 w-6 text-blue-600" />
                    <span className="text-xl font-bold">Landlord254</span>
                </Link>
            </div>

            <div className="flex-1 px-3">
                {routes.map((route) => (
                    <Link
                        key={route.href}
                        href={route.href}
                        className={cn(
                            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-gray-100',
                            pathname === route.href ? 'bg-gray-100 text-gray-900' : 'text-gray-600'
                        )}
                    >
                        <route.icon className={cn('h-4 w-4', route.color)} />
                        {route.label}
                    </Link>
                ))}
            </div>

            <div className="p-4 border-t">
                <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
                >
                    <Settings className="h-4 w-4" />
                    Settings
                </Link>
            </div>
        </div>
    )
}