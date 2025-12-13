import { getOffers } from '@/lib/supabase-server';
import { Metadata } from 'next';
import PageLayout from '@/components/layout/PageLayout';
import { OfferStructuredData } from '@/components/seo/OfferStructuredData';
import { Hero } from "@/components/hero/Hero";
import { StudentEligibilityToastProvider } from "@/components/home/StudentEligibilityToastProvider";
import dynamic from 'next/dynamic';
import { getStaticCategoriesWithIcons } from "@/data/categories";
import { getCategoryCounts } from "@/lib/categoryUtils";
import { DeferredRender } from "@/components/utils/DeferredRender";

// Lazy load below-the-fold components
const CategoryGrid = dynamic(() => import("@/components/categories/CategoryGrid").then(mod => mod.CategoryGrid));
const GithubPackBanner = dynamic(() => import("@/components/promo/GithubPackBanner"));
const HighlightsRail = dynamic(() => import("@/components/highlights/HighlightsRail"));
const UnderratedSection = dynamic(() => import("@/components/offers/UnderratedSection").then(mod => mod.UnderratedSection));
const SubmitCTA = dynamic(() => import("@/components/promo/SubmitCTA").then(mod => mod.SubmitCTA));
const IndiaSection = dynamic(() => import("@/components/home/IndiaSection").then(mod => mod.IndiaSection));
const RandomizedGrid = dynamic(() => import("@/components/home/RandomizedGrid").then(mod => mod.RandomizedGrid));

// Use Node.js runtime for better compression and faster response
export const revalidate = 14400;

export const metadata: Metadata = {
  title: 'Student Offers',
  description: 'Discover verified student discounts across Tech, AI, Fashion & Travel. Save on GitHub, Notion, Spotify, Nike + many others — all with your .edu email.',
};

export default async function Page() {
  const offers = await getOffers();

  // Server-side logic for categories
  const staticCategories = getStaticCategoriesWithIcons();
  const categoryCounts = getCategoryCounts(offers, staticCategories);

  // Prepare data for HighlightsRail
  const githubPackOffers = offers?.filter(d => d.github_offer) || [];
  const hiddenGemsOffers = offers?.filter(d => d.is_hidden_gem) || [];
  const featuredOffers = offers?.filter(d => d.is_featured) || [];

  return (
    <>
      <OfferStructuredData offers={offers} limit={50} />
      <PageLayout offers={offers}>
        <StudentEligibilityToastProvider />
        <main className="flex flex-col">
          {/* Server Rendered: Critical Path (LCP) */}
          <Hero offerCount={offers.length} />

          <CategoryGrid categories={staticCategories} categoryCounts={categoryCounts} />

          <section className="py-8 md:py-12">
            <GithubPackBanner />
          </section>

          {/* Client Components for heavy/interactive parts - now code-split via dynamic AND deferred */}
          <DeferredRender minHeight="400px" rootMargin="400px">
            <HighlightsRail
              githubOffers={githubPackOffers}
              hiddenGemsOffers={hiddenGemsOffers}
              featuredOffers={featuredOffers.slice(0, 10)}
            />
          </DeferredRender>

          <DeferredRender minHeight="300px">
            <IndiaSection offers={offers} />
          </DeferredRender>

          <DeferredRender minHeight="400px">
            <UnderratedSection offers={offers} />
          </DeferredRender>

          <DeferredRender minHeight="800px">
            <RandomizedGrid offers={offers} />
          </DeferredRender>

          <SubmitCTA />
        </main>
      </PageLayout>
    </>
  );
}
