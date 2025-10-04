
import { Client, Functions, ExecutionMethod } from 'appwrite';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { functionId, path, data } = await request.json();

    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

    const functions = new Functions(client);

    const result = await functions.createExecution({
      functionId: functionId,
      body: JSON.stringify(data), // Pass data directly, not wrapped
      async: false, // Wait for response
      path: path || '/', // Your custom path
      method: ExecutionMethod.POST,
      headers: {} // optional headers
    });

    // Parse the response body
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