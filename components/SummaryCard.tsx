import { LucideIcon } from 'lucide-react'
import { Card, CardContent } from './ui/card'
import { cn } from '@/lib/utils'

interface SummaryCardProps {
    title: string
    value: string | number
    icon: LucideIcon
    trend?: string
    trendUp?: boolean
}

export function SummaryCard({ title, value, icon: Icon, trend, trendUp }: SummaryCardProps) {
    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">{title}</p>
                        <p className="text-2xl font-bold mt-2">{value}</p>
                        {trend && (
                            <p className={cn(
                                "text-xs mt-2",
                                trendUp ? "text-green-600" : "text-red-600"
                            )}>
                                {trend}
                            </p>
                        )}
                    </div>
                    <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}