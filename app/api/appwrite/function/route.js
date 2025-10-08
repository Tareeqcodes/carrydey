import { Client, Functions, ExecutionMethod } from 'appwrite';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { functionId, path, data } = await request.json();

    // Validate required fields
    if (!functionId) {
      return NextResponse.json(
        { success: false, error: 'Function ID is required' },
        { status: 400 }
      );
    }

    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT_ID) // Fixed: removed _ID
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

    const functions = new Functions(client);

    // Properly structure the execution call
    const result = await functions.createExecution(
      functionId,
      JSON.stringify({ path: path || '/', method: 'POST', ...data }), // Body as string
      false, // async
      path || '/', // path
      ExecutionMethod.POST // method
    );

    // Check if execution was successful
    if (result.status === 'failed') {
      console.error('Function execution failed:', result.stderr);
      return NextResponse.json(
        {
          success: false,
          error: result.stderr || 'Function execution failed'
        },
        { status: 500 }
      );
    }

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