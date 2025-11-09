"use server";

import path from "node:path";
import sharp from "sharp";
import { mkdir, unlink } from "node:fs/promises";
import { toast } from "sonner";

export async function saveBase64AsWebP(
  base64: string,
  type: "thumbnail" | "banner",
  userId: string,
) {
  const base64Data = base64.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64Data, "base64");

  const filename = `${type}-${userId}${Date.now()}.webp`;

  const dir = path.join(process.cwd(), "uploads");
  await mkdir(dir, { recursive: true });

  const filePath = path.join(dir, filename);

  await sharp(buffer).webp({ quality: 80 }).toFile(filePath);

  return `/api/uploads/${filename}`;
}

export async function deleteFileFromUploads(relativePath: string) {
  try {
    const filePath = path.join(process.cwd(), "public", relativePath);

    await unlink(filePath);
  } catch (err: any) {
    if (err.code !== "ENOENT") {
      toast.error("Erro ao deletar arquivo:", err);
    }
  }
}
