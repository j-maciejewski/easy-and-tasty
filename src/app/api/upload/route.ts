import sharp from "sharp";
import { UTApi } from "uploadthing/server";

const MAX_IMAGE_SIZE = 1600;
const PASSTHROUGH_TYPES = ["image/gif", "image/svg+xml"];

// Large originals are slow to fetch from the CDN and can exceed the
// Next.js image optimizer's 7s upstream timeout, so store them small.
async function compressImage(file: File) {
  if (!file.type.startsWith("image/") || PASSTHROUGH_TYPES.includes(file.type))
    return file;

  const buffer = await sharp(Buffer.from(await file.arrayBuffer()))
    .rotate()
    .resize({
      width: MAX_IMAGE_SIZE,
      height: MAX_IMAGE_SIZE,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 80 })
    .toBuffer();

  return new File(
    [new Uint8Array(buffer)],
    `${file.name.replace(/\.[^.]+$/, "")}.webp`,
    { type: "image/webp" },
  );
}

export async function POST(req: Request) {
  const utapi = new UTApi();
  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File))
    return Response.json(
      { data: null, error: "No file provided" },
      { status: 400 },
    );

  const response = await utapi.uploadFiles(await compressImage(file));

  if (response.data) {
    // Fetch once so the CDN caches the file before the first page view asks for it
    await fetch(response.data.ufsUrl, {
      signal: AbortSignal.timeout(30_000),
    }).catch(() => null);

    return Response.json({
      data: { name: response.data.name, url: response.data.ufsUrl },
      error: null,
    });
  }

  return Response.json(
    { data: null, error: response.error.message },
    { status: 201 },
  );
}
