'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ArrowLeft, Save, UserPlus, Phone, Mail, Home, Calendar, DollarSign, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// property list fetched from backend
interface RawPropertyWithUnits {
    id: number
    name: string
    units: Array<{ id: number; unit_number: string; is_occupied: boolean }>
}

export default function AddTenantPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [properties, setProperties] = useState<RawPropertyWithUnits[]>([])

    // form fields
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [idNumber, setIdNumber] = useState('')

    const [selectedProperty, setSelectedProperty] = useState<number | ''>('')
    const [availableUnits, setAvailableUnits] = useState<Array<{id:number; unit_number:string}>>([])
    const [selectedUnit, setSelectedUnit] = useState<number | ''>('')

    const [rentAmount, setRentAmount] = useState(0)
    const [deposit, setDeposit] = useState(0)
    const [leaseStart, setLeaseStart] = useState('')
    const [leaseEnd, setLeaseEnd] = useState('')
    const [dueDate, setDueDate] = useState('1')

    const [emContactName, setEmContactName] = useState('')
    const [emContactPhone, setEmContactPhone] = useState('')
    const [emRelationship, setEmRelationship] = useState('')

    // fetch properties on mount
    useEffect(() => {
        const loadProperties = async () => {
            try {
                const res = await api.get<RawPropertyWithUnits[]>('/properties')
                setProperties(res.data)
            } catch (err) {
                console.error('failed to load properties', err)
                toast.error('Could not load properties')
            }
        }
        loadProperties()
    }, [])

    const handlePropertyChange = (propertyId: string) => {
        const id = Number(propertyId)
        setSelectedProperty(id)
        const property = properties.find(p => p.id === id)
        const units = property?.units.filter(u => !u.is_occupied) || []
        setAvailableUnits(units)
        setSelectedUnit('')
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const payload: any = {
                first_name: firstName,
                last_name: lastName,
                email: email || undefined,
                phone,
                id_number: idNumber || undefined,
                monthly_rent: rentAmount,
                rent_due_day: Number(dueDate),
                property_id: selectedProperty,
                unit_id: selectedUnit || undefined,
                lease_start: leaseStart,
                lease_end: leaseEnd,
                security_deposit: deposit || undefined,
                emergency_contact_name: emContactName || undefined,
                emergency_contact_phone: emContactPhone || undefined,
                emergency_contact_relationship: emRelationship || undefined,
            }

            await api.post('/tenants', payload)
            toast.success('Tenant added successfully!', {
                description: 'The tenant has been added and lease agreement created.'
            })
            router.push('/dashboard/tenants')
        } catch (err) {
            console.error('Failed to add tenant', err)
            toast.error('Unable to create tenant')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-6">
                <Link
                    href="/dashboard/tenants"
                    className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
                >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to Tenants
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center">
                            <UserPlus className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <CardTitle>Add New Tenant</CardTitle>
                            <CardDescription>
                                Enter the tenant&#39;s information and lease details
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent>
                        <Tabs defaultValue="personal" className="space-y-4">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                                <TabsTrigger value="lease">Lease Details</TabsTrigger>
                                <TabsTrigger value="emergency">Emergency Contact</TabsTrigger>
                            </TabsList>

                            <TabsContent value="personal" className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">First Name *</Label>
                                        <Input id="firstName" placeholder="John" value={firstName} onChange={e => setFirstName(e.target.value)} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Last Name *</Label>
                                        <Input id="lastName" placeholder="Doe" value={lastName} onChange={e => setLastName(e.target.value)} required />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address *</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                        <Input id="email" type="email" placeholder="john.doe@email.com" className="pl-9" value={email} onChange={e => setEmail(e.target.value)} required />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number *</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                        <Input id="phone" placeholder="+254 712 345 678" className="pl-9" value={phone} onChange={e => setPhone(e.target.value)} required />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="idNumber">ID/Passport Number</Label>
                                    <Input id="idNumber" placeholder="Enter identification number" value={idNumber} onChange={e => setIdNumber(e.target.value)} />
                                </div>
                            </TabsContent>

                            <TabsContent value="lease" className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="property">Select Property *</Label>
                                    <Select onValueChange={handlePropertyChange} value={selectedProperty === '' ? undefined : String(selectedProperty)} required>
                                        <SelectTrigger>
                                            <Home className="h-4 w-4 mr-2" />
                                            <SelectValue placeholder="Choose a property" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {properties.map(property => (
                                                <SelectItem key={property.id} value={String(property.id)}>
                                                    {property.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="unit">Unit Number *</Label>
                                    <Select value={selectedUnit === '' ? undefined : String(selectedUnit)} onValueChange={val => setSelectedUnit(Number(val))} disabled={!selectedProperty} required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select unit" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableUnits.map(unit => (
                                                <SelectItem key={unit.id} value={String(unit.id)}>{unit.unit_number}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="rentAmount">Monthly Rent ($) *</Label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                            <Input id="rentAmount" type="number" min="0" placeholder="1500" className="pl-9" value={rentAmount} onChange={e => setRentAmount(Number(e.target.value))} required />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="deposit">Security Deposit ($) *</Label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                            <Input id="deposit" type="number" min="0" placeholder="1500" className="pl-9" value={deposit} onChange={e => setDeposit(Number(e.target.value))} required />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="leaseStart">Lease Start Date *</Label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                            <Input id="leaseStart" type="date" className="pl-9" value={leaseStart} onChange={e => setLeaseStart(e.target.value)} required />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="leaseEnd">Lease End Date *</Label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                            <Input id="leaseEnd" type="date" className="pl-9" value={leaseEnd} onChange={e => setLeaseEnd(e.target.value)} required />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="dueDate">Rent Due Day *</Label>
                                    <Select value={dueDate} onValueChange={v => setDueDate(v)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select due date" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                                                <SelectItem key={day} value={day.toString()}>
                                                    Day {day} of each month
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </TabsContent>

                            <TabsContent value="emergency" className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="emergencyName">Emergency Contact Name *</Label>
                                    <Input id="emergencyName" placeholder="Full name" value={emContactName} onChange={e => setEmContactName(e.target.value)} required />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="emergencyPhone">Emergency Contact Phone *</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                        <Input id="emergencyPhone" placeholder="+254 712 345 678" className="pl-9" value={emContactPhone} onChange={e => setEmContactPhone(e.target.value)} required />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="relationship">Relationship *</Label>
                                    <Select value={emRelationship} onValueChange={v => setEmRelationship(v)} required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select relationship" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="spouse">Spouse</SelectItem>
                                            <SelectItem value="parent">Parent</SelectItem>
                                            <SelectItem value="sibling">Sibling</SelectItem>
                                            <SelectItem value="friend">Friend</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </TabsContent>
                        </Tabs>

                        <div className="mt-6 p-4 bg-blue-50 rounded-lg flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div className="text-sm text-blue-800">
                                <p className="font-medium">SMS Notifications Enabled</p>
                                <p className="text-blue-600">This tenant will receive automated rent reminders via SMS on the due date.</p>
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    Adding Tenant...
                                </div>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    Add Tenant
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}