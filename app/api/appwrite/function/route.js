
import { Client, Functions, ExecutionMethod } from 'appwrite';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { functionId, path, data } = await request.json();

    const client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT_ID)
      .setProject(process.env.APPWRITE_PROJECT_ID);

    const functions = new Functions(client);

   const result = await functions.createExecution({
      functionId: functionId,
      body: JSON.stringify(data), // Keep this, Appwrite will parse it
      async: false,
      path: path || '/',
      method: ExecutionMethod.POST,
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