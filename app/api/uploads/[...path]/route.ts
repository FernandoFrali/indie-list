import { type NextRequest, NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { existsSync } from "node:fs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  try {
    const { path } = await params;

    const filePath = join(process.cwd(), "uploads", ...path);

    if (!filePath.startsWith(join(process.cwd(), "uploads"))) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    if (!existsSync(filePath)) {
      return new NextResponse("Not found", { status: 404 });
    }

    const file = await readFile(filePath);
    const ext = filePath.split(".").pop()?.toLowerCase();

    const contentTypes: Record<string, string> = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      webp: "image/webp",
      svg: "image/svg+xml",
      pdf: "application/pdf",
    };

    return new NextResponse(file, {
      headers: {
        "Content-Type": contentTypes[ext || ""] || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    return new NextResponse("Error reading file", { status: 500 });
  }
}
