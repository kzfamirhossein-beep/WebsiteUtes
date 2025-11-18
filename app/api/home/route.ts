import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const homeFile = path.join(dataDir, 'home.json');

// GET - Read home content
export async function GET() {
  try {
    const data = fs.readFileSync(homeFile, 'utf8');
    const home = JSON.parse(data);
    return NextResponse.json(home);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read home content' }, { status: 500 });
  }
}

// PUT - Update home content
export async function PUT(request: NextRequest) {
  try {
    const updatedContent = await request.json();
    fs.writeFileSync(homeFile, JSON.stringify(updatedContent, null, 2));
    return NextResponse.json(updatedContent);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update home content' }, { status: 500 });
  }
}

