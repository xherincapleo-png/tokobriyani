import { NextResponse } from "next/server";
import crypto from "crypto";
import path from "path";
import { mkdir, writeFile } from "fs/promises";
import { getAdminSession } from "@/lib/supabase/admin-auth";
import { isSupabaseServiceConfigured } from "@/lib/supabase/config";
import { createSupabaseServiceClient } from "@/lib/supabase/server";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Please attach an image file." },
        { status: 400 }
      );
    }

    const ext = ALLOWED_MIME_TYPES[file.type];
    if (!ext) {
      return NextResponse.json(
        { error: "Only JPG, PNG, and WebP images are permitted." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: "Image file must be 5 MB or smaller." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const filename = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}.${ext}`;

    if (isSupabaseServiceConfigured()) {
      const supabase = createSupabaseServiceClient();
      if (supabase) {
        const storagePath = `products/${filename}`;
        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(storagePath, buffer, {
            contentType: file.type,
            upsert: false,
          });

        if (uploadError) {
          return NextResponse.json(
            { error: `Storage upload failed: ${uploadError.message}` },
            { status: 500 }
          );
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from("product-images").getPublicUrl(storagePath);

        return NextResponse.json({ url: publicUrl, storage: "supabase" });
      }
    }

    // Local preview fallback: save securely inside public/uploads/
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });
    await writeFile(path.join(uploadsDir, filename), buffer);

    return NextResponse.json({
      url: `/uploads/${filename}`,
      storage: "local-preview",
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Image upload failed" },
      { status: 500 }
    );
  }
}
