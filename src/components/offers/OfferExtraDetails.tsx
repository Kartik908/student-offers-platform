/**
 * Displays extra details for an offer, like country links or discount codes.
 */
import { useState, useMemo } from 'react';
import { Offer } from '@/types';
import { Button } from '@/components/ui/button';
import { Copy, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Function to convert URLs in text to clickable links
const linkifyText = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, index) => {
    if (urlRegex.test(part)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:text-primary/80 underline break-all"
        >
          {part}
        </a>
      );
    }
    return part;
  });
};

interface OfferExtraDetailsProps {
  offer: Offer;
  showNotesInline?: boolean;
}

const OfferExtraDetails = ({ offer, showNotesInline = true }: OfferExtraDetailsProps) => {
  const countries = useMemo(() => {
    if (!offer.has_alt_links || !offer.alt_links) return [];
    return Object.entries(offer.alt_links).map(([name, urlOrDetails]) => ({
      name,
      url: typeof urlOrDetails === 'string' ? urlOrDetails : urlOrDetails.url
    }));
  }, [offer.alt_links, offer.has_alt_links]);

  const [selectedCountry, setSelectedCountry] = useState(countries.length > 0 ? countries[0] : null);
  const [isNotesOpen, setIsNotesOpen] = useState(false);

  const coupons = useMemo(() => {
    if (!offer.has_discount_codes || !offer.discount_codes) return [];
    return offer.discount_codes;
  }, [offer.discount_codes, offer.has_discount_codes]);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Copied "${code}" to clipboard!`);
  };

  const finalUrl = selectedCountry ? selectedCountry.url : offer.claim_url;
  const hasExtraInfo = !!offer.extra_info;
  const hasLessThan5Countries = countries.length < 5;

  return (
    <div className="space-y-5">
      {/* Country Selection */}
      {offer.has_alt_links && countries.length > 0 && (
        <div>
          <h4 className="font-semibold text-base mb-3">Choose your country</h4>
          <div className="flex flex-wrap gap-2">
            {countries.map((country) => {
              const isSelected = selectedCountry?.name === country.name;
              return (
                <Button
                  key={country.name}
                  variant={isSelected ? 'default' : 'outline'}
                  onClick={() => setSelectedCountry(country)}
                  className={cn(!isSelected && "hover:bg-accent hover:text-accent-foreground")}
                >
                  {country.name}
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* Discount Codes */}
      {offer.has_discount_codes && coupons.length > 0 && (
        <div>
          <h4 className="font-semibold text-base mb-3">Discount Codes</h4>
          <div className="space-y-3">
            {coupons.map((coupon) => (
              <div key={coupon.code} className="flex items-center justify-between bg-slate-100 border border-slate-200 shadow-sm dark:bg-muted/30 dark:border-border/50 dark:shadow-none p-4 rounded-xl">
                <div>
                  <p className="font-mono font-semibold">{coupon.code}</p>
                  <p className="text-sm text-muted-foreground">{coupon.description}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleCopy(coupon.code)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Important Notes - Different display based on complexity */}
      {hasExtraInfo && showNotesInline && (
        <>
          {countries.length === 0 ? (
            // No alt_links: Show notes directly without collapsible
            <div>
              <h4 className="font-semibold text-base mb-3">Important Notes</h4>
              <div className="bg-muted/30 rounded-xl p-5 border border-border/50">
                <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                  {offer.extra_info.split('\n').map((line, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{linkifyText(line.trim())}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : hasLessThan5Countries ? (
            // Has alt_links but less than 5: Show collapsible "More info"
            <Collapsible open={isNotesOpen} onOpenChange={setIsNotesOpen}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between p-3 h-auto bg-slate-100 border border-slate-200 shadow-sm hover:bg-slate-200 dark:bg-muted/20 dark:border-border/30 dark:shadow-none dark:hover:bg-muted/40 rounded-xl"
                >
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">More info</span>
                  </div>
                  {isNotesOpen ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3">
                <div className="bg-slate-100 border border-slate-200 shadow-sm dark:bg-muted/30 dark:border-border/50 dark:shadow-none rounded-xl p-5">
                  <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                    {offer.extra_info.split('\n').map((line, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{linkifyText(line.trim())}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ) : (
            // Has 5+ alt_links: Show inline (when not using tabs)
            <div>
              <h4 className="font-semibold text-base mb-3">Important Notes</h4>
              <div className="bg-muted/30 rounded-xl p-5 border border-border/50">
                <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                  {offer.extra_info.split('\n').map((line, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{linkifyText(line.trim())}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Continue Button */}
      <div className="pt-3">
        <Button asChild size="lg" className="w-full">
          <a href={finalUrl} target="_blank" rel="noopener noreferrer">
            Continue to Offer
          </a>
        </Button>
      </div>
    </div>
  );
};

export default OfferExtraDetails;