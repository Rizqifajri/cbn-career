import { NextResponse } from "next/server";

const BASE = process.env.UPSTREAM_BASE!;
const TOKEN = process.env.BARRIER_TOKEN;

// ImageKit configuration
const IMAGEKIT_PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY || "";
const IMAGEKIT_UPLOAD_URL = "https://upload.imagekit.io/api/v1/files/upload";
const DEFAULT_FOLDER = process.env.IMAGEKIT_FOLDER || "/Career";

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
  } catch (error: any) {
    console.error("Career GET error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to fetch career" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  console.log(`PUT /api/career/${params.id} - Starting request processing`);
  
  try {
    const contentType = req.headers.get("content-type");
    console.log("Content-Type:", contentType);
    
    let body: any = {};
    let imageFile: File | null = null;

    // Handle different content types
    if (contentType?.includes("multipart/form-data")) {
      const formData = await req.formData();
      console.log("FormData entries:");
      
      imageFile = formData.get("image") as File | null;
      console.log("Image file:", imageFile ? `${imageFile.name} (${imageFile.size} bytes)` : "No file");
      
      for (const [key, value] of formData.entries()) {
        console.log(`FormData[${key}]:`, value);
        if (key !== "image") {
          // Handle requirements array
          if (key === "requirements") {
            try {
              body[key] = JSON.parse(value as string);
            } catch {
              body[key] = value;
            }
          } else {
            body[key] = value;
          }
        }
      }
    } else {
      body = await req.json();
    }

    console.log("Processed body:", body);

    // Upload new image if provided
    if (imageFile && IMAGEKIT_PRIVATE_KEY) {
      console.log("Starting ImageKit upload for update...");
      
      try {
        // Validate file
        if (!imageFile.type.startsWith('image/')) {
          return NextResponse.json(
            { message: "File must be an image" },
            { status: 400 }
          );
        }

        // Prepare FormData for ImageKit
        const ikForm = new FormData();
        ikForm.append("file", imageFile);
        ikForm.append("fileName", imageFile.name);
        ikForm.append("folder", DEFAULT_FOLDER);
        ikForm.append("tags", "career,job-posting");

        // Create proper authentication header
        const authString = `${IMAGEKIT_PRIVATE_KEY}:`;
        const authHeader = "Basic " + Buffer.from(authString).toString("base64");

        console.log("ImageKit upload request:", {
          url: IMAGEKIT_UPLOAD_URL,
          fileName: imageFile.name,
          fileSize: imageFile.size,
          folder: DEFAULT_FOLDER
        });

        const ikRes = await fetch(IMAGEKIT_UPLOAD_URL, {
          method: "POST",
          headers: { 
            Authorization: authHeader,
          },
          body: ikForm,
        });

        console.log("ImageKit response status:", ikRes.status);
        
        const imageKitData = await ikRes.json();
        console.log("ImageKit response data:", imageKitData);
        
        if (!ikRes.ok) {
          console.error("ImageKit upload failed:", imageKitData);
          return NextResponse.json(
            { 
              message: "Image upload failed", 
              detail: imageKitData,
              error: imageKitData.message || "Unknown ImageKit error"
            },
            { status: 400 }
          );
        }

        body.image = imageKitData.url;
        body.imageId = imageKitData.fileId;
        
        console.log("Image uploaded successfully:", imageKitData.url);

      } catch (imageError: any) {
        console.error("Image upload error:", imageError);
        return NextResponse.json(
          { message: "Image upload failed", error: imageError.message },
          { status: 500 }
        );
      }
    } else {
      if (imageFile) {
        console.log("ImageKit credentials missing - IMAGEKIT_PRIVATE_KEY not set");
        return NextResponse.json(
          { message: "Image upload configuration missing" },
          { status: 500 }
        );
      }
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
      const jsonResponse = JSON.parse(text);
      return NextResponse.json(jsonResponse, { status: res.status });
    } catch {
      return NextResponse.json({ message: text }, { status: res.status });
    }

  } catch (error: any) {
    console.error("Career PUT error:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
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

  } catch (error: any) {
    console.error("Career DELETE error:", error);
    return NextResponse.json(
      { message: "Failed to delete career" },
      { status: 500 }
    );
  }
}