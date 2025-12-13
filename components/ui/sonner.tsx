'use client';

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="top-center"
      duration={2500}
      className="toaster group"
      style={{
        '--width': '100%',
      } as React.CSSProperties}
      offset="1rem"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:!bg-transparent group-[.toaster]:bg-gradient-to-b group-[.toaster]:from-white/90 group-[.toaster]:to-white/50 dark:group-[.toaster]:from-neutral-900/90 dark:group-[.toaster]:to-neutral-900/50 group-[.toaster]:text-foreground group-[.toaster]:border group-[.toaster]:border-white/50 dark:group-[.toaster]:border-white/10 group-[.toaster]:shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:group-[.toaster]:shadow-black/20 group-[.toaster]:ring-1 group-[.toaster]:ring-black/5 dark:group-[.toaster]:ring-white/10 group-[.toaster]:backdrop-blur-xl group-[.toaster]:supports-[backdrop-filter]:backdrop-blur-xl group-[.toaster]:rounded-2xl group-[.toaster]:sm:rounded-3xl group-[.toaster]:px-3 group-[.toaster]:sm:px-5 group-[.toaster]:lg:px-6 group-[.toaster]:py-2.5 group-[.toaster]:sm:py-3 group-[.toaster]:animate-in group-[.toaster]:slide-in-from-top-2 group-[.toaster]:fade-in-0 !left-0 !right-0 !transform-none mx-auto w-[85%] max-w-[350px] sm:min-w-[500px] md:min-w-[550px] lg:min-w-[600px] sm:max-w-2xl",
          title: "group-[.toast]:text-neutral-900 dark:group-[.toast]:text-gray-100 group-[.toast]:font-semibold group-[.toast]:text-sm group-[.toast]:sm:text-base group-[.toast]:leading-tight group-[.toast]:text-center group-[.toast]:sm:text-left",
          description: "group-[.toast]:text-neutral-600 dark:group-[.toast]:text-gray-300 group-[.toast]:text-xs group-[.toast]:sm:text-sm group-[.toast]:leading-tight group-[.toast]:whitespace-pre-line group-[.toast]:text-center group-[.toast]:sm:text-left",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          icon: "group-[.toast]:p-1.5 group-[.toast]:sm:p-2 group-[.toast]:bg-black/5 dark:group-[.toast]:bg-white/10 group-[.toast]:rounded-full group-[.toast]:flex group-[.toast]:items-center group-[.toast]:justify-center group-[.toast]:flex-shrink-0 group-[.toast]:w-auto group-[.toast]:h-auto group-[.toast]:mr-2 group-[.toast]:sm:mr-3 text-neutral-900 dark:text-white",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
