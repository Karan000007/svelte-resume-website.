import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

async function refreshTokenIfNeeded(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  settings: {
    google_access_token: string;
    google_refresh_token: string | null;
    google_token_expiry: string | null;
  }
) {
  if (
    settings.google_token_expiry &&
    new Date(settings.google_token_expiry) > new Date()
  ) {
    return settings.google_access_token;
  }

  if (!settings.google_refresh_token) return null;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: settings.google_refresh_token,
      grant_type: "refresh_token",
    }),
  });

  const tokens = await res.json();
  if (!tokens.access_token) return null;

  await supabase.from("user_settings").update({
    google_access_token: tokens.access_token,
    google_token_expiry: new Date(
      Date.now() + tokens.expires_in * 1000
    ).toISOString(),
  }).eq("user_id", userId);

  return tokens.access_token;
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data: settings } = await supabase
    .from("user_settings")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!settings?.google_access_token) {
    return NextResponse.json(
      { error: "Google Calendar not connected" },
      { status: 400 }
    );
  }

  const accessToken = await refreshTokenIfNeeded(supabase, user.id, settings);
  if (!accessToken) {
    return NextResponse.json(
      { error: "Failed to refresh Google token. Please reconnect." },
      { status: 401 }
    );
  }

  const { company, role, nextStep, nextStepDate } = await request.json();

  const event = {
    summary: `${nextStep} — ${company} (${role})`,
    description: `Job application next step for ${role} at ${company}`,
    start: {
      date: nextStepDate,
    },
    end: {
      date: nextStepDate,
    },
    reminders: {
      useDefault: false,
      overrides: [{ method: "popup", minutes: 60 }],
    },
  };

  const calRes = await fetch(
    "https://www.googleapis.com/calendar/v3/calendars/primary/events",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    }
  );

  if (!calRes.ok) {
    const err = await calRes.text();
    return NextResponse.json(
      { error: "Failed to create calendar event", details: err },
      { status: 500 }
    );
  }

  const created = await calRes.json();
  return NextResponse.json({ success: true, eventId: created.id });
}
