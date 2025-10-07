// /app/api/proxy-snapshot/[gateId]/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // ✅ Ambil path param langsung dari URL, bukan context.params
  const urlParts = req.nextUrl.pathname.split("/");
  const gateId = urlParts[urlParts.length - 1];
  const urlServer = req.nextUrl.searchParams.get("urlServer");

  if (!gateId) {
    return NextResponse.json(
      { success: false, message: "Gate ID is required" },
      { status: 400 }
    );
  }

  if (!urlServer) {
    return NextResponse.json(
      { success: false, message: "Missing urlServer parameter" },
      { status: 400 }
    );
  }

  console.log("Proxy snapshot request:", { gateId, urlServer });

  try {
    const res = await fetch(
      `${urlServer}/api/cctv/snapshot-intercome/${gateId}`,
      {
        method: "GET",
        headers: { Accept: "application/json" },
      }
    );

    if (!res.ok) {
      const text = await res.text();
      console.error("Response not OK:", text);
      return NextResponse.json(
        { success: false, message: "Server error while fetching snapshot" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Fetch error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch snapshot" },
      { status: 500 }
    );
  }
}
