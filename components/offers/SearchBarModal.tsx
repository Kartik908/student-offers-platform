/**
 * SearchBarModal - Custom modal for Google AI Pro with searchable country list
 * Fetches countries and extra_info from database
 */
import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Search } from "lucide-react";
import { Offer } from "@/types";
import { Input } from "@/components/ui/input";

interface SearchBarModalProps {
  isOpen: boolean;
  onClose: () => void;
  offer: Offer;
}

type Country = string | { name: string; flag?: string };

export default function SearchBarModal({ isOpen, onClose, offer }: SearchBarModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Parse extra_info to get countries and notes
  const { countries, importantNotes } = useMemo(() => {
    if (!offer.extra_info) {
      return { countries: [], importantNotes: [] };
    }

    try {
      const parsed = JSON.parse(offer.extra_info);
      const extraInfo = parsed.extra_info || parsed;

      return {
        countries: extraInfo.supported_countries || [],
        importantNotes: extraInfo.important_notes || []
      };
    } catch {
      return { countries: [], importantNotes: [] };
    }
  }, [offer.extra_info]);

  // Filter countries based on search
  const filteredCountries = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return countries;

    return countries.filter((country: Country) => {
      // Support both old format (string) and new format (object with name and flag)
      const countryName = typeof country === 'string' ? country : country.name;
      return countryName.toLowerCase().includes(query);
    });
  }, [countries, searchQuery]);

  const handleContinueToOffer = () => {
    if (offer.claim_url) {
      window.open(offer.claim_url, '_blank', 'noopener,noreferrer');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] p-0 gap-0">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-3">
            {offer.logo && (
              <div className="relative h-10 w-10 flex-shrink-0 rounded-xl overflow-hidden border border-border/50 bg-background shadow-sm">
                {offer.logo.endsWith('.mp4') || offer.logo.endsWith('.webm') ? (
                  <video
                    src={offer.logo}
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                ) : (
                  <Image
                    src={offer.logo}
                    alt={`${offer.name} logo`}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-xl font-semibold truncate leading-tight">
                Claim: {offer.name}
              </DialogTitle>
              <p className="text-sm text-muted-foreground truncate">
                View eligibility details, supported regions, and continue to claim.
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* Content */}
        <div className="px-6 py-5 grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Left: Countries list */}
          <section className="md:col-span-7">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium">
                Countries & regions with 1-year student trial
              </h3>
              <span className="text-xs text-muted-foreground">
                {filteredCountries.length} shown
              </span>
            </div>

            {/* Search Input */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search your country"
                className="pl-9 bg-card/50 border-border"
              />
            </div>

            {/* Countries List */}
            <div className="rounded-xl border border-border/50 bg-muted/40">
              <ul className="max-h-[34vh] overflow-auto px-3 py-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
                {filteredCountries.map((country: Country, index: number) => {
                  // Support both old format (string) and new format (object with name and flag)
                  const countryName = typeof country === 'string' ? country : country.name;
                  const countryFlag = typeof country === 'object' && country.flag ? country.flag : '🌍';

                  return (
                    <li
                      key={`${countryName}-${index}`}
                      className="flex items-center gap-2 py-2 px-2 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <span className="text-base">{countryFlag}</span>
                      <span className="text-sm text-foreground/90">{countryName}</span>
                    </li>
                  );
                })}
                {filteredCountries.length === 0 && (
                  <li className="py-8 text-center text-sm text-muted-foreground">
                    No matches found.
                  </li>
                )}
              </ul>
            </div>
          </section>

          {/* Right: Important Notes */}
          <section className="md:col-span-5">
            <div className="rounded-xl border border-primary/10 bg-primary/5 p-4">
              <h4 className="text-sm font-semibold mb-3">
                <span className="inline-block mr-2">ℹ️</span>
                Important Notes
              </h4>
              <div className="space-y-3">
                {importantNotes.map((note: { text?: string; link_url?: string; link_label?: string }, index: number) => {
                  // Split text by bullet points (•) if present
                  const textParts = note.text ? note.text.split('•').filter((part: string) => part.trim()) : [];

                  return (
                    <div key={index} className="space-y-2">
                      {textParts.map((part: string, partIndex: number) => (
                        <p key={partIndex} className="text-sm text-foreground/90 leading-relaxed">
                          <span className="inline-block mr-2">👉</span>
                          {part.trim()}
                        </p>
                      ))}
                      {note.link_url && note.link_label && (
                        <a
                          href={note.link_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 mt-1 text-xs text-primary no-underline hover:no-underline"
                        >
                          <span className="inline-block no-underline">🔗</span>
                          <span className="underline hover:no-underline">{note.link_label}</span>
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4">
          <Button
            variant="ghost"
            onClick={onClose}
            className="h-10 px-4 hover:bg-muted/50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleContinueToOffer}
            className="h-10 min-w-[140px]"
          >
            Continue to Offer
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
