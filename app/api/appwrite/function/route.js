import { Client, Functions } from 'appwrite';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { functionId, path, method = 'POST', data } = await request.json();

    if (!functionId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Function ID is required'
        },
        { status: 400 }
      );
    }

    const client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT)
      .setProject(process.env.APPWRITE_PROJECT_ID)
      .setKey(process.env.APPWRITE_API_KEY); // Add API key if needed

    const functions = new Functions(client);

    const execution = await functions.createExecution(
      functionId,
      JSON.stringify({
        path: path || '/initialize-payment',
        method: method || 'POST',
        body: data || {}
      }),
      false, // async
      path || '/initialize-payment', // path
      'POST' // method
    );

    // Parse the response safely
    let responseData;
    try {
      responseData = JSON.parse(execution.responseBody);
    } catch (parseError) {
      console.error('Error parsing function response:', parseError);
      responseData = {
        success: false,
        error: 'Invalid response from function',
        rawResponse: execution.responseBody
      };
    }

    return NextResponse.json(responseData);

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