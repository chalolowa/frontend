'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
    Mail,
    Phone,
    MapPin,
    Building2,
    Calendar,
    Clock,
    Edit2,
    Save,
    LogOut
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { auth, db } from '@/lib/firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { signOut, updateProfile } from 'firebase/auth'
import { api } from '@/lib/api'

interface UserData {
    uid: string
    email: string
    firstName: string
    lastName: string
    fullName: string
    phone: string
    company: string
    photoURL?: string
    createdAt: string
    landlordId?: string
    businessAddress?: string
    taxId?: string
}

type Stats = {
    properties?: { total?: number; occupancy_rate?: number }
    tenants?: { active?: number }
    payments?: { monthly_total?: number; overdue_payments?: number }
}

export default function ProfilePage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [userData, setUserData] = useState<UserData | null>(null)
    const [editedData, setEditedData] = useState<Partial<UserData>>({})
    const [stats, setStats] = useState<Stats | null>(null)

    useEffect(() => {
        const loadUserData = async () => {
            try {
                const user = auth.currentUser
                if (!user) {
                    router.push('/login')
                    return
                }

                // Get user data from Firestore
                const userDoc = await getDoc(doc(db, 'landlords', user.uid))

                if (userDoc.exists()) {
                    const data = userDoc.data() as UserData
                    setUserData(data)
                    setEditedData(data)
                }

                // Fetch dashboard stats from backend
                try {
                    const statsResponse = await api.get('/landlords/dashboard/stats')
                    setStats(statsResponse.data)
                } catch (error) {
                    console.warn('Could not fetch stats:', error)
                }

            } catch (error) {
                console.error('Error loading user data:', error)
                toast.error('Failed to load profile')
            } finally {
                setIsLoading(false)
            }
        }

        loadUserData()
    }, [router])

    const handleInputChange = (field: keyof UserData, value: string) => {
        setEditedData(prev => ({ ...prev, [field]: value }))
    }

    const handleSave = async () => {
        if (!userData || !auth.currentUser) return

        setIsSaving(true)

        try {
            // Update Firestore
            const userRef = doc(db, 'landlords', userData.uid)
            await updateDoc(userRef, {
                firstName: editedData.firstName,
                lastName: editedData.lastName,
                fullName: `${editedData.firstName} ${editedData.lastName}`,
                phone: editedData.phone,
                company: editedData.company,
                businessAddress: editedData.businessAddress,
                taxId: editedData.taxId
            })

            // Update Firebase Auth profile if name changed
            if (auth.currentUser.displayName !== `${editedData.firstName} ${editedData.lastName}`) {
                await updateProfile(auth.currentUser, {
                    displayName: `${editedData.firstName} ${editedData.lastName}`
                })
            }

            // Update local state
            setUserData({
                ...userData,
                ...editedData,
                fullName: `${editedData.firstName} ${editedData.lastName}`
            })

            // Update localStorage
            localStorage.setItem('user', JSON.stringify({
                ...userData,
                ...editedData,
                fullName: `${editedData.firstName} ${editedData.lastName}`
            }))

            toast.success('Profile updated successfully')
            setIsEditing(false)

        } catch (error) {
            console.error('Error updating profile:', error)
            toast.error('Failed to update profile')
        } finally {
            setIsSaving(false)
        }
    }

    const handleLogout = async () => {
        try {
            await signOut(auth)
            localStorage.removeItem('authToken')
            localStorage.removeItem('landlordId')
            localStorage.removeItem('user')
            router.push('/')
            toast.success('Logged out successfully')
        } catch (error) {
            console.error('Logout error:', error)
            toast.error('Failed to logout')
        }
    }

    const getInitials = () => {
        if (!userData) return 'U'
        return `${userData.firstName?.[0] || ''}${userData.lastName?.[0] || ''}`.toUpperCase()
    }

    const getProfileCompletion = () => {
        if (!userData) return 0
        let completed = 0
        const fields = ['firstName', 'lastName', 'email', 'phone', 'company', 'businessAddress', 'taxId']
        fields.forEach(field => {
            if (userData[field as keyof UserData]) completed += 100 / fields.length
        })
        return Math.round(completed)
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    if (!userData) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">User data not found</p>
                <Button onClick={() => router.push('/')} className="mt-4">
                    Go Home
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Profile Header */}
            <div className="relative h-48 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg overflow-hidden">
                <div className="absolute bottom-0 left-0 p-6 flex items-end gap-6">
                    <Avatar className="h-24 w-24 border-4 border-white">
                        <AvatarImage src={userData.photoURL} />
                        <AvatarFallback>{getInitials()}</AvatarFallback>
                    </Avatar>
                    <div className="text-white">
                        <h1 className="text-2xl font-bold">{userData.fullName}</h1>
                        <p className="text-white/80">
                            Property Manager • {stats?.properties?.total || 0} properties
                        </p>
                    </div>
                </div>
                <div className="absolute top-4 right-4 flex gap-2">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setIsEditing(!isEditing)}
                    >
                        <Edit2 className="h-4 w-4 mr-2" />
                        {isEditing ? 'Cancel' : 'Edit Profile'}
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleLogout}
                    >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Contact Info */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Contact Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Mail className="h-4 w-4 text-gray-400" />
                                <span className="text-sm">{userData.email}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="h-4 w-4 text-gray-400" />
                                <span className="text-sm">{userData.phone || 'Not provided'}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <MapPin className="h-4 w-4 text-gray-400" />
                                <span className="text-sm">{userData.businessAddress || 'Nairobi, Kenya'}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Building2 className="h-4 w-4 text-gray-400" />
                                <span className="text-sm">{userData.company || 'Independent'}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Account Stats</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500">Member since</p>
                                <p className="font-medium flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                    {new Date(userData.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Last active</p>
                                <p className="font-medium flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-gray-400" />
                                    Just now
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Profile completion</p>
                                <Progress value={getProfileCompletion()} className="h-2 mt-2" />
                                <p className="text-xs text-gray-500 mt-1">{getProfileCompletion()}% complete</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Details and Activity */}
                <div className="lg:col-span-2 space-y-6">
                    {isEditing ? (
                        <Card>
                            <CardHeader>
                                <CardTitle>Edit Profile</CardTitle>
                                <CardDescription>Update your personal information</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>First Name</Label>
                                        <Input 
                                            value={editedData.firstName || ''}
                                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Last Name</Label>
                                        <Input 
                                            value={editedData.lastName || ''}
                                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <Input 
                                        type="email" 
                                        value={userData.email}
                                        disabled 
                                        className="bg-gray-50"
                                    />
                                    <p className="text-xs text-gray-500">Email cannot be changed</p>
                                </div>

                                <div className="space-y-2">
                                    <Label>Phone</Label>
                                    <Input 
                                        value={editedData.phone || ''}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                        placeholder="+254 712 345 678"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Company</Label>
                                    <Input 
                                        value={editedData.company || ''}
                                        onChange={(e) => handleInputChange('company', e.target.value)}
                                        placeholder="Your property management company"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Business Address</Label>
                                    <Input 
                                        value={editedData.businessAddress || ''}
                                        onChange={(e) => handleInputChange('businessAddress', e.target.value)}
                                        placeholder="Nairobi, Kenya"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Tax ID / Business Registration</Label>
                                    <Input 
                                        value={editedData.taxId || ''}
                                        onChange={(e) => handleInputChange('taxId', e.target.value)}
                                        placeholder="P0512345678"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Bio</Label>
                                    <textarea
                                        className="w-full min-h-[100px] p-3 border rounded-lg"
                                        defaultValue="Experienced property manager with 5+ years in residential real estate."
                                    />
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setIsEditing(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleSave} disabled={isSaving}>
                                    {isSaving ? (
                                        <>
                                            <span className="animate-spin mr-2">⏳</span>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4 mr-2" />
                                            Save Changes
                                        </>
                                    )}
                                </Button>
                            </CardFooter>
                        </Card>
                    ) : (
                        <>
                            <Card>
                                <CardHeader>
                                    <CardTitle>About</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600">
                                        {userData.company ? 
                                            `${userData.fullName} manages properties through ${userData.company}.` :
                                            `${userData.fullName} is an independent property manager.`
                                        }
                                        {stats && ` Currently managing ${stats.properties?.total ?? 0} properties with ${stats.tenants?.active ?? 0} active tenants.`}
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Professional Achievements</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex gap-2 flex-wrap">
                                        {stats && (stats?.properties?.occupancy_rate ?? 0) > 90 && (
                                            <Badge className="bg-green-100 text-green-800">High Occupancy Rate</Badge>
                                        )}
                                        {stats && (stats.payments?.overdue_payments ?? 0) === 0 && (
                                            <Badge className="bg-blue-100 text-blue-800">Perfect Payment Record</Badge>
                                        )}
                                        <Badge className="bg-purple-100 text-purple-800">Verified Landlord</Badge>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Quick Stats */}
                            {stats && (
                                <div className="grid grid-cols-3 gap-4">
                                    <Card>
                                        <CardContent className="p-4 text-center">
                                            <p className="text-2xl font-bold text-blue-600">{stats.properties?.total ?? 0}</p>
                                            <p className="text-xs text-gray-500">Properties</p>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardContent className="p-4 text-center">
                                            <p className="text-2xl font-bold text-green-600">{stats.tenants?.active ?? 0}</p>
                                            <p className="text-xs text-gray-500">Active Tenants</p>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardContent className="p-4 text-center">
                                            <p className="text-2xl font-bold text-purple-600">
                                                KES {(stats.payments?.monthly_total ?? 0).toLocaleString()}
                                            </p>
                                            <p className="text-xs text-gray-500">Monthly Revenue</p>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}