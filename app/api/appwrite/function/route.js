
import { Client, Functions } from 'appwrite';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { functionId, path, method = 'POST', data } = await request.json();

    if (!functionId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Function ID is required',
        },
        { status: 400 }
      );
    }

    const client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT)
      .setProject(process.env.APPWRITE_PROJECT_ID)
      .setKey(process.env.APPWRITE_API_KEY);

    const functions = new Functions(client);

    // Call the Appwrite function asynchronously.
    // The body, path, and method must be passed as the second argument.
    const execution = await functions.createExecution(
      functionId,
      JSON.stringify({
        path: path || '/',
        method: method,
        body: data || {},
      }),
      true, // async parameter set to true
      // The `path` and `method` parameters for createExecution are for internal
      // Appwrite routing. You are correctly passing them as part of the body.
    );

    // When the function is executed asynchronously, we don't get the responseBody
    // immediately. Instead, we return the execution ID.
    // The frontend must use this ID to poll for the final result or rely on a webhook.
    return NextResponse.json({
      success: true,
      message: 'Function execution initiated asynchronously.',
      executionId: execution.$id,
    });
  } catch (error) {
    console.error('Appwrite function error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to execute function',
        trace: error.stack,
      },
      { status: 500 }
    );
  }
}