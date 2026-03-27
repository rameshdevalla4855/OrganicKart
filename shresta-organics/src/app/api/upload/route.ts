import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Define the local upload directory inside 'public'
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products');
    
    // Ensure the directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    // Generate a unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const filename = `${uniqueSuffix}-${file.name.replace(/\s+/g, '-')}`;
    const filePath = path.join(uploadDir, filename);

    // Save the file to the local filesystem
    await fs.writeFile(filePath, buffer);

    // The URL that Next.js will use to serve the image
    // Since it's in public/uploads/products/filename, the URL is /uploads/products/filename
    const publicUrl = `/uploads/products/${filename}`;

    return NextResponse.json({ url: publicUrl });
  } catch (error: unknown) {
    console.error('LOCAL UPLOAD FAILED:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown upload error';
    return NextResponse.json({ error: `Local Upload Failed: ${errorMessage}` }, { status: 500 });
  }
}
