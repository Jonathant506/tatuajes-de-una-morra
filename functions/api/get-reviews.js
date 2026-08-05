// get-reviews.js
// Cloudflare Workers function to fetch approved reviews from D1
export async function onRequest(context) {
  try {
    const { env } = context;
    const DB = env.DB; // D1 binding
    const result = await DB.prepare("SELECT name, city, rating, comment FROM reviews WHERE approved = 1 ORDER BY id DESC").all();
    const reviews = result && result.results ? result.results : [];
    return new Response(JSON.stringify({ reviews }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
