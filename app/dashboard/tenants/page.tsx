'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import {
    Users,
    Plus,
    Search,
    Filter,
    Mail,
    Phone,
    Calendar,
    DollarSign,
    Home,
    MoreVertical,
    Download,
    MessageSquare,
    AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tenant } from '@/types/tenant'

// Mock data
const mockTenants: Tenant[] = [
    {
        id: 't1',
        name: 'John Mwangi',
        email: 'john.mwangi@email.com',
        phone: '+254 712 345 678',
        propertyId: '1',
        propertyName: 'Sunset Apartments',
        unitNumber: 'A1',
        rentAmount: 1500,
        deposit: 1500,
        leaseStart: '2024-01-01',
        leaseEnd: '2024-12-31',
        nextPayment: '2024-02-01',
        paymentStatus: 'pending',
        balance: 1500,
        documents: [],
        emergencyContact: {
            name: 'Mary Mwangi',
            phone: '+254 723 456 789',
            relationship: 'Spouse'
        }
    },
    {
        id: 't2',
        name: 'Sarah Wanjiku',
        email: 'sarah.wanjiku@email.com',
        phone: '+254 733 456 789',
        propertyId: '1',
        propertyName: 'Sunset Apartments',
        unitNumber: 'A2',
        rentAmount: 1200,
        deposit: 1200,
        leaseStart: '2024-01-15',
        leaseEnd: '2024-12-15',
        nextPayment: '2024-02-05',
        paymentStatus: 'paid',
        balance: 0,
        documents: [],
        emergencyContact: {
            name: 'Peter Wanjiku',
            phone: '+254 743 567 890',
            relationship: 'Brother'
        }
    },
    {
        id: 't3',
        name: 'David Omondi',
        email: 'david.omondi@email.com',
        phone: '+254 753 567 890',
        propertyId: '2',
        propertyName: 'Green Heights',
        unitNumber: 'B1',
        rentAmount: 2000,
        deposit: 2000,
        leaseStart: '2024-01-01',
        leaseEnd: '2024-12-31',
        nextPayment: '2024-01-30',
        paymentStatus: 'overdue',
        balance: 2000,
        documents: [],
        emergencyContact: {
            name: 'James Omondi',
            phone: '+254 763 678 901',
            relationship: 'Father'
        }
    },
    {
        id: 't4',
        name: 'Grace Akinyi',
        email: 'grace.akinyi@email.com',
        phone: '+254 773 678 901',
        propertyId: '2',
        propertyName: 'Green Heights',
        unitNumber: 'B2',
        rentAmount: 1600,
        deposit: 1600,
        leaseStart: '2024-02-01',
        leaseEnd: '2025-01-31',
        nextPayment: '2024-02-01',
        paymentStatus: 'pending',
        balance: 1600,
        documents: [],
        emergencyContact: {
            name: 'Michael Akinyi',
            phone: '+254 783 789 012',
            relationship: 'Spouse'
        }
    },
    {
        id: 't5',
        name: 'James Kariuki',
        email: 'james.kariuki@email.com',
        phone: '+254 793 789 012',
        propertyId: '3',
        propertyName: 'City View Plaza',
        unitNumber: 'C1',
        rentAmount: 1400,
        deposit: 1400,
        leaseStart: '2024-01-10',
        leaseEnd: '2024-12-10',
        nextPayment: '2024-02-10',
        paymentStatus: 'paid',
        balance: 0,
        documents: [],
        emergencyContact: {
            name: 'Lucy Kariuki',
            phone: '+254 703 890 123',
            relationship: 'Spouse'
        }
    }
]

