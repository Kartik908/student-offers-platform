import { cn } from "@/lib/utils";

export const HeroBackgrounds = () => {
    return (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
            {/* Global Noise Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04] mix-blend-overlay z-10">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <filter id="noiseFilter">
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency="0.6"
                            numOctaves="3"
                            stitchTiles="stitch"
                        />
                    </filter>
                    <rect width="100%" height="100%" filter="url(#noiseFilter)" />
                </svg>
            </div>

            {/* Hybrid Variant (Mesh + Subtle Grid) */}
            <div className="absolute inset-0 opacity-100">
                {/* Mesh Base */}
                <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-primary/15 dark:bg-primary/10 blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-accent/30 dark:bg-accent/10 blur-[100px] animate-pulse-slow delay-1000" />
                <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] rounded-full bg-blue-400/15 dark:bg-blue-400/5 blur-[80px] animate-pulse-slow delay-700" />

                {/* Grid Overlay (Very Subtle) */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 dark:opacity-20" />
            </div>
        </div>
    );
};
