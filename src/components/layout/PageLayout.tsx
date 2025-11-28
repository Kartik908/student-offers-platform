/**
 * The main layout structure for all pages, including header and footer.
 */
import { Outlet } from "react-router-dom";
import SiteHeader from "@/components/nav/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";

import { GlobalLoadingIndicator } from "@/components/layout/GlobalLoadingIndicator";
import { ScrollToTop } from "@/components/ui/scroll-to-top";

const PageLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <GlobalLoadingIndicator />
      <SiteHeader />
      <main className="flex-grow">
        <Outlet />
      </main>
      <SiteFooter />

      <ScrollToTop />
    </div>
  );
};

export default PageLayout;