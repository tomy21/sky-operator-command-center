// /app/api/proxy-snapshot/[gateId]/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // ✅ Ambil gateId langsung dari path URL
  const pathParts = req.nextUrl.pathname.split("/");
  const gateId = pathParts[pathParts.length - 1];

  // ✅ Ambil query param urlServer
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
    const response = await fetch(
      `${urlServer}/api/cctv/snapshot-image/${gateId}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      const text = await response.text();
      console.error("Response not OK:", text);
      return NextResponse.json(
        { success: false, message: "Server error", details: text },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Proxy fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch snapshot",
        error: String(error),
      },
      { status: 500 }
    );
  }
}
