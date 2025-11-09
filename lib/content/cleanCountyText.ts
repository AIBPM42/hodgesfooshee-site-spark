export function cleanCountyText(raw: string) {
  if (!raw) return { html: "", plain: "", bullets: [] };

  // 1) kill markdown bold and inline footnotes like [1], [2]
  let txt = raw
    .replace(/\*\*/g, "")         // remove **bold**
    .replace(/\[(?:\d+|[^\]]+)\]/g, "") // remove [1] or [word]
    .replace(/ +/g, " ")          // collapse spaces
    .replace(/\s+\n/g, "\n")      // trim line tails
    .trim();

  // 2) make paragraphs
  const paras = txt
    .split(/\n{2,}/g)
    .map(s => s.trim())
    .filter(Boolean);

  // 3) simple takeaways (sentences with % / $ / days / months / key metrics)
  const sentences = txt.split(/(?<=[.!?])\s+/);
  const isKey = (s: string) =>
    /(\d+%|\$\d|days|months|median|trend|inventory|absorption|ratio|MoM|YoY|vs\.|up|down)/i.test(s);
  const bullets = sentences.filter(isKey).slice(0, 8);

  const html = paras.map(p => `<p>${escapeHtml(p)}</p>`).join("");
  return { html, plain: txt, bullets };
}

function escapeHtml(s: string) {
  const htmlEntities: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  };
  return s.replace(/[&<>"']/g, m => htmlEntities[m] || m);
}
