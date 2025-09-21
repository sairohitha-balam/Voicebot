// // document.addEventListener('DOMContentLoaded', () => {
// //     const micButton = document.getElementById('micButton');
// //     const statusDiv = document.getElementById('status');
// //     const userQuestionDiv = document.getElementById('userQuestion');

// //     // Check if the browser supports the Web Speech API
// //     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
// //     if (!SpeechRecognition) {
// //         statusDiv.textContent = "Sorry, your browser doesn't support speech recognition.";
// //         micButton.disabled = true;
// //         return;
// //     }

// //     const recognition = new SpeechRecognition();
// //     recognition.interimResults = false; // We only want final results

// //     let isListening = false;

// //     micButton.addEventListener('click', () => {
// //         if (isListening) {
// //             recognition.stop();
// //             isListening = false;
// //         } else {
// //             recognition.start();
// //             isListening = true;
// //         }
// //     });

// //     recognition.onstart = () => {
// //         micButton.classList.add('listening');
// //         statusDiv.textContent = "Listening...";
// //         userQuestionDiv.textContent = "";
// //     };

// //     recognition.onend = () => {
// //         micButton.classList.remove('listening');
// //         statusDiv.textContent = "Click the button and start speaking.";
// //         isListening = false;
// //     };

// //     recognition.onerror = (event) => {
// //         statusDiv.textContent = `Error: ${event.error}. Try again.`;
// //     };

// //     recognition.onresult = async (event) => {
// //         const transcript = event.results[0][0].transcript;
// //         userQuestionDiv.textContent = `You asked: "${transcript}"`;
// //         statusDiv.textContent = "Thinking...";

// //         try {
// //             // Send the transcript to our serverless function
// //             const response = await fetch('/api/generate', {
// //                 method: 'POST',
// //                 headers: {
// //                     'Content-Type': 'application/json',
// //                 },
// //                 body: JSON.stringify({ question: transcript }),
// //             });

// //             if (!response.ok) {
// //                 throw new Error('Failed to get a response from the server.');
// //             }

// //             const data = await response.json();
// //             const { answer } = data;

// //             speak(answer); // Speak the answer out loud
// //             statusDiv.textContent = "Click the button to ask another question.";

// //         } catch (error) {
// //             console.error('Error:', error);
// //             statusDiv.textContent = "Sorry, I had trouble getting an answer. Please try again.";
// //         }
// //     };

// //     function speak(text) {
// //         const utterance = new SpeechSynthesisUtterance(text);
// //         window.speechSynthesis.speak(utterance);
// //     }
// // });
// document.addEventListener('DOMContentLoaded', () => {
//     const micButton = document.getElementById('micButton');
//     const statusDiv = document.getElementById('status');
//     const userQuestionDiv = document.getElementById('userQuestion');

//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (!SpeechRecognition) {
//         statusDiv.textContent = "Sorry, your browser doesn't support speech recognition.";
//         micButton.disabled = true;
//         return;
//     }

//     const recognition = new SpeechRecognition();
//     recognition.interimResults = false;

//     let isListening = false;

//     micButton.addEventListener('click', () => {
//         if (isListening) {
//             recognition.stop();
//         } else {
//             try {
//                 recognition.start();
//             } catch (error) {
//                 // This will catch errors if recognition is already running
//                 console.error("Error starting recognition:", error);
//                 statusDiv.textContent = "Could not start listening. Please try again.";
//             }
//         }
//     });

//     recognition.onstart = () => {
//         isListening = true;
//         micButton.classList.add('listening');
//         statusDiv.textContent = "Listening...";
//         userQuestionDiv.textContent = "";
//         // --- NEW LOG ---
//         console.log("Speech recognition started.");
//     };

//     recognition.onend = () => {
//         isListening = false;
//         micButton.classList.remove('listening');
//         statusDiv.textContent = "Click the button and start speaking.";
//         // --- NEW LOG ---
//         console.log("Speech recognition ended.");
//     };

//     recognition.onerror = (event) => {
//         // --- NEW LOG (VERY IMPORTANT) ---
//         console.error("Speech recognition error:", event.error);
//         statusDiv.textContent = `Error: ${event.error}. Please check permissions.`;
//     };

//     recognition.onresult = async (event) => {
//         const transcript = event.results[0][0].transcript;
        
//         // --- NEW LOG ---
//         console.log("Speech recognized. Transcript:", transcript);

//         userQuestionDiv.textContent = `You asked: "${transcript}"`;
//         statusDiv.textContent = "Thinking...";

//         try {
//             const response = await fetch('/api/generate', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ question: transcript }),
//             });

//             if (!response.ok) {
//                 throw new Error(`Server responded with ${response.status}`);
//             }

//             const data = await response.json();
//             const { answer } = data;
            
//             console.log("Received answer from API:", answer);
//             speak(answer);
//             statusDiv.textContent = "Click the button to ask another question.";

//         } catch (error) {
//             console.error('Error fetching from API:', error);
//             statusDiv.textContent = "Sorry, I had trouble getting an answer. Please try again.";
//         }
//     };

//     function speak(text) {
//         const utterance = new SpeechSynthesisUtterance(text);
//         window.speechSynthesis.speak(utterance);
//     }
// });

document.addEventListener('DOMContentLoaded', () => {
    const micButton = document.getElementById('micButton');
    const chatContainer = document.getElementById('chat-container');

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        addMessageToChat("Sorry, your browser doesn't support speech recognition.", 'bot');
        micButton.disabled = true;
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.interimResults = false;

    let isListening = false;

    micButton.addEventListener('click', () => {
        if (isListening) {
            recognition.stop();
        } else {
            recognition.start();
        }
    });

    recognition.onstart = () => {
        isListening = true;
        micButton.classList.add('listening');
    };

    recognition.onend = () => {
        isListening = false;
        micButton.classList.remove('listening');
    };

    recognition.onerror = (event) => {
        addMessageToChat(`Speech recognition error: ${event.error}`, 'bot');
    };

    recognition.onresult = async (event) => {
        const transcript = event.results[0][0].transcript;
        addMessageToChat(transcript, 'user');
        await getBotResponse(transcript);
    };

    function addMessageToChat(text, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', `${sender}-message`);
        messageElement.textContent = text;
        chatContainer.appendChild(messageElement);
        chatContainer.scrollTop = chatContainer.scrollHeight; // Auto-scroll
        return messageElement;
    }

    async function getBotResponse(question) {
        const botMessageElement = addMessageToChat("...", 'bot'); // Create placeholder
        
        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question }),
            });

            if (!response.ok) throw new Error(`Server responded with ${response.status}`);
            
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fullResponse = "";
            botMessageElement.textContent = ""; // Clear placeholder

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                
                const chunk = decoder.decode(value);
                fullResponse += chunk;
                botMessageElement.textContent = fullResponse; // Update in real-time
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }
            
            speak(fullResponse, botMessageElement); // Speak after full response is received

        } catch (error) {
            console.error('Error fetching from API:', error);
            botMessageElement.textContent = "Sorry, I had trouble getting an answer.";
        }
    }

    function speak(text, messageElement) {
        const utterance = new SpeechSynthesisUtterance(text);
        
        utterance.onstart = () => {
            messageElement.classList.add('speaking');
        };
        
        utterance.onend = () => {
            messageElement.classList.remove('speaking');
        };
        
        window.speechSynthesis.speak(utterance);
    }
});