// This is a temporary diagnostic tool to list available models.

export const config = {
    runtime: 'edge',
};

export default async function handler(req) {
    const API_KEY = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            const errorText = await response.text();
            return new Response(`Error from Google API: ${response.status} ${response.statusText}\n${errorText}`, {
                status: response.status,
                headers: { 'Content-Type': 'text/plain' },
            });
        }
        
        const data = await response.json();
        
        // Return the list of models as a nicely formatted JSON string
        return new Response(JSON.stringify(data, null, 2), {
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        return new Response(`Failed to fetch models: ${error.message}`, {
            status: 500,
            headers: { 'Content-Type': 'text/plain' },
        });
    }
}