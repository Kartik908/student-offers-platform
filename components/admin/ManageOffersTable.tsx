import { useState } from "react";
import Image from 'next/image';
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
import { ExternalLink, Trash2, Search, Edit } from "lucide-react";
import { toast } from "sonner";
import { EditOfferDialog } from "./EditOfferDialog";

export const ManageOffersTable = () => {
  const { data: offers, isLoading, error } = useOffersAdmin();
  const deleteOffer = useDeleteOffer();
  const [searchQuery, setSearchQuery] = useState("");
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      try {
        await deleteOffer.mutateAsync(id);
        toast.success('Offer deleted successfully');
      } catch {
        toast.error('Failed to delete offer');
      }
    }
  };

  const handleEdit = (offer: Offer) => {
    setEditingOffer(offer);
    setIsEditOpen(true);
  };

  const filteredOffers = offers?.filter(offer => {
    const matchesSearch = !searchQuery ||
      offer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.offer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold">Manage Offers ({offers.length} total)</h2>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search offers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full md:w-64"
            />
          </div>
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        Showing {filteredOffers.length} of {offers.length} offers
      </div>

      <div className="space-y-4">
        {/* Mobile Card View */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {filteredOffers.map((offer) => (
            <div key={offer.id} className="border rounded-xl p-5 space-y-4 bg-card shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  {offer.logo && (
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden flex items-center justify-center bg-muted/30 border">
                      {offer.logo.endsWith('.mp4') || offer.logo.endsWith('.webm') ? (
                        <video
                          src={offer.logo}
                          className="w-full h-full object-cover"
                          autoPlay
                          loop
                          muted
                          playsInline
                        />
                      ) : (
                        <Image
                          src={offer.logo}
                          alt=""
                          fill
                          className="object-contain p-1"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      )}
                    </div>
                  )}
                  <div>
                    <div className="font-semibold text-lg leading-tight">{offer.name}</div>
                    <div className="text-sm text-muted-foreground truncate max-w-[150px] mt-0.5">
                      {offer.location}
                    </div>
                  </div>
                </div>

                {/* Mobile Actions Menu */}
                <div className="flex gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleEdit(offer)}
                    className="h-8 w-8 text-muted-foreground hover:text-blue-600 hover:bg-blue-50/50 rounded-full"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(offer.id, offer.name)}
                    disabled={deleteOffer.isPending}
                    className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-50/50 rounded-full"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="font-medium text-base">{offer.offer}</div>
                <div className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  {offer.description}
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {offer.tags?.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs px-2 py-0.5 bg-secondary/50 hover:bg-secondary/70 font-normal">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex flex-wrap gap-1.5 pt-3 border-t border-border/50">
                {getStatusBadges(offer)}
              </div>

              <a
                href={offer.claim_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-sm font-medium text-blue-600 bg-blue-50/50 hover:bg-blue-50 rounded-lg py-2.5 mt-2 transition-colors w-full"
              >
                <span>View offer link</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block border rounded-lg">
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
                        <div className="relative w-8 h-8 rounded overflow-hidden flex items-center justify-center bg-muted/50">
                          {offer.logo.endsWith('.mp4') || offer.logo.endsWith('.webm') ? (
                            <video
                              src={offer.logo}
                              className="w-full h-full object-cover"
                              autoPlay
                              loop
                              muted
                              playsInline
                            />
                          ) : (
                            <Image
                              src={offer.logo}
                              alt=""
                              fill
                              className="object-contain"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                              }}
                            />
                          )}
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
                      {offer.tags?.slice(0, 2).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {(offer.tags?.length || 0) > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{(offer.tags?.length || 0) - 2}
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
                        onClick={() => handleEdit(offer)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
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

      <EditOfferDialog
        offer={editingOffer}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />
    </div>
  );
};