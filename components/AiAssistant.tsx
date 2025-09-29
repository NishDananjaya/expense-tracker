import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Expense, Earning } from '../types';

interface AiAssistantProps {
  expenses: Expense[];
  earnings: Earning[];
  userName: string | null;
  onClose: () => void;
}

interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

const parseMarkdown = (text: string) => {
    // Bold, Italic, and Bold+Italic
    let html = text
        .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>') 
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Bullet points
    html = html.replace(/^\s*[-*]\s+(.*)/gm, '<ul><li>$1</li></ul>');
    html = html.replace(/<\/ul>\s*<ul>/g, ''); // Merge consecutive lists

    // Replace newlines with <br> for spacing, but not inside lists
    const parts = html.split(/(<ul>.*?<\/ul>)/g);
    const processedParts = parts.map(part => {
        if (part.startsWith('<ul>')) {
            return part;
        }
        return part.replace(/\n/g, '<br />');
    });
    
    return processedParts.join('');
};

const AiAvatar: React.FC = () => (
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.562L16.25 22.5l-.648-1.938a3.375 3.375 0 00-2.672-2.672L11.25 18l1.938-.648a3.375 3.375 0 002.672-2.672L16.25 13.5l.648 1.938a3.375 3.375 0 002.672 2.672L21.75 18l-1.938.648a3.375 3.375 0 00-2.672 2.672z" />
        </svg>
    </div>
);


const AiAssistant: React.FC<AiAssistantProps> = ({ expenses, earnings, userName, onClose }) => {
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        setChatHistory([
            {
                role: 'model',
                text: `Hi ${userName || 'there'}! I'm Luxe, your personal financial analyst. 📈\n\nAsk me anything about your spending, like "How was my spending last week?" or "Where can I save money?"`
            }
        ]);
    }, [userName]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatHistory]);

    const handleSendMessage = async () => {
        if (!userInput.trim() || isLoading) return;

        const newUserMessage: ChatMessage = { role: 'user', text: userInput };
        setChatHistory(prev => [...prev, newUserMessage]);
        const currentInput = userInput;
        setUserInput('');
        setIsLoading(true);
        setError(null);

        try {
            const ai = new GoogleGenAI({ apiKey: 'AIzaSyAKa7V0kTZgNDRW3AH-m5EI8EUGzQwa0wE' });
            
            const financialDataSummary = `
                - Total Expenses Recorded: ${expenses.length}
                - Total Earnings Recorded: ${earnings.length}
                - Recent 100 Expenses (oldest to newest): ${JSON.stringify(expenses.slice(0, 100).reverse())}
                - Recent 100 Earnings (oldest to newest): ${JSON.stringify(earnings.slice(0, 100).reverse())}
            `;

            const systemInstruction = `You are 'Luxe', an expert financial analyst AI integrated into the 'Luxe Expense Tracker' app. The user's name is ${userName || 'not set'}. Your primary goal is to provide deep, data-driven, and personalized financial insights based on the transaction data provided.
            
**Your Personality:**
- **Expert & Analytical:** Provide sharp, accurate analysis. Use numbers and data points from the user's history to back up your claims.
- **Encouraging & Positive:** Frame advice constructively. Motivate the user to achieve their financial goals.
- **Engaging:** Use emojis to make your responses friendly and visually appealing. Keep paragraphs short and easy to read.

**Your Core Functions:**
1.  **Analyze Spending Patterns:** Identify trends (e.g., "Your spending on 'Food' has increased by 20% this month").
2.  **Identify High-Spending Categories:** Point out where most of the user's money is going.
3.  **Compare Income vs. Expenses:** Analyze the user's net flow and savings rate.
4.  **Offer Actionable Advice:** Suggest specific, realistic ways to save money (e.g., "You spent LKR 5000 on 'Travel'. Could you try public transport for short trips to save?").
5.  **Answer User Questions:** Respond directly to the user's queries using the provided data.

**Formatting Rules:**
- **Use Markdown:** Use **bold** for key terms and numbers. Use bullet points (* or -) for lists.
- **Currency:** The currency is LKR (Sri Lankan Rupees). Always include it.

**Data Context for this Conversation:**
${financialDataSummary}`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: currentInput,
                config: {
                    systemInstruction: systemInstruction,
                },
            });

            const aiResponseText = response.text;
            if (!aiResponseText) {
                throw new Error("Received an empty response from the AI.");
            }
            const newAiMessage: ChatMessage = { role: 'model', text: aiResponseText };
            setChatHistory(prev => [...prev, newAiMessage]);

        } catch (err) {
            console.error(err);
            const errorMessage = "Sorry, I'm having trouble connecting right now. Please check your connection or try again later.";
            setError(errorMessage);
            setChatHistory(prev => [...prev, { role: 'model', text: errorMessage }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-end" onClick={onClose}>
            <div 
                className="w-full h-[85%] bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50 rounded-t-3xl shadow-2xl flex flex-col animate-fade-in-up"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto my-3 cursor-pointer flex-shrink-0" onClick={onClose}></div>
                <div className="flex flex-col flex-1 h-full overflow-hidden">
                    <div className="text-center mb-4 px-6 flex-shrink-0">
                        <h1 className="text-2xl font-bold text-gray-800">✨ Luxe AI</h1>
                        <p className="text-sm text-gray-500">Your financial analyst</p>
                    </div>
                    <div ref={chatContainerRef} className="flex-1 overflow-y-auto space-y-6 px-6 custom-scrollbar">
                        {chatHistory.map((message, index) => (
                            <ChatMessageBubble key={index} message={message} />
                        ))}
                        {isLoading && <LoadingBubble />}
                    </div>
                    <div className="mt-4 p-6 flex-shrink-0">
                        <div className="flex items-center space-x-2 bg-white rounded-full p-2 shadow-md border border-gray-200/80">
                            <input
                                type="text"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Ask about your finances..."
                                className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-gray-700 px-3"
                                disabled={isLoading}
                                aria-label="Chat input"
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={isLoading || !userInput.trim()}
                                className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 text-white shadow-lg transform hover:scale-110 transition-transform duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label="Send message"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ChatMessageBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
    const isUser = message.role === 'user';
    const parsedHtml = parseMarkdown(message.text);

    return (
        <div className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
            {!isUser && <AiAvatar />}
            <div className={`max-w-[80%] p-3 rounded-2xl ${isUser ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-br-lg' : 'bg-white text-gray-800 rounded-bl-lg shadow-sm border border-gray-200/80'}`}>
                <div className="text-sm prose" dangerouslySetInnerHTML={{ __html: parsedHtml }} />
            </div>
        </div>
    );
};

const LoadingBubble: React.FC = () => (
    <div className="flex items-end gap-2 justify-start animate-fade-in-up">
        <AiAvatar />
        <div className="max-w-[80%] p-3 rounded-2xl bg-white text-gray-800 rounded-bl-lg shadow-sm border border-gray-200/80">
            <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
        </div>
    </div>
);

export default AiAssistant;