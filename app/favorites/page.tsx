import PageLayout from '@/components/layout/PageLayout';
import { FavoritesContent } from '@/components/favorites/FavoritesContent';

export const dynamic = 'force-dynamic';

export default function FavoritesPage() {
  return (
    <PageLayout offers={[]}>
      <FavoritesContent />
    </PageLayout>
  );
}
