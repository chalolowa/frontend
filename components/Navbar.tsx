'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Bell, Menu, Search, LogOut } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { auth } from '@/lib/firebase'
import { signOut } from 'firebase/auth'
import { toast } from 'sonner'

interface UserData {
    uid: string
    email: string
    firstName: string
    lastName: string
    fullName: string
    photoURL?: string
}

export function Navbar() {
    const router = useRouter()
    const [user, setUser] = useState<UserData | null>(() => {
        // Initialize from localStorage on mount
        const storedUser = localStorage.getItem('user')
        return storedUser ? JSON.parse(storedUser) : null
    })
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {

        // Subscribe to auth changes
        const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
            if (!firebaseUser) {
                setUser(null)
            }
        })

        return () => unsubscribe()
    }, [])

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

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            router.push(`/dashboard/search?q=${encodeURIComponent(searchQuery)}`)
        }
    }

    const getInitials = () => {
        if (!user) return 'U'
        if (user.firstName && user.lastName) {
            return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
        }
        if (user.fullName) {
            return user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        }
        return user.email?.[0].toUpperCase() || 'U'
    }

    const getDisplayName = () => {
        if (!user) return 'User'
        if (user.fullName) return user.fullName
        if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`
        return user.email?.split('@')[0] || 'User'
    }

    return (
        <header className="border-b bg-white px-4 py-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="md:hidden">
                        <Menu className="h-5 w-5" />
                    </Button>
                    <form onSubmit={handleSearch} className="hidden md:flex relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                            placeholder="Search properties, tenants..."
                            className="pl-8 w-75"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </form>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" className="relative">
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={user?.photoURL} />
                                    <AvatarFallback>{getInitials()}</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{getDisplayName()}</p>
                                    <p className="text-xs leading-none text-gray-500">{user?.email}</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/dashboard/profile" className="cursor-pointer w-full">
                                    Profile
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/dashboard/settings" className="cursor-pointer w-full">
                                    Settings
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={handleLogout}
                                className="text-red-600 cursor-pointer"
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}