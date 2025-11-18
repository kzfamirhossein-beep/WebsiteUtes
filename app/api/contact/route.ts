import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

const dataDir = path.join(process.cwd(), 'data');
const contactFile = path.join(dataDir, 'contact.json');
const messagesFile = path.join(dataDir, 'messages.json');

// GET - Read contact info
export async function GET() {
  try {
    const data = fs.readFileSync(contactFile, 'utf8');
    const contact = JSON.parse(data);
    return NextResponse.json(contact);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read contact info' }, { status: 500 });
  }
}

// PUT - Update contact info
export async function PUT(request: NextRequest) {
  try {
    const updatedContact = await request.json();
    fs.writeFileSync(contactFile, JSON.stringify(updatedContact, null, 2));
    return NextResponse.json(updatedContact);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update contact info' }, { status: 500 });
  }
}

// POST - Submit a contact message
export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, message } = await request.json();

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    const entry = {
      id: randomUUID(),
      name: name.trim(),
      email: email.trim(),
      phone: phone?.trim() || "",
      message: message.trim(),
      createdAt: new Date().toISOString(),
    };

    let messages: unknown = [];

    try {
      if (fs.existsSync(messagesFile)) {
        const raw = fs.readFileSync(messagesFile, 'utf8');
        messages = JSON.parse(raw);
      }
    } catch (error) {
      console.error('Failed to read existing messages:', error);
      messages = [];
    }

    const nextMessages = Array.isArray(messages) ? [...messages, entry] : [entry];

    fs.writeFileSync(messagesFile, JSON.stringify(nextMessages, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to submit contact message:', error);
    return NextResponse.json({ error: 'Failed to submit message.' }, { status: 500 });
  }
}

