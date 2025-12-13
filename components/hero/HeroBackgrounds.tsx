

export const HeroBackgrounds = () => {
    return (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
            {/* Global Noise Texture Overlay - Optimized (Hidden on mobile for LCP) */}
            <div className="hidden sm:block absolute inset-0 opacity-[0.03] dark:opacity-[0.04] mix-blend-overlay z-10 will-change-transform">
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

            {/* Mesh Background - GPU Accelerated */}
            <div className="absolute inset-0 opacity-100">
                {/* Mesh Base - Optimized blur effects with GPU acceleration */}
                <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-primary/15 dark:bg-primary/10 blur-[100px] md:animate-pulse-slow will-change-transform translate-z-0" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-accent/30 dark:bg-accent/10 blur-[80px] md:animate-pulse-slow delay-1000 will-change-transform translate-z-0" />
                <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] rounded-full bg-blue-400/15 dark:bg-blue-400/5 blur-[60px] md:animate-pulse-slow delay-700 will-change-transform translate-z-0" />
            </div>
        </div>
    );
};
