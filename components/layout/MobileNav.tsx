'use client';

import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Link from 'next/link';
import { useState } from 'react';

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <nav className="flex flex-col gap-4 mt-8">
          <Link href="/" onClick={() => setOpen(false)} className="text-lg font-medium">
            Home
          </Link>
          <Link href="/tools" onClick={() => setOpen(false)} className="text-lg font-medium">
            All Tools
          </Link>
          <Link href="/favorites" onClick={() => setOpen(false)} className="text-lg font-medium">
            Favorites
          </Link>
          <Link href="/how-we-verify" onClick={() => setOpen(false)} className="text-lg font-medium">
            How We Verify
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
