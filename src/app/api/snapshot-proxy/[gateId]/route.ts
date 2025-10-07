// /app/api/proxy-snapshot/[gateId]/route.ts
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { gateId: string } }
) {
  const { gateId } = params;
  const urlServer = req.nextUrl.searchParams.get("urlServer");

  if (!gateId) {
    return NextResponse.json(
      { success: false, message: "Gate ID is required" },
      { status: 400 }
    );
  }

  console.log("Proxy snapshot request:", { gateId, urlServer });

  try {
    const res = await fetch(`${urlServer}/api/cctv/snapshot-image/${gateId}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Response not OK:", text);
      return NextResponse.json(
        { success: false, message: "Server error" },
        { status: 500 }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch snapshot" },
      { status: 500 }
    );
  }
}
