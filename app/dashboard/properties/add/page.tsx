'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import {api} from "@/lib/api";

export default function AddPropertyPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [name, setName] = useState('')
    const [address, setAddress] = useState('')
    const [totalUnits, setTotalUnits] = useState(1)
    const [monthlyRent, setMonthlyRent] = useState(0)
    const [description, setDescription] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const payload = {
                name,
                address,
                total_units: totalUnits,
                // the UI asks for 'monthlyRent' but backend expects units or will
                // compute monthly_rent_total; we can send a single unit entry if
                // the owner provided this value.
                units: totalUnits > 0 ? [
                    {
                        unit_number: 'Unit 1',
                        monthly_rent: monthlyRent
                    }
                ] : []
            }
            await api.post('/properties', payload)

            toast.success('Property added successfully!', {
                description: 'You can now add tenants to this property.'
            })
            router.push('/dashboard/properties')
        } catch (err) {
            console.error('Failed to create property', err)
            toast.error('Failed to add property')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6">
                <Link
                    href="/dashboard/properties"
                    className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
                >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to Properties
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Add New Property</CardTitle>
                    <CardDescription>
                        Enter the details of your property to start managing it.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Property Name</Label>
                            <Input
                                id="name"
                                placeholder="e.g., Sunset Apartments"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Input
                                id="address"
                                placeholder="Street address, city, country"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="units">Total Units</Label>
                                <Input
                                    id="units"
                                    type="number"
                                    min="1"
                                    placeholder="5"
                                    value={totalUnits}
                                    onChange={(e) => setTotalUnits(Number(e.target.value))}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="rent">Monthly Rent ($)</Label>
                                <Input
                                    id="rent"
                                    type="number"
                                    min="0"
                                    step="100"
                                    placeholder="1500"
                                    value={monthlyRent}
                                    onChange={(e) => setMonthlyRent(Number(e.target.value))}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description (Optional)</Label>
                            <Input
                                id="description"
                                placeholder="Any additional details about the property"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
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
                                    Saving...
                                </div>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    Save Property
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}