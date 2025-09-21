# Gemini Voice Bot 🤖

A simple, user-friendly web application featuring a voice-activated chatbot powered by the Google Gemini API. The bot is designed to answer questions with the specific persona of Gemini, providing a seamless voice-in, voice-out user experience.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com)

---

###  Live Demo

**Test the live application here:** [https://voicebot-sairohitha-s-balams-projects.vercel.app/](https://YOUR-PROJECT-NAME.vercel.app)

![Gemini Voice Bot Screenshot](https://i.imgur.com/8aB3C7H.png)

##  Features

-   **Voice-to-Text:** Utilizes the browser's built-in Web Speech API to transcribe user speech in real-time.
-   **AI-Powered Responses:** Integrates with the Google Gemini API to generate intelligent and context-aware answers.
-   **Persona-Driven Dialogue:** The AI is specifically prompted to respond as Gemini, a helpful assistant from Google.
-   **Text-to-Speech:** The bot speaks its generated responses back to the user for a hands-free experience.
-   **Secure API Key Handling:** Employs a serverless function on Vercel to protect the Gemini API key, ensuring it is never exposed on the frontend.
-   **Minimalist UI:** Clean and simple interface focused on ease of use.

##  Technology Stack

-   **Frontend:** HTML5, CSS3, JavaScript (ES6+)
-   **AI Model:** Google Gemini API (`gemini-1.5-flash`)
-   **Backend:** Node.js Serverless Function
-   **Deployment:** Vercel

##  How It Works

The application follows a simple but powerful client-server architecture:

1.  **Voice Input:** The user clicks the microphone button, and the browser's `SpeechRecognition` API captures their question and converts it to a text string.
2.  **API Request:** The frontend sends this text string in a `POST` request to a serverless backend function hosted at `/api/generate`.
3.  **Secure Backend Processing:** The Vercel function (running Node.js) receives the request. It securely accesses the `GEMINI_API_KEY` from its environment variables.
4.  **AI Generation:** The function constructs a detailed prompt (including the persona instructions and the user's question) and sends it to the Google Gemini API.
5.  **Response Handling:** Once Gemini generates a response, the serverless function sends it back to the frontend as a JSON object.
6.  **Voice Output:** The frontend receives the response text and uses the browser's `SpeechSynthesis` API to speak the answer out loud to the user.

##  Local Development Setup

To run this project on your local machine:

1.  **Prerequisites:**
    -   [Node.js](https://nodejs.org/) (LTS version recommended)
    -   [Git](https://git-scm.com/)

2.  **Clone the Repository:**
    ```bash
    git clone [https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git](https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git)
    cd YOUR_REPOSITORY_NAME
    ```

3.  **Install Dependencies:**
    ```bash
    npm install
    ```

4.  **Set Up Environment Variables:**
    -   Create a file named `.env.local` in the root of the project.
    -   Add your Gemini API key to this file:
        ```
        GEMINI_API_KEY="YOUR_API_KEY_HERE"
        ```

5.  **Run the Development Server:**
    -   This project uses Vercel's architecture. The best way to run it locally is with the Vercel CLI.
    ```bash
    npm install -g vercel # Install Vercel CLI globally
    vercel dev # Start the local development server
    ```
    This will start a local server that correctly handles the serverless function in the `/api` directory.
