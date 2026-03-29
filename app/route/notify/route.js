// app/route/notify/route.js
import { Client, Messaging, ID } from 'node-appwrite';
import { NextResponse } from 'next/server';

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const messaging = new Messaging(client);

export async function POST(req) {
  try {
    const { userIds, title, body } = await req.json(); // removed `data` — unused

    if (!userIds?.length || !title || !body) {
      return NextResponse.json({ ok: false, reason: 'missing_fields' }, { status: 400 });
    }

    await messaging.createPush(
      ID.unique(), // messageId
      title,       // title
      body,        // body
      [],          // topics
      userIds,     // userIds
      [],          // targets
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Notify API error:', err);
    return NextResponse.json({ ok: false, reason: err.message }, { status: 500 });
  }
}