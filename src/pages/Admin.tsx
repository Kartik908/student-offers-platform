import { useState, useEffect } from "react";
import { SubmissionsTable } from "@/components/admin/SubmissionsTable";
import { AddOfferForm } from "@/components/admin/AddOfferForm";
import { ManageOffersTable } from "@/components/admin/ManageOffersTable";
import { FeedbackTable } from "@/components/admin/FeedbackTable";
import { ContactTable } from "@/components/admin/ContactTable";

import { AdminLogin } from "@/components/admin/AdminLogin";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authService } from "@/lib/auth";
import { showSuccess, showError } from "@/utils/toast";
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
      showSuccess("Logged out successfully");
      setIsAuthenticated(false);
    } catch (error: unknown) {
      console.error("Logout error:", error);
      showError(error instanceof Error ? error.message : "Failed to logout");
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
        <Button
          variant="outline"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
      <Tabs defaultValue="submissions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>

          <TabsTrigger value="add-offer">Add Offer</TabsTrigger>
          <TabsTrigger value="manage-offers">Manage Offers</TabsTrigger>
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
      </Tabs>
    </div>
  );
};

export default Admin;