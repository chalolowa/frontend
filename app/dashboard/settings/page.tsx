'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import {
    Settings as SettingsIcon,
    User,
    Bell,
    CreditCard,
    MessageSquare,
    Globe,
    Shield,
    Smartphone,
    Webhook,
    Database,
    Users,
    Building2,
    Mail,
    Phone,
    Key,
    Save,
    RefreshCw,
    AlertCircle,
    CheckCircle2,
    XCircle,
    Eye,
    EyeOff,
    Copy,
    Zap,
    Link as LinkIcon,
    TestTube,
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
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

export default function SettingsPage() {
    const [isLoading, setIsLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('profile')

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800)
        return () => clearTimeout(timer)
    }, [])

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
                    <ProfileSettings />
                </TabsContent>

                {/* Notifications Tab */}
                <TabsContent value="notifications">
                    <NotificationSettings />
                </TabsContent>

                {/* SMS & USSD Tab */}
                <TabsContent value="sms">
                    <SMSSettings />
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
function ProfileSettings() {
    const [isSaving, setIsSaving] = useState(false)

    const handleSave = async () => {
        setIsSaving(true)
        await new Promise(resolve => setTimeout(resolve, 1500))
        toast.success('Profile updated successfully')
        setIsSaving(false)
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
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>JD</AvatarFallback>
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
                            <Input id="firstName" defaultValue="John" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input id="lastName" defaultValue="Doe" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" defaultValue="john.doe@example.com" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" defaultValue="+254 712 345 678" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="company">Company/Business Name</Label>
                        <Input id="company" defaultValue="Doe Properties Ltd" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="taxId">Tax ID / Business Registration</Label>
                        <Input id="taxId" defaultValue="P0512345678" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address">Business Address</Label>
                        <Input id="address" defaultValue="123 Business District, Nairobi" />
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
                        <p className="font-medium">January 15, 2024</p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Properties</p>
                        <p className="font-medium">5 Properties • 12 Units</p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Tenants</p>
                        <p className="font-medium">8 Active Tenants</p>
                    </div>

                    <Separator />

                    <div>
                        <p className="text-sm text-gray-500 mb-2">Storage Used</p>
                        <Progress value={45} className="h-2" />
                        <p className="text-xs text-gray-500 mt-1">45% of 10GB used</p>
                    </div>

                    <Button variant="outline" className="w-full">
                        Upgrade Plan
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}

// Notification Settings Component
function NotificationSettings() {
    const [settings, setSettings] = useState({
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
        toast.success('Notification preference updated')
    }

    return (
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

            <Card className="lg:col-span-2">
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
            </Card>
        </div>
    )
}

// SMS & USSD Settings Component
function SMSSettings() {
    const [isSaving, setIsSaving] = useState(false)
    const [testNumber, setTestNumber] = useState('')

    const handleSave = async () => {
        setIsSaving(true)
        await new Promise(resolve => setTimeout(resolve, 1500))
        toast.success('SMS settings updated successfully')
        setIsSaving(false)
    }

    const handleTestSMS = () => {
        if (!testNumber) {
            toast.error('Please enter a phone number')
            return
        }
        toast.success(`Test SMS sent to ${testNumber}`)
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
                            defaultValue="Dear {tenant_name}, your rent of KES {amount} for {property_name} is due on {due_date}. Please make payment to avoid late fees. Reply with *182* to pay via M-Pesa."
                        />
                        <p className="text-xs text-gray-500">
                            Available variables: {'{tenant_name}'}, {'{amount}'}, {'{due_date}'}, {'{property_name}'}, {'{balance}'}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label>Payment Confirmation Template</Label>
                        <textarea
                            className="w-full min-h-[100px] p-3 border rounded-lg text-sm"
                            defaultValue="Thank you {tenant_name}! We've received your rent payment of KES {amount} for {property_name}. Receipt #{receipt_number} has been sent to your email."
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Overdue Reminder Template</Label>
                        <textarea
                            className="w-full min-h-[100px] p-3 border rounded-lg text-sm"
                            defaultValue="URGENT: {tenant_name}, your rent payment of KES {amount} for {property_name} is now {days_overdue} days overdue. Please pay immediately to avoid further action. Pay now: *384*123456#"
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
                            <Input id="ussdCode" placeholder="*384*123456#" defaultValue="*384*123456#" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="ussdType">Service Type</Label>
                            <Select defaultValue="basic">
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
                            <p>CON Welcome to RentFlow</p>
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
function SecuritySettings() {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isChangingPassword, setIsChangingPassword] = useState(false)
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)

    const handleChangePassword = async () => {
        setIsChangingPassword(true)
        await new Promise(resolve => setTimeout(resolve, 1500))
        toast.success('Password changed successfully')
        setIsChangingPassword(false)
    }

    const sessions = [
        {
            device: 'Chrome on MacBook Pro',
            location: 'Nairobi, Kenya',
            ip: '192.168.1.100',
            lastActive: 'Now',
            current: true,
        },
        {
            device: 'Safari on iPhone',
            location: 'Mombasa, Kenya',
            ip: '192.168.1.101',
            lastActive: '2 hours ago',
            current: false,
        },
        {
            device: 'Firefox on Windows',
            location: 'Kisumu, Kenya',
            ip: '192.168.1.102',
            lastActive: '2 days ago',
            current: false,
        },
    ]

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

                    <div className="space-y-2">
                        <p className="text-sm font-medium">Password Requirements:</p>
                        <ul className="text-sm text-gray-500 space-y-1">
                            <li className="flex items-center gap-2">
                                <CheckCircle2 className="h-3 w-3 text-green-500" />
                                At least 8 characters
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle2 className="h-3 w-3 text-green-500" />
                                Contains uppercase and lowercase letters
                            </li>
                            <li className="flex items-center gap-2">
                                <XCircle className="h-3 w-3 text-red-500" />
                                Contains at least one number
                            </li>
                            <li className="flex items-center gap-2">
                                <XCircle className="h-3 w-3 text-red-500" />
                                Contains at least one special character
                            </li>
                        </ul>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleChangePassword} disabled={isChangingPassword}>
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

            {/* Active Sessions */}
            <Card>
                <CardHeader>
                    <CardTitle>Active Sessions</CardTitle>
                    <CardDescription>
                        Devices currently logged into your account
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {sessions.map((session, index) => (
                        <div key={index} className="flex items-start justify-between">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <p className="font-medium text-sm">{session.device}</p>
                                    {session.current && (
                                        <Badge className="bg-green-100 text-green-800 text-xs">Current</Badge>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500">{session.location} • {session.ip}</p>
                                <p className="text-xs text-gray-400">Last active: {session.lastActive}</p>
                            </div>
                            {!session.current && (
                                <Button variant="ghost" size="sm" className="text-red-600">
                                    Revoke
                                </Button>
                            )}
                        </div>
                    ))}
                </CardContent>
                <CardFooter>
                    <Button variant="outline" className="w-full">
                        Sign Out All Other Devices
                    </Button>
                </CardFooter>
            </Card>

            {/* Login History */}
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
                                <TableCell>2024-02-01 09:30 AM</TableCell>
                                <TableCell>Chrome on MacBook Pro</TableCell>
                                <TableCell>Nairobi, Kenya</TableCell>
                                <TableCell>192.168.1.100</TableCell>
                                <TableCell>
                                    <Badge className="bg-green-100 text-green-800">Successful</Badge>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>2024-01-31 08:15 PM</TableCell>
                                <TableCell>Safari on iPhone</TableCell>
                                <TableCell>Mombasa, Kenya</TableCell>
                                <TableCell>192.168.1.101</TableCell>
                                <TableCell>
                                    <Badge className="bg-green-100 text-green-800">Successful</Badge>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>2024-01-30 11:45 AM</TableCell>
                                <TableCell>Firefox on Windows</TableCell>
                                <TableCell>Unknown Location</TableCell>
                                <TableCell>203.45.67.89</TableCell>
                                <TableCell>
                                    <Badge className="bg-red-100 text-red-800">Failed Attempt</Badge>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}