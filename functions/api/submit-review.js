// submit-review.js
// Cloudflare Workers function to store a new review in D1
// Binding name: DB (configured in wrangler.toml)
// Table: reviews (id auto-increment, name, city, rating, comment, approved)
export async function onRequest(context) {
  try {
    const { request, env } = context;
    const DB = env.DB; // D1 binding
    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: { "Content-Type": "application/json" } });
    }
    const data = await request.json();
    const { name, city = null, rating, comment } = data;
    if (!name || rating == null || !comment) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    const stmt = DB.prepare("INSERT INTO reviews (name, city, rating, comment, approved) VALUES (?, ?, ?, ?, 0)");
    const result = await stmt.bind(name, city, rating, comment).run();
    if (result.success) {
      return new Response(JSON.stringify({ success: true }), { status: 200, headers: { "Content-Type": "application/json" } });
    }
    return new Response(JSON.stringify({ error: "Database error" }), { status: 500, headers: { "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
