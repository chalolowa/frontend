'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import {
    Building2,
    Plus,
    Search,
    Filter,
    MapPin,
    Users,
    DollarSign,
    Calendar,
    MoreVertical,
    Download,
    Mail,
    Phone,
    AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
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
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Property } from '@/types/property'

// Mock data
const mockProperties: Property[] = [
    {
        id: '1',
        name: 'Sunset Apartments',
        address: '123 Main St, Nairobi',
        units: [
            { id: '101', number: 'A1', type: '2 Bedroom', rent: 1500, status: 'occupied', tenantId: 't1' },
            { id: '102', number: 'A2', type: '1 Bedroom', rent: 1200, status: 'occupied', tenantId: 't2' },
            { id: '103', number: 'A3', type: 'Studio', rent: 900, status: 'vacant' },
        ],
        totalUnits: 3,
        occupiedUnits: 2,
        monthlyRevenue: 2700,
        nextPayment: '2024-02-01',
        status: 'active',
        image: '/properties/sunset.jpg',
    },
    {
        id: '2',
        name: 'Green Heights',
        address: '456 Park Ave, Mombasa',
        units: [
            { id: '201', number: 'B1', type: '3 Bedroom', rent: 2000, status: 'occupied', tenantId: 't3' },
            { id: '202', number: 'B2', type: '2 Bedroom', rent: 1600, status: 'occupied', tenantId: 't4' },
        ],
        totalUnits: 2,
        occupiedUnits: 2,
        monthlyRevenue: 3600,
        nextPayment: '2024-02-05',
        status: 'active',
        image: '/properties/green.jpg',
    },
    {
        id: '3',
        name: 'City View Plaza',
        address: '789 River Rd, Kisumu',
        units: [
            { id: '301', number: 'C1', type: '2 Bedroom', rent: 1400, status: 'occupied', tenantId: 't5' },
            { id: '302', number: 'C2', type: '2 Bedroom', rent: 1400, status: 'occupied', tenantId: 't6' },
            { id: '303', number: 'C3', type: '1 Bedroom', rent: 1100, status: 'occupied', tenantId: 't7' },
            { id: '304', number: 'C4', type: 'Studio', rent: 850, status: 'vacant' },
        ],
        totalUnits: 4,
        occupiedUnits: 3,
        monthlyRevenue: 3900,
        nextPayment: '2024-01-30',
        status: 'maintenance',
    },
]

