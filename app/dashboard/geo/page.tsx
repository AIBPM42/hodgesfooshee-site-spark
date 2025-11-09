import { Card, Header, Body } from '@/components/cards/Card'

export default function GeoPage(){
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold">Geographic Intelligence</h1>
        <p className="text-sm text-[var(--sub)]">County, city, and ZIP-level market dynamics.</p>
      </div>

      <Card>
        <Header title="Coming Soon" subtitle="Geographic market breakdown" />
        <Body>
          <p className="text-[var(--sub)]">This view will show detailed county, city, and ZIP code analytics with interactive maps.</p>
        </Body>
      </Card>
    </div>
  );
}
