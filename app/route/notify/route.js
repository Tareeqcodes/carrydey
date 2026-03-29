// app/route/notify/route.js
import { Client, Messaging, ID } from 'node-appwrite';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { userIds, title, body } = await req.json();

    if (!userIds?.length || !title || !body) {
      return NextResponse.json({ ok: false, reason: 'missing_fields' }, { status: 400 });
    }

    // ── Initialize inside the handler — runs at request time, not build time ──
    const client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT)
      .setProject(process.env.APPWRITE_PROJECT_ID)
      .setKey(process.env.APPWRITE_API_KEY);

    const messaging = new Messaging(client);

    await messaging.createPush(
      ID.unique(),
      title,
      body,
      [],      // topics
      userIds, // userIds
      [],      // targets
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Notify API error:', err);
    return NextResponse.json({ ok: false, reason: err.message }, { status: 500 });
  }
}