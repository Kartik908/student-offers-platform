'use client';

/**
 * A card component to display a single student offer.
 */
import { toast } from "sonner";
import React, { useState, useRef, useEffect, Suspense, lazy } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassClaimButton } from "@/components/ui/glass-claim-button";
import { Heart, MapPin } from "lucide-react";
import { Offer } from "@/types";
import { useFavorites } from "@/providers/FavoritesProvider";
import { cn } from "@/lib/utils";
import { shouldUseCustomModal } from '@/lib/customModalConfig';
import { track } from "@/lib/trackingManager";
import { getOfferBadgeClasses, parseUrgencyBadge } from "@/lib/offerUtils";

// Lazy load modals for code splitting
const RegionalOfferModal = lazy(() => import('@/components/offers/RegionalOfferModal'));
const ExtraInfoModal = lazy(() => import('@/components/offers/ExtraInfoModal'));
const DiscountCodeModal = lazy(() => import('@/components/offers/DiscountCodeModal'));
const CustomOfferModal = lazy(() => import('@/components/offers/CustomOfferModals').then(module => ({ default: module.CustomOfferModal })));

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface OfferCardProps {
  deal: Offer;
  isHighlighted?: boolean;
}

const OfferCard = ({ deal, isHighlighted = false }: OfferCardProps) => {
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const favorite = isFavorite(deal.id);
  const [isRegionalModalOpen, setIsRegionalModalOpen] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [isExtraInfoModalOpen, setIsExtraInfoModalOpen] = useState(false);
  const [isDiscountCodeModalOpen, setIsDiscountCodeModalOpen] = useState(false);

  // Check if this offer should use a custom modal
  const useCustomModal = shouldUseCustomModal(deal.name);

  const nameRef = useRef<HTMLSpanElement>(null);
  const nameContainerRef = useRef<HTMLDivElement>(null);
  const [isNameOverflowing, setIsNameOverflowing] = useState(false);
  const offerRef = useRef<HTMLParagraphElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  const [isOfferTruncated, setIsOfferTruncated] = useState(false);
  const [isDescriptionTruncated, setIsDescriptionTruncated] = useState(false);

  useEffect(() => {
    const checkTruncation = () => {
      // Add 2px threshold to prevent false positives from sub-pixel rendering
      const THRESHOLD = 2;
      if (offerRef.current) {
        setIsOfferTruncated(offerRef.current.scrollHeight > offerRef.current.clientHeight + THRESHOLD);
      }
      if (descriptionRef.current) {
        setIsDescriptionTruncated(descriptionRef.current.scrollHeight > descriptionRef.current.clientHeight + THRESHOLD);
      }
      if (nameRef.current && nameContainerRef.current) {
        setIsNameOverflowing(nameRef.current.scrollWidth > nameContainerRef.current.clientWidth + THRESHOLD);
      }
    };

    const timeoutId = setTimeout(checkTruncation, 50);
    window.addEventListener('resize', checkTruncation);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', checkTruncation);
    };
  }, [deal]);

  // Simple modal routing based on database flags
  const useRegionalModal = deal.has_alt_links && !useCustomModal;
  const useExtraInfoModal = !useCustomModal && !useRegionalModal && (deal.has_details_modal || !!deal.extra_info);
  const useDiscountCodeModal = !useCustomModal && !useRegionalModal && !useExtraInfoModal && deal.has_discount_codes;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const action = favorite ? 'removed' : 'added';
    track('offer_favorite_toggled', {
      action,
      offer_name: deal.name,
      offer_type: deal.github_offer ? 'github' : deal.is_hidden_gem ? 'hidden_gem' : deal.is_featured ? 'featured' : 'regular',
    });

    if (favorite) {
      removeFromFavorites(deal.id);
      toast.info("Removed from favorites", {
        description: `${deal.name} has been removed from your saved tools.`
      });
    } else {
      addToFavorites(deal);
      toast.success("Added to favorites", {
        description: `${deal.name} has been saved to your favorites.`
      });
    }
  };



  const urgencyBadge = parseUrgencyBadge(deal.urgency_badge);

  const NameComponent = isNameOverflowing ? (
    <div
      ref={nameContainerRef}
      className="marquee-container overflow-hidden whitespace-nowrap block relative"
    >
      <span
        ref={nameRef}
        className="marquee-text inline-block font-semibold text-lg leading-tight group-hover/card:text-primary"
      >
        {deal.name}
        <span className="mx-4 text-muted-foreground/30">•</span>
        {deal.name}
      </span>
    </div>
  ) : (
    <div ref={nameContainerRef} className="overflow-hidden whitespace-nowrap block relative">
      <span
        ref={nameRef}
        className="inline-block font-semibold text-lg leading-tight group-hover/card:text-primary truncate"
      >
        {deal.name}
      </span>
    </div>
  );
  const OfferComponent = (
    <div className={cn(
      "text-sm font-semibold px-3 rounded-lg border flex flex-col py-1.5 gap-1.5 justify-start",
      urgencyBadge ? "h-16" : "h-12",
      getOfferBadgeClasses(deal.offer)
    )}>
      <p ref={offerRef} className="line-clamp-2 leading-tight">{deal.offer}</p>
      {urgencyBadge && (
        <div className="flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 md:px-4 py-0.5 bg-destructive/80 text-destructive-foreground/90 rounded-full text-[9px] sm:text-[10px] font-semibold w-full shadow-sm">
          {urgencyBadge.emoji && <span className="text-[10px] sm:text-[11px]">{urgencyBadge.emoji}</span>}
          <span className="truncate">{urgencyBadge.text}</span>
        </div>
      )}
    </div>
  );
  const DescriptionComponent = (
    <p ref={descriptionRef} className="text-sm text-muted-foreground line-clamp-2 text-left">
      {deal.description}
    </p>
  );

  const handleClaimClick = () => {
    track('offer_claim_clicked', {
      offer_name: deal.name,
      offer_type: deal.github_offer ? 'github' : deal.is_hidden_gem ? 'hidden_gem' : deal.is_featured ? 'featured' : 'regular',
      has_details: useExtraInfoModal,
      location: deal.location,
      tags: deal.tags,
    });
  };

  const renderClaimButton = () => {
    // Custom modal offers (highest priority)
    if (useCustomModal) {
      return (
        <GlassClaimButton
          label="Claim Offer"
          onClick={() => {
            handleClaimClick();
            setIsCustomModalOpen(true);
            track('custom_offer_modal_opened', {
              offer_name: deal.name,
            });
          }}
        />
      );
    }

    // Regional offers get special treatment
    if (useRegionalModal) {
      return (
        <GlassClaimButton
          label="Claim Offer"
          onClick={() => {
            handleClaimClick();
            setIsRegionalModalOpen(true);
            track('regional_offer_modal_opened', {
              offer_name: deal.name,
              available_countries: Object.keys(deal.alt_links || {}),
            });
          }}
        />
      );
    }

    // Extra info only modal
    if (useExtraInfoModal) {
      return (
        <GlassClaimButton
          label="Claim Offer"
          onClick={() => {
            handleClaimClick();
            setIsExtraInfoModalOpen(true);
          }}
        />
      );
    }

    // Discount code modal
    if (useDiscountCodeModal) {
      return (
        <GlassClaimButton
          label="Claim Offer"
          onClick={() => {
            handleClaimClick();
            setIsDiscountCodeModalOpen(true);
          }}
        />
      );
    }



    // Simple direct link offers
    return (
      <GlassClaimButton
        label="Claim Offer"
        href={deal.claim_url}
        onClick={handleClaimClick}
      />
    );
  };

  return (
    <>
      <Card
        className={cn(
          "group/card bg-card border rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 flex flex-col h-full relative hover:z-20 cursor-pointer hover:-translate-y-1",
          // Light mode hover
          "hover:border-primary/50 hover:bg-accent/30",
          // Dark mode hover (Subtler & Cleaner)
          "dark:hover:border-primary/50 dark:hover:bg-primary/5",
          isHighlighted && "ring-2 ring-primary ring-offset-2 ring-offset-background shadow-2xl"
        )}
      >
        <CardHeader className="px-4 pt-4 pb-3">
          <div className="flex justify-between items-start gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-12 w-12 rounded-xl border border-border/50 overflow-hidden flex items-center justify-center flex-shrink-0 bg-muted/20">
                {deal.logo?.endsWith('.mp4') || deal.logo?.endsWith('.webm') ? (
                  <video
                    src={deal.logo}
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                    onError={(e) => {
                      const target = e.target as HTMLVideoElement;
                      target.style.display = 'none';
                    }}
                  />
                ) : (
                  <Image
                    src={deal.logo}
                    alt={`${deal.name} logo`}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                )}
              </div>
              <div className="min-w-0 pt-1">
                {NameComponent}
                <div className="overflow-x-auto no-scrollbar flex gap-2 whitespace-nowrap py-1 mt-1">
                  {deal.tags?.slice(0, 3).map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleFavoriteClick}
                  aria-label={favorite ? "Unsave" : "Save"}
                  className={cn(
                    "h-9 w-9 flex-shrink-0 rounded-full opacity-60 transition-all hover:opacity-100 hover:bg-transparent focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 group/favorite",
                    favorite && "opacity-100"
                  )}
                >
                  <Heart
                    className={cn(
                      "h-5 w-5 transition-all duration-300",
                      favorite
                        ? "fill-red-500 text-red-500 animate-like"
                        : "text-muted-foreground group-hover/favorite:text-red-500 group-hover/favorite:scale-110"
                    )}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{favorite ? "Unsave" : "Save"}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardHeader>

        <CardContent className="px-4 pt-2 pb-4 flex-grow flex flex-col gap-3">
          {isOfferTruncated ? (
            <Tooltip><TooltipTrigger className="w-full text-left">{OfferComponent}</TooltipTrigger><TooltipContent><p>{deal.offer}</p></TooltipContent></Tooltip>
          ) : OfferComponent}

          <div className="flex-grow min-h-[40px]">
            {isDescriptionTruncated ? (
              <Tooltip><TooltipTrigger asChild>{DescriptionComponent}</TooltipTrigger><TooltipContent><p>{deal.description}</p></TooltipContent></Tooltip>
            ) : DescriptionComponent}
          </div>

          {renderClaimButton()}
        </CardContent>

        <CardFooter className="px-4 py-2 border-t dark:border-white/10 bg-muted/50 flex justify-center rounded-b-2xl">
          <Badge variant="outline" className="font-medium dark:border-white/20 dark:bg-white/5">
            <MapPin className="h-4 w-4 mr-1.5 flex-shrink-0" />
            <span className="truncate max-w-[200px]">{deal.location}</span>
          </Badge>
        </CardFooter>
      </Card>


      {useCustomModal && (
        <Suspense fallback={null}>
          <CustomOfferModal isOpen={isCustomModalOpen} onClose={() => setIsCustomModalOpen(false)} offer={deal} />
        </Suspense>
      )}
      {useRegionalModal && (
        <Suspense fallback={null}>
          <RegionalOfferModal isOpen={isRegionalModalOpen} onClose={() => setIsRegionalModalOpen(false)} offer={deal} />
        </Suspense>
      )}
      {useExtraInfoModal && (
        <Suspense fallback={null}>
          <ExtraInfoModal isOpen={isExtraInfoModalOpen} onClose={() => setIsExtraInfoModalOpen(false)} offer={deal} />
        </Suspense>
      )}
      {useDiscountCodeModal && (
        <Suspense fallback={null}>
          <DiscountCodeModal isOpen={isDiscountCodeModalOpen} onClose={() => setIsDiscountCodeModalOpen(false)} offer={deal} />
        </Suspense>
      )}

    </>
  );
};

export default OfferCard;