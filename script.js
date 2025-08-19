// WARNING: Storing API keys in client-side code is a security risk.
// For a production app, use a server-side component.
const API_KEY = '$AIzaSyD5GYUAbYl13OiTkZnix-nDfF8xFM5fD4U'; 

const PROMPT_PARTS = [
    {
        text: `You are a helpful teaching assistant for a history class. You will only answer questions based on the provided documents. If you are asked a question that is not covered in the documents, you will respond with "I can only answer questions about the provided texts."

        ---
        Provided Documents:
        - The Roman Republic was an era of classical Roman civilization, dating from the overthrow of the Roman Kingdom in 509 BC to 27 BC. The Republic was governed by a Senate and a series of elected magistrates.
        - The Punic Wars were a series of three wars fought between Rome and Carthage from 264 BC to 146 BC. They were the largest wars of the ancient world.
        - The fall of the Western Roman Empire occurred in 476 AD, when the last emperor was deposed.
        ---
        `
    }
];

const chatWindow = document.getElementById('chat-window');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

async function getGeminiResponse(message) {
    const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;
    
    // Create a new chat history for each request to keep it simple.
    // For a multi-turn conversation, you would need to manage the history.
    const requestBody = {
        contents: [
            ...PROMPT_PARTS,
            {
                role: 'user',
                parts: [{ text: message }]
            }
        ]
    };

    try {
        const response = await fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        const botMessage = data.candidates[0].content.parts[0].text;
        return botMessage;
    } catch (error) {
        console.error('Error fetching Gemini response:', error);
        return 'Sorry, I am having trouble connecting right now. Please try again later.';
    }
}

function addMessage(message, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);
    messageDiv.innerHTML = `<p>${message}</p>`;
    chatWindow.appendChild(messageDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight; // Auto-scroll to the bottom
}

sendButton.addEventListener('click', async () => {
    const message = userInput.value.trim();
    if (message) {
        addMessage(message, 'user');
        userInput.value = '';

        const botResponse = await getGeminiResponse(message);
        addMessage(botResponse, 'bot');
    }
});

userInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendButton.click();
    }
});
