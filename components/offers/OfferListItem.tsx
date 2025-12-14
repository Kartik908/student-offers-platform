import { useState, useEffect, useRef, Suspense, lazy } from "react";
import Image from 'next/image';
import { Offer } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassClaimButton } from "@/components/ui/glass-claim-button";
import { Heart, MapPin } from "lucide-react";
import { useFavorites } from "@/providers/FavoritesProvider";
import { cn } from "@/lib/utils";
import { shouldUseCustomModal } from "@/lib/customModalConfig";
import { getOfferBadgeClasses } from "@/lib/offerUtils";
import { trackOfferViewed, trackButtonClick, track } from "@/lib/trackingManager";
import { hasRegionalOffers } from "@/lib/regionalOffers";

// Lazy load modals for code splitting
const RegionalOfferModal = lazy(() => import("@/components/offers/RegionalOfferModal"));
const ExtraInfoModal = lazy(() => import("@/components/offers/ExtraInfoModal"));
const DiscountCodeModal = lazy(() => import("@/components/offers/DiscountCodeModal"));
const CustomOfferModal = lazy(() => import("@/components/offers/CustomOfferModals").then(module => ({ default: module.CustomOfferModal })));
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface OfferListItemProps {
    deal: Offer;
}

const OfferListItem = ({ deal }: OfferListItemProps) => {
    const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
    const favorite = isFavorite(deal.id);
    const [tagsExpanded, setTagsExpanded] = useState(false);
    const [hasBeenViewed, setHasBeenViewed] = useState(false);
    const [isRegionalModalOpen, setIsRegionalModalOpen] = useState(false);
    const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
    const [isExtraInfoModalOpen, setIsExtraInfoModalOpen] = useState(false);
    const [isDiscountCodeModalOpen, setIsDiscountCodeModalOpen] = useState(false);
    const itemRef = useRef<HTMLDivElement>(null);

    const useCustomModal = shouldUseCustomModal(deal.name);
    const isRegionalOffer = hasRegionalOffers(deal) && !useCustomModal;
    const useExtraInfoModal = !useCustomModal && !isRegionalOffer && (deal.has_details_modal || !!deal.extra_info);
    const useDiscountCodeModal = !useCustomModal && !isRegionalOffer && !useExtraInfoModal && deal.has_discount_codes;
    const hasExtraDetails = useCustomModal || isRegionalOffer || useExtraInfoModal || useDiscountCodeModal;

    // Track when offer comes into view
    useEffect(() => {
        if (hasBeenViewed) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasBeenViewed) {
                    trackOfferViewed(deal.name, {
                        offer_type: deal.github_offer ? 'github' : deal.is_hidden_gem ? 'hidden_gem' : deal.is_featured ? 'featured' : 'regular',
                        location: deal.location,
                        view_type: 'list',
                        has_details: hasExtraDetails
                    });
                    setHasBeenViewed(true);
                }
            },
            { threshold: 0.5 }
        );

        if (itemRef.current) {
            observer.observe(itemRef.current);
        }

        return () => observer.disconnect();
    }, [deal.name, deal.github_offer, deal.is_hidden_gem, deal.is_featured, deal.location, hasExtraDetails, hasBeenViewed]);

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // Add micro-bounce animation
        const button = e.currentTarget;
        button.classList.add('favorite-bounce');
        setTimeout(() => button.classList.remove('favorite-bounce'), 300);

        const action = favorite ? 'removed' : 'added';
        trackButtonClick(`${action} favorite`, 'offer_card', {
            offer_name: deal.name,
            offer_type: deal.github_offer ? 'github' : deal.is_hidden_gem ? 'hidden_gem' : deal.is_featured ? 'featured' : 'regular',
            action: action
        });

        if (favorite) removeFromFavorites(deal.id);
        else addToFavorites(deal);
    };

    const handleTagClick = (tag: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        track('offer_tag_clicked', {
            tag,
            offer_name: deal.name,
            location: 'list_view'
        });
    };

    const handleTagsToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const newState = !tagsExpanded;
        setTagsExpanded(newState);

        track('offer_tags_expanded', {
            action: newState ? 'expanded' : 'collapsed',
            offer_name: deal.name,
            hidden_tags_count: extraTagsCount,
            location: 'list_view'
        });
    };

    const handleTagsTooltipView = () => {
        track('offer_tags_tooltip_viewed', {
            offer_name: deal.name,
            hidden_tags_count: extraTagsCount,
            location: 'list_view'
        });
    };

    // Parse urgency badge from database (supports both JSON and plain text)
    const parseUrgencyBadge = () => {
        if (!deal.urgency_badge) return null;

        try {
            const parsed = JSON.parse(deal.urgency_badge);
            return {
                emoji: parsed.emoji || '',
                text: parsed.text || ''
            };
        } catch {
            // Fallback: treat as plain text if not valid JSON
            return {
                emoji: '',
                text: deal.urgency_badge
            };
        }
    };

    const urgencyBadge = parseUrgencyBadge();

    const renderClaimButton = () => {
        const handleClaimClick = () => {
            track('offer_claim_clicked', {
                offer_name: deal.name,
                offer_type: deal.github_offer ? 'github' : deal.is_hidden_gem ? 'hidden_gem' : deal.is_featured ? 'featured' : 'regular',
                has_details: useExtraInfoModal,
                location: deal.location,
                tags: deal.tags,
                view_type: 'list'
            });
        };

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
                            view_type: 'list'
                        });
                    }}
                />
            );
        }

        // Regional offers get special treatment
        if (isRegionalOffer) {
            return (
                <GlassClaimButton
                    label="Claim Offer"
                    onClick={() => {
                        handleClaimClick();
                        setIsRegionalModalOpen(true);
                        track('regional_offer_modal_opened', {
                            offer_name: deal.name,
                            available_countries: Object.keys(deal.alt_links || {}),
                            view_type: 'list'
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

    // Calculate extra tags count (limit to 1 primary + location)
    const primaryTag = deal.tags?.[0];
    const extraTagsCount = (deal.tags?.length || 0) - 1;
    const hiddenTags = deal.tags?.slice(1) || [];
    const hiddenTagsText = hiddenTags.join(', ');

    const renderFavoriteButton = (className?: string) => (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleFavoriteClick}
                    className={cn(
                        "h-9 w-9 rounded-full flex-shrink-0 transition-all duration-200 group/favorite",
                        favorite ? "text-destructive hover:text-destructive/90 hover:bg-destructive/10" : "text-muted-foreground hover:text-red-500 hover:bg-red-500/10",
                        className
                    )}
                    aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
                    aria-pressed={favorite}
                >
                    <Heart className={cn("h-5 w-5 transition-transform duration-200 motion-safe:group-hover/favorite:scale-110", favorite && "fill-current animate-like")} />
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>{favorite ? "Remove from favorites" : "Add to favorites"}</p>
            </TooltipContent>
        </Tooltip>
    );

    return (
        <div
            ref={itemRef}
            className={cn(
                "group bg-card border rounded-2xl shadow-md hover:shadow-xl hover:border-primary/30 hover:bg-accent/30 transition-all duration-200 flex flex-col relative hover:z-20 motion-safe:hover:-translate-y-1",
                "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                "p-3"
            )}
            tabIndex={0}
            role="article"
            aria-label={`${deal.name} offer`}
        >
            <div className="flex items-start gap-5">
                {/* Logo - Consistent size with video support */}
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl border border-border/50 overflow-hidden flex items-center justify-center flex-shrink-0 bg-muted/20">
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
                            width={24}
                            height={24}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                            }}
                        />
                    )}
                </div>

                {/* Main Content */}
                <div className="flex-grow min-w-0 sm:pr-28">
                    {/* Title Row */}
                    <div className="flex justify-between items-start gap-2 mb-1">
                        <h3 className="font-medium text-lg leading-tight truncate-1 group-hover:text-primary transition-colors">
                            {deal.name}
                        </h3>
                        {/* Mobile Favorite Button */}
                        {renderFavoriteButton("sm:hidden -mt-1 -mr-1")}
                    </div>

                    {/* Ribbon + Urgency Badge (Responsive) */}
                    <div className="mb-1.5 flex items-start gap-2 flex-wrap">
                        <div
                            className={cn(
                                "text-xs font-semibold px-2.5 py-1.5 rounded-lg border flex items-center sm:justify-center min-h-7",
                                getOfferBadgeClasses(deal.offer)
                            )}
                        >
                            <span className="sm:line-clamp-1">{deal.offer}</span>
                        </div>
                        {urgencyBadge && (
                            <div className="flex items-center justify-center gap-1.5 px-2.5 py-0.5 bg-destructive/80 text-destructive-foreground/90 rounded-full text-[10px] font-semibold shadow-sm whitespace-nowrap h-7">
                                {urgencyBadge.emoji && <span className="text-[10px]">{urgencyBadge.emoji}</span>}
                                <span className="truncate">{urgencyBadge.text}</span>
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-tight mb-2.5 max-w-2xl">
                        {deal.description}
                    </p>

                    {/* Tags Row */}
                    <div className="flex items-center justify-between gap-2 flex-wrap min-w-0">
                        <div className="flex items-center gap-2 flex-wrap min-w-0">
                            {/* Primary category tag */}
                            {primaryTag && (
                                <Badge
                                    variant="secondary"
                                    className="text-xs px-2.5 py-0.5 h-6 cursor-pointer hover:bg-secondary/80 flex-shrink-0 transition-colors duration-200"
                                    onClick={(e) => handleTagClick(primaryTag, e)}
                                >
                                    {primaryTag}
                                </Badge>
                            )}

                            {/* Location badge */}
                            <Badge variant="outline" className="text-xs px-2.5 py-0.5 h-6 flex-shrink-0 border-border/60 bg-background/50">
                                <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                                <span className="truncate max-w-[100px]">{deal.location}</span>
                            </Badge>

                            {/* Expanded tags (when toggled) */}
                            {tagsExpanded && hiddenTags.map((tag) => (
                                <Badge
                                    key={tag}
                                    variant="secondary"
                                    className="text-xs px-2.5 py-0.5 h-6 cursor-pointer hover:bg-secondary/80 flex-shrink-0 transition-colors duration-200"
                                    onClick={(e) => handleTagClick(tag, e)}
                                >
                                    {tag}
                                </Badge>
                            ))}

                            {/* Interactive +n / − chip */}
                            {extraTagsCount > 0 && (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span>
                                            <Badge
                                                variant="outline"
                                                className="text-xs px-2 py-0.5 h-6 text-muted-foreground cursor-pointer hover:bg-muted/50 hover:text-foreground transition-colors duration-200 flex-shrink-0 border-border/60"
                                                onClick={handleTagsToggle}
                                                onMouseEnter={handleTagsTooltipView}
                                            >
                                                {tagsExpanded ? `−${extraTagsCount}` : `+${extraTagsCount}`}
                                            </Badge>
                                        </span>
                                    </TooltipTrigger>
                                    {!tagsExpanded && (
                                        <TooltipContent
                                            side="top"
                                            align="center"
                                            sideOffset={8}
                                        >
                                            <p className="max-w-xs">{hiddenTagsText}</p>
                                        </TooltipContent>
                                    )}
                                </Tooltip>
                            )}
                        </div>

                        {/* Mobile Claim Button - Inline with Tags */}
                        <div className="sm:hidden flex-shrink-0">
                            {renderClaimButton()}
                        </div>
                    </div>
                </div>
            </div>

            {/* Absolute Positioned Actions */}

            {/* Favorite button - Desktop Only (16px inset) */}
            <div className="absolute top-4 right-4 z-20 hidden sm:block">
                {renderFavoriteButton()}
            </div>

            {/* Claim Button - Desktop Only (Bottom Right) */}
            <div className="absolute bottom-4 right-4 z-20 hidden sm:block">
                {renderClaimButton()}
            </div>

            {/* Modals */}
            {useCustomModal && (
                <Suspense fallback={null}>
                    <CustomOfferModal isOpen={isCustomModalOpen} onClose={() => setIsCustomModalOpen(false)} offer={deal} />
                </Suspense>
            )}
            {isRegionalOffer && (
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
        </div>
    );
};

export default OfferListItem;