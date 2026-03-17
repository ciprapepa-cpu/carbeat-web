import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { CAR_STATUSES } from "@/lib/validations/car";

const statusSchema = z.object({
  status: z.enum(CAR_STATUSES),
});

async function requireAuth() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  return user;
}

// PATCH /api/admin/cars/[id]/status — change car status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireAuth();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = statusSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Neplatný stav" }, { status: 400 });
  }

  const isPublished = parsed.data.status === "v_nabidce";

  const { data, error } = await supabaseAdmin
    .from("cars")
    .update({
      status: parsed.data.status,
      is_published: isPublished,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
