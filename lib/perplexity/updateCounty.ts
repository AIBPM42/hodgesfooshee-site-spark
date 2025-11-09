import { getApiKey } from "@/lib/safeKeys";

/**
 * Generate a county market narrative using Perplexity AI
 * @param countyName - Full county name (e.g., "Davidson County")
 * @returns AI-generated 3-paragraph narrative
 */
export async function generateCountyNarrative(countyName: string): Promise<string> {
  try {
    const apiKey = await getApiKey("perplexity");

    if (!apiKey) {
      console.warn("[Perplexity] No API key found, returning placeholder");
      return getPlaceholderNarrative(countyName);
    }

    const prompt = `Write a comprehensive 3-paragraph real estate market summary for ${countyName}, Tennessee.

Paragraph 1: Discuss current market conditions, median home prices, population growth trends, and overall market competitiveness. Include specific data points if available.

Paragraph 2: Describe buyer trends, popular neighborhoods, price points, and what types of buyers are attracted to this area. Include information about first-time buyers vs. move-up buyers.

Paragraph 3: Cover school quality, economic fundamentals, infrastructure development, and long-term growth outlook. Discuss appeal to both homeowners and investors.

Keep the tone professional but accessible. Focus on facts and market fundamentals.`;

    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-sonar-large-128k-online",
        messages: [
          {
            role: "system",
            content: "You are a professional real estate market analyst providing accurate, data-driven market summaries.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 800,
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Perplexity] API error ${response.status}:`, errorText);
      return getPlaceholderNarrative(countyName);
    }

    const data = await response.json();
    const narrative = data.choices?.[0]?.message?.content;

    if (!narrative) {
      console.error("[Perplexity] No narrative content in response");
      return getPlaceholderNarrative(countyName);
    }

    return narrative.trim();
  } catch (error) {
    console.error("[Perplexity] Error generating narrative:", error);
    return getPlaceholderNarrative(countyName);
  }
}

/**
 * Fallback placeholder narrative when Perplexity is unavailable
 */
function getPlaceholderNarrative(countyName: string): string {
  return `${countyName} is experiencing dynamic growth in the Middle Tennessee real estate market. The area continues to attract new residents and businesses, driving sustained demand for housing across multiple price points. Market conditions remain competitive with strong fundamentals supporting long-term value appreciation.

Buyer activity in ${countyName} reflects diverse demographic trends, with both first-time buyers and move-up purchasers finding opportunities that match their needs. Popular neighborhoods offer a range of amenities and lifestyle options, from urban convenience to suburban tranquility. The local real estate market provides options for various buyer profiles and investment strategies.

The county's economic foundation, school systems, and ongoing infrastructure development position it well for continued growth. Both homeowners seeking quality of life and investors looking for appreciation potential find ${countyName} an attractive market. The combination of job growth, community investment, and strategic location within the Nashville metropolitan area supports a positive long-term outlook.`;
}
