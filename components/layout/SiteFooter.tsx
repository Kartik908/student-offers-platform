'use client';

/**
 * SiteFooter
 * 
 * Purpose: Renders the main footer for the entire application.
 * Used in: PageLayout.tsx
 * Context: Layout
 */
import { GraduationCap } from "lucide-react";
import Link from "next/link";
import { useModal } from "@/providers/ModalProvider";
import { DisclaimerBanner } from "./DisclaimerBanner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";


const linkGroups = [
  {
    title: "Resources",
    links: [
      { label: "Submit an Offer", href: "#submit", isModal: true },
      { label: "Feedback", href: "#feedback", isModal: true },
      { label: "How We Verify", href: "/how-we-verify" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Contact Us", href: "#contact", isModal: true },
      { label: "Privacy & Terms", href: "/privacy-cookies-terms" },
    ],
  },
];

interface FooterLink {
  label: string;
  href: string;
  isModal?: boolean;
}

const SiteFooter = () => {
  const { openFeedbackModal, openContactModal, openSubmitOfferModal } = useModal();

  const handleLinkClick = (e: React.MouseEvent, link: FooterLink) => {
    if (link.isModal) {
      e.preventDefault();
      if (link.label === "Feedback") {
        openFeedbackModal();
      } else if (link.label === "Contact Us") {
        openContactModal();
      } else if (link.label === "Submit an Offer") {
        openSubmitOfferModal();
      }
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 relative overflow-hidden">
      <div className="container py-12 md:py-16 relative z-10">
        {/* Desktop Layout */}
        <div className="hidden md:grid md:grid-cols-8 md:gap-8">
          <div className="col-span-4">
            <div className="flex items-center space-x-3 mb-4">
              {/* Icon with subtle glow */}
              <div className="relative">
                <div className="absolute inset-0 rounded-full blur-md bg-primary/20 dark:bg-primary/30 animate-pulse" />
                <GraduationCap className="relative h-8 w-8 text-primary stroke-[2] drop-shadow-[0_0_8px_rgba(59,130,246,0.4)] dark:drop-shadow-[0_0_8px_rgba(96,165,250,0.6)]" />
              </div>
              {/* Text with light glow */}
              <span className="font-semibold tracking-tight text-white leading-none text-lg drop-shadow-[0_0_6px_rgba(59,130,246,0.3)] dark:drop-shadow-[0_0_6px_rgba(96,165,250,0.5)]">Student Offers</span>
            </div>
            <p className="text-slate-400 text-sm max-w-xs">
              <span className="font-semibold text-slate-300">A better way to find student perks.</span><br />
              Hand-verified discounts. No expired codes. Just useful offers.
            </p>
          </div>
          <div className="col-span-2">
            <h3 className="font-semibold text-sm text-white mb-4">Resources</h3>
            <ul className="space-y-3">
              {linkGroups[0].links.map((link) => {
                if (link.isModal) {
                  return (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        onClick={(e) => handleLinkClick(e, link)}
                        className="text-sm text-slate-400 hover:text-white hover:underline underline-offset-4 transition-colors cursor-pointer"
                      >
                        {link.label}
                      </a>
                    </li>
                  );
                }
                return (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-white hover:underline underline-offset-4 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="col-span-2">
            <h3 className="font-semibold text-sm text-white mb-4">Company</h3>
            <ul className="space-y-3">
              {linkGroups[1].links.map((link) => {
                if (link.isModal) {
                  return (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        onClick={(e) => handleLinkClick(e, link)}
                        className="text-sm text-slate-400 hover:text-white hover:underline underline-offset-4 transition-colors cursor-pointer"
                      >
                        {link.label}
                      </a>
                    </li>
                  );
                }
                return (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-white hover:underline underline-offset-4 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              {/* Icon with subtle glow */}
              <div className="relative">
                <div className="absolute inset-0 rounded-full blur-md bg-primary/20 dark:bg-primary/30 animate-pulse" />
                <GraduationCap className="relative h-8 w-8 text-primary stroke-[2] drop-shadow-[0_0_8px_rgba(59,130,246,0.4)] dark:drop-shadow-[0_0_8px_rgba(96,165,250,0.6)]" />
              </div>
              {/* Text with light glow */}
              <span className="font-semibold tracking-tight text-white leading-none text-lg drop-shadow-[0_0_6px_rgba(59,130,246,0.3)] dark:drop-shadow-[0_0_6px_rgba(96,165,250,0.5)]">Student Offers</span>
            </div>
            <p className="text-slate-400 text-sm max-w-xs">
              <span className="font-semibold text-slate-300">A better way to find student perks.</span><br />
              Hand-verified discounts. No expired codes. Just useful offers.
            </p>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {linkGroups.map((group) => (
              <AccordionItem key={group.title} value={group.title}>
                <AccordionTrigger className="text-white">{group.title}</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-4 pt-2">
                    {group.links.map((link) => {
                      if (link.isModal) {
                        return (
                          <li key={link.label}>
                            <a
                              href={link.href}
                              onClick={(e) => handleLinkClick(e, link)}
                              className="text-slate-400 hover:text-white cursor-pointer"
                            >
                              {link.label}
                            </a>
                          </li>
                        );
                      }
                      return (
                        <li key={link.label}>
                          <Link
                            href={link.href}
                            className="text-slate-400 hover:text-white"
                          >
                            {link.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex justify-center text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} Student Offers. All rights reserved.</p>
        </div>
      </div>

      <DisclaimerBanner />

      {/* Decorative Wordmark */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 flex items-end justify-center overflow-hidden pointer-events-none [mask-image:linear-gradient(to_top,black_75%,transparent_100%)]"
      >
        <span className="hidden md:inline font-black text-white/[.03] leading-none tracking-tighter whitespace-nowrap md:text-[128px] lg:text-[200px] transform md:translate-y-16 lg:translate-y-[72px]">
          Student Offers
        </span>
      </div>
    </footer>
  );
};

export default SiteFooter;