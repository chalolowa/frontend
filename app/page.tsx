import Link from 'next/link'
import Image from 'next/image'
import {
  Home,
  Users,
  Bell,
  Calculator,
  MessageSquare,
  Smartphone,
  Zap,
  Shield,
  TrendingUp,
  Clock,
  CheckCircle,
  ArrowRight,
  Star,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  return (
      <div className="min-h-screen">
        {/* Navigation */}
        <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-2">
                <Home className="h-6 w-6 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">Landlord254</span>
              </div>

              <div className="flex items-center gap-3">
                <Link href="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Start Free Trial
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-to-b from-blue-50 to-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full mb-6">
                  <Zap className="h-4 w-4" />
                  <span className="text-sm font-medium">Trusted by 5,000+ landlords</span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Simplify Your
                  <span className="text-blue-600"> Property Management</span>
                </h1>

                <p className="text-lg text-gray-600 mt-6 max-w-lg">
                  Automate rent collection, communicate with tenants via SMS, track payments,
                  and handle taxes—all from one powerful dashboard.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <Link href="/signup">
                    <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-base">
                      Start 14-Day Free Trial
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="#demo">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto text-base">
                      Watch Demo
                    </Button>
                  </Link>
                </div>

                <div className="flex items-center gap-6 mt-8">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-600">No credit card required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-600">Cancel anytime</span>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="bg-white rounded-2xl shadow-2xl p-4">
                  <Image
                      src="/dashboard-preview.png"
                      alt="Landlord254 Dashboard"
                      width={600}
                      height={400}
                      className="rounded-lg"
                      priority
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-white rounded-lg shadow-lg p-4 hidden lg:block">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Monthly Revenue</p>
                      <p className="text-xl font-bold text-gray-900">$12,500</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="py-12 bg-white border-y">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-gray-500 mb-8">Trusted by property managers across Africa</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
              {[1,2,3,4].map((i) => (
                  <div key={i} className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Everything you need to manage your properties
              </h2>
              <p className="text-lg text-gray-600 mt-4">
                Powerful features that save you time and help you get paid faster
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                  icon={Users}
                  title="Tenant Management"
                  description="Keep all tenant information in one place. Track leases, documents, and communication history."
              />
              <FeatureCard
                  icon={Bell}
                  title="Automated Rent Reminders"
                  description="Send SMS reminders automatically via Africa's Talking. Reduce late payments by 80%."
              />
              <FeatureCard
                  icon={Calculator}
                  title="Payment Tracking"
                  description="Track payments in real-time. View payment history and generate receipts instantly."
              />
              <FeatureCard
                  icon={Smartphone}
                  title="USSD Payments"
                  description="Tenants can pay via USSD without smartphones. Works on any mobile phone."
              />
              <FeatureCard
                  icon={MessageSquare}
                  title="Bulk SMS Communication"
                  description="Send announcements and reminders to all tenants at once. Save time and money."
              />
              <FeatureCard
                  icon={TrendingUp}
                  title="Tax Calculations"
                  description="Automatic tax calculations based on your income. Export reports for your accountant."
              />
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                How Landlord254 Works
              </h2>
              <p className="text-lg text-gray-600 mt-4">
                Get started in minutes, not days
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <StepCard
                  number="1"
                  title="Add Your Properties"
                  description="List your properties and units. Set rent amounts and due dates for each."
              />
              <StepCard
                  number="2"
                  title="Invite Tenants"
                  description="Add tenants and their contact info. They'll receive SMS instructions automatically."
              />
              <StepCard
                  number="3"
                  title="Start Collecting Rent"
                  description="Sit back as Landlord254 sends reminders and tracks payments. Get paid on time, every time."
              />
            </div>

            <div className="mt-12 text-center">
              <Link href="/signup">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Get Started Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* SMS & USSD Integration Highlight */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full mb-6">
                  <Smartphone className="h-4 w-4" />
                  <span className="text-sm font-medium">Africa's Talking Integration</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Reach tenants anywhere, even without smartphones
                </h2>
                <p className="text-lg text-gray-600 mt-4">
                  Our integration with Africa's Talking enables SMS reminders and USSD payments
                  that work on any mobile phone. No app downloads required.
                </p>
                <div className="mt-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h3 className="font-semibold">Automated SMS Reminders</h3>
                      <p className="text-sm text-gray-500">Tenants receive reminders before rent is due</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h3 className="font-semibold">USSD Payment Codes</h3>
                      <p className="text-sm text-gray-500">Tenants pay using simple codes like *384*123#</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h3 className="font-semibold">M-Pesa Integration</h3>
                      <p className="text-sm text-gray-500">Seamless mobile money payments</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-8 rounded-2xl">
                <div className="max-w-sm mx-auto">
                  <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Bell className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">SMS Reminder</span>
                    </div>
                    <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                      "Dear John, your rent of KES 15,000 is due in 3 days. Pay via *384*123456#"
                    </p>
                  </div>
                  <div className="bg-white rounded-lg shadow-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Smartphone className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">USSD Payment</span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg font-mono text-sm">
                      <p>CON Welcome to Landlord254</p>
                      <p>1. Check Balance</p>
                      <p>2. Make Payment</p>
                      <p>3. View Statement</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-linear-to-r from-blue-600 to-blue-700">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Simplify Your Property Management?
            </h2>
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of landlords who&#39;ve automated their rent collection and saved countless hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
                  Start Your Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#demo">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-blue-500">
                  Schedule a Demo
                </Button>
              </Link>
            </div>
            <p className="text-sm text-blue-200 mt-4">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-300 py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Home className="h-5 w-5 text-blue-400" />
                  <span className="text-lg font-bold text-white">Landlord254</span>
                </div>
                <p className="text-sm text-gray-400">
                  Simplifying property management across Africa with smart automation.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-4">Product</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#features" className="hover:text-white">Features</a></li>
                  <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
                  <li><a href="#how-it-works" className="hover:text-white">How it Works</a></li>
                  <li><a href="#" className="hover:text-white">FAQ</a></li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-4">Company</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-white">About Us</a></li>
                  <li><a href="#" className="hover:text-white">Blog</a></li>
                  <li><a href="#" className="hover:text-white">Careers</a></li>
                  <li><a href="#" className="hover:text-white">Contact</a></li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-4">Legal</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                  <li><a href="#" className="hover:text-white">Cookie Policy</a></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-400">
                © 2024 Landlord254. All rights reserved. Made with ❤️ in Kenya.
              </p>
              <div className="flex gap-4 mt-4 md:mt-0">
                <a href="#" className="text-gray-400 hover:text-white">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
  )
}

// Feature Card Component
function FeatureCard({ icon: Icon, title, description }: { icon: any; title: string; description: string }) {
  return (
      <div className="bg-white p-6 rounded-xl border hover:shadow-lg transition-shadow">
        <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
  )
}

// Step Card Component
function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
      <div className="text-center">
        <div className="h-12 w-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
          {number}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
  )
}
