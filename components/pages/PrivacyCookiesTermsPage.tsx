'use client';

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"
import { Settings, Cookie, Shield, Eye, Target } from "lucide-react"
import { ConsentManager } from "@/components/layout/ConsentManager"
import { useConsent } from "@/hooks/useConsent"
import { SEO } from "@/components/seo/SEO"

export default function PrivacyCookiesTermsPage() {
    const [mounted, setMounted] = useState(false)
    const [defaultOpenSections, setDefaultOpenSections] = useState<string[]>([])

    // Use actual consent system
    const { preferences, consentGiven, consentStatus } = useConsent()

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true)

        // Check if user came from cookie banner
        if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search)
            const fromCookies = urlParams.get('from') === 'cookies'

            if (fromCookies) {
                setDefaultOpenSections(['necessary', 'analytics', 'functional', 'marketing'])
            }
        }
    }, [])

    return (
        <div className="min-h-screen w-full bg-background text-foreground px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
            <SEO
                title="Privacy Policy, Cookies & Terms"
                description="Read our privacy policy, cookie usage, and terms of service. We value your privacy and data security."
                canonical="https://studentoffers.co/privacy-cookies-terms"
            />
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">🔒 Privacy, Cookies & Terms</h1>
                        <p className="text-muted-foreground text-sm sm:text-base">
                            <span className="font-medium">Last updated:</span> November 2025
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                        <ConsentManager variant="button" className="w-full sm:w-auto flex-shrink-0" />
                        {mounted && consentGiven && (
                            <div className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg text-sm w-full sm:w-auto">
                                <Shield className="w-4 h-4 flex-shrink-0" />
                                <span className="whitespace-nowrap">Consent: {consentStatus || 'none'}</span>
                            </div>
                        )}
                    </div>
                </div>

                <Card className="border border-border/40 shadow-sm rounded-xl sm:rounded-2xl">
                    <CardContent className="space-y-6 p-4 sm:p-6 lg:p-8">
                        <section>
                            <p className="text-muted-foreground mb-4">
                                We use cookies to improve your experience. You control what data we collect.
                            </p>

                            {/* Current Status */}
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <Cookie className="w-4 h-4" />
                                    <span className="font-medium">Your Cookie Settings</span>
                                </div>
                                {mounted ? (
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-3 h-3 rounded-full ${preferences.necessary ? 'bg-green-500' : 'bg-gray-300'}`} />
                                            <span>Necessary</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className={`w-3 h-3 rounded-full ${preferences.functional ? 'bg-green-500' : 'bg-gray-300'}`} />
                                            <span>Functional</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className={`w-3 h-3 rounded-full ${preferences.analytics ? 'bg-green-500' : 'bg-gray-300'}`} />
                                            <span>Analytics</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className={`w-3 h-3 rounded-full ${preferences.marketing ? 'bg-green-500' : 'bg-gray-300'}`} />
                                            <span>Marketing</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-gray-300" />
                                            <span>Necessary</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-gray-300" />
                                            <span>Functional</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-gray-300" />
                                            <span>Analytics</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-gray-300" />
                                            <span>Marketing</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>

                        <Separator />

                        <Accordion type="multiple" className="w-full" defaultValue={defaultOpenSections}>
                            <AccordionItem value="necessary">
                                <AccordionTrigger className="text-base font-medium">
                                    <div className="flex items-center gap-2">
                                        <Shield className="w-4 h-4 text-green-600" />
                                        Necessary Cookies
                                        <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                                            Always Active
                                        </span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="text-sm text-muted-foreground">
                                    <p>Essential for site functionality and security. Cannot be disabled.</p>
                                    <p className="text-xs mt-2"><strong>Includes:</strong> Basic functionality, error logging, security monitoring</p>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="functional">
                                <AccordionTrigger className="text-base font-medium">
                                    <div className="flex items-center gap-2">
                                        <Settings className="w-4 h-4 text-blue-600" />
                                        Functional Cookies
                                        {mounted ? (
                                            <span className={`text-xs px-2 py-1 rounded ${preferences.functional
                                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                                                }`}>
                                                {preferences.functional ? 'Active' : 'Inactive'}
                                            </span>
                                        ) : (
                                            <span className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                                                Inactive
                                            </span>
                                        )}
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="text-sm text-muted-foreground">
                                    <p>Remember your preferences and enhance your experience.</p>
                                    <p className="text-xs mt-2"><strong>Includes:</strong> Theme settings, UI preferences, session recordings (anonymized)</p>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="analytics">
                                <AccordionTrigger className="text-base font-medium">
                                    <div className="flex items-center gap-2">
                                        <Eye className="w-4 h-4 text-purple-600" />
                                        Analytics Cookies
                                        {mounted ? (
                                            <span className={`text-xs px-2 py-1 rounded ${preferences.analytics
                                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                                                }`}>
                                                {preferences.analytics ? 'Active' : 'Inactive'}
                                            </span>
                                        ) : (
                                            <span className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                                                Inactive
                                            </span>
                                        )}
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="text-sm text-muted-foreground">
                                    <p>Help us understand how you use the site to improve it. All data is anonymized.</p>
                                    <p className="text-xs mt-2"><strong>Includes:</strong> Page views, clicks, search queries (no IP collection)</p>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="marketing">
                                <AccordionTrigger className="text-base font-medium">
                                    <div className="flex items-center gap-2">
                                        <Target className="w-4 h-4 text-orange-600" />
                                        Marketing Cookies
                                        {mounted ? (
                                            <span className={`text-xs px-2 py-1 rounded ${preferences.marketing
                                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                                                }`}>
                                                {preferences.marketing ? 'Active' : 'Inactive'}
                                            </span>
                                        ) : (
                                            <span className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                                                Inactive
                                            </span>
                                        )}
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="text-sm text-muted-foreground">
                                    <p>Understand where visitors come from and measure content performance.</p>
                                    <p className="text-xs mt-2"><strong>Includes:</strong> Referral sources, campaign attribution (no ads, no cross-site tracking)</p>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>

                        <Separator />

                        <section className="text-sm">
                            <h2 className="text-lg font-semibold mb-3">Our Privacy Promise</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                                    <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">✅ We Do</h4>
                                    <ul className="text-xs space-y-1 text-muted-foreground">
                                        <li>• Encrypt all data</li>
                                        <li>• Respect your choices</li>
                                        <li>• Use minimal data only</li>
                                    </ul>
                                </div>
                                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
                                    <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">❌ We Never</h4>
                                    <ul className="text-xs space-y-1 text-muted-foreground">
                                        <li>• Sell your data</li>
                                        <li>• Show ads</li>
                                        <li>• Track across sites</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section className="text-sm">
                            <h2 className="text-lg font-semibold mb-3">Terms of Use</h2>
                            <div className="text-muted-foreground space-y-2">
                                <p>Student Offers is a free resource for discovering student discounts. Use responsibly.</p>
                                <p>Content is for informational purposes and may change. We strive for accuracy but don't guarantee offer availability.</p>
                            </div>
                        </section>

                        <section className="text-sm">
                            <h2 className="text-lg font-semibold mb-3">Your Rights</h2>
                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="font-medium mb-2">🍪 Cookie Control</h4>
                                        <p className="text-xs text-muted-foreground mb-3">Change or revoke consent anytime</p>
                                        <ConsentManager variant="button" className="text-xs" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium mb-2">📧 Data Requests</h4>
                                        <p className="text-xs text-muted-foreground mb-1">Delete, download, or correct your data</p>
                                        <p className="text-xs font-mono">privacy@studentoffers.co</p>
                                    </div>
                                </div>
                            </div>
                        </section>


                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
