'use client';

import { useState, useEffect } from "react";
import { QueryClientProvider } from "@/providers/QueryClientProvider";
import { SubmissionsTable } from "@/components/admin/SubmissionsTable";
import { AddOfferForm } from "@/components/admin/AddOfferForm";
import { ManageOffersTable } from "@/components/admin/ManageOffersTable";
import { FeedbackTable } from "@/components/admin/FeedbackTable";
import { ContactTable } from "@/components/admin/ContactTable";
import { OfferVisibilityTable } from "@/components/admin/OfferVisibilityTable";

import { AdminLogin } from "@/components/admin/AdminLogin";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authService } from "@/lib/auth";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { SEO } from "@/components/seo/SEO";

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = authService.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setIsAuthenticated(true);
        setUserEmail(session?.user?.email || "");
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        setUserEmail("");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkAuth = async () => {
    try {
      const session = await authService.getSession();
      if (session) {
        setIsAuthenticated(true);
        setUserEmail(session.user?.email || "");
      }
    } catch (error) {
      console.error("Auth check error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.signOut();
      toast.success("Logged out successfully");
      setIsAuthenticated(false);
    } catch (error: unknown) {
      console.error("Logout error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to logout");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />;
  }



  return (
    <QueryClientProvider>
      <div className="container py-10">
        <SEO
          title="Admin Dashboard"
          description="Admin dashboard for managing student offers."
          canonical="https://studentoffers.co/admin"
          type="noindex"
        />
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            {userEmail && (
              <p className="text-sm text-muted-foreground mt-1">
                Signed in as {userEmail}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                try {
                  const res = await fetch('/api/revalidate');
                  const data = await res.json();
                  if (data.revalidated) {
                    toast.success('Cache refreshed!', {
                      description: 'All pages will show fresh data.'
                    });
                  }
                } catch {
                  toast.error('Failed to refresh cache');
                }
              }}
            >
              🔄 Refresh Cache
            </Button>
            <Button
              variant="outline"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>
        <Tabs defaultValue="submissions" className="space-y-6">
          <TabsList className="flex w-full overflow-x-auto pb-2 justify-start lg:grid lg:grid-cols-7 h-auto gap-1.5 bg-transparent lg:bg-muted p-0 lg:p-1 no-scrollbar">
            <TabsTrigger value="submissions" className="whitespace-nowrap px-3 py-1.5 text-xs rounded-full border border-border/50 bg-background/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary lg:border-none lg:rounded-sm lg:bg-transparent lg:data-[state=active]:bg-background lg:data-[state=active]:text-foreground">Submissions</TabsTrigger>
            <TabsTrigger value="feedback" className="whitespace-nowrap px-3 py-1.5 text-xs rounded-full border border-border/50 bg-background/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary lg:border-none lg:rounded-sm lg:bg-transparent lg:data-[state=active]:bg-background lg:data-[state=active]:text-foreground">Feedback</TabsTrigger>
            <TabsTrigger value="contact" className="whitespace-nowrap px-3 py-1.5 text-xs rounded-full border border-border/50 bg-background/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary lg:border-none lg:rounded-sm lg:bg-transparent lg:data-[state=active]:bg-background lg:data-[state=active]:text-foreground">Contact</TabsTrigger>

            <TabsTrigger value="add-offer" className="whitespace-nowrap px-3 py-1.5 text-xs rounded-full border border-border/50 bg-background/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary lg:border-none lg:rounded-sm lg:bg-transparent lg:data-[state=active]:bg-background lg:data-[state=active]:text-foreground">Add Offer</TabsTrigger>
            <TabsTrigger value="manage-offers" className="whitespace-nowrap px-3 py-1.5 text-xs rounded-full border border-border/50 bg-background/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary lg:border-none lg:rounded-sm lg:bg-transparent lg:data-[state=active]:bg-background lg:data-[state=active]:text-foreground">Manage Offers</TabsTrigger>
            <TabsTrigger value="visibility" className="whitespace-nowrap px-3 py-1.5 text-xs rounded-full border border-border/50 bg-background/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary lg:border-none lg:rounded-sm lg:bg-transparent lg:data-[state=active]:bg-background lg:data-[state=active]:text-foreground">Visibility</TabsTrigger>
          </TabsList>

          <TabsContent value="submissions" className="space-y-6">
            <SubmissionsTable />
          </TabsContent>

          <TabsContent value="feedback" className="space-y-6">
            <FeedbackTable />
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <ContactTable />
          </TabsContent>

          <TabsContent value="add-offer" className="space-y-6">
            <AddOfferForm />
          </TabsContent>

          <TabsContent value="manage-offers" className="space-y-6">
            <ManageOffersTable />
          </TabsContent>

          <TabsContent value="visibility" className="space-y-6">
            <OfferVisibilityTable />
          </TabsContent>
        </Tabs>
      </div>
    </QueryClientProvider>
  );
};

export default Admin;