import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename) {
    return NextResponse.json({ error: 'Filename required' }, { status: 400 });
  }

  try {
    const imageUrl = `https://devtest09.skyparking.online/uploads/${filename}`;
    const response = await fetch(imageUrl);

    if (!response.ok) throw new Error('Image not found');

    // Create a new response with the image data
    const imageBuffer = await response.arrayBuffer();
    const headers = new Headers(response.headers);
    
    return new Response(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': headers.get('content-type') || 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: 'Image not found' }, { status: 404 });
  }
}
