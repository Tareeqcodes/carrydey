import { Client, Functions } from 'appwrite';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { functionId, path, data } = req.body;

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
        headers: req.headers,
      })
    );

    const response = JSON.parse(result.responseBody);
    res.status(200).json(response);
  } catch (error) {
    console.error('Appwrite function error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to execute function' 
    });
  }
}