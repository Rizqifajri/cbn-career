import { NextResponse } from "next/server";

const BASE = process.env.UPSTREAM_BASE;

// ✅ Read Career by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const res = await fetch(`${BASE}/career/${params.id}`, {
      method: "GET",
    });

    const text = await res.text(); // buat logging
    console.log("GET /career/:id →", res.status, text);

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch career", detail: text },
        { status: res.status }
      );
    }

    return new NextResponse(text, {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("GET /career/:id error →", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await req.formData();

    // 🔎 Debug semua field yang dikirim dari FE
    formData.forEach((val, key) => {
      console.log("PUT sending field:", key, val);
    });

    const res = await fetch(`${BASE}/career/${params.id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${process.env.BARRIER_TOKEN!}`,
      },
      body: formData,
    });

    const text = await res.text();
    console.log("PUT /career/:id →", res.status, text);

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to update career", detail: text },
        { status: res.status }
      );
    }

    return new NextResponse(text, {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("PUT /career/:id error →", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}



export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const res = await fetch(`${BASE}/career/${params.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${process.env.BARRIER_TOKEN!}`,
      },
    });

    const text = await res.text();
    console.log("DELETE /career/:id →", res.status, text);

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to delete career", detail: text },
        { status: res.status }
      );
    }

    return new NextResponse(text, {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("DELETE /career/:id error →", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
