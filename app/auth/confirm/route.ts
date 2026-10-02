import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);

  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");

  if (tokenHash && type === "email") {
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json(
        { error: "Email verification is unavailable because Supabase is not configured." },
        { status: 503 }
      );
    }

    const { error } = await supabase.auth.verifyOtp({
      type: "email",
      token_hash: tokenHash,
    });

    if (!error) {
      return NextResponse.redirect(`${origin}/dashboard`);
    }
  }

  return NextResponse.redirect(
    `${origin}/login?error=verification_failed`
  );
}
