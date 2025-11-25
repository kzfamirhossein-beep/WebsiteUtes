import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = new Uint8Array(bytes);

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const filename = `${Date.now()}-${file.name}`;
    const filepath = path.join(uploadsDir, filename);

    fs.writeFileSync(filepath, buffer);
    
    return NextResponse.json({ 
      success: true, 
      url: `/uploads/${filename}` 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}

