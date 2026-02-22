import { Phone, Mail, Calendar, DollarSign, MoreVertical } from 'lucide-react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Avatar, AvatarFallback } from './ui/avatar'
import { cn } from '@/lib/utils'

interface TenantCardProps {
    tenant: {
        id: string
        name: string
        email: string
        phone: string
        property: string
        unit: string
        rentAmount: number
        nextPayment: string
        paymentStatus: 'paid' | 'pending' | 'overdue'
    }
}

export function TenantCard({ tenant }: TenantCardProps) {
    const getStatusColor = (status: string) => {
        switch(status) {
            case 'paid': return 'bg-green-100 text-green-800'
            case 'pending': return 'bg-yellow-100 text-yellow-800'
            case 'overdue': return 'bg-red-100 text-red-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const initials = tenant.name.split(' ').map(n => n[0]).join('')

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarFallback className="bg-blue-100 text-blue-600">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="font-semibold">{tenant.name}</h3>
                            <p className="text-sm text-gray-500">{tenant.property} - {tenant.unit}</p>
                        </div>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Send Message</DropdownMenuItem>
                            <DropdownMenuItem>Record Payment</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Mark as Overdue</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-600">{tenant.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-600 truncate">{tenant.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-600">${tenant.rentAmount}/month</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-600">Due: {new Date(tenant.nextPayment).toLocaleDateString()}</span>
                    </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                    <Badge className={cn(getStatusColor(tenant.paymentStatus))}>
                        {tenant.paymentStatus.charAt(0).toUpperCase() + tenant.paymentStatus.slice(1)}
                    </Badge>

                    <Button variant="outline" size="sm">
                        Send Reminder
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}