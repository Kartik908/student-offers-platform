'use client';

/**
 * A carousel section for displaying featured or highlighted offers.
 */
"use client"

import { useState } from "react"
import OfferCarousel from "@/components/highlights/OfferCarousel"
import { Offer } from "@/types"
import { Github, Gem, Star, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { trackEvent } from "@/lib/analytics"
import { AnimatePresence, motion } from "framer-motion"

interface HighlightsRailProps {
  githubOffers: Offer[];
  hiddenGemsOffers: Offer[];
  featuredOffers: Offer[];
}

const tabs = [
  { id: "featured", label: "Featured", icon: Star },
  { id: "github", label: "GitHub Pack", icon: Github, seeAllLink: "/tools?category=github", seeAllText: "See all GitHub Pack tools" },
  { id: "gems", label: "Hidden Gems", icon: Gem },
]

const HighlightsRail = ({ githubOffers, hiddenGemsOffers, featuredOffers }: HighlightsRailProps) => {
  const [activeTab, setActiveTab] = useState(tabs[0].id)

  const handleTabChange = (tabId: string) => {
    if (tabId === activeTab) return;

    trackEvent('highlights_tab_switched', {
      from_tab: activeTab,
      to_tab: tabId,
      tab_name: tabs.find(t => t.id === tabId)?.label,
    });

    setActiveTab(tabId);
  };



  if (githubOffers.length === 0 && hiddenGemsOffers.length === 0 && featuredOffers.length === 0) {
    return null;
  }

  const activeTabData = tabs.find(tab => tab.id === activeTab);

  return (
    <section className="py-8 md:py-12">
      <div
        className="container text-center mb-12 mx-auto animate-fade-in-up"
      >
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight leading-tight">Highlights</h2>
          <p className="text-muted-foreground mt-2">Curated picks students love</p>
        </div>

        {activeTabData?.seeAllLink && activeTabData.seeAllLink.trim() !== '' && (
          <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <Link href={activeTabData.seeAllLink} className="md:hidden text-sm text-primary hover:underline mt-4 inline-flex items-center">
              {activeTabData.seeAllText} <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
      <div className="w-full">
        <div className="container flex justify-center mb-8">
          <div className="flex space-x-1 rounded-full bg-muted p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={cn(
                  "relative rounded-full px-3 sm:px-4 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  activeTab === tab.id
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                )}
              >
                <span className="relative z-20 flex items-center">
                  <tab.icon className="mr-2 h-4 w-4" />
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="relative min-h-[400px]">
          <AnimatePresence mode="wait">
            {activeTab === 'featured' && (
              <motion.div
                key="featured"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <OfferCarousel offers={featuredOffers} />
              </motion.div>
            )}
            {activeTab === 'github' && (
              <motion.div
                key="github"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <OfferCarousel offers={githubOffers} seeAllLink="/tools?category=github" seeAllText="See all GitHub Pack tools" />
              </motion.div>
            )}
            {activeTab === 'gems' && (
              <motion.div
                key="gems"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <OfferCarousel offers={hiddenGemsOffers} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

export default HighlightsRail;