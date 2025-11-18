import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const messagesFile = path.join(dataDir, 'messages.json');

// GET - Read all messages
export async function GET() {
  try {
    if (!fs.existsSync(messagesFile)) {
      return NextResponse.json([]);
    }
    const data = fs.readFileSync(messagesFile, 'utf8');
    const messages = JSON.parse(data);
    // Sort by newest first
    const sorted = Array.isArray(messages) 
      ? messages.sort((a: any, b: any) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      : [];
    return NextResponse.json(sorted);
  } catch (error) {
    console.error('Failed to read messages:', error);
    return NextResponse.json({ error: 'Failed to read messages' }, { status: 500 });
  }
}

// DELETE - Delete a message
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Message ID is required' }, { status: 400 });
    }

    if (!fs.existsSync(messagesFile)) {
      return NextResponse.json({ error: 'No messages found' }, { status: 404 });
    }

    const data = fs.readFileSync(messagesFile, 'utf8');
    const messages = JSON.parse(data);
    
    if (!Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages data' }, { status: 500 });
    }

    const filtered = messages.filter((msg: any) => msg.id !== id);
    fs.writeFileSync(messagesFile, JSON.stringify(filtered, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete message:', error);
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 });
  }
}


