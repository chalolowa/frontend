'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Home, Mail, Lock, User, Phone, Building2, Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'

export default function SignupPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [step, setStep] = useState(1)

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false
    })

    const updateFormData = (key: string, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [key]: value }))
    }

    const handleNext = () => {
        if (step === 1) {
            if (!formData.firstName || !formData.lastName || !formData.email) {
                toast.error('Please fill in all required fields')
                return
            }
            setStep(2)
        }
    }

    const handleBack = () => {
        setStep(1)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (step === 1) {
            handleNext()
            return
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match')
            return
        }

        if (!formData.agreeTerms) {
            toast.error('Please agree to the terms and conditions')
            return
        }

        setIsLoading(true)

        // Simulate signup
        await new Promise(resolve => setTimeout(resolve, 2000))

        toast.success('Account created successfully!', {
            description: 'Welcome to Landlord254. Check your email to verify your account.'
        })

        setIsLoading(false)
        router.push('/dashboard')
    }

    const passwordStrength = () => {
        const password = formData.password
        if (!password) return 0
        let strength = 0
        if (password.length >= 8) strength += 25
        if (/[A-Z]/.test(password)) strength += 25
        if (/[0-9]/.test(password)) strength += 25
        if (/[^A-Za-z0-9]/.test(password)) strength += 25
        return strength
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
                    <CardHeader>
                        <div className="flex justify-between items-center mb-2">
                            {[1, 2].map((i) => (
                                <div
                                    key={i}
                                    className={`flex-1 h-1 rounded-full mx-1 ${
                                        i <= step ? 'bg-blue-600' : 'bg-gray-200'
                                    }`}
                                />
                            ))}
                        </div>
                        <CardTitle className="text-2xl">
                            {step === 1 ? 'Create your account' : 'Secure your account'}
                        </CardTitle>
                        <CardDescription>
                            {step === 1
                                ? 'Enter your details to get started with your 14-day free trial'
                                : 'Choose a strong password to protect your account'}
                        </CardDescription>
                    </CardHeader>

                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            {step === 1 ? (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName">First Name *</Label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                                <Input
                                                    id="firstName"
                                                    placeholder="John"
                                                    className="pl-9"
                                                    value={formData.firstName}
                                                    onChange={(e) => updateFormData('firstName', e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName">Last Name *</Label>
                                            <Input
                                                id="lastName"
                                                placeholder="Doe"
                                                value={formData.lastName}
                                                onChange={(e) => updateFormData('lastName', e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email *</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="you@example.com"
                                                className="pl-9"
                                                value={formData.email}
                                                onChange={(e) => updateFormData('email', e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="phone"
                                                placeholder="+254 712 345 678"
                                                className="pl-9"
                                                value={formData.phone}
                                                onChange={(e) => updateFormData('phone', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="company">Company Name</Label>
                                        <div className="relative">
                                            <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="company"
                                                placeholder="Your property management company"
                                                className="pl-9"
                                                value={formData.company}
                                                onChange={(e) => updateFormData('company', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password *</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                className="pl-9 pr-9"
                                                value={formData.password}
                                                onChange={(e) => updateFormData('password', e.target.value)}
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

                                        {formData.password && (
                                            <div className="mt-2">
                                                <Progress value={passwordStrength()} className="h-1" />
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Password strength: {
                                                    passwordStrength() <= 25 ? 'Weak' :
                                                        passwordStrength() <= 50 ? 'Fair' :
                                                            passwordStrength() <= 75 ? 'Good' : 'Strong'
                                                }
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword">Confirm Password *</Label>
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            placeholder="••••••••"
                                            value={formData.confirmPassword}
                                            onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-start gap-2">
                                            <Checkbox
                                                id="terms"
                                                checked={formData.agreeTerms}
                                                onCheckedChange={(checked) => updateFormData('agreeTerms', checked as boolean)}
                                            />
                                            <label htmlFor="terms" className="text-sm text-gray-600">
                                                I agree to the{' '}
                                                <Link href="/terms" className="text-blue-600 hover:text-blue-700">
                                                    Terms of Service
                                                </Link>{' '}
                                                and{' '}
                                                <Link href="/privacy" className="text-blue-600 hover:text-blue-700">
                                                    Privacy Policy
                                                </Link>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <p className="text-sm text-blue-800 font-medium mb-2">✨ Your 14-day free trial includes:</p>
                                        <ul className="space-y-1 text-sm text-blue-700">
                                            <li className="flex items-center gap-2">
                                                <CheckCircle className="h-3 w-3" />
                                                All Professional features
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <CheckCircle className="h-3 w-3" />
                                                Up to 15 properties
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <CheckCircle className="h-3 w-3" />
                                                Unlimited tenants
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <CheckCircle className="h-3 w-3" />
                                                SMS & USSD integration
                                            </li>
                                        </ul>
                                    </div>
                                </>
                            )}
                        </CardContent>

                        <CardFooter className="flex flex-col gap-4">
                            <div className="flex gap-2 w-full">
                                {step === 2 && (
                                    <Button type="button" variant="outline" onClick={handleBack} className="flex-1">
                                        Back
                                    </Button>
                                )}
                                <Button
                                    type={step === 2 ? "submit" : "button"}
                                    onClick={step === 1 ? handleNext : undefined}
                                    className={`flex-1 ${step === 2 ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                            Creating account...
                                        </div>
                                    ) : step === 1 ? (
                                        <>
                                            Continue
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </>
                                    ) : (
                                        'Create Account'
                                    )}
                                </Button>
                            </div>

                            <p className="text-sm text-center text-gray-600">
                                Already have an account?{' '}
                                <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                                    Sign in
                                </Link>
                            </p>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    )
}