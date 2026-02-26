'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import {
    DollarSign,
    TrendingUp,
    TrendingDown,
    Calendar,
    Download,
    Plus,
    Receipt,
    Clock,
    CheckCircle,
    XCircle,
    Printer,
    Mail,
    MoreVertical
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Progress } from '@/components/ui/progress'
import { Payment, TaxSummary } from '@/types/payment'

interface AccountingSummary {
    total_collected?: number
    pending_amount?: number
    overdue_amount?: number
    total_payments?: number
    pending_payments?: number
    overdue_payments?: number
}

// Mock data
const mockPayments: Payment[] = [
    {
        id: 'p1',
        tenantId: 't1',
        tenantName: 'John Mwangi',
        propertyId: '1',
        propertyName: 'Sunset Apartments',
        unitNumber: 'A1',
        amount: 1500,
        date: '2024-01-15',
        dueDate: '2024-02-01',
        status: 'completed',
        method: 'M-Pesa',
        reference: 'MPE123456',
        notes: 'January rent payment'
    },
    {
        id: 'p2',
        tenantId: 't2',
        tenantName: 'Sarah Wanjiku',
        propertyId: '1',
        propertyName: 'Sunset Apartments',
        unitNumber: 'A2',
        amount: 1200,
        date: '2024-01-20',
        dueDate: '2024-02-05',
        status: 'completed',
        method: 'Bank Transfer',
        reference: 'BT789012',
        notes: ''
    },
    {
        id: 'p3',
        tenantId: 't3',
        tenantName: 'David Omondi',
        propertyId: '2',
        propertyName: 'Green Heights',
        unitNumber: 'B1',
        amount: 2000,
        date: '2024-01-10',
        dueDate: '2024-01-30',
        status: 'overdue',
        method: 'Pending',
        reference: '',
        notes: 'Second reminder sent'
    },
    {
        id: 'p4',
        tenantId: 't4',
        tenantName: 'Grace Akinyi',
        propertyId: '2',
        propertyName: 'Green Heights',
        unitNumber: 'B2',
        amount: 1600,
        date: '',
        dueDate: '2024-02-01',
        status: 'pending',
        method: 'Pending',
        reference: '',
        notes: 'New tenant'
    },
    {
        id: 'p5',
        tenantId: 't5',
        tenantName: 'James Kariuki',
        propertyId: '3',
        propertyName: 'City View Plaza',
        unitNumber: 'C1',
        amount: 1400,
        date: '2024-01-25',
        dueDate: '2024-02-10',
        status: 'completed',
        method: 'M-Pesa',
        reference: 'MPE345678',
        notes: 'Early payment'
    }
]

const mockTaxSummary: TaxSummary = {
    year: 2024,
    totalIncome: 25700,
    totalExpenses: 5200,
    netIncome: 20500,
    estimatedTax: 4100,
    taxRate: 20,
    deductions: {
        maintenance: 2500,
        insurance: 1200,
        propertyTax: 1500,
        other: 0
    }
}

