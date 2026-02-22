export interface Property {
    id: string
    name: string
    address: string
    units: Unit[]
    totalUnits: number
    occupiedUnits: number
    monthlyRevenue: number
    nextPayment: string
    status: 'active' | 'maintenance' | 'inactive'
    image?: string
}

export interface Unit {
    id: string
    number: string
    type: 'Studio' | '1 Bedroom' | '2 Bedroom' | '3 Bedroom' | 'Other'
    rent: number
    status: 'occupied' | 'vacant' | 'maintenance'
    tenantId?: string
    features?: string[]
}