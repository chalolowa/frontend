'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import {
    User,
    Mail,
    Phone,
    MapPin,
    Building2,
    Calendar,
    Award,
    Clock,
    Edit2,
    Save,
    Camera,
    Link as LinkIcon,
    Twitter,
    Linkedin,
    Github,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    const handleSave = async () => {
        setIsSaving(true)
        await new Promise(resolve => setTimeout(resolve, 1500))
        toast.success('Profile updated successfully')
        setIsSaving(false)
        setIsEditing(false)
    }

    return (
        <div className="space-y-6">
            {/* Profile Header */}
            <div className="relative h-48 bg-linear-to-r from-blue-600 to-blue-400 rounded-lg overflow-hidden">
                <div className="absolute bottom-0 left-0 p-6 flex items-end gap-6">
                    <Avatar className="h-24 w-24 border-4 border-white">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div className="text-white">
                        <h1 className="text-2xl font-bold">John Doe</h1>
                        <p className="text-white/80">Property Manager • 5 properties</p>
                    </div>
                </div>
                <Button
                    variant="secondary"
                    size="sm"
                    className="absolute top-4 right-4"
                    onClick={() => setIsEditing(!isEditing)}
                >
                    <Edit2 className="h-4 w-4 mr-2" />
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                </Button>
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
                                <span className="text-sm">john.doe@example.com</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="h-4 w-4 text-gray-400" />
                                <span className="text-sm">+254 712 345 678</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <MapPin className="h-4 w-4 text-gray-400" />
                                <span className="text-sm">Nairobi, Kenya</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Building2 className="h-4 w-4 text-gray-400" />
                                <span className="text-sm">Doe Properties Ltd</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Social Links</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Button variant="outline" className="w-full justify-start">
                                <Twitter className="h-4 w-4 mr-2 text-blue-400" />
                                @johndoe
                            </Button>
                            <Button variant="outline" className="w-full justify-start">
                                <Linkedin className="h-4 w-4 mr-2 text-blue-600" />
                                john-doe
                            </Button>
                            <Button variant="outline" className="w-full justify-start">
                                <Github className="h-4 w-4 mr-2" />
                                johndoe
                            </Button>
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
                                    January 15, 2024
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Last active</p>
                                <p className="font-medium flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-gray-400" />
                                    2 minutes ago
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Profile completion</p>
                                <Progress value={85} className="h-2 mt-2" />
                                <p className="text-xs text-gray-500 mt-1">85% complete</p>
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
                                        <Input defaultValue="John" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Last Name</Label>
                                        <Input defaultValue="Doe" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <Input type="email" defaultValue="john.doe@example.com" />
                                </div>

                                <div className="space-y-2">
                                    <Label>Phone</Label>
                                    <Input defaultValue="+254 712 345 678" />
                                </div>

                                <div className="space-y-2">
                                    <Label>Company</Label>
                                    <Input defaultValue="Doe Properties Ltd" />
                                </div>

                                <div className="space-y-2">
                                    <Label>Location</Label>
                                    <Input defaultValue="Nairobi, Kenya" />
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
                                        Experienced property manager with over 5 years in residential real estate.
                                        Managing 5 properties across Nairobi, Mombasa, and Kisumu. Specializing in
                                        tenant relations and property maintenance.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Recent Activity</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <div className="h-2 w-2 bg-green-500 rounded-full mt-2"></div>
                                            <div>
                                                <p className="font-medium">New tenant added</p>
                                                <p className="text-sm text-gray-500">Grace Akinyi moved into Green Heights, Unit B2</p>
                                                <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                                            </div>
                                        </div>
                                        <Separator />
                                        <div className="flex items-start gap-3">
                                            <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
                                            <div>
                                                <p className="font-medium">Payment received</p>
                                                <p className="text-sm text-gray-500">$1,500 from John Mwangi - Sunset Apartments</p>
                                                <p className="text-xs text-gray-400 mt-1">Yesterday</p>
                                            </div>
                                        </div>
                                        <Separator />
                                        <div className="flex items-start gap-3">
                                            <div className="h-2 w-2 bg-yellow-500 rounded-full mt-2"></div>
                                            <div>
                                                <p className="font-medium">Maintenance request</p>
                                                <p className="text-sm text-gray-500">Plumbing issue at City View Plaza, Unit C3</p>
                                                <p className="text-xs text-gray-400 mt-1">2 days ago</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Professional Achievements</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex gap-2 flex-wrap">
                                        <Badge className="bg-blue-100 text-blue-800">Top Performer 2023</Badge>
                                        <Badge className="bg-green-100 text-green-800">100% Occupancy Rate</Badge>
                                        <Badge className="bg-purple-100 text-purple-800">5★ Reviews</Badge>
                                        <Badge className="bg-orange-100 text-orange-800">Certified Property Manager</Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}