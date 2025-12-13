'use client';

import React, { useEffect, useRef, useState } from 'react';

interface DeferredRenderProps {
    children: React.ReactNode;
    minHeight?: string;
    threshold?: number;
    rootMargin?: string;
    className?: string;
}

/**
 * DeferredRender
 * 
 * A performance optimization component that only renders its children when they
 * are about to enter the viewport. This reduces the initial main thread work
 * by splitting the rendering task into smaller chunks as the user scrolls.
 * 
 * @param minHeight - The minimum height to reserve for the component to prevent layout shifts (CLS).
 * @param threshold - IntersectionObserver threshold (0 to 1).
 * @param rootMargin - Margin around the root to trigger early rendering (default: '200px').
 */
export const DeferredRender = ({
    children,
    minHeight = '100px',
    threshold = 0,
    rootMargin = '200px',
    className = '',
}: DeferredRenderProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // If already visible, no need to observe
        if (isVisible) return;

        // SSR check
        if (typeof window === 'undefined' || !window.IntersectionObserver) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsVisible(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            {
                root: null, // viewport
                rootMargin, // load before it comes into view
                threshold,
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            observer.disconnect();
        };
    }, [isVisible, rootMargin, threshold]);

    return (
        <div
            ref={ref}
            className={className}
            style={{
                minHeight: minHeight,
                transition: 'min-height 0.3s ease-out'
            }}
        >
            {isVisible ? children : null}
        </div>
    );
};
