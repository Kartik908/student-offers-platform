import { useState } from "react";
import { Offer } from "@/types";
import { useOffersAdmin, useDeleteOffer } from "@/hooks/useOffersAdmin";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { ExternalLink, Trash2, Search, Eye, EyeOff } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";

export const ManageOffersTable = () => {
  const { data: offers, isLoading, error } = useOffersAdmin();
  const deleteOffer = useDeleteOffer();
  const [searchQuery, setSearchQuery] = useState("");
  const [showHidden, setShowHidden] = useState(true);

  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      try {
        await deleteOffer.mutateAsync(id);
        showSuccess('Offer deleted successfully');
      } catch (error) {
        showError('Failed to delete offer');
      }
    }
  };

  const filteredOffers = offers?.filter(offer => {
    const matchesSearch = !searchQuery ||
      offer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.offer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.description?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  }) || [];

  const getStatusBadges = (offer: Offer) => {
    const badges = [];
    if (offer.github_offer) badges.push(<Badge key="github" className="bg-purple-500">GitHub</Badge>);
    if (offer.is_hidden_gem) badges.push(<Badge key="gem" className="bg-amber-500">Hidden Gem</Badge>);
    if (offer.has_details_modal) badges.push(<Badge key="modal" variant="outline">Modal</Badge>);
    if (offer.has_alt_links) badges.push(<Badge key="alt" variant="outline">Alt Links</Badge>);
    if (offer.has_discount_codes) badges.push(<Badge key="codes" variant="outline">Codes</Badge>);
    return badges;
  };

  if (isLoading) return <div className="p-4">Loading offers...</div>;
  if (error) return <div className="p-4 text-red-500">Error loading offers: {error.message}</div>;
  if (!offers?.length) return <div className="p-4">No offers found.</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Offers ({offers.length} total)</h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search offers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        Showing {filteredOffers.length} of {offers.length} offers
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Offer</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOffers.map((offer) => (
              <TableRow key={offer.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {offer.logo && (
                      <div className="w-8 h-8 rounded overflow-hidden flex items-center justify-center bg-muted/50">
                        <img
                          src={offer.logo}
                          alt=""
                          className="w-full h-full object-contain"
                          loading="eager"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    <div>
                      <div className="font-medium">{offer.name}</div>
                      <div className="text-sm text-muted-foreground truncate max-w-xs">
                        {offer.description}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-xs">
                    <div className="font-medium text-sm">{offer.offer}</div>
                    <a
                      href={offer.claim_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 mt-1"
                    >
                      <span className="truncate">View offer</span>
                      <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    </a>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {offer.tags.slice(0, 2).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {offer.tags.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{offer.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {offer.location}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {getStatusBadges(offer)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(offer.id, offer.name)}
                      disabled={deleteOffer.isPending}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};