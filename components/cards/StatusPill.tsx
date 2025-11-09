export function StatusPill({
  status,
  updatedAt,
  source,
  provenance = "live"
}:{
  status:"idle"|"queued"|"running"|"succeeded"|"failed";
  updatedAt?:string;
  source?:string;
  provenance?: "live"|"partial"|"cached";
}){
  const tone = status === 'failed' ? '#EF4444' : status === 'running' ? '#F59E0B' : '#65A30D';
  const provenanceTone = provenance === 'live' ? '#65A30D' : provenance === 'partial' ? '#F59E0B' : '#94A3B8';
  const provenanceLabel = provenance === 'live' ? 'Live data' : provenance === 'partial' ? 'Partial refresh' : 'Cached';

  return (
    <span
      className="group inline-flex items-center gap-2 text-xs px-2.5 py-1 rounded-full border relative"
      style={{ borderColor: 'var(--border)', background: 'color-mix(in oklab, var(--panel) 82%, transparent)' }}
      title={`${provenanceLabel}${source ? ` • Source: ${source}` : ''}${updatedAt ? ` • ${updatedAt}` : ''}`}
    >
      <span className="inline-flex items-center gap-1.5">
        <span className="inline-block w-2 h-2 rounded-full animate-pulse" style={{ background:tone }} />
        <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background:provenanceTone }} />
      </span>
      {status === 'succeeded' && (updatedAt ? `Updated ${updatedAt}` : 'Updated')}
      {status === 'running' && 'Updating…'}
      {status === 'queued' && 'Queued'}
      {status === 'failed' && 'Failed'}
      {source && <span className="opacity-70">• {source}</span>}
    </span>
  );
}
