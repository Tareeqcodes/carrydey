import { Client, Messaging, ID } from 'node-appwrite';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { targets, title, body } = await req.json();

    if (!targets?.length || !title || !body) {
      return NextResponse.json({ ok: false, reason: 'missing_fields' }, { status: 400 });
    }

    const client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT)
      .setProject(process.env.APPWRITE_PROJECT_ID)
      .setKey(process.env.APPWRITE_API_KEY);

    const messaging = new Messaging(client);

    await messaging.createPush(
      ID.unique(),
      title,
      body,
      [],       // topics
      [],       // userIds — no longer used
      targets,  // target IDs directly
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Notify API error:', err);
    return NextResponse.json({ ok: false, reason: err.message }, { status: 500 });
  }
}