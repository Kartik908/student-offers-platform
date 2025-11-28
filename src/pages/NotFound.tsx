import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";
import { trackError } from "@/lib/trackingManager";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    // Track 404 error for analytics
    trackError(`404 Error: ${location.pathname}`, {
      error_type: '404',
      attempted_path: location.pathname,
      referrer: document.referrer
    });
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-foreground mb-2">Page Not Found</h2>
          <p className="text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg" className="shadow-md hover:shadow-lg">
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/tools">
              <Search className="mr-2 h-4 w-4" />
              Browse Offers
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
