import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import sharp from "sharp";

const uploadsDir = path.join(process.cwd(), "public", "uploads");
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const MAX_FILES_PER_REQUEST = 10;
const MAX_DIMENSION = 1600;
const COVER_WIDTH = 1200;
const COVER_HEIGHT = 1500;

type UploadPreset = "cover" | "gallery";
type CropFocus = "center" | "north" | "south" | "east" | "west";

function getPreset(value: FormDataEntryValue | null): UploadPreset {
  return value === "cover" ? "cover" : "gallery";
}

function getCropFocus(value: FormDataEntryValue | null): CropFocus {
  switch (value) {
    case "north":
    case "south":
    case "east":
    case "west":
      return value;
    default:
      return "center";
  }
}

async function transformImage(file: File, preset: UploadPreset, cropFocus: CropFocus): Promise<Buffer> {
  const inputBuffer = Buffer.from(await file.arrayBuffer());
  let transformer = sharp(inputBuffer).rotate();

  if (preset === "cover") {
    transformer = transformer.resize(COVER_WIDTH, COVER_HEIGHT, {
      fit: "cover",
      position: cropFocus,
    });
  } else {
    transformer = transformer.resize(MAX_DIMENSION, MAX_DIMENSION, {
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  return transformer
    .webp({
      quality: preset === "cover" ? 82 : 80,
      effort: 4,
    })
    .toBuffer();
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const entries = formData.getAll("files");
    const preset = getPreset(formData.get("preset"));
    const cropFocus = getCropFocus(formData.get("cropFocus"));

    if (!entries.length) {
      return NextResponse.json({ message: "No files received." }, { status: 400 });
    }

    if (entries.length > MAX_FILES_PER_REQUEST) {
      return NextResponse.json({ message: "Too many files in one upload." }, { status: 400 });
    }

    await fs.mkdir(uploadsDir, { recursive: true });

    const urls: string[] = [];

    for (const entry of entries) {
      if (!(entry instanceof File)) {
        continue;
      }

      if (!entry.type.startsWith("image/")) {
        return NextResponse.json({ message: "Only image uploads are allowed." }, { status: 400 });
      }

      if (entry.size > MAX_FILE_SIZE_BYTES) {
        return NextResponse.json(
          { message: "Each image must be 5 MB or smaller." },
          { status: 400 },
        );
      }

      const buffer = await transformImage(entry, preset, cropFocus);
      const extension = ".webp";
      const filename = `${Date.now()}-${randomUUID()}${extension}`;
      const filepath = path.join(uploadsDir, filename);

      await fs.writeFile(filepath, buffer);
      urls.push(`/uploads/${filename}`);
    }

    return NextResponse.json({ urls });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Upload failed." },
      { status: 500 },
    );
  }
}