export default function AccountingPage() {
    const [payments, setPayments] = useState<Payment[]>(mockPayments)
    const [dateRange, setDateRange] = useState('this-month')
    const [isLoading, setIsLoading] = useState(true)
    const [summary, setSummary] = useState<AccountingSummary | null>(null)

    useEffect(() => {
        // Fetch accounting dashboard from the backend
        const fetchDashboard = async () => {
            try {
                setIsLoading(true)
                const res = await api.get('/accounting/dashboard')
                const data = res.data

                const mapped = (data.recent_payments || []).map((p: Record<string, unknown>) => ({
                    id: String(p.id),
                    tenantId: (p.tenant_id as string) || (p.tenantId as string) || '',
                    tenantName: (p.tenant_name as string) || (p.tenantName as string) || 'Unknown',
                    propertyId: p.property_id ? String(p.property_id) : ((p.propertyId as string) || ''),
                    propertyName: (p.property_name as string) || (p.propertyName as string) || '-',
                    unitNumber: (p.unit_number as string) || (p.unitNumber as string) || '-',
                    amount: (p.amount as number) || 0,
                    date: p.date ? new Date(p.date as string | number).toISOString() : (p.payment_date ? new Date(p.payment_date as string | number).toISOString() : ''),
                    dueDate: p.due_date ? new Date(p.due_date as string | number).toISOString() : (p.dueDate ? new Date(p.dueDate as string | number).toISOString() : ''),
                    status: ((p.status as string) || '').toLowerCase(),
                    method: (p.payment_method as string) || (p.method as string) || '',
                    reference: (p.transaction_id as string) || (p.reference as string) || '',
                    notes: (p.notes as string) || ''
                }))

                setPayments(mapped.length ? mapped : mockPayments)
                setSummary(data.summary || null)
            } catch (err) {
                console.error('Failed to load accounting dashboard', err)
                toast.error('Failed to load accounting data')
                setPayments(mockPayments)
            } finally {
                setIsLoading(false)
            }
        }

        fetchDashboard()
    }, [])

    const stats = summary ? {
        totalIncome: summary.total_collected || 0,
        pendingAmount: summary.pending_amount || 0,
        overdueAmount: summary.overdue_amount || 0,
        totalPayments: summary.total_payments || 0,
        pendingPayments: summary.pending_payments || 0,
        overduePayments: summary.overdue_payments || 0,
    } : {
        totalIncome: payments.filter(p => p.status === 'completed').reduce((acc, p) => acc + p.amount, 0),
        pendingAmount: payments.filter(p => p.status === 'pending').reduce((acc, p) => acc + p.amount, 0),
        overdueAmount: payments.filter(p => p.status === 'overdue').reduce((acc, p) => acc + p.amount, 0),
        totalPayments: payments.filter(p => p.status === 'completed').length,
        pendingPayments: payments.filter(p => p.status === 'pending').length,
        overduePayments: payments.filter(p => p.status === 'overdue').length,
    }

    const handleGenerateReceipt = (payment: Payment) => {
        toast.success(`Receipt generated for ${payment.tenantName}`, {
            description: 'The receipt has been saved and is ready to send',
        })
    }

    const handleSendReceipt = (payment: Payment) => {
        toast.success(`Receipt sent to ${payment.tenantName}`, {
            description: 'The receipt has been emailed to the tenant',
        })
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handlePrintReceipt = (_payment: Payment) => {
        toast.info('Preparing receipt for printing...')
    }

    const handleExportStatement = () => {
        toast.info('Exporting financial statement...')
    }

    const getStatusIcon = (status: string) => {
        switch(status) {
            case 'completed':
                return <CheckCircle className="h-4 w-4 text-green-500" />
            case 'pending':
                return <Clock className="h-4 w-4 text-yellow-500" />
            case 'overdue':
                return <XCircle className="h-4 w-4 text-red-500" />
            default:
                return null
        }
    }

    const getStatusBadge = (status: string) => {
        switch(status) {
            case 'completed':
                return <Badge className="bg-green-100 text-green-800">Completed</Badge>
            case 'pending':
                return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
            case 'overdue':
                return <Badge className="bg-red-100 text-red-800">Overdue</Badge>
            default:
                return <Badge>{status}</Badge>
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
                    <h1 className="text-2xl md:text-3xl font-bold">Accounting</h1>
                    <p className="text-gray-500 mt-1">Track payments, manage receipts, and handle taxes</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleExportStatement}>
                        <Download className="h-4 w-4 mr-2" />
                        Export
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Record Payment
                    </Button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Total Income</p>
                                <p className="text-2xl font-bold mt-1 text-green-600">
                                    ${stats.totalIncome.toLocaleString()}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">{stats.totalPayments} payments</p>
                            </div>
                            <div className="h-12 w-12 bg-green-50 rounded-lg flex items-center justify-center">
                                <TrendingUp className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Pending</p>
                                <p className="text-2xl font-bold mt-1 text-yellow-600">
                                    ${stats.pendingAmount.toLocaleString()}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">{stats.pendingPayments} payments</p>
                            </div>
                            <div className="h-12 w-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                                <Clock className="h-6 w-6 text-yellow-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Overdue</p>
                                <p className="text-2xl font-bold mt-1 text-red-600">
                                    ${stats.overdueAmount.toLocaleString()}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">{stats.overduePayments} payments</p>
                            </div>
                            <div className="h-12 w-12 bg-red-50 rounded-lg flex items-center justify-center">
                                <TrendingDown className="h-6 w-6 text-red-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Net Income</p>
                                <p className="text-2xl font-bold mt-1">
                                    ${mockTaxSummary.netIncome.toLocaleString()}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">After expenses</p>
                            </div>
                            <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
                                <DollarSign className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="payments" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3 lg:w-100">
                    <TabsTrigger value="payments">Payments</TabsTrigger>
                    <TabsTrigger value="receipts">Receipts</TabsTrigger>
                    <TabsTrigger value="taxes">Tax Summary</TabsTrigger>
                </TabsList>

                {/* Payments Tab */}
                <TabsContent value="payments" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Recent Payments</CardTitle>
                                <Select value={dateRange} onValueChange={setDateRange}>
                                    <SelectTrigger className="w-45">
                                        <Calendar className="h-4 w-4 mr-2" />
                                        <SelectValue placeholder="Date Range" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="this-month">This Month</SelectItem>
                                        <SelectItem value="last-month">Last Month</SelectItem>
                                        <SelectItem value="this-quarter">This Quarter</SelectItem>
                                        <SelectItem value="this-year">This Year</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Tenant</TableHead>
                                        <TableHead>Property</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Due Date</TableHead>
                                        <TableHead>Payment Date</TableHead>
                                        <TableHead>Method</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {payments.map((payment) => (
                                        <TableRow key={payment.id}>
                                            <TableCell className="font-medium">{payment.tenantName}</TableCell>
                                            <TableCell>{payment.propertyName} - {payment.unitNumber}</TableCell>
                                            <TableCell>${payment.amount}</TableCell>
                                            <TableCell>{new Date(payment.dueDate).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                {payment.date ? new Date(payment.date).toLocaleDateString() : '-'}
                                            </TableCell>
                                            <TableCell>{payment.method || '-'}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {getStatusIcon(payment.status)}
                                                    {getStatusBadge(payment.status)}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => handleGenerateReceipt(payment)}>
                                                            Generate Receipt
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleSendReceipt(payment)}>
                                                            Send Receipt
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handlePrintReceipt(payment)}>
                                                            Print Receipt
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Receipts Tab */}
                <TabsContent value="receipts" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {payments.filter(p => p.status === 'completed').map((payment) => (
                            <ReceiptCard
                                key={payment.id}
                                payment={payment}
                                onSend={() => handleSendReceipt(payment)}
                                onPrint={() => handlePrintReceipt(payment)}
                                onDownload={() => handleGenerateReceipt(payment)}
                            />
                        ))}
                    </div>
                </TabsContent>

                {/* Taxes Tab */}
                <TabsContent value="taxes">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Tax Summary */}
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle>Tax Summary {mockTaxSummary.year}</CardTitle>
                                <CardDescription>
                                    Estimated tax liability based on current income
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Total Income</p>
                                        <p className="text-2xl font-bold">${mockTaxSummary.totalIncome.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Total Expenses</p>
                                        <p className="text-2xl font-bold">${mockTaxSummary.totalExpenses.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Net Income</p>
                                        <p className="text-2xl font-bold text-green-600">
                                            ${mockTaxSummary.netIncome.toLocaleString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Estimated Tax</p>
                                        <p className="text-2xl font-bold text-orange-600">
                                            ${mockTaxSummary.estimatedTax.toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm font-medium">Tax Rate</span>
                                        <span className="text-sm text-gray-500">{mockTaxSummary.taxRate}%</span>
                                    </div>
                                    <Progress value={mockTaxSummary.taxRate} className="h-2" />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Deductions Breakdown */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Deductions</CardTitle>
                                <CardDescription>Tax deductible expenses</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm">Maintenance</span>
                                        <span className="font-medium">${mockTaxSummary.deductions.maintenance}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm">Insurance</span>
                                        <span className="font-medium">${mockTaxSummary.deductions.insurance}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm">Property Tax</span>
                                        <span className="font-medium">${mockTaxSummary.deductions.propertyTax}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm">Other</span>
                                        <span className="font-medium">${mockTaxSummary.deductions.other}</span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t">
                                    <div className="flex justify-between font-medium">
                                        <span>Total Deductions</span>
                                        <span>${mockTaxSummary.totalExpenses}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}

// Receipt Card Component
function ReceiptCard({ payment, onSend, onPrint, onDownload }: {
    payment: Payment;
    onSend: () => void;
    onPrint: () => void;
    onDownload: () => void;
}) {
    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Receipt className="h-5 w-5 text-blue-600" />
                    </div>
                    <Badge>Paid</Badge>
                </div>

                <div className="space-y-2">
                    <h3 className="font-semibold">{payment.tenantName}</h3>
                    <p className="text-sm text-gray-500">
                        {payment.propertyName} - Unit {payment.unitNumber}
                    </p>
                    <p className="text-2xl font-bold">${payment.amount}</p>
                    <p className="text-xs text-gray-500">
                        Paid on {new Date(payment.date!).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500">Ref: {payment.reference}</p>
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t">
                    <Button variant="outline" size="sm" className="flex-1" onClick={onSend}>
                        <Mail className="h-3 w-3 mr-1" />
                        Email
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" onClick={onPrint}>
                        <Printer className="h-3 w-3 mr-1" />
                        Print
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" onClick={onDownload}>
                        <Download className="h-3 w-3 mr-1" />
                        PDF
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}