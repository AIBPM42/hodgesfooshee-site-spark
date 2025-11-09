import { Card, Header, Body } from '@/components/cards/Card'

export default function ConstructionPage(){
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold">New Construction</h1>
        <p className="text-sm text-[var(--sub)]">Builder activity, inventory, and absorption trends.</p>
      </div>

      <Card>
        <Header title="Coming Soon" subtitle="New construction analytics" />
        <Body>
          <p className="text-[var(--sub)]">This view will track builder inventory, new construction permits, and community absorption rates.</p>
        </Body>
      </Card>
    </div>
  );
}
