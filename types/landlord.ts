export interface Landlord {
    uid: string
    email: string | null
    firstName: string
    lastName: string
    fullName: string
    phone?: string
    company?: string
    photoURL?: string
    createdAt: string
    landlordId?: string
    businessAddress?: string
    taxId?: string
    isActive?: boolean
    syncedWithBackend?: boolean
}

