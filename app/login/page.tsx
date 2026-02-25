'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Home, Mail, Lock, Eye, EyeOff, ArrowRight, Chrome } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '@/lib/firebase'
import { api } from '@/lib/api'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Landlord } from '@/types/landlord'

export default function LoginPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!email || !password) {
            toast.error('Please enter email and password')
            return
        }

        setIsLoading(true)

        try {
            // Sign in with Firebase
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            const user = userCredential.user

            // Get Firebase token
            const token = await user.getIdToken()

            // Get user data from Firestore
            const userDoc = await getDoc(doc(db, 'landlords', user.uid))

            if (!userDoc.exists()) {
                toast.error('User profile not found')
                return
            }

            const userData = userDoc.data()

            // Store auth data
            localStorage.setItem('authToken', token)
            localStorage.setItem('landlordId', userData.landlordId?.toString() || user.uid)
            localStorage.setItem('user', JSON.stringify(userData))

            toast.success('Login successful!')

            // Verify backend connection
            try {
                await api.get('/landlords/dashboard/stats')
            } catch (error) {
                console.warn('Backend not reachable, but continuing with local auth');
                console.error(error);
            }

            router.push('/dashboard')

        } catch (error: unknown) {
            console.error('Login error:', error)
            toast.error("Invalid email/password")
        } finally {
            setIsLoading(false)
        }
    }

    const handleGoogleLogin = async () => {
        setIsLoading(true)

        try {
            // Sign in with Google
            const result = await signInWithPopup(auth, googleProvider)
            const user = result.user

            // Get Firebase token
            const token = await user.getIdToken()

            // Check if user exists in Firestore
            const userDoc = await getDoc(doc(db, 'landlords', user.uid))

            const landlordId = user.uid
            let userData: Landlord | Record<string, unknown> = {}

            if (!userDoc.exists()) {
                // Create new landlord in Firestore
                const newLandlord: Landlord = {
                    uid: user.uid,
                    email: user.email || null,
                    fullName: user.displayName || '',
                    firstName: user.displayName?.split(' ')[0] || '',
                    lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
                    photoURL: user.photoURL || undefined,
                    phone: user.phoneNumber || '',
                    createdAt: new Date().toISOString(),
                    landlordId: user.uid,
                    isActive: true
                }

                await setDoc(doc(db, 'landlords', user.uid), newLandlord)
                userData = newLandlord

                toast.success('Account created successfully!')
            } else {
                userData = userDoc.data() as Landlord
                toast.success('Login successful!')
            }

            const landlordIdToStore =
                'landlordId' in userData && userData.landlordId != null
                    ? String(userData.landlordId)
                    : user.uid

            // Store auth data
            localStorage.setItem('authToken', token)
            localStorage.setItem('landlordId', landlordIdToStore)
            localStorage.setItem('user', JSON.stringify(userData))

            router.push('/dashboard')

        } catch (error: unknown) {
            console.error('Google login error:', error)
            toast.error('Failed to login with Google')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <Link href="/" className="flex items-center justify-center gap-2 mb-8">
                    <Home className="h-8 w-8 text-blue-600" />
                    <span className="text-2xl font-bold text-gray-900">Landlord254</span>
                </Link>

                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">Welcome back</CardTitle>
                        <CardDescription>
                            Sign in to your account to manage your properties
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleEmailLogin}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        className="pl-9"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="pl-9 pr-9"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-1 top-1 h-8"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Checkbox id="remember" />
                                    <label htmlFor="remember" className="text-sm text-gray-600">
                                        Remember me
                                    </label>
                                </div>
                                <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">
                                    Forgot password?
                                </Link>
                            </div>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white px-2 text-gray-500">Or continue with</span>
                                </div>
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                onClick={handleGoogleLogin}
                                disabled={isLoading}
                            >
                                <Chrome className="mr-2 h-4 w-4" />
                                Google
                            </Button>
                        </CardContent>

                        <CardFooter className="flex flex-col gap-4">
                            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        Signing in...
                                    </div>
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </Button>

                            <p className="text-sm text-center text-gray-600">
                                Don&#39;t have an account?{' '}
                                <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                                    Start free trial
                                </Link>
                            </p>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    )
}