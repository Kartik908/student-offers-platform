/**
 * A promotional banner for the GitHub Student Developer Pack.
 */
import { Button } from "@/components/ui/button";
import { Github, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

const GithubPackBanner = () => {
  return (
    <div className="container">
      <div className="relative bg-gradient-to-br from-[#0C1524] to-[#111827] dark:from-[#0C1524]/80 dark:to-[#07101C]/50 rounded-3xl border border-[#1F2937] dark:border-white/10 shadow-2xl shadow-slate-900/10 dark:shadow-black/40 text-white p-5 ring-1 ring-white/10 overflow-hidden group transition-all duration-300 hover:shadow-primary/5 dark:hover:shadow-primary/10 hover:border-primary/20 after:absolute after:top-0 after:left-0 after:right-0 after:h-px after:bg-white/10 after:rounded-t-3xl backdrop-blur-xl">
        {/* Subtle glass layer */}
        <div className="absolute inset-0 bg-white/[0.02] pointer-events-none" />

        {/* Soft top-to-bottom lighting */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] via-transparent to-transparent pointer-events-none" />

        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Left side: Icon and main text */}
          <div className="flex items-center gap-4">
            <div className="bg-white/10 h-14 w-14 rounded-xl flex-shrink-0 flex items-center justify-center shadow-lg shadow-black/20 ring-1 ring-white/10">
              <Github className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">GitHub Student Developer Pack</h2>
              <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-sm text-slate-400 mt-1">
                <span>80+ Developer Tools</span>
                <span className="hidden sm:inline text-slate-600">•</span>
                <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 text-xs font-medium px-2 py-0.5 rounded-full ring-1 ring-emerald-500/20">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Verified</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right side: Value and buttons */}
          <div className="flex flex-col items-start md:items-end w-full md:w-auto md:pl-4">
            <div className="relative flex items-center gap-2 text-sm sm:text-base font-bold text-emerald-400 mb-3 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
              <Sparkles className="h-4 w-4 flex-shrink-0 text-emerald-400" />
              <span>Unlock $200K+</span>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="ghost" className="text-white hover:bg-white/10 hover:text-white h-9 px-4 border border-white/10 transition-all group/btn">
                <Link href="/tools?category=github" className="flex items-center">
                  Explore Pack <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
                </Link>
              </Button>
              <Button asChild className="h-9 px-4 group/btn bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20">
                <a href="https://education.github.com/pack" target="_blank" rel="noopener noreferrer" className="flex items-center">
                  Claim Pack <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GithubPackBanner;