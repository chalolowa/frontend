'use client'

import { useEffect, useState } from 'react'
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
    AlertCircle
} from 'lucide-react'

// Mock data
const mockSummary = {
    totalProperties: 5,
    totalTenants: 8,
    monthlyRevenue: 12500,
    occupancyRate: 85,
    pendingPayments: 2,
    overdueAmount: 1800
}

const mockProperties = [
    {
        id: '1',
        name: 'Sunset Apartments',
        address: '123 Main St, Nairobi',
        units: 3,
        occupied: 2,
        monthlyRent: 4500,
        nextPayment: '2024-02-01',
        status: 'partial'
    },
    {
        id: '2',
        name: 'Green Heights',
        address: '456 Park Ave, Mombasa',
        units: 2,
        occupied: 2,
        monthlyRent: 3800,
        nextPayment: '2024-02-05',
        status: 'paid'
    },
    {
        id: '3',
        name: 'City View Plaza',
        address: '789 River Rd, Kisumu',
        units: 4,
        occupied: 3,
        monthlyRent: 6200,
        nextPayment: '2024-01-30',
        status: 'overdue'
    }
]

export default function DashboardPage() {
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Simulate API loading
        const timer = setTimeout(() => {
            setIsLoading(false)
            // Show notification for overdue payments
            if (mockSummary.overdueAmount > 0) {
                toast.warning(`You have ${mockSummary.pendingPayments} overdue payments totaling $${mockSummary.overdueAmount}`, {
                    icon: <AlertCircle className="h-4 w-4" />,
                    duration: 5000,
                })
            }
        }, 1000)

        return () => clearTimeout(timer)
    }, [])

    const handleAddProperty = () => {
        toast.info('Add property feature coming soon!')
    }

    const handleSendReminder = (propertyId: string) => {
        toast.success('Payment reminder sent to all tenants', {
            description: 'SMS notifications will be delivered shortly',
        })
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
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
                    <p className="text-gray-500 mt-1">Welcome back, John! Here&#39;s your portfolio overview.</p>
                </div>
                <Button onClick={handleAddProperty} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Property
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <SummaryCard
                    title="Total Properties"
                    value={mockSummary.totalProperties}
                    icon={Home}
                    trend="+2 this month"
                    trendUp={true}
                />
                <SummaryCard
                    title="Total Tenants"
                    value={mockSummary.totalTenants}
                    icon={Users}
                    trend="+3 this month"
                    trendUp={true}
                />
                <SummaryCard
                    title="Monthly Revenue"
                    value={`$${mockSummary.monthlyRevenue.toLocaleString()}`}
                    icon={DollarSign}
                    trend="+12.5% vs last month"
                    trendUp={true}
                />
                <SummaryCard
                    title="Occupancy Rate"
                    value={`${mockSummary.occupancyRate}%`}
                    icon={TrendingUp}
                    trend="+5% vs last month"
                    trendUp={true}
                />
            </div>

            {/* Alerts Section */}
            {mockSummary.overdueAmount > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                        <div className="flex-1">
                            <h3 className="font-semibold text-red-800">Attention Needed</h3>
                            <p className="text-sm text-red-600">
                                You have {mockSummary.pendingPayments} overdue payments totaling ${mockSummary.overdueAmount}.
                                Send reminders to tenants.
                            </p>
                        </div>
                        <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                            Send All Reminders
                        </Button>
                    </div>
                </div>
            )}

            {/* Properties Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Your Properties</h2>
                    <Button variant="outline" size="sm">
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
                            {mockProperties.map((property) => (
                                <PropertyCard
                                    key={property.id}
                                    property={property}
                                    onSendReminder={() => handleSendReminder(property.id)}
                                />
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="occupied">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {mockProperties.filter(p => p.occupied > 0).map((property) => (
                                <PropertyCard
                                    key={property.id}
                                    property={property}
                                    onSendReminder={() => handleSendReminder(property.id)}
                                />
                            ))}
                        </div>
                    </TabsContent>

                    {/* Add other tab contents similarly */}
                </Tabs>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg border p-6">
                <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-3 text-sm">
                            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                            <span className="text-gray-600">Tenant at Sunset Apartments paid $1,500</span>
                            <span className="text-gray-400 ml-auto">2 hours ago</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}