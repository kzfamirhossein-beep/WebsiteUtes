import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const adminFile = path.join(dataDir, 'admin.json');

// POST - Login
export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    const data = fs.readFileSync(adminFile, 'utf8');
    const admin = JSON.parse(data);
    
    if (password === admin.password) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}

