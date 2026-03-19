import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { photoReorderSchema } from "@/lib/validations/car";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

async function requireAuth() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  return user;
}

// POST /api/admin/cars/[id]/photos — upload photos
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip = getClientIp(request);
  const { allowed } = checkRateLimit(ip, { limit: 20, windowSeconds: 60 });
  if (!allowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const user = await requireAuth();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = getSupabaseAdmin();
  const { id } = await params;

  // Verify car exists
  const { error: carError } = await admin
    .from("cars")
    .select("id")
    .eq("id", id)
    .single();

  if (carError) {
    return NextResponse.json({ error: "Auto nenalezeno" }, { status: 404 });
  }

  const formData = await request.formData();
  const files = formData.getAll("photos") as File[];

  if (files.length === 0) {
    return NextResponse.json({ error: "Žádné soubory" }, { status: 400 });
  }

  // Get current max position
  const { data: existingPhotos } = await admin
    .from("car_photos")
    .select("position")
    .eq("car_id", id)
    .order("position", { ascending: false })
    .limit(1);

  let nextPosition = (existingPhotos?.[0]?.position ?? -1) + 1;

  const uploaded: Array<{ id: string; storage_path: string; position: number }> = [];
  const errors: string[] = [];

  for (const file of files) {
    const nameLC = file.name.toLowerCase();
    const isHeic = nameLC.endsWith(".heic") || nameLC.endsWith(".heif");
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    // Accept HEIC/HEIF files (browser may report as application/octet-stream)
    if (!allowedTypes.includes(file.type) && !isHeic) {
      errors.push(`${file.name}: nepodporovaný formát (${file.type})`);
      continue;
    }

    // 10MB limit
    if (file.size > 10 * 1024 * 1024) {
      errors.push(`${file.name}: soubor je příliš velký (max 10 MB)`);
      continue;
    }

    // For HEIC files that weren't converted client-side, store as-is with jpeg content type
    const contentType = isHeic ? "image/jpeg" : file.type;
    const ext = isHeic ? "jpg" : (file.name.split(".").pop()?.toLowerCase() || "jpg");
    const storagePath = `${id}/${Date.now()}-${nextPosition}.${ext}`;

    const { error: uploadError } = await admin.storage
      .from("car-photos")
      .upload(storagePath, file, {
        contentType,
        upsert: false,
      });

    if (uploadError) {
      errors.push(`${file.name}: ${uploadError.message}`);
      continue;
    }

    const { data: photoRecord, error: insertError } = await admin
      .from("car_photos")
      .insert({
        car_id: id,
        storage_path: storagePath,
        position: nextPosition,
      })
      .select()
      .single();

    if (insertError) {
      errors.push(`${file.name}: ${insertError.message}`);
    } else if (photoRecord) {
      uploaded.push({
        id: photoRecord.id,
        storage_path: storagePath,
        position: nextPosition,
      });
    }

    nextPosition++;
  }

  return NextResponse.json({ uploaded, errors }, { status: 201 });
}

// PUT /api/admin/cars/[id]/photos — reorder photos
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireAuth();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = getSupabaseAdmin();
  const { id } = await params;
  const body = await request.json();
  const parsed = photoReorderSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validační chyba", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  for (const photo of parsed.data.photos) {
    await admin
      .from("car_photos")
      .update({ position: photo.position })
      .eq("id", photo.id)
      .eq("car_id", id);
  }

  return NextResponse.json({ success: true });
}

// DELETE /api/admin/cars/[id]/photos — delete one or multiple photos
// Single: ?photoId=xxx  |  Batch: ?photoIds=id1,id2,id3
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireAuth();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = getSupabaseAdmin();
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const photoId = searchParams.get("photoId");
  const photoIds = searchParams.get("photoIds");

  // Collect IDs to delete
  const idsToDelete: string[] = [];
  if (photoIds) {
    idsToDelete.push(...photoIds.split(",").filter(Boolean));
  } else if (photoId) {
    idsToDelete.push(photoId);
  } else {
    return NextResponse.json({ error: "photoId nebo photoIds je povinný" }, { status: 400 });
  }

  // Fetch all photos to get storage paths
  const { data: photos, error: fetchError } = await admin
    .from("car_photos")
    .select("id, storage_path")
    .in("id", idsToDelete)
    .eq("car_id", id);

  if (fetchError || !photos || photos.length === 0) {
    return NextResponse.json({ error: "Fotky nenalezeny" }, { status: 404 });
  }

  // Delete from storage (batch) — skip local /images/ paths
  const storagePaths = photos
    .map((p) => p.storage_path)
    .filter((path) => !path.startsWith("/images/"));
  if (storagePaths.length > 0) {
    await admin.storage.from("car-photos").remove(storagePaths);
  }

  // Delete from DB
  const { error } = await admin
    .from("car_photos")
    .delete()
    .in("id", photos.map((p) => p.id));

  if (error) {
    console.error("Admin photos DELETE error:", error.message);
    return NextResponse.json({ error: "Chyba při mazání fotek" }, { status: 500 });
  }

  return NextResponse.json({ success: true, deleted: photos.length });
}
