export interface Tenant {
    id: string
    name: string
    email: string
    phone: string
    propertyId: string
    propertyName: string
    unitNumber: string
    rentAmount: number
    deposit: number
    leaseStart: string
    leaseEnd: string
    nextPayment: string
    paymentStatus: 'paid' | 'pending' | 'overdue'
    balance: number
    documents: TenantDocument[]
    emergencyContact: EmergencyContact
}

export interface TenantDocument {
    id: string
    type: 'lease' | 'id' | 'agreement' | 'other'
    name: string
    url: string
    uploadDate: string
}

export interface EmergencyContact {
    name: string
    phone: string
    relationship: string
}