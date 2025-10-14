export const toResoParams = (input: any) => ({
  City: input.city,
  ListPriceMin: input.minPrice,
  ListPriceMax: input.maxPrice,
  BedroomsTotal: input.beds,
  BathroomsTotal: input.baths,
  $top: input.pageSize || "10",
  $skip: input.page ? String((Number(input.page) - 1) * Number(input.pageSize || 10)) : "0",
});

let cachedToken: string | null = null;
export async function getMlsToken() {
  if (cachedToken) return cachedToken;
  const res = await fetch("https://api.realtyfeed.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.MLS_CLIENT_ID,
      client_secret: process.env.MLS_CLIENT_SECRET,
    }),
  });
  const data = await res.json();
  cachedToken = data.access_token;
  return cachedToken;
}
