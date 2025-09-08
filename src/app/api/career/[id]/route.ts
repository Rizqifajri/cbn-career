// src/app/api/career/[id]/route.ts
import { NextResponse } from "next/server";

const BASE = process.env.UPSTREAM_BASE!;
const TOKEN = process.env.BARRIER_TOKEN;

// ImageKit configuration
const IMAGEKIT_PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY || "";
const IMAGEKIT_UPLOAD_URL = "https://upload.imagekit.io/api/v1/files/upload";
const DEFAULT_FOLDER = process.env.IMAGEKIT_FOLDER || "/Career";

/** ==== Types ==== */
type RequirementsField = string[] | string | undefined;

interface CareerUpdatePayload {
  id?: string | number;
  branch?: string;
  title?: string;
  location?: string;
  role?: string;
  type?: string;
  image?: string;
  imageId?: string;
  requirements?: string[];
  // tambahkan field lain jika backend butuh
}

interface ImageKitSuccess {
  url: string;
  fileId: string;
  name?: string;
  size?: number;
  width?: number;
  height?: number;
  thumbnailUrl?: string;
  fileType?: string;
  [k: string]: unknown;
}

interface ImageKitError {
  message?: string;
  [k: string]: unknown;
}

function toErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  try {
    return JSON.stringify(err);
  } catch {
    return "Unknown error";
  }
}

function parseRequirements(input: RequirementsField): string[] | undefined {
  if (Array.isArray(input)) return input.map(String).filter(Boolean);
  if (typeof input === "string") {
    // coba JSON.parse dulu
    try {
      const parsed = JSON.parse(input);
      if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
    } catch {
      // fallback: split newline/comma
      const parts = input.split(/\r?\n|,/).map((s) => s.trim()).filter(Boolean);
      return parts.length ? parts : undefined;
    }
  }
  return undefined;
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const res = await fetch(`${BASE}/career/${params.id}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
      },
      cache: "no-store",
    });

    const text = await res.text();
    try {
      return NextResponse.json(JSON.parse(text), { status: res.status });
    } catch {
      return NextResponse.json({ message: text }, { status: res.status });
    }
  } catch (error: unknown) {
    console.error("Career GET error:", error);
    return NextResponse.json(
      { message: toErrorMessage(error) || "Failed to fetch career" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  console.log(`PUT /api/career/${params.id} - Starting request processing`);

  try {
    const contentType = req.headers.get("content-type") || "";
    console.log("Content-Type:", contentType);

    const body: CareerUpdatePayload = {};
    let imageFile: File | null = null;

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      imageFile = (formData.get("image") as File | null) ?? null;
      console.log(
        "Image file:",
        imageFile ? `${imageFile.name} (${imageFile.size} bytes)` : "No file"
      );

      for (const [key, rawValue] of formData.entries()) {
        if (key === "image") continue;

        // value bisa string atau File (walau utk field selain image biasanya string)
        if (key === "requirements") {
          const reqs = typeof rawValue === "string" ? rawValue : undefined;
          const normalized = parseRequirements(reqs);
          if (normalized) body.requirements = normalized;
          continue;
        }

        // isikan field umum sebagai string
        if (typeof rawValue === "string") {
          (body as Record<string, unknown>)[key] = rawValue;
        }
      }
    } else {
      // application/json
      const jsonBody = (await req.json()) as unknown;
      if (jsonBody && typeof jsonBody === "object") {
        const obj = jsonBody as Record<string, unknown>;
        // copy hanya field yang kita kenal
        if (typeof obj.branch === "string") body.branch = obj.branch;
        if (typeof obj.title === "string") body.title = obj.title;
        if (typeof obj.location === "string") body.location = obj.location;
        if (typeof obj.role === "string") body.role = obj.role;
        if (typeof obj.type === "string") body.type = obj.type;
        if (typeof obj.image === "string") body.image = obj.image;
        if (typeof obj.imageId === "string") body.imageId = obj.imageId;

        const normalizedReqs = parseRequirements(
          (obj.requirements as RequirementsField) ?? undefined
        );
        if (normalizedReqs) body.requirements = normalizedReqs;
      }
    }

    console.log("Processed body:", body);

    // Upload new image if provided & we have ImageKit credentials
    if (imageFile) {
      if (!IMAGEKIT_PRIVATE_KEY) {
        console.log("ImageKit credentials missing - IMAGEKIT_PRIVATE_KEY not set");
        return NextResponse.json(
          { message: "Image upload configuration missing" },
          { status: 500 }
        );
      }

      console.log("Starting ImageKit upload for update...");

      if (!imageFile.type.startsWith("image/")) {
        return NextResponse.json({ message: "File must be an image" }, { status: 400 });
      }

      const ikForm = new FormData();
      ikForm.append("file", imageFile);
      ikForm.append("fileName", imageFile.name);
      ikForm.append("folder", DEFAULT_FOLDER);
      ikForm.append("tags", "career,job-posting");

      const authString = `${IMAGEKIT_PRIVATE_KEY}:`;
      const authHeader = "Basic " + Buffer.from(authString).toString("base64");

      console.log("ImageKit upload request:", {
        url: IMAGEKIT_UPLOAD_URL,
        fileName: imageFile.name,
        fileSize: imageFile.size,
        folder: DEFAULT_FOLDER,
      });

      const ikRes = await fetch(IMAGEKIT_UPLOAD_URL, {
        method: "POST",
        headers: { Authorization: authHeader },
        body: ikForm,
      });

      console.log("ImageKit response status:", ikRes.status);

      const ikText = await ikRes.text();
      let imageKitData: ImageKitSuccess | ImageKitError = {};
      try {
        imageKitData = ikText ? (JSON.parse(ikText) as ImageKitSuccess | ImageKitError) : {};
      } catch {
        // jika bukan JSON, bungkus sebagai error
        imageKitData = { message: ikText };
      }

      if (!ikRes.ok) {
        console.error("ImageKit upload failed:", imageKitData);
        return NextResponse.json(
          {
            message: "Image upload failed",
            detail: imageKitData,
            error:
              (imageKitData as ImageKitError).message || "Unknown ImageKit error",
          },
          { status: 400 }
        );
      }

      const success = imageKitData as ImageKitSuccess;
      body.image = success.url;
      body.imageId = success.fileId;

      console.log("Image uploaded successfully:", success.url);
    } else {
      console.log("No new image file to upload");
    }

    // Handle empty image field
    if (body.image === "" || body.image === null) {
      delete body.image;
    }

    // Add ID to body for backend processing
    body.id = params.id;

    console.log("Final body to send to backend:", body);

    // Send update request to backend
    const res = await fetch(`${BASE}/career/${params.id}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
      },
      body: JSON.stringify(body),
    });

    console.log("Backend API response status:", res.status);

    const text = await res.text();
    console.log("Backend API response text:", text);

    try {
      const jsonResponse = JSON.parse(text) as unknown;
      return NextResponse.json(jsonResponse, { status: res.status });
    } catch {
      return NextResponse.json({ message: text }, { status: res.status });
    }
  } catch (error: unknown) {
    console.error("Career PUT error:", error);
    return NextResponse.json(
      { message: toErrorMessage(error) || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const res = await fetch(`${BASE}/career/${params.id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
      },
    });

    const text = await res.text();
    try {
      return NextResponse.json(JSON.parse(text), { status: res.status });
    } catch {
      return NextResponse.json({ message: text }, { status: res.status });
    }
  } catch (error: unknown) {
    console.error("Career DELETE error:", error);
    return NextResponse.json(
      { message: "Failed to delete career" },
      { status: 500 }
    );
  }
}
