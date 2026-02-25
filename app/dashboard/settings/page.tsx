'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
    User,
    Bell,
    MessageSquare,
    Shield,
    Save,
    RefreshCw,
    CheckCircle2,
    XCircle,
    Eye,
    EyeOff,
    Key,
    Mail,
    Calendar,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { auth, db } from '@/lib/firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth'
import { api } from '@/lib/api'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";

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
    notificationSettings?: {
        emailNotifications: boolean
        smsNotifications: boolean
        paymentReminders: boolean
        leaseExpiryReminders: boolean
        maintenanceAlerts: boolean
        marketingEmails: boolean
        weeklyReports: boolean
        monthlyStatements: boolean
    }
    smsSettings?: {
        paymentReminderTemplate: string
        paymentConfirmationTemplate: string
        overdueReminderTemplate: string
        ussdCode: string
        ussdType: string
    }
}

type DashboardStats = {
    properties?: { total?: number; total_units?: number }
    tenants?: { active?: number }
}

export default function SettingsPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('profile')
    const [userData, setUserData] = useState<UserData | null>(null)
    const [stats, setStats] = useState<DashboardStats | null>(null)

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
                toast.error('Failed to load settings')
            } finally {
                setIsLoading(false)
            }
        }

        loadUserData()
    }, [router])

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
            {/* Header */}
            <div>
                <h1 className="text-2xl md:text-3xl font-bold">Settings</h1>
                <p className="text-gray-500 mt-1">Manage your account, integrations, and preferences</p>
            </div>

            {/* Settings Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 gap-2 h-auto p-1">
                    <TabsTrigger value="profile" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span className="hidden lg:inline">Profile</span>
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="flex items-center gap-2">
                        <Bell className="h-4 w-4" />
                        <span className="hidden lg:inline">Notifications</span>
                    </TabsTrigger>
                    <TabsTrigger value="sms" className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        <span className="hidden lg:inline">SMS & USSD</span>
                    </TabsTrigger>
                    <TabsTrigger value="security" className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        <span className="hidden lg:inline">Security</span>
                    </TabsTrigger>
                </TabsList>

                {/* Profile Tab */}
                <TabsContent value="profile">
                    <ProfileSettings userData={userData} stats={stats} />
                </TabsContent>

                {/* Notifications Tab */}
                <TabsContent value="notifications">
                    <NotificationSettings userData={userData} />
                </TabsContent>

                {/* SMS & USSD Tab */}
                <TabsContent value="sms">
                    <SMSSettings userData={userData} />
                </TabsContent>

                {/* Security Tab */}
                <TabsContent value="security">
                    <SecuritySettings />
                </TabsContent>
            </Tabs>
        </div>
    )
}

