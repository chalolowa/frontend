'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { api } from '@/lib/api'
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

// data fetched from backend
interface RawTenant {
    id: number
    first_name: string
    last_name: string
    email?: string
    phone: string
    property_id: number
    property_name?: string
    unit_number?: string
    monthly_rent: number
    deposit_paid?: boolean
    lease_start: string
    lease_end: string
    payment_status: 'paid' | 'pending' | 'overdue'
    balance: number
    emergency_contact_name?: string
    emergency_contact_phone?: string
    emergency_contact_relationship?: string
}

export default function TenantsPage() {
    const [tenants, setTenants] = useState<Tenant[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [propertyFilter, setPropertyFilter] = useState('all')
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const load = async () => {
            try {
                const res = await api.get<RawTenant[]>('/tenants')

                // map to front-end Tenant type
                const mapped: Tenant[] = res.data.map(t => ({
                    id: String(t.id),
                    name: `${t.first_name} ${t.last_name}`,
                    email: t.email || '',
                    phone: t.phone,
                    propertyId: String(t.property_id),
                    propertyName: t.property_name || '',
                    unitNumber: t.unit_number || '',
                    rentAmount: t.monthly_rent,
                    deposit: 0,
                    leaseStart: t.lease_start,
                    leaseEnd: t.lease_end,
                    nextPayment: '',
                    paymentStatus: t.payment_status,
                    balance: t.balance,
                    documents: [],
                    emergencyContact: {
                        name: t.emergency_contact_name || '',
                        phone: t.emergency_contact_phone || '',
                        relationship: t.emergency_contact_relationship || ''
                    }
                }))
                setTenants(mapped)
            } catch (err) {
                console.error('failed to load tenants', err)
                toast.error('Could not fetch tenants')
            } finally {
                setIsLoading(false)
            }
        }
        load()
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

    const handleSendReminder = async (tenant: Tenant) => {
        try {
            const res = await api.post(`/tenants/${tenant.id}/remind`)
            // backend now returns HTTP 502 on failure, but we'll also check
            // the JSON body in case we continue to return 200 for any reason.
            if (res.data && res.data.success === false) {
                throw new Error(res.data.error || 'unknown')
            }
            toast.success(`Reminder queued for ${tenant.name}`)
        } catch (err) {
            console.error('reminder api error', err)
            toast.error('Failed to send reminder')
        }
    }

    const handleSendBulkReminders = async () => {
        try {
            const res = await api.post('/payments/remind/all-overdue')
            toast.success(`Reminders queued: ${res.data.count}`)
        } catch (err) {
            console.error('bulk reminder error', err)
            toast.error('Failed to send reminders')
        }
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
                                You have {stats.overduePayments} tenants with overdue payments totaling KES{stats.overdueAmount}.
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
                                <p className="text-2xl font-bold mt-1">KES{stats.monthlyRevenue.toLocaleString()}</p>
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
                                <p className="text-2xl font-bold mt-1 text-red-600">KES{stats.overdueAmount.toLocaleString()}</p>
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
                                                    <DropdownMenuItem onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleSendReminder(tenant); }}>
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
                                            <p className="font-medium">KES{tenant.rentAmount}/month</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Next Payment</p>
                                            <p className="font-medium">{new Date(tenant.nextPayment).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Balance</p>
                                            <p className={`font-medium ${tenant.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                                KES{tenant.balance}
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