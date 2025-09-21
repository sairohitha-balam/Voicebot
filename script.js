document.addEventListener('DOMContentLoaded', () => {
    const micButton = document.getElementById('micButton');
    const statusDiv = document.getElementById('status');
    const userQuestionDiv = document.getElementById('userQuestion');

    // Check if the browser supports the Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        statusDiv.textContent = "Sorry, your browser doesn't support speech recognition.";
        micButton.disabled = true;
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.interimResults = false; // We only want final results

    let isListening = false;

    micButton.addEventListener('click', () => {
        if (isListening) {
            recognition.stop();
            isListening = false;
        } else {
            recognition.start();
            isListening = true;
        }
    });

    recognition.onstart = () => {
        micButton.classList.add('listening');
        statusDiv.textContent = "Listening...";
        userQuestionDiv.textContent = "";
    };

    recognition.onend = () => {
        micButton.classList.remove('listening');
        statusDiv.textContent = "Click the button and start speaking.";
        isListening = false;
    };

    recognition.onerror = (event) => {
        statusDiv.textContent = `Error: ${event.error}. Try again.`;
    };

    recognition.onresult = async (event) => {
        const transcript = event.results[0][0].transcript;
        userQuestionDiv.textContent = `You asked: "${transcript}"`;
        statusDiv.textContent = "Thinking...";

        try {
            // Send the transcript to our serverless function
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question: transcript }),
            });

            if (!response.ok) {
                throw new Error('Failed to get a response from the server.');
            }

            const data = await response.json();
            const { answer } = data;

            speak(answer); // Speak the answer out loud
            statusDiv.textContent = "Click the button to ask another question.";

        } catch (error) {
            console.error('Error:', error);
            statusDiv.textContent = "Sorry, I had trouble getting an answer. Please try again.";
        }
    };

    function speak(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
    }
});