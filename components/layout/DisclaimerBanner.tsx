import { Info, ArrowRight } from "lucide-react";
import Link from "next/link";

export function DisclaimerBanner() {
  return (
    <div className="w-full border-t border-slate-700/50 bg-slate-800/30 py-3 sm:py-1 px-4 sm:px-6 md:px-8">
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex items-start sm:items-center justify-center gap-2">
          <Info className="h-3.5 w-3.5 flex-shrink-0 text-primary/70 mt-0.5 sm:mt-0" />
          <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed sm:leading-[1.4] font-normal text-left sm:text-center max-w-5xl pr-16 sm:pr-0">
            <span className="font-medium text-slate-300">Disclaimer:</span> Offer details may change. Always verify on official sites.{" "}
            <Link
              href="/how-we-verify"
              className="inline-flex items-center gap-0.5 text-primary hover:text-primary/80 font-medium hover:underline transition-colors ml-0.5"
            >
              Learn how we verify
              <ArrowRight className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