// Profile Settings Component
function ProfileSettings({ userData, stats }: { userData: UserData; stats: DashboardStats | null }) {
    const [isSaving, setIsSaving] = useState(false)
    const [localUserData, setUserData] = useState<UserData>(userData)
    const [editedData, setEditedData] = useState({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        phone: userData.phone || '',
        company: userData.company || '',
        businessAddress: userData.businessAddress || '',
        taxId: userData.taxId || '',
    })

    const handleInputChange = (field: keyof typeof editedData, value: string) => {
        setEditedData(prev => ({ ...prev, [field]: value }))
    }

    const handleSave = async () => {
        setIsSaving(true)

        try {
            const user = auth.currentUser
            if (!user) {
                console.error('Not authenticated')
                return
            }

            // Update Firestore
            const userRef = doc(db, 'landlords', user.uid)
            await updateDoc(userRef, {
                firstName: editedData.firstName,
                lastName: editedData.lastName,
                fullName: `${editedData.firstName} ${editedData.lastName}`,
                phone: editedData.phone,
                company: editedData.company,
                businessAddress: editedData.businessAddress,
                taxId: editedData.taxId,
            })

            // Update local storage and state
            const updatedUser = {
                ...localUserData,
                ...editedData,
                fullName: `${editedData.firstName} ${editedData.lastName}`
            }
            localStorage.setItem('user', JSON.stringify(updatedUser))
            setUserData(updatedUser)

            toast.success('Profile updated successfully')
        } catch (error) {
            console.error('Error updating profile:', error)
            toast.error('Failed to update profile')
        } finally {
            setIsSaving(false)
        }
    }

    const getInitials = () => {
        return `${localUserData.firstName?.[0] || ''}${localUserData.lastName?.[0] || ''}`.toUpperCase()
    }

    const getProfileCompletion = () => {
        let completed = 0
        const fields = ['firstName', 'lastName', 'email', 'phone', 'company', 'businessAddress', 'taxId']
        fields.forEach(field => {
            if (localUserData[field as keyof UserData]) completed += 100 / fields.length
        })
        return Math.round(completed)
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Information */}
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                        Update your personal information and contact details
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-4 mb-6">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={userData.photoURL} />
                            <AvatarFallback>{getInitials()}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-2">
                            <Button variant="outline" size="sm">
                                Change Avatar
                            </Button>
                            <p className="text-xs text-gray-500">
                                JPG, GIF or PNG. Max size 2MB.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                                id="firstName"
                                value={editedData.firstName}
                                onChange={(e) => handleInputChange('firstName', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                id="lastName"
                                value={editedData.lastName}
                                onChange={(e) => handleInputChange('lastName', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            value={userData.email}
                            disabled
                            className="bg-gray-50"
                        />
                        <p className="text-xs text-gray-500">Email cannot be changed</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                            id="phone"
                            value={editedData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            placeholder="+254 712 345 678"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="company">Company/Business Name</Label>
                        <Input
                            id="company"
                            value={editedData.company}
                            onChange={(e) => handleInputChange('company', e.target.value)}
                            placeholder="Your property management company"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="taxId">Tax ID / Business Registration</Label>
                        <Input
                            id="taxId"
                            value={editedData.taxId}
                            onChange={(e) => handleInputChange('taxId', e.target.value)}
                            placeholder="P0512345678"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address">Business Address</Label>
                        <Input
                            id="address"
                            value={editedData.businessAddress}
                            onChange={(e) => handleInputChange('businessAddress', e.target.value)}
                            placeholder="123 Business District, Nairobi"
                        />
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? (
                            <>
                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
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

            {/* Account Summary */}
            <Card>
                <CardHeader>
                    <CardTitle>Account Summary</CardTitle>
                    <CardDescription>Your account at a glance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <p className="text-sm text-gray-500">Account Type</p>
                        <p className="font-medium flex items-center gap-2">
                            Professional Plan
                            <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Member Since</p>
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
                        <p className="text-sm text-gray-500">Properties</p>
                        <p className="font-medium">
                            {stats?.properties?.total || 0} Properties • {stats?.properties?.total_units || 0} Units
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Tenants</p>
                        <p className="font-medium">{stats?.tenants?.active || 0} Active Tenants</p>
                    </div>

                    <Separator />

                    <div>
                        <p className="text-sm text-gray-500 mb-2">Profile Completion</p>
                        <Progress value={getProfileCompletion()} className="h-2" />
                        <p className="text-xs text-gray-500 mt-1">{getProfileCompletion()}% complete</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

// Notification Settings Component
function NotificationSettings({ userData }: { userData: UserData }) {
    const [isSaving, setIsSaving] = useState(false)
    const [settings, setSettings] = useState(userData.notificationSettings || {
        emailNotifications: true,
        smsNotifications: true,
        paymentReminders: true,
        leaseExpiryReminders: true,
        maintenanceAlerts: true,
        marketingEmails: false,
        weeklyReports: true,
        monthlyStatements: true,
    })

    const handleToggle = (key: keyof typeof settings) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }))
    }

    const handleSave = async () => {
        setIsSaving(true)

        try {
            const user = auth.currentUser
            if (!user) throw new Error('Not authenticated')

            // Update Firestore
            const userRef = doc(db, 'landlords', user.uid)
            await updateDoc(userRef, {
                notificationSettings: settings
            })

            toast.success('Notification preferences updated')
        } catch (error) {
            console.error('Error saving notification settings:', error)
            toast.error('Failed to save settings')
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Notification Channels</CardTitle>
                        <CardDescription>Choose how you want to receive notifications</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base">Email Notifications</Label>
                                <p className="text-sm text-gray-500">Receive updates via email</p>
                            </div>
                            <Switch
                                checked={settings.emailNotifications}
                                onCheckedChange={() => handleToggle('emailNotifications')}
                            />
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base">SMS Notifications</Label>
                                <p className="text-sm text-gray-500">Get text messages for urgent alerts</p>
                            </div>
                            <Switch
                                checked={settings.smsNotifications}
                                onCheckedChange={() => handleToggle('smsNotifications')}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Alert Preferences</CardTitle>
                        <CardDescription>Customize which alerts you receive</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base">Payment Reminders</Label>
                                <p className="text-sm text-gray-500">Get notified when payments are due</p>
                            </div>
                            <Switch
                                checked={settings.paymentReminders}
                                onCheckedChange={() => handleToggle('paymentReminders')}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base">Lease Expiry</Label>
                                <p className="text-sm text-gray-500">Reminders for upcoming lease renewals</p>
                            </div>
                            <Switch
                                checked={settings.leaseExpiryReminders}
                                onCheckedChange={() => handleToggle('leaseExpiryReminders')}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base">Maintenance Alerts</Label>
                                <p className="text-sm text-gray-500">Get notified about maintenance requests</p>
                            </div>
                            <Switch
                                checked={settings.maintenanceAlerts}
                                onCheckedChange={() => handleToggle('maintenanceAlerts')}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Report Schedule</CardTitle>
                    <CardDescription>Configure automatic report generation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base">Weekly Reports</Label>
                            <p className="text-sm text-gray-500">Receive weekly income and occupancy reports</p>
                        </div>
                        <Switch
                            checked={settings.weeklyReports}
                            onCheckedChange={() => handleToggle('weeklyReports')}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base">Monthly Statements</Label>
                            <p className="text-sm text-gray-500">Get detailed monthly financial statements</p>
                        </div>
                        <Switch
                            checked={settings.monthlyStatements}
                            onCheckedChange={() => handleToggle('monthlyStatements')}
                        />
                    </div>

                    <div className="pt-4">
                        <Label htmlFor="reportTime">Delivery Time</Label>
                        <Select defaultValue="09:00">
                            <SelectTrigger className="w-full mt-1">
                                <SelectValue placeholder="Select time" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="00:00">12:00 AM</SelectItem>
                                <SelectItem value="09:00">9:00 AM</SelectItem>
                                <SelectItem value="12:00">12:00 PM</SelectItem>
                                <SelectItem value="17:00">5:00 PM</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? (
                            <>
                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4 mr-2" />
                                Save Settings
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

// SMS & USSD Settings Component
function SMSSettings({ userData }: { userData: UserData }) {
    const [isSaving, setIsSaving] = useState(false)
    const [testNumber, setTestNumber] = useState('')
    const [settings, setSettings] = useState(userData.smsSettings || {
        paymentReminderTemplate: "Dear {tenant_name}, your rent of KES {amount} for {property_name} is due on {due_date}. Please make payment to avoid late fees. Dial *384*123456# to pay via M-Pesa.",
        paymentConfirmationTemplate: "Thank you {tenant_name}! We've received your rent payment of KES {amount} for {property_name}. Receipt #{receipt_number} has been sent to your email.",
        overdueReminderTemplate: "URGENT: {tenant_name}, your rent payment of KES {amount} for {property_name} is now {days_overdue} days overdue. Please pay immediately to avoid further action. Pay now: *384*123456#",
        ussdCode: "*384*123456#",
        ussdType: "basic",
    })

    const handleInputChange = (field: keyof typeof settings, value: string) => {
        setSettings(prev => ({ ...prev, [field]: value }))
    }

    const handleSave = async () => {
        setIsSaving(true)

        try {
            const user = auth.currentUser
            if (!user) throw new Error('Not authenticated')

            // Update Firestore
            const userRef = doc(db, 'landlords', user.uid)
            await updateDoc(userRef, {
                smsSettings: settings
            })

            toast.success('SMS settings updated successfully')
        } catch (error) {
            console.error('Error saving SMS settings:', error)
            toast.error('Failed to save settings')
        } finally {
            setIsSaving(false)
        }
    }

    const handleTestSMS = () => {
        if (!testNumber) {
            toast.error('Please enter a phone number')
            return
        }

        // In production, this would call the backend to send a test SMS
        toast.success(`Test SMS would be sent to ${testNumber}`, {
            description: "In production, this would send a real SMS via Africa's Talking"
        })
        setTestNumber('')
    }

    return (
        <div className="space-y-6">
            {/* SMS Templates */}
            <Card>
                <CardHeader>
                    <CardTitle>SMS Templates</CardTitle>
                    <CardDescription>
                        Customize the SMS messages sent to tenants
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Payment Reminder Template</Label>
                        <textarea
                            className="w-full min-h-[100px] p-3 border rounded-lg text-sm"
                            value={settings.paymentReminderTemplate}
                            onChange={(e) => handleInputChange('paymentReminderTemplate', e.target.value)}
                        />
                        <p className="text-xs text-gray-500">
                            Available variables: {'{tenant_name}'}, {'{amount}'}, {'{due_date}'}, {'{property_name}'}, {'{balance}'}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label>Payment Confirmation Template</Label>
                        <textarea
                            className="w-full min-h-[100px] p-3 border rounded-lg text-sm"
                            value={settings.paymentConfirmationTemplate}
                            onChange={(e) => handleInputChange('paymentConfirmationTemplate', e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Overdue Reminder Template</Label>
                        <textarea
                            className="w-full min-h-[100px] p-3 border rounded-lg text-sm"
                            value={settings.overdueReminderTemplate}
                            onChange={(e) => handleInputChange('overdueReminderTemplate', e.target.value)}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* USSD Configuration */}
            <Card>
                <CardHeader>
                    <CardTitle>USSD Service Configuration</CardTitle>
                    <CardDescription>
                        Set up USSD codes for tenant self-service
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="ussdCode">USSD Short Code</Label>
                            <Input
                                id="ussdCode"
                                value={settings.ussdCode}
                                onChange={(e) => handleInputChange('ussdCode', e.target.value)}
                                placeholder="*384*123456#"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="ussdType">Service Type</Label>
                            <Select
                                value={settings.ussdType}
                                onValueChange={(value) => handleInputChange('ussdType', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="basic">Basic (Menu-based)</SelectItem>
                                    <SelectItem value="advanced">Advanced (Payment enabled)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>USSD Menu Structure</Label>
                        <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm">
                            <p>CON Welcome to Landlord254</p>
                            <p>1. Check Balance</p>
                            <p>2. Make Payment</p>
                            <p>3. View Due Date</p>
                            <p>4. Report Issue</p>
                            <p>0. Talk to Agent</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Test SMS */}
            <Card>
                <CardHeader>
                    <CardTitle>Test SMS Configuration</CardTitle>
                    <CardDescription>
                        Send a test message to verify your setup
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-2">
                        <Input
                            placeholder="Enter phone number (e.g., +254712345678)"
                            value={testNumber}
                            onChange={(e) => setTestNumber(e.target.value)}
                        />
                        <Button onClick={handleTestSMS} variant="outline">
                            <Mail className="h-4 w-4 mr-2" />
                            Send Test
                        </Button>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? (
                            <>
                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4 mr-2" />
                                Save SMS Settings
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

// Security Settings Component
function SecuritySettings(): React.ReactNode {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isChangingPassword, setIsChangingPassword] = useState(false)
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: ''
    })

    const handlePasswordChange = (field: keyof typeof passwords, value: string) => {
        setPasswords(prev => ({ ...prev, [field]: value }))
    }

    const handleChangePassword = async () => {
        if (passwords.new !== passwords.confirm) {
            toast.error('New passwords do not match')
            return
        }

        if (passwords.new.length < 8) {
            toast.error('Password must be at least 8 characters')
            return
        }

        setIsChangingPassword(true)

        try {
            const user = auth.currentUser
            if (!user || !user.email) throw new Error('Not authenticated')

            // Re-authenticate user
            const credential = EmailAuthProvider.credential(user.email, passwords.current)
            await reauthenticateWithCredential(user, credential)

            // Update password
            await updatePassword(user, passwords.new)

            toast.success('Password changed successfully')
            setPasswords({ current: '', new: '', confirm: '' })

        } catch (error) {
            console.error('Error changing password:', error)

            toast.error('Failed to reset password!')
        } finally {
            setIsChangingPassword(false)
        }
    }

    const passwordStrength = () => {
        const password = passwords.new
        if (!password) return 0
        let strength = 0
        if (password.length >= 8) strength += 25
        if (/[A-Z]/.test(password)) strength += 25
        if (/[0-9]/.test(password)) strength += 25
        if (/[^A-Za-z0-9]/.test(password)) strength += 25
        return strength
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Change Password */}
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>
                        Update your password to keep your account secure
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <div className="relative">
                            <Input
                                id="currentPassword"
                                type={showCurrentPassword ? "text" : "password"}
                                value={passwords.current}
                                onChange={(e) => handlePasswordChange('current', e.target.value)}
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1 h-8"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            >
                                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <div className="relative">
                            <Input
                                id="newPassword"
                                type={showNewPassword ? "text" : "password"}
                                value={passwords.new}
                                onChange={(e) => handlePasswordChange('new', e.target.value)}
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1 h-8"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                value={passwords.confirm}
                                onChange={(e) => handlePasswordChange('confirm', e.target.value)}
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1 h-8"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>

                    {passwords.new && (
                        <div className="space-y-2">
                            <p className="text-sm font-medium">Password Strength: {
                                passwordStrength() <= 25 ? 'Weak' :
                                    passwordStrength() <= 50 ? 'Fair' :
                                        passwordStrength() <= 75 ? 'Good' : 'Strong'
                            }</p>
                            <Progress value={passwordStrength()} className="h-2" />

                            <ul className="text-sm text-gray-500 space-y-1 mt-2">
                                <li className="flex items-center gap-2">
                                    {passwords.new.length >= 8 ?
                                        <CheckCircle2 className="h-3 w-3 text-green-500" /> :
                                        <XCircle className="h-3 w-3 text-red-500" />
                                    }
                                    At least 8 characters
                                </li>
                                <li className="flex items-center gap-2">
                                    {/[A-Z]/.test(passwords.new) ?
                                        <CheckCircle2 className="h-3 w-3 text-green-500" /> :
                                        <XCircle className="h-3 w-3 text-red-500" />
                                    }
                                    Contains uppercase letter
                                </li>
                                <li className="flex items-center gap-2">
                                    {/[0-9]/.test(passwords.new) ?
                                        <CheckCircle2 className="h-3 w-3 text-green-500" /> :
                                        <XCircle className="h-3 w-3 text-red-500" />
                                    }
                                    Contains number
                                </li>
                                <li className="flex items-center gap-2">
                                    {/[^A-Za-z0-9]/.test(passwords.new) ?
                                        <CheckCircle2 className="h-3 w-3 text-green-500" /> :
                                        <XCircle className="h-3 w-3 text-red-500" />
                                    }
                                    Contains special character
                                </li>
                            </ul>
                        </div>
                    )}
                </CardContent>
                <CardFooter>
                    <Button
                        onClick={handleChangePassword}
                        disabled={isChangingPassword || !passwords.current || !passwords.new || !passwords.confirm}
                    >
                        {isChangingPassword ? (
                            <>
                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                Updating...
                            </>
                        ) : (
                            <>
                                <Key className="h-4 w-4 mr-2" />
                                Change Password
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>

            {/* Two-Factor Authentication */}
            <Card>
                <CardHeader>
                    <CardTitle>Two-Factor Authentication</CardTitle>
                    <CardDescription>
                        Add an extra layer of security to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base">Enable 2FA</Label>
                            <p className="text-sm text-gray-500">
                                Secure your account with Google Authenticator
                            </p>
                        </div>
                        <Switch
                            checked={twoFactorEnabled}
                            onCheckedChange={setTwoFactorEnabled}
                        />
                    </div>

                    {twoFactorEnabled && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm mb-2">Scan this QR code with Google Authenticator:</p>
                            <div className="h-32 w-32 bg-gray-200 mx-auto mb-2 flex items-center justify-center">
                                [QR Code Placeholder]
                            </div>
                            <p className="text-xs text-gray-500">
                                Backup codes: 12345-67890-ABCDE-FGHIJ
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Recent Login Activity */}
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Recent Login Activity</CardTitle>
                    <CardDescription>
                        Review recent access to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date & Time</TableHead>
                                <TableHead>Device</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>IP Address</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell>{new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</TableCell>
                                <TableCell>Current Session</TableCell>
                                <TableCell>Loading...</TableCell>
                                <TableCell>-</TableCell>
                                <TableCell>
                                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <p className="text-sm text-gray-500 mt-4">
                        Login history is available in Firebase Console
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}