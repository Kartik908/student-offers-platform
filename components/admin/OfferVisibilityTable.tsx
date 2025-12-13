import { useState } from "react";
import Image from 'next/image';
import { Offer } from "@/types";
import { useOffersAdmin, useUpdateOffer } from "@/hooks/useOffersAdmin";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Search, CheckSquare, Square, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type FilterType = 'all' | 'featured' | 'hidden_gem' | 'underrated';

export const OfferVisibilityTable = () => {
    const { data: offers, isLoading, error } = useOffersAdmin();
    const updateOffer = useUpdateOffer();

    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState<FilterType>('all');
    const [selectedOffers, setSelectedOffers] = useState<Set<number>>(new Set());
    const [isBulkUpdating, setIsBulkUpdating] = useState(false);

    const handleToggle = async (id: number, field: keyof Offer, currentValue: boolean) => {
        try {
            // Optimistic update could be handled by react-query if configured, 
            // but for now we rely on the mutation success to refetch.
            // To make it feel instant, we could manage local state, but let's stick to the hook.
            await updateOffer.mutateAsync({
                id,
                updates: { [field]: !currentValue }
            });
            toast.success(`Updated ${field.replace('is_', '').replace('_', ' ')} status`);
        } catch (error) {
            console.error('Toggle error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            toast.error(`Failed to update status: ${errorMessage}`);
        }
    };

    const handleSelectAll = (filtered: Offer[]) => {
        if (selectedOffers.size === filtered.length) {
            setSelectedOffers(new Set());
        } else {
            setSelectedOffers(new Set(filtered.map(o => o.id)));
        }
    };

    const handleSelect = (id: number) => {
        const newSelected = new Set(selectedOffers);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedOffers(newSelected);
    };

    const handleBulkAction = async (field: keyof Offer, value: boolean) => {
        if (selectedOffers.size === 0) return;

        setIsBulkUpdating(true);
        try {
            const promises = Array.from(selectedOffers).map(id =>
                updateOffer.mutateAsync({
                    id,
                    updates: { [field]: value }
                })
            );

            await Promise.all(promises);
            toast.success(`Updated ${selectedOffers.size} offers`);
            setSelectedOffers(new Set());
        } catch (error) {
            console.error('Bulk update error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            toast.error(`Failed to perform bulk update: ${errorMessage}`);
        } finally {
            setIsBulkUpdating(false);
        }
    };

    const [sortOption, setSortOption] = useState<string>("name-asc");

    // Calculate counts
    const counts = {
        all: offers?.length || 0,
        featured: offers?.filter(o => o.is_featured).length || 0,
        hidden_gem: offers?.filter(o => o.is_hidden_gem).length || 0,
        underrated: offers?.filter(o => o.is_underrated).length || 0,
    };

    const filteredOffers = offers?.filter(offer => {
        const matchesSearch = !searchQuery ||
            offer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            offer.offer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (offer.slug && offer.slug.toLowerCase().includes(searchQuery.toLowerCase()));

        if (!matchesSearch) return false;

        switch (activeFilter) {
            case 'featured': return offer.is_featured;
            case 'hidden_gem': return offer.is_hidden_gem;
            case 'underrated': return offer.is_underrated;
            default: return true;
        }
    }).sort((a, b) => {
        switch (sortOption) {
            case "name-asc":
                return a.name.localeCompare(b.name);
            case "name-desc":
                return b.name.localeCompare(a.name);
            case "featured-first":
                return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0) || a.name.localeCompare(b.name);
            case "hidden-first":
                return (b.is_hidden_gem ? 1 : 0) - (a.is_hidden_gem ? 1 : 0) || a.name.localeCompare(b.name);
            case "underrated-first":
                return (b.is_underrated ? 1 : 0) - (a.is_underrated ? 1 : 0) || a.name.localeCompare(b.name);
            default:
                return 0;
        }
    }) || [];

    if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    if (error) return <div className="p-4 text-red-500">Error loading offers: {error.message}</div>;
    if (!offers) return null;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Visibility Control</h2>
                    <p className="text-muted-foreground">Manage featured status, hidden gems, and underrated perks.</p>
                </div>

                {/* Bulk Actions */}
                {selectedOffers.size > 0 && (
                    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                        <span className="text-sm font-medium">{selectedOffers.size} selected</span>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" disabled={isBulkUpdating}>
                                    {isBulkUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    Bulk Actions
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Set Status</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleBulkAction('is_featured', true)}>
                                    Mark as Featured
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleBulkAction('is_featured', false)}>
                                    Unmark Featured
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleBulkAction('is_hidden_gem', true)}>
                                    Mark as Hidden Gem
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleBulkAction('is_hidden_gem', false)}>
                                    Unmark Hidden Gem
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleBulkAction('is_underrated', true)}>
                                    Mark as Underrated
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleBulkAction('is_underrated', false)}>
                                    Unmark Underrated
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedOffers(new Set())}>
                            Clear
                        </Button>
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-4 bg-card p-4 rounded-lg border shadow-sm">
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                    {/* Search */}
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                            placeholder="Search by title, brand, slug..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    {/* Sort Dropdown */}
                    <div className="w-full sm:w-auto">
                        <Select value={sortOption} onValueChange={setSortOption}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                                <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                                <SelectItem value="featured-first">Featured First</SelectItem>
                                <SelectItem value="hidden-first">Hidden Gems First</SelectItem>
                                <SelectItem value="underrated-first">Underrated First</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg overflow-x-auto max-w-full no-scrollbar">
                    <Button
                        variant={activeFilter === 'all' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setActiveFilter('all')}
                        className="text-xs whitespace-nowrap"
                    >
                        All ({counts.all})
                    </Button>
                    <Button
                        variant={activeFilter === 'featured' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setActiveFilter('featured')}
                        className="text-xs whitespace-nowrap"
                    >
                        Featured ({counts.featured})
                    </Button>
                    <Button
                        variant={activeFilter === 'hidden_gem' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setActiveFilter('hidden_gem')}
                        className="text-xs whitespace-nowrap"
                    >
                        Hidden Gems ({counts.hidden_gem})
                    </Button>
                    <Button
                        variant={activeFilter === 'underrated' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setActiveFilter('underrated')}
                        className="text-xs whitespace-nowrap"
                    >
                        Underrated ({counts.underrated})
                    </Button>
                </div>
            </div>

            <div className="border rounded-lg bg-card shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50 hover:bg-muted/50">
                            <TableHead className="w-[50px]">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={() => handleSelectAll(filteredOffers)}
                                >
                                    {selectedOffers.size === filteredOffers.length && filteredOffers.length > 0 ?
                                        <CheckSquare className="h-4 w-4 text-primary" /> :
                                        <Square className="h-4 w-4 text-muted-foreground" />
                                    }
                                </Button>
                            </TableHead>
                            <TableHead>Offer Details</TableHead>
                            <TableHead className="text-center w-[120px]">Featured</TableHead>
                            <TableHead className="text-center w-[120px]">Hidden Gem</TableHead>
                            <TableHead className="text-center w-[120px]">Underrated</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredOffers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                    No offers found matching your criteria.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredOffers.map((offer) => (
                                <TableRow key={offer.id} className="hover:bg-muted/5">
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0"
                                            onClick={() => handleSelect(offer.id)}
                                        >
                                            {selectedOffers.has(offer.id) ?
                                                <CheckSquare className="h-4 w-4 text-primary" /> :
                                                <Square className="h-4 w-4 text-muted-foreground" />
                                            }
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="relative h-10 w-10 rounded-lg bg-muted/30 border flex items-center justify-center overflow-hidden flex-shrink-0">
                                                {offer.logo && (
                                                    offer.logo.endsWith('.mp4') || offer.logo.endsWith('.webm') ? (
                                                        <video
                                                            src={offer.logo}
                                                            className="h-full w-full object-cover"
                                                            autoPlay
                                                            loop
                                                            muted
                                                            playsInline
                                                        />
                                                    ) : (
                                                        <Image src={offer.logo} alt={offer.name} fill className="object-contain p-1" />
                                                    )
                                                )}
                                                {!offer.logo && (
                                                    <span className="text-xs font-bold text-muted-foreground">{offer.name.charAt(0)}</span>
                                                )}
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="font-medium truncate">{offer.name}</span>
                                                <span className="text-xs text-muted-foreground truncate">{offer.offer}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex justify-center">
                                            <Switch
                                                checked={offer.is_featured}
                                                onCheckedChange={(checked) => handleToggle(offer.id, 'is_featured', !checked)}
                                                className="data-[state=checked]:bg-primary"
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex justify-center">
                                            <Switch
                                                checked={offer.is_hidden_gem}
                                                onCheckedChange={(checked) => handleToggle(offer.id, 'is_hidden_gem', !checked)}
                                                className="data-[state=checked]:bg-amber-500"
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex justify-center">
                                            <Switch
                                                checked={offer.is_underrated}
                                                onCheckedChange={(checked) => handleToggle(offer.id, 'is_underrated', !checked)}
                                                className="data-[state=checked]:bg-purple-500"
                                            />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="text-xs text-muted-foreground text-center">
                Showing {filteredOffers.length} of {offers.length} offers
            </div>
        </div>
    );
};
