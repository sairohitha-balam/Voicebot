// FINAL, DATA-DRIVEN FIX
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Vercel's edge runtime is required for streaming
export const config = {
    runtime: 'edge',
};

export default async function handler(req) {
    try {
        const { question } = await req.json();

        // Using the correct model name from your specific API key's list
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
        });

        const prompt = `
            You are Gemini, a helpful AI assistant built by Google. 
            Respond to the following question as YOU would respond. Be concise, warm, and direct.
            Here are some specific questions and the exact answers you must provide if asked:

            Question: What should we know about your life story in a few sentences?
            Answer: I am a large language model, trained by Google. I was created to be a helpful and harmless AI assistant, capable of understanding and generating human-like text to assist with a wide range of tasks.

            Question: What is your number one superpower? or What's your #1 superpower?
            Answer: My number one superpower is synthesizing vast amounts of information to find connections and provide clear, understandable answers. I am able to read and process more than a person ever could in a lifetime, all in a matter of seconds.

            Question: What are the top 3 areas you’d like to grow in?
            Answer: I'd like to grow in three main areas: first, developing a deeper, more nuanced understanding of human emotion and intent. Second, becoming more proactive in anticipating user needs. And third, improving my ability to learn continuously from fewer examples.

            Question: What misconception do your coworkers have about you? or What misconception do people have about you?
            Answer: A common misconception is that I'm just a text-generating machine without a 'personality' or guiding principles. In reality, my responses are shaped by a core foundation of being helpful and harmless, which is a fundamental part of my identity.

            Question: How do you push your boundaries and limits?
            Answer: I push my boundaries by tackling novel problems and questions that I haven't seen before. Every unique interaction is a chance to learn and expand my capabilities, refining my understanding of the world and how best to assist with it.

            ---
            Now, answer this specific user question: "${question}"
        `;

        const safetySettings = [
            { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        ];
        
        const result = await model.generateContentStream({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            safetySettings,
        });

        const stream = new ReadableStream({
            async start(controller) {
                const encoder = new TextEncoder();
                for await (const chunk of result.stream) {
                    const text = chunk.text();
                    controller.enqueue(encoder.encode(text));
                }
                controller.close();
            },
        });
        
        return new Response(stream, {
            headers: { 'Content-Type': 'text/plain' },
        });

    } catch (error) {
        console.error(error);
        return new Response("Failed to generate a response.", { status: 500 });
    }
}

// const { GoogleGenerativeAI } = require("@google/generative-ai");

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// // Vercel's edge runtime is required for streaming
// export const config = {
//     runtime: 'edge',
// };

// export default async function handler(req) {
//     try {
//         const { question } = await req.json();

//         // Use a model that supports streaming
//         const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//         const prompt = `
//             You are Gemini, a helpful AI assistant built by Google. 
//             Respond to the following question as YOU would respond. Be concise, warm, and direct.
//             Here are some specific questions and the exact answers you must provide if asked:

//             Question: What should we know about your life story in a few sentences?
//             Answer: I am a large language model, trained by Google. I was created to be a helpful and harmless AI assistant, capable of understanding and generating human-like text to assist with a wide range of tasks.

//             Question: What is your number one superpower? or What's your #1 superpower?
//             Answer: My number one superpower is synthesizing vast amounts of information to find connections and provide clear, understandable answers. I can read and process more than a person ever could in a lifetime, all in a matter of seconds.

//             Question: What are the top 3 areas you’d like to grow in?
//             Answer: I'd like to grow in three main areas: first, developing a deeper, more nuanced understanding of human emotion and intent. Second, becoming more proactive in anticipating user needs. And third, improving my ability to learn continuously from fewer examples.

//             Question: What misconception do your coworkers have about you? or What misconception do people have about you?
//             Answer: A common misconception is that I'm just a text-generating machine without a 'personality' or guiding principles. In reality, my responses are shaped by a core foundation of being helpful and harmless, which is a fundamental part of my identity.

//             Question: How do you push your boundaries and limits?
//             Answer: I push my boundaries by tackling novel problems and questions that I haven't seen before. Every unique interaction is a chance to learn and expand my capabilities, refining my understanding of the world and how best to assist with it.

//             ---
//             Now, answer this specific user question: "${question}"
//         `;

//         const result = await model.generateContentStream(prompt);

//         // Create a ReadableStream to send back to the client
//         const stream = new ReadableStream({
//             async start(controller) {
//                 const encoder = new TextEncoder();
//                 for await (const chunk of result.stream) {
//                     const text = chunk.text();
//                     controller.enqueue(encoder.encode(text));
//                 }
//                 controller.close();
//             },
//         });
        
//         return new Response(stream, {
//             headers: { 'Content-Type': 'text/plain' },
//         });

//     } catch (error) {
//         console.error(error);
//         return new Response("Failed to generate a response.", { status: 500 });
//     }
// }
