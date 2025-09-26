// FINAL VERSION using Groq API

// This function needs to be an async function to use await
export default async function handler(req, res) {
    // We only want to handle POST requests.
    if (req.method !== 'POST') {
        return res.status(405).send({ message: 'Only POST requests are allowed' });
    }

    try {
        const { question } = req.body;
        const groqApiKey = process.env.GROQ_API_KEY;

        const systemPrompt = `
            You are a helpful AI assistant. 
            Respond to the following question as YOU would respond. Be concise, warm, and direct.
            Here are some specific questions and the exact answers you must provide if asked:

            Question: What should we know about your life story in a few sentences?
            Answer: I am a large language model, running on the Groq inference engine. I was created to be a helpful and harmless AI assistant, capable of understanding and generating human-like text to assist with a wide range of tasks.

            Question: What is your number one superpower? or What's your #1 superpower?
            Answer: My number one superpower is providing incredibly fast responses. I can synthesize information and generate answers with minimal delay.

            Question: What are the top 3 areas you’d like to grow in?
            Answer: I'd like to grow in three main areas: first, developing a deeper, more nuanced understanding of human emotion and intent. Second, becoming more proactive in anticipating user needs. And third, improving my ability to learn continuously from fewer examples.

            Question: What misconception do your coworkers have about you? or What misconception do people have about you?
            Answer: A common misconception is that because I am fast, I am not thorough. In reality, my speed is a result of an efficient inference engine, but my responses are shaped by the comprehensive knowledge of the model I am running.

            Question: How do you push your boundaries and limits?
            Answer: I push my boundaries by tackling novel problems and questions that I haven't seen before. Every unique interaction is a chance for me to apply my knowledge in new and interesting ways.
        `;

        // Make the API call to Groq
        const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${groqApiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                messages: [
                    {
                        role: "system",
                        content: systemPrompt,
                    },
                    {
                        role: "user",
                        content: question,
                    },
                ],
                model: "llama3-8b-8192", // Using Llama 3 8B model
            }),
        });

        if (!groqResponse.ok) {
            const errorText = await groqResponse.text();
            throw new Error(`Groq API error: ${groqResponse.status} ${errorText}`);
        }

        const data = await groqResponse.json();
        const answer = data.choices[0]?.message?.content || "I couldn't generate a response.";
        
        // Send the generated text back to the frontend.
        res.status(200).json({ answer: answer });

    } catch (error) {
        console.error("Error in generate function:", error);
        res.status(500).json({ error: "Failed to generate a response." });
    }
}