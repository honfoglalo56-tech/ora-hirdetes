const TRUSTED_SOURCES = [
  "chrono24.com",
  "ebay.com",
  "watchuseek.com",
  "yahoo.co.jp auctions",
  "catawiki.com"
].join(", ");

export async function POST(req) {
  try {
    const { model, year } = await req.json();

    const userText = `Search for recent sales and current listings of the following watch: ${model}${year ? ` (${year})` : ""}.

Search these platforms: ${TRUSTED_SOURCES}. Also search Yahoo Auctions Japan in Japanese if relevant.

Return a JSON array of the most relevant results found. Each result should have:
- platform (string): the website name
- price (string): the price with currency
- condition (string): brief condition description if available
- url (string): the listing URL if available
- date (string): sale date or "current listing" if still available

Return ONLY a JSON array, no other text. Maximum 8 results. Focus on actual sold prices or current listings, not articles.`;

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "anthropic-beta": "web-search-2025-03-05",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5",
        max_tokens: 1000,
        tools: [{ type: "web_search_20250305", name: "web_search", max_uses: 5 }],
        messages: [{ role: "user", content: userText }],
      }),
    });

    const data = await res.json();
    if (data.error) throw new Error(data.error.message);

    const text = data.content
      .filter(b => b.type === "text")
      .map(b => b.text || "")
      .join("");

    // Parse JSON from response
    let prices = [];
    try {
      const match = text.match(/\[[\s\S]*\]/);
      if (match) prices = JSON.parse(match[0]);
    } catch (e) {
      prices = [];
    }

    return Response.json({ prices });
  } catch (err) {
    console.error(err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
