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