import { useState, useEffect, useRef } from "react";
import { Offer } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassClaimButton } from "@/components/ui/glass-claim-button";
import { Heart, MapPin, ExternalLink, Info } from "lucide-react";
import { useFavorites } from "@/providers/FavoritesProvider";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import OfferExtraDetails from "@/components/offers/OfferExtraDetails";
import RegionalOfferModal from "@/components/offers/RegionalOfferModal";
import ExtraInfoModal from "@/components/offers/ExtraInfoModal";
import DiscountCodeModal from "@/components/offers/DiscountCodeModal";
import { CustomOfferModal } from "@/components/offers/CustomOfferModals";
import { shouldUseCustomModal } from "@/lib/customModalConfig";
import { getOfferBadgeClasses } from "@/lib/offerUtils";
import { trackOfferViewed, trackOfferClicked, trackButtonClick, track } from "@/lib/trackingManager";
import { hasRegionalOffers } from "@/lib/regionalOffers";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface OfferListItemProps {
    deal: Offer;
}

const OfferListItem = ({ deal }: OfferListItemProps) => {
    const { isFavorite, addFavorite, removeFavorite } = useFavorites();
    const favorite = isFavorite(String(deal.id));
    const [isExpanded, setIsExpanded] = useState(false);
    const [logoError, setLogoError] = useState(false);
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

        if (favorite) removeFavorite(String(deal.id));
        else addFavorite(String(deal.id));
    };

    const handleCardClick = () => {
        track('offer_card_clicked', {
            offer_name: deal.name,
            offer_type: deal.github_offer ? 'github' : deal.is_hidden_gem ? 'hidden_gem' : deal.is_featured ? 'featured' : 'regular',
            view_type: 'list',
            has_details: hasExtraDetails
        });

        // Track offer interaction with PostHog
        if (typeof window !== 'undefined' && window.posthog) {
            window.posthog.capture('offer_card_clicked', {
                offer_name: deal.name,
                offer_category: deal.tags?.[0] || 'uncategorized',
                offer_value: deal.offer,
                offer_id: deal.id.toString(),
            });
        }

        if (hasExtraDetails) {
            setIsExpanded(!isExpanded);
        }
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
        } catch (error) {
            // Fallback: treat as plain text if not valid JSON
            return {
                emoji: '',
                text: deal.urgency_badge
            };
        }
    };

    const urgencyBadge = parseUrgencyBadge();

    const ClaimButton = () => {
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

    // Generate monogram fallback
    const getMonogram = (name: string) => {
        return name.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase();
    };

    // Calculate extra tags count (limit to 1 primary + location)
    const primaryTag = deal.tags?.[0];
    const extraTagsCount = (deal.tags?.length || 0) - 1;
    const hiddenTags = deal.tags?.slice(1) || [];
    const hiddenTagsText = hiddenTags.join(', ');

    return (
        <motion.div
            ref={itemRef}
            layout
            className={cn(
                "group bg-card border rounded-2xl shadow-md hover:shadow-xl hover:border-primary/30 hover:bg-accent/30 transition-all duration-200 flex flex-col relative hover:z-20 cursor-pointer motion-safe:hover:-translate-y-1",
                "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                "p-4"
            )}
            tabIndex={0}
            role="article"
            aria-label={`${deal.name} offer`}
        >
            <div className="flex items-start gap-4 mb-3">
                {/* Logo - Consistent size with video support */}
                <div className="h-12 w-12 rounded-xl border border-border/50 overflow-hidden flex items-center justify-center flex-shrink-0">
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
                        <img
                            src={deal.logo}
                            alt={`${deal.name} logo`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            decoding="async"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                            }}
                        />
                    )}
                </div>

                {/* Main Content */}
                <div className="flex-grow min-w-0">
                    <div className="flex items-start justify-between gap-3">
                        <div
                            className="flex-grow min-w-0 cursor-pointer"
                            onClick={handleCardClick}
                        >
                            {/* Title */}
                            <h3 className="font-semibold text-base leading-tight truncate-1 group-hover:text-primary transition-colors mb-2">
                                {deal.name}
                            </h3>

                            {/* Offer Badge with Urgency Badge on Right */}
                            <div className="mb-3 flex items-center gap-2">
                                <div className={cn(
                                    "text-sm font-semibold px-3 py-2 rounded-lg border flex items-center justify-center",
                                    getOfferBadgeClasses(deal.offer)
                                )}>
                                    <span className="line-clamp-1">{deal.offer}</span>
                                </div>
                                {urgencyBadge && (
                                    <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 bg-destructive/80 text-destructive-foreground/90 rounded-full text-[9px] sm:text-[10px] font-semibold shadow-sm whitespace-nowrap">
                                        {urgencyBadge.emoji && <span className="text-[10px] sm:text-[11px]">{urgencyBadge.emoji}</span>}
                                        <span>{urgencyBadge.text}</span>
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            <p className="text-sm text-muted-foreground truncate-2 leading-normal">
                                {deal.description}
                            </p>
                        </div>

                        {/* Favorite button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleFavoriteClick}
                            className={cn(
                                "h-9 w-9 rounded-full flex-shrink-0 transition-all duration-200 group/favorite",
                                favorite ? "text-destructive hover:text-destructive/90 hover:bg-destructive/10" : "text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                            )}
                            aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
                            aria-pressed={favorite}
                        >
                            <Heart className={cn("h-5 w-5 transition-transform duration-200 motion-safe:group-hover/favorite:scale-110", favorite && "fill-current animate-like")} />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Tags and Actions Row */}
            <div className="flex items-center justify-between gap-3 mt-3.5 pt-3.5 border-t border-border/20">
                <div className="flex items-center gap-2 flex-wrap min-w-0 flex-1">
                    {/* Primary category tag */}
                    {primaryTag && (
                        <Badge
                            variant="secondary"
                            className="text-xs px-2 py-1 cursor-pointer hover:bg-secondary/80 flex-shrink-0 transition-colors duration-200"
                            onClick={(e) => handleTagClick(primaryTag, e)}
                        >
                            {primaryTag}
                        </Badge>
                    )}

                    {/* Location badge */}
                    <Badge variant="outline" className="text-xs px-2 py-1 flex-shrink-0 border-border/60">
                        <MapPin className="h-4 w-4 mr-1.5 flex-shrink-0" />
                        <span className="truncate">{deal.location}</span>
                    </Badge>

                    {/* Expanded tags (when toggled) */}
                    {tagsExpanded && hiddenTags.map((tag) => (
                        <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs px-2 py-1 cursor-pointer hover:bg-secondary/80 flex-shrink-0 transition-colors duration-200"
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
                                        className="text-xs px-2 py-1 text-muted-foreground cursor-pointer hover:bg-muted/50 hover:text-foreground transition-colors duration-200 flex-shrink-0 border-border/60"
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

                {/* Claim Button */}
                <div className="flex-shrink-0 flex items-center relative z-10">
                    <ClaimButton />
                </div>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.section
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                        className="overflow-hidden"
                    >
                        <div className="mt-4 pt-4 border-t border-border/30 bg-muted/20 rounded-lg mx-0 px-4 pb-4">
                            <OfferExtraDetails offer={deal} />
                        </div>
                    </motion.section>
                )}
            </AnimatePresence>

            {/* Modals */}
            {useCustomModal && <CustomOfferModal isOpen={isCustomModalOpen} onClose={() => setIsCustomModalOpen(false)} offer={deal} />}
            {isRegionalOffer && <RegionalOfferModal isOpen={isRegionalModalOpen} onClose={() => setIsRegionalModalOpen(false)} offer={deal} />}
            {useExtraInfoModal && <ExtraInfoModal isOpen={isExtraInfoModalOpen} onClose={() => setIsExtraInfoModalOpen(false)} offer={deal} />}
            {useDiscountCodeModal && <DiscountCodeModal isOpen={isDiscountCodeModalOpen} onClose={() => setIsDiscountCodeModalOpen(false)} offer={deal} />}
        </motion.div>
    );
};

export default OfferListItem;