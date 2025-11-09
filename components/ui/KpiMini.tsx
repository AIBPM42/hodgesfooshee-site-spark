export function KpiMini({
  label,
  value,
  note,
  delta
}: {
  label: string;
  value: string;
  note?: string;
  delta?: { v: string; dir: 'up' | 'down' | 'flat' };
}) {
  return (
    <div className="bg-white rounded-xl border border-[#E8E3DA] shadow-sm p-4">
      <div className="text-sm text-[#6B7280] mb-1">{label}</div>
      <div className="text-2xl font-bold text-[#1F2937] mb-1">{value}</div>
      {note && <div className="text-xs text-[#6B7280]">{note}</div>}
      {delta && (
        <div className={`text-xs mt-2 ${
          delta.dir === 'up' ? 'text-green-600' :
          delta.dir === 'down' ? 'text-red-600' :
          'text-[#6B7280]'
        }`}>
          {delta.v}
        </div>
      )}
    </div>
  );
}
