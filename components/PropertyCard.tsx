import { Building2, MapPin, Users, Calendar, DollarSign, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardFooter } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { cn } from '@/lib/utils'

interface PropertyCardProps {
    property: {
        id: string
        name: string
        address: string
        units: number
        occupied: number
        monthlyRent: number
        nextPayment: string
        status: 'paid' | 'partial' | 'overdue' | 'vacant'
    }
    onSendReminder: () => void
}

export function PropertyCard({ property, onSendReminder }: PropertyCardProps) {
    const getStatusColor = (status: string) => {
        switch(status) {
            case 'paid': return 'bg-green-100 text-green-800'
            case 'partial': return 'bg-yellow-100 text-yellow-800'
            case 'overdue': return 'bg-red-100 text-red-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const getStatusText = (status: string) => {
        switch(status) {
            case 'paid': return 'All Paid'
            case 'partial': return 'Partial Payment'
            case 'overdue': return 'Overdue'
            case 'vacant': return 'Vacant'
            default: return status
        }
    }

    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h3 className="font-semibold text-lg">{property.name}</h3>
                        <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                            <MapPin className="h-3 w-3" />
                            {property.address}
                        </div>
                    </div>
                    <Badge className={cn(getStatusColor(property.status))}>
                        {getStatusText(property.status)}
                    </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-gray-400" />
                        <div>
                            <p className="text-xs text-gray-500">Units</p>
                            <p className="font-medium">{property.occupied}/{property.units}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <div>
                            <p className="text-xs text-gray-500">Occupied</p>
                            <p className="font-medium">{property.occupied}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <div>
                            <p className="text-xs text-gray-500">Monthly Rent</p>
                            <p className="font-medium">${property.monthlyRent.toLocaleString()}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <div>
                            <p className="text-xs text-gray-500">Next Payment</p>
                            <p className="font-medium">{new Date(property.nextPayment).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>

                {property.status === 'overdue' && (
                    <div className="mt-4 p-2 bg-red-50 rounded-md flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <span className="text-xs text-red-600">Payment overdue - Send reminder</span>
                    </div>
                )}
            </CardContent>

            <CardFooter className="bg-gray-50 px-6 py-3 border-t">
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    onClick={onSendReminder}
                >
                    Send Reminder
                </Button>
            </CardFooter>
        </Card>
    )
}