export default function PropertiesPage() {
    const [properties, setProperties] = useState<Property[]>(mockProperties)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Simulate loading
        const timer = setTimeout(() => setIsLoading(false), 1000)
        return () => clearTimeout(timer)
    }, [])

    const filteredProperties = properties.filter(property => {
        const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            property.address.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === 'all' || property.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const stats = {
        totalProperties: properties.length,
        totalUnits: properties.reduce((acc, p) => acc + p.totalUnits, 0),
        occupiedUnits: properties.reduce((acc, p) => acc + p.occupiedUnits, 0),
        totalRevenue: properties.reduce((acc, p) => acc + p.monthlyRevenue, 0),
    }

    const handleSendBulkReminder = () => {
        toast.success('Payment reminders sent to all tenants', {
            description: 'SMS notifications will be delivered shortly',
        })
    }

    const handleExportData = () => {
        toast.info('Exporting property data...')
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
                    <h1 className="text-2xl md:text-3xl font-bold">Properties</h1>
                    <p className="text-gray-500 mt-1">Manage your rental properties and units</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleExportData}>
                        <Download className="h-4 w-4 mr-2" />
                        Export
                    </Button>
                    <Link href="/dashboard/properties/add">
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Property
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Total Properties</p>
                                <p className="text-2xl font-bold mt-1">{stats.totalProperties}</p>
                            </div>
                            <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                <Building2 className="h-5 w-5 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Total Units</p>
                                <p className="text-2xl font-bold mt-1">{stats.totalUnits}</p>
                            </div>
                            <div className="h-10 w-10 bg-green-50 rounded-lg flex items-center justify-center">
                                <Users className="h-5 w-5 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Occupied</p>
                                <p className="text-2xl font-bold mt-1">{stats.occupiedUnits}/{stats.totalUnits}</p>
                            </div>
                            <div className="h-10 w-10 bg-purple-50 rounded-lg flex items-center justify-center">
                                <Building2 className="h-5 w-5 text-purple-600" />
                            </div>
                        </div>
                        <Progress value={(stats.occupiedUnits / stats.totalUnits) * 100} className="mt-3" />
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Monthly Revenue</p>
                                <p className="text-2xl font-bold mt-1">${stats.totalRevenue.toLocaleString()}</p>
                            </div>
                            <div className="h-10 w-10 bg-orange-50 rounded-lg flex items-center justify-center">
                                <DollarSign className="h-5 w-5 text-orange-600" />
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
                                placeholder="Search properties by name or address..."
                                className="pl-9"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <Filter className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Properties</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="maintenance">Maintenance</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline" onClick={handleSendBulkReminder}>
                            <Mail className="h-4 w-4 mr-2" />
                            Send Reminders
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Properties Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredProperties.map((property) => (
                    <Link href={`/dashboard/properties/${property.id}`} key={property.id}>
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                            <CardContent className="p-0">
                                {/* Property Header with Image */}
                                <div className="h-40 bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-lg relative">
                                    <div className="absolute top-4 right-4">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                                                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>Edit Property</DropdownMenuItem>
                                                <DropdownMenuItem>View Units</DropdownMenuItem>
                                                <DropdownMenuItem>Add Tenant</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-red-600">Archive</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    <div className="absolute bottom-4 left-4 text-white">
                                        <h3 className="text-xl font-bold">{property.name}</h3>
                                        <div className="flex items-center gap-1 text-sm text-white/80">
                                            <MapPin className="h-3 w-3" />
                                            {property.address}
                                        </div>
                                    </div>
                                </div>

                                {/* Property Details */}
                                <div className="p-6">
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4 text-gray-400" />
                                            <div>
                                                <p className="text-xs text-gray-500">Occupancy</p>
                                                <p className="font-medium">{property.occupiedUnits}/{property.totalUnits} units</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <DollarSign className="h-4 w-4 text-gray-400" />
                                            <div>
                                                <p className="text-xs text-gray-500">Monthly Revenue</p>
                                                <p className="font-medium">${property.monthlyRevenue.toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-gray-400" />
                                            <div>
                                                <p className="text-xs text-gray-500">Next Payment</p>
                                                <p className="font-medium">{new Date(property.nextPayment).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <Badge variant={property.status === 'active' ? 'default' : 'secondary'}>
                                                {property.status}
                                            </Badge>
                                        </div>
                                    </div>

                                    {/* Units Preview */}
                                    <div className="border-t pt-4">
                                        <p className="text-sm font-medium mb-3">Recent Units</p>
                                        <div className="space-y-2">
                                            {property.units.slice(0, 2).map((unit) => (
                                                <div key={unit.id} className="flex items-center justify-between text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <Building2 className="h-3 w-3 text-gray-400" />
                                                        <span>Unit {unit.number}</span>
                                                        <span className="text-gray-500">({unit.type})</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium">${unit.rent}</span>
                                                        <Badge variant={unit.status === 'occupied' ? 'outline' : 'secondary'} className="text-xs">
                                                            {unit.status}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            ))}
                                            {property.units.length > 2 && (
                                                <p className="text-xs text-gray-500 mt-2">
                                                    +{property.units.length - 2} more units
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            {filteredProperties.length === 0 && (
                <div className="text-center py-12">
                    <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No properties found</h3>
                    <p className="text-gray-500 mt-1">Try adjusting your search or add a new property</p>
                    <Link href="/dashboard/properties/add">
                        <Button className="mt-4">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Property
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    )
}