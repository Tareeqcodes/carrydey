import { Client, Functions, ExecutionMethod } from 'appwrite';
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
      .setKey(process.env.APPWRITE_API_KEY);

    const functions = new Functions(client);

    // Map method string to ExecutionMethod enum
    const executionMethod = method === 'GET' ? ExecutionMethod.GET : 
                           method === 'PUT' ? ExecutionMethod.PUT :
                           method === 'DELETE' ? ExecutionMethod.DELETE :
                           method === 'PATCH' ? ExecutionMethod.PATCH :
                           ExecutionMethod.POST;

    console.log('Executing Appwrite function:', {
      functionId,
      path: path || '/',
      method: executionMethod,
      dataKeys: data ? Object.keys(data) : []
    });

    // Execute the function synchronously
    const execution = await functions.createExecution(
      functionId,
      JSON.stringify(data || {}), // Body payload
      false, // async: false (wait for completion)
      path || '/', // Path for internal routing
      executionMethod // HTTP method
    );

    console.log('Appwrite function execution completed:', {
      status: execution.status,
      statusCode: execution.statusCode,
      responseLength: execution.responseBody?.length || 0
    });

    // Parse the response body
    let responseData;
    try {
      responseData = JSON.parse(execution.responseBody);
      console.log('Parsed response:', responseData);
    } catch (parseError) {
      console.error('Error parsing function response:', parseError);
      console.error('Raw response body:', execution.responseBody);
      
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid response from function',
          details: 'Function returned non-JSON response',
          rawResponse: execution.responseBody?.substring(0, 500) // First 500 chars
        },
        { status: 500 }
      );
    }

    // Check if the function execution itself failed
    if (execution.status === 'failed') {
      console.error('Function execution failed:', execution.errors);
      return NextResponse.json(
        {
          success: false,
          error: 'Function execution failed',
          details: execution.errors || 'Unknown error',
          statusCode: execution.statusCode
        },
        { status: 500 }
      );
    }

    return NextResponse.json(responseData);

  } catch (error) {
    console.error('Appwrite function error:', error);
    
    // Provide more detailed error information
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to execute function',
        type: error.type || error.name || 'Unknown',
        details: error.response?.message || error.toString()
      },
      { status: 500 }
    );
  }
}