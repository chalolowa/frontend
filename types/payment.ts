export interface Payment {
    id: string
    tenantId: string
    tenantName: string
    propertyId: string
    propertyName: string
    unitNumber: string
    amount: number
    date: string
    dueDate: string
    status: 'completed' | 'pending' | 'overdue' | 'failed'
    method: 'M-Pesa' | 'Bank Transfer' | 'Cash' | 'Check' | 'Credit Card' | 'Pending'
    reference: string
    notes?: string
}

export interface TaxSummary {
    year: number
    totalIncome: number
    totalExpenses: number
    netIncome: number
    estimatedTax: number
    taxRate: number
    deductions: {
        maintenance: number
        insurance: number
        propertyTax: number
        other: number
    }
}

export interface Receipt {
    id: string
    paymentId: string
    receiptNumber: string
    generatedDate: string
    pdfUrl?: string
    sentToTenant: boolean
    sentDate?: string
}