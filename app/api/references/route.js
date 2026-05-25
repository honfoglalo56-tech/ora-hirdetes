import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(req) {
  try {
    const { model, text } = await req.json();
    if (!model || !text) return Response.json({ error: "Hiányzó adat" }, { status: 400 });

    const { error } = await supabase.from("watch_references").insert({ model, text });
    if (error) throw error;

    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("watch_references")
      .select("id, model, text, created_at")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return Response.json({ data });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
