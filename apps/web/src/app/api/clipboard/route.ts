import { NextRequest, NextResponse } from "next/server";

interface ClipboardEntry {
  id: string;
  content: string;
  type: "text" | "url" | "code";
  createdAt: string;
}

// In-memory store for clipboard rooms (ephemeral, zero persistent tracking)
// Global map survives during serverless container lifecycle
declare global {
  // eslint-disable-next-line no-var
  var __trysomenew_clipboard_rooms: Map<string, { items: ClipboardEntry[]; updatedAt: number }> | undefined;
}

if (!globalThis.__trysomenew_clipboard_rooms) {
  globalThis.__trysomenew_clipboard_rooms = new Map();
}

const rooms = globalThis.__trysomenew_clipboard_rooms;

// Auto cleanup rooms older than 24 hours
function cleanupOldRooms() {
  const cutoff = Date.now() - 24 * 60 * 60 * 1000;
  for (const [code, data] of rooms.entries()) {
    if (data.updatedAt < cutoff) {
      rooms.delete(code);
    }
  }
}

export async function GET(req: NextRequest) {
  cleanupOldRooms();
  const { searchParams } = new URL(req.url);
  const room = searchParams.get("room");

  if (!room) {
    return NextResponse.json({ error: "Room code required" }, { status: 400 });
  }

  const roomData = rooms.get(room);
  return NextResponse.json({
    room,
    items: roomData ? roomData.items : [],
    updatedAt: roomData ? roomData.updatedAt : Date.now(),
  });
}

export async function POST(req: NextRequest) {
  cleanupOldRooms();
  try {
    const body = await req.json();
    const { room, item } = body;

    if (!room || !item || !item.content) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const current = rooms.get(room) || { items: [], updatedAt: Date.now() };

    // Prevent duplicate spam
    const existingIndex = current.items.findIndex((i) => i.id === item.id);
    if (existingIndex === -1) {
      current.items.unshift({
        id: item.id || Math.random().toString(36).substring(2, 9),
        content: String(item.content).slice(0, 50000), // 50KB limit per item
        type: item.type || "text",
        createdAt: item.createdAt || new Date().toLocaleTimeString(),
      });
    }

    // Limit to 40 items per room
    if (current.items.length > 40) {
      current.items = current.items.slice(0, 40);
    }

    current.updatedAt = Date.now();
    rooms.set(room, current);

    return NextResponse.json({
      success: true,
      room,
      items: current.items,
    });
  } catch {
    return NextResponse.json({ error: "Failed to save item" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const room = searchParams.get("room");
  const itemId = searchParams.get("itemId");

  if (!room) {
    return NextResponse.json({ error: "Room code required" }, { status: 400 });
  }

  if (itemId) {
    const current = rooms.get(room);
    if (current) {
      current.items = current.items.filter((i) => i.id !== itemId);
      current.updatedAt = Date.now();
      rooms.set(room, current);
    }
  } else {
    rooms.delete(room);
  }

  return NextResponse.json({ success: true, room });
}