export default function TenantsPage() {
    const [tenants, setTenants] = useState<Tenant[]>(mockTenants)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [propertyFilter, setPropertyFilter] = useState('all')
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1000)
        return () => clearTimeout(timer)
    }, [])

    const filteredTenants = tenants.filter(tenant => {
        const matchesSearch = tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tenant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tenant.phone.includes(searchTerm)
        const matchesStatus = statusFilter === 'all' || tenant.paymentStatus === statusFilter
        const matchesProperty = propertyFilter === 'all' || tenant.propertyId === propertyFilter
        return matchesSearch && matchesStatus && matchesProperty
    })

    const stats = {
        totalTenants: tenants.length,
        activeLeases: tenants.filter(t => new Date(t.leaseEnd) > new Date()).length,
        monthlyRevenue: tenants.reduce((acc, t) => acc + t.rentAmount, 0),
        overduePayments: tenants.filter(t => t.paymentStatus === 'overdue').length,
        overdueAmount: tenants.filter(t => t.paymentStatus === 'overdue').reduce((acc, t) => acc + t.balance, 0)
    }

    const uniqueProperties = Array.from(new Set(tenants.map(t => t.propertyId)))
        .map(id => ({
            id,
            name: tenants.find(t => t.propertyId === id)?.propertyName
        }))

    const handleSendReminder = (tenant: Tenant) => {
        toast.success(`Reminder sent to ${tenant.name}`, {
            description: `SMS notification for $${tenant.rentAmount} sent to ${tenant.phone}`,
        })
    }

    const handleSendBulkReminders = () => {
        const overdueTenants = tenants.filter(t => t.paymentStatus === 'overdue')
        toast.success(`Reminders sent to ${overdueTenants.length} tenants`, {
            description: 'SMS notifications will be delivered shortly',
        })
    }

    const handleExportData = () => {
        toast.info('Exporting tenant data...')
    }

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('')
    }

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'paid': return 'bg-green-100 text-green-800'
            case 'pending': return 'bg-yellow-100 text-yellow-800'
            case 'overdue': return 'bg-red-100 text-red-800'
            default: return 'bg-gray-100 text-gray-800'
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
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">Tenants</h1>
                    <p className="text-gray-500 mt-1">Manage your tenants and lease agreements</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleExportData}>
                        <Download className="h-4 w-4 mr-2" />
                        Export
                    </Button>
                    <Link href="/dashboard/tenants/add">
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Tenant
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Alert for overdue payments */}
            {stats.overdueAmount > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                        <div className="flex-1">
                            <h3 className="font-semibold text-red-800">Overdue Payments Alert</h3>
                            <p className="text-sm text-red-600">
                                You have {stats.overduePayments} tenants with overdue payments totaling ${stats.overdueAmount}.
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            className="border-red-300 text-red-600 hover:bg-red-50"
                            onClick={handleSendBulkReminders}
                        >
                            Send All Reminders
                        </Button>
                    </div>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Total Tenants</p>
                                <p className="text-2xl font-bold mt-1">{stats.totalTenants}</p>
                            </div>
                            <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                <Users className="h-5 w-5 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Active Leases</p>
                                <p className="text-2xl font-bold mt-1">{stats.activeLeases}</p>
                            </div>
                            <div className="h-10 w-10 bg-green-50 rounded-lg flex items-center justify-center">
                                <Home className="h-5 w-5 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Monthly Rent</p>
                                <p className="text-2xl font-bold mt-1">${stats.monthlyRevenue.toLocaleString()}</p>
                            </div>
                            <div className="h-10 w-10 bg-purple-50 rounded-lg flex items-center justify-center">
                                <DollarSign className="h-5 w-5 text-purple-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Overdue</p>
                                <p className="text-2xl font-bold mt-1 text-red-600">${stats.overdueAmount.toLocaleString()}</p>
                            </div>
                            <div className="h-10 w-10 bg-red-50 rounded-lg flex items-center justify-center">
                                <AlertCircle className="h-5 w-5 text-red-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search tenants by name, email, or phone..."
                                className="pl-9"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Select value={propertyFilter} onValueChange={setPropertyFilter}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <Home className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Property" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Properties</SelectItem>
                                {uniqueProperties.map(p => (
                                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <Filter className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Payment Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="paid">Paid</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="overdue">Overdue</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Tenants List */}
            <Tabs defaultValue="all" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="all">All Tenants</TabsTrigger>
                    <TabsTrigger value="active">Active</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="overdue">Overdue</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4">
                    {filteredTenants.map((tenant) => (
                        <Link href={`/dashboard/tenants/${tenant.id}`} key={tenant.id}>
                            <Card className="hover:shadow-md transition-shadow cursor-pointer">
                                <CardContent className="p-6">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <Avatar className="h-12 w-12">
                                                <AvatarFallback className="bg-blue-100 text-blue-600">
                                                    {getInitials(tenant.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h3 className="font-semibold text-lg">{tenant.name}</h3>
                                                <div className="flex flex-wrap items-center gap-3 mt-1">
                                                    <div className="flex items-center gap-1 text-sm text-gray-500">
                                                        <Mail className="h-3 w-3" />
                                                        {tenant.email}
                                                    </div>
                                                    <div className="flex items-center gap-1 text-sm text-gray-500">
                                                        <Phone className="h-3 w-3" />
                                                        {tenant.phone}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="text-sm text-gray-500">Unit {tenant.unitNumber}</p>
                                                <p className="text-sm font-medium">{tenant.propertyName}</p>
                                            </div>
                                            <Badge className={getStatusColor(tenant.paymentStatus)}>
                                                {tenant.paymentStatus}
                                            </Badge>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem>View Details</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleSendReminder(tenant)}>
                                                        Send Reminder
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>Record Payment</DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-red-600">
                                                        Terminate Lease
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t">
                                        <div>
                                            <p className="text-xs text-gray-500">Rent Amount</p>
                                            <p className="font-medium">${tenant.rentAmount}/month</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Next Payment</p>
                                            <p className="font-medium">{new Date(tenant.nextPayment).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Balance</p>
                                            <p className={`font-medium ${tenant.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                                ${tenant.balance}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Lease End</p>
                                            <p className="font-medium">{new Date(tenant.leaseEnd).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </TabsContent>

                <TabsContent value="pending">
                    {filteredTenants.filter(t => t.paymentStatus === 'pending').map((tenant) => (
                        // Same card structure as above
                        <div key={tenant.id}>Pending tenants list</div>
                    ))}
                </TabsContent>

                <TabsContent value="overdue">
                    {filteredTenants.filter(t => t.paymentStatus === 'overdue').map((tenant) => (
                        // Same card structure as above
                        <div key={tenant.id}>Overdue tenants list</div>
                    ))}
                </TabsContent>
            </Tabs>

            {filteredTenants.length === 0 && (
                <div className="text-center py-12">
                    <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No tenants found</h3>
                    <p className="text-gray-500 mt-1">Try adjusting your search or add a new tenant</p>
                    <Link href="/dashboard/tenants/add">
                        <Button className="mt-4">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Tenant
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    )
}