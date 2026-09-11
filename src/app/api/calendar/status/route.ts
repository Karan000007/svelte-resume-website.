import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ connected: false });
  }

  const { data: settings } = await supabase
    .from("user_settings")
    .select("google_access_token")
    .eq("user_id", user.id)
    .single();

  return NextResponse.json({
    connected: !!settings?.google_access_token,
  });
}
