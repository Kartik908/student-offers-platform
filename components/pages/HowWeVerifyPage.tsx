'use client';

import { CheckCircle2, Shield, Users, RefreshCw, AlertCircle, Tag, MessageSquare, Calendar } from "lucide-react";
import { useModal } from "@/providers/ModalProvider";
import { SEO } from "@/components/seo/SEO";

export default function HowWeVerifyPage() {
    const { openFeedbackModal } = useModal();
    return (
        <div className="min-h-screen bg-background">
            <SEO
                title="How We Verify Offers"
                description="Learn about our rigorous verification process. We manually review every student discount and cross-check with AI models to ensure accuracy."
                canonical="https://studentoffers.co/how-we-verify"
            />
            <div className="w-full py-8 sm:py-10 md:py-12 lg:py-16 px-4 sm:px-6 md:px-8 lg:px-12 max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8 sm:mb-10 md:mb-12">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight mb-3 sm:mb-4 px-2">
                        How We Verify
                    </h1>
                    <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-2 leading-relaxed">
                        Every offer is manually verified through multiple layers of checks to ensure accuracy and reliability.
                    </p>
                    {/* Last Updated */}
                    <div className="flex items-center justify-center gap-2 mt-3 sm:mt-4 text-xs sm:text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        <span>Last updated: November 2025</span>
                    </div>
                </div>

                {/* TL;DR */}
                <div className="bg-primary/10 border border-primary/30 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 mb-8 sm:mb-10 md:mb-12 hover:bg-primary/[0.12] transition-all duration-200">
                    <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 flex items-center gap-2">
                        <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                        TL;DR
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-none">
                        We manually verify every offer, cross-check details with multiple AI models, monitor updates regularly, and only use trusted public sources. While accuracy is a priority, always confirm final details on the official website.
                    </p>
                </div>

                {/* Sections */}
                <div className="space-y-6 sm:space-y-8 md:space-y-10 lg:space-y-12 [&_p]:max-w-3xl [&_h2]:mb-3 [&_h2]:sm:mb-4">
                    {/* 1. Manual Review */}
                    <section className="bg-card/30 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border border-border/50 hover:bg-card/40 transition-all duration-200">
                        <div className="flex items-start gap-3 sm:gap-4">
                            <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h2 className="text-base sm:text-lg md:text-xl font-semibold break-words">
                                    1. Manual Review — Primary Verification Layer
                                </h2>
                                <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">
                                    Every offer is manually reviewed before appearing on the platform. We check official sources, eligibility rules, region restrictions, expiration notes, and whether the offer is still active.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* 2. Secondary Verification */}
                    <section className="bg-card/30 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border border-border/50 hover:bg-card/40 transition-all duration-200">
                        <div className="flex items-start gap-3 sm:gap-4">
                            <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h2 className="text-base sm:text-lg md:text-xl font-semibold break-words">
                                    2. Secondary Verification — Using Multiple AI Models
                                </h2>
                                <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">
                                    Multiple AI models cross-check each offer for outdated details, hidden conditions, conflicting information, and broken links. AI never auto-publishes offers — it only flags potential issues.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* 3. Trusted Sources */}
                    <section className="bg-card/30 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border border-border/50 hover:bg-card/40 transition-all duration-200">
                        <div className="flex items-start gap-3 sm:gap-4">
                            <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Tag className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h2 className="text-base sm:text-lg md:text-xl font-semibold break-words">
                                    3. Trusted Sources — Public Only
                                </h2>
                                <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">
                                    We curate from official company pages, university portals, public announcements, verified Reddit communities, trusted blogs, and direct student submissions. We never list unverified or rumor-based offers.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* 4. Ongoing Monitoring */}
                    <section className="bg-card/30 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border border-border/50 hover:bg-card/40 transition-all duration-200">
                        <div className="flex items-start gap-3 sm:gap-4">
                            <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h2 className="text-base sm:text-lg md:text-xl font-semibold break-words">
                                    4. Ongoing Monitoring — Re-Verification
                                </h2>
                                <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">
                                    Offers change frequently. We routinely re-check pricing, terms, eligibility rules, region restrictions, and plan updates. Expired or unclear offers are removed.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* 5. Accuracy & Limitations */}
                    <section className="bg-card/30 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border border-border/50 hover:bg-card/40 transition-all duration-200">
                        <div className="flex items-start gap-3 sm:gap-4">
                            <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h2 className="text-base sm:text-lg md:text-xl font-semibold break-words">
                                    5. Accuracy — Limitations
                                </h2>
                                <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">
                                    Companies may update or discontinue offers without notice. While we aim for accuracy, final details should always be confirmed on the provider's website.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* 6. Transparency */}
                    <section className="bg-card/30 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border border-border/50 hover:bg-card/40 transition-all duration-200">
                        <div className="flex items-start gap-3 sm:gap-4">
                            <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h2 className="text-base sm:text-lg md:text-xl font-semibold break-words">
                                    6. Transparency — Listing Details
                                </h2>
                                <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">
                                    We clearly label verification requirements, third-party services (UNiDAYS, SheerID, Student Beans), region-specific offers, limited-time deals, and university partnerships.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* 7. Community Feedback */}
                    <section className="bg-card/30 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border border-border/50 hover:bg-card/40 transition-all duration-200">
                        <div className="flex items-start gap-3 sm:gap-4">
                            <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h2 className="text-base sm:text-lg md:text-xl font-semibold break-words">
                                    7. Community Feedback — Loop
                                </h2>
                                <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">
                                    Students can report expired offers, incorrect details, regional differences, and new verified deals. Community feedback helps keep the platform accurate and current.
                                </p>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Footer CTA */}
                <div className="mt-10 sm:mt-12 md:mt-14 lg:mt-16 text-center px-2">
                    <div className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground bg-card/50 border border-border/50 px-4 sm:px-5 py-3 sm:py-4 rounded-lg shadow-sm max-w-full">
                        <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                        <span className="text-center sm:text-left">
                            Have feedback or found an issue? Use our{" "}
                            <button
                                onClick={openFeedbackModal}
                                className="text-primary hover:underline font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 rounded"
                            >
                                Feedback form
                            </button>{" "}
                            to let us know.
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
