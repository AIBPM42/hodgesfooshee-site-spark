import { Card, Header, Body } from '@/components/cards/Card'

export default function SegmentsPage(){
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold">Market Segments</h1>
        <p className="text-sm text-[var(--sub)]">Price band analysis, property types, buyer profiles.</p>
      </div>

      <Card>
        <Header title="Coming Soon" subtitle="Segment intelligence dashboard" />
        <Body>
          <p className="text-[var(--sub)]">This view will show price band performance, property type trends, and buyer segment analysis.</p>
        </Body>
      </Card>
    </div>
  );
}
