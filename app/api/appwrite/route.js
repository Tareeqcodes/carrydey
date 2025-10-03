import { Client, Functions } from 'node-appwrite';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { functionId, path, data } = await request.json();

    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

    const functions = new Functions(client);

    const result = await functions.createExecution(
      functionId,
      JSON.stringify({
        path,
        method: 'POST',
        body: JSON.stringify(data),
      })
    );

    const response = JSON.parse(result.responseBody);
    return NextResponse.json(response);

  } catch (error) {
    console.error('Appwrite function error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to execute function'
      },
      { status: 500 }
    );
  }
}