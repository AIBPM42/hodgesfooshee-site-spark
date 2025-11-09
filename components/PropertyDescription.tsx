/**
 * PropertyDescription Component
 * Transforms plain MLS text into structured, readable premium format
 * Adds visual rhythm without modifying source data
 */

interface PropertyDescriptionProps {
  description: string;
}

export default function PropertyDescription({ description }: PropertyDescriptionProps) {
  // Split description into paragraphs (by double line breaks or single if long)
  const paragraphs = description
    .split(/\n\n+|\n(?=[A-Z])/) // Split on double newlines or newlines before capitals
    .map(p => p.trim())
    .filter(p => p.length > 0);

  // Detect if first paragraph is a "welcome" or summary statement
  const hasIntro = paragraphs[0]?.length < 200;

  return (
    <div className="space-y-5 text-[#374151] leading-relaxed" style={{fontSize: '1.05rem', lineHeight: '1.75', letterSpacing: '0.01em'}}>
      {paragraphs.map((paragraph, idx) => {
        // Check if paragraph contains bullet-like patterns
        const hasBullets = paragraph.includes('•') || paragraph.includes('- ') || /^\d+\.\s/.test(paragraph);

        if (hasBullets) {
          // Convert to proper bullet list
          const items = paragraph
            .split(/\n|•|- /)
            .map(item => item.replace(/^\d+\.\s*/, '').trim())
            .filter(item => item.length > 0);

          return (
            <div key={idx} className="bg-[#FAF5EC]/60 border-l-4 border-[#E4552E] rounded-lg p-4">
              <ul className="space-y-2 list-disc pl-5 text-[#374151]">
                {items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          );
        }

        // Check if paragraph looks like a section header (short, all caps, or ends with colon)
        const isHeader = paragraph.length < 60 && (
          paragraph === paragraph.toUpperCase() ||
          paragraph.endsWith(':') ||
          /^(Features|Amenities|Location|Details|Overview|Highlights)/i.test(paragraph)
        );

        if (isHeader) {
          return (
            <h4 key={idx} className="text-lg font-bold text-[#111827] mt-6 mb-2">
              {paragraph.replace(/:$/, '')}
            </h4>
          );
        }

        // Special styling for first paragraph if it's an intro
        if (idx === 0 && hasIntro) {
          return (
            <p key={idx} className="text-lg font-medium text-[#374151] leading-relaxed">
              <strong className="text-[#111827] font-bold">
                {paragraph.split('.')[0]}.
              </strong>
              {paragraph.slice(paragraph.indexOf('.') + 1)}
            </p>
          );
        }

        // Regular paragraph
        return (
          <p key={idx} className="text-[#374151]">
            {paragraph}
          </p>
        );
      })}

      {/* Optional lifestyle hook if description is short */}
      {description.length < 300 && (
        <p className="text-base font-medium text-[#6B7280] italic pt-4 border-t border-neutral-200">
          Schedule a showing to experience this property firsthand.
        </p>
      )}
    </div>
  );
}

/**
 * Alternative: Simple formatter that just adds paragraph breaks
 * Use this if descriptions are well-formatted already
 */
export function SimplePropertyDescription({ description }: PropertyDescriptionProps) {
  const paragraphs = description.split('\n').filter(p => p.trim().length > 0);

  return (
    <div className="space-y-4 text-[#374151]" style={{fontSize: '1.05rem', lineHeight: '1.75', letterSpacing: '0.01em'}}>
      {paragraphs.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  );
}
