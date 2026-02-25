'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { SummaryCard } from '@/components/SummaryCard'
import { PropertyCard } from '@/components/PropertyCard'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    DollarSign,
    Home,
    Users,
    TrendingUp,
    Plus,
    AlertCircle,
    LogOut
} from 'lucide-react'
import { api } from '@/lib/api'
import { auth } from '@/lib/firebase'
import { signOut } from 'firebase/auth'

// Types for dashboard data
interface DashboardStats {
    properties: {
        total: number
        total_units: number
        occupied_units: number
        occupancy_rate: number
    }
    tenants: {
        total: number
        active: number
    }
    payments: {
        total_collected: number
        pending_amount: number
        overdue_amount: number
        total_payments: number
        pending_payments: number
        overdue_payments: number
        monthly_total: number
    }
    overdue_count: number
}

interface Property {
    id: string
    name: string
    address: string
    total_units: number
    occupied_units: number
    monthly_rent_total: number
    status: 'paid' | 'partial' | 'overdue' | 'vacant'
    units: unknown[]
}

export default function DashboardPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [properties, setProperties] = useState<Property[]>([])
    const [user, setUser] = useState<null | { firstName?: string; fullName?: string }>(null)

    useEffect(() => {
        // Check if user is authenticated
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (!user) {
                router.push('/login')
                return
            }

            // Get user from localStorage
            const storedUser = localStorage.getItem('user')
            if (storedUser) {
                setUser(JSON.parse(storedUser))
            }

            await fetchDashboardData()
        })

        return () => unsubscribe()
    }, [router])

    const fetchDashboardData = async () => {
        try {
            setIsLoading(true)
            
            // Fetch dashboard stats from backend
            const statsResponse = await api.get('/landlords/dashboard/stats')
            setStats(statsResponse.data)
            
            // Fetch properties
            const propertiesResponse = await api.get('/properties')
            setProperties(propertiesResponse.data)
            
        } catch (_error) {
            console.error('Failed to fetch dashboard data:', _error)
            toast.error('Failed to load dashboard data')
        } finally {
            setIsLoading(false)
        }
    }

    const handleLogout = async () => {
        try {
            await signOut(auth)
            localStorage.removeItem('authToken')
            localStorage.removeItem('landlordId')
            localStorage.removeItem('user')
            router.push('/')
            toast.success('Logged out successfully')
        } catch (error) {
            console.error('Logout error:', error)
            toast.error('Failed to logout')
        }
    }

    const handleAddProperty = () => {
        router.push('/dashboard/properties/add')
    }

    const handleSendReminder = async (propertyId: string) => {
        try {
            await api.post(`/payments/remind/bulk`, { property_id: propertyId })
            toast.success('Payment reminders sent to all tenants', {
                description: 'SMS notifications will be delivered shortly',
            })
        } catch (_error) {
            toast.error('Failed to send reminders')
        }
    }

    const handleSendAllReminders = async () => {
        try {
            await api.post('/payments/remind/all-overdue')
            toast.success('Reminders sent to all overdue tenants')
        } catch (_error) {
            toast.error('Failed to send reminders')
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header with Logout */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
                    <p className="text-gray-500 mt-1">
                        Welcome back, {user?.firstName || user?.fullName || 'Landlord'}! Here&#39;s your portfolio overview.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={handleAddProperty} className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Property
                    </Button>
                    <Button variant="outline" onClick={handleLogout}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                    </Button>
                </div>
            </div>

            {/* Summary Cards */}
            {stats && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <SummaryCard
                        title="Total Properties"
                        value={stats.properties.total}
                        icon={Home}
                        trend={`${stats.properties.occupied_units}/${stats.properties.total_units} units`}
                        trendUp={stats.properties.occupancy_rate > 70}
                    />
                    <SummaryCard
                        title="Total Tenants"
                        value={stats.tenants.active}
                        icon={Users}
                        trend={`${stats.tenants.total} total`}
                        trendUp={true}
                    />
                    <SummaryCard
                        title="Monthly Revenue"
                        value={`KES ${stats.payments.monthly_total.toLocaleString()}`}
                        icon={DollarSign}
                        trend={`${stats.payments.total_payments} payments`}
                        trendUp={true}
                    />
                    <SummaryCard
                        title="Occupancy Rate"
                        value={`${stats.properties.occupancy_rate}%`}
                        icon={TrendingUp}
                        trend={`${stats.properties.occupied_units} occupied`}
                        trendUp={stats.properties.occupancy_rate > 70}
                    />
                </div>
            )}

            {/* Alerts Section */}
            {stats && stats.payments.overdue_amount > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                        <div className="flex-1">
                            <h3 className="font-semibold text-red-800">Attention Needed</h3>
                            <p className="text-sm text-red-600">
                                You have {stats.payments.overdue_payments} overdue payments totaling 
                                KES {stats.payments.overdue_amount.toLocaleString()}. Send reminders to tenants.
                            </p>
                        </div>
                        <Button 
                            variant="outline" 
                            className="border-red-300 text-red-600 hover:bg-red-50"
                            onClick={handleSendAllReminders}
                        >
                            Send All Reminders
                        </Button>
                    </div>
                </div>
            )}

            {/* Properties Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Your Properties</h2>
                    <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/properties')}>
                        View All
                    </Button>
                </div>

                <Tabs defaultValue="all" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="all">All Properties</TabsTrigger>
                        <TabsTrigger value="occupied">Occupied</TabsTrigger>
                        <TabsTrigger value="vacant">Vacant</TabsTrigger>
                        <TabsTrigger value="overdue">Overdue</TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {properties.slice(0, 3).map((property) => (
                                <PropertyCard
                                    key={property.id}
                                    property={{
                                        id: property.id,
                                        name: property.name,
                                        address: property.address,
                                        units: property.total_units,
                                        occupied: property.occupied_units,
                                        monthlyRent: property.monthly_rent_total,
                                        nextPayment: new Date().toISOString().split('T')[0], // You'd get this from backend
                                        status: (property.occupied_units === property.total_units ? 'paid'
                                            : property.occupied_units > 0 ? 'partial' : 'vacant') as 'paid' | 'partial' | 'overdue' | 'vacant'
                                    }}
                                    onSendReminder={() => handleSendReminder(property.id)}
                                />
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="occupied">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {properties.filter(p => p.occupied_units > 0).slice(0, 3).map((property) => (
                                <PropertyCard
                                    key={property.id}
                                    property={{
                                        id: property.id,
                                        name: property.name,
                                        address: property.address,
                                        units: property.total_units,
                                        occupied: property.occupied_units,
                                        monthlyRent: property.monthly_rent_total,
                                        nextPayment: new Date().toISOString().split('T')[0],
                                        status: 'partial'
                                    }}
                                    onSendReminder={() => handleSendReminder(property.id)}
                                />
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="vacant">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {properties.filter(p => p.occupied_units === 0).slice(0, 3).map((property) => (
                                <PropertyCard
                                    key={property.id}
                                    property={{
                                        id: property.id,
                                        name: property.name,
                                        address: property.address,
                                        units: property.total_units,
                                        occupied: 0,
                                        monthlyRent: property.monthly_rent_total,
                                        nextPayment: new Date().toISOString().split('T')[0],
                                        status: 'vacant' as 'paid' | 'partial' | 'overdue' | 'vacant'
                                    }}
                                    onSendReminder={() => {}}
                                />
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg border p-6">
                <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
                <div className="space-y-4">
                    {stats && stats.payments.total_payments > 0 ? (
                        <div className="flex items-center gap-3 text-sm">
                            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                            <span className="text-gray-600">
                                Total collections: KES {stats.payments.total_collected.toLocaleString()}
                            </span>
                            <span className="text-gray-400 ml-auto">This month</span>
                        </div>
                    ) : (
                        <p className="text-gray-500 text-sm">No recent activity</p>
                    )}
                </div>
            </div>
        </div>
    )
}