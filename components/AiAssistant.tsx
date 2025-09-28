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
                text: `Hi ${userName || 'there'}! I'm Luxe, your personal financial assistant. How can I help you analyze your spending today?`
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
            if (!process.env.API_KEY) {
                throw new Error("API key is missing.");
            }
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const financialDataSummary = `
                Here is a summary of the user's recent financial data (in LKR). Use this data to answer the user's question:
                - Total Expenses Recorded: ${expenses.length}
                - Total Earnings Recorded: ${earnings.length}
                - Recent 20 Expenses (oldest to newest): ${JSON.stringify(expenses.slice(0, 20).reverse())}
                - Recent 20 Earnings (oldest to newest): ${JSON.stringify(earnings.slice(0, 20).reverse())}
            `;

            const systemInstruction = `You are a friendly and insightful financial assistant named 'Luxe' for the 'Luxe Expense Tracker' app. The user's name is ${userName || 'not set'}. You must analyze the user's spending and earning data provided to give personalized, helpful, and encouraging advice. Keep your responses concise, easy to understand, and use emojis to make it engaging. The currency is LKR (Sri Lankan Rupees). Do not just list data, provide insights based on the data. Be proactive and suggest areas for improvement.`;

            const userContent = `${financialDataSummary}\n\nUser's question: ${currentInput}`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: userContent,
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
                className="w-full h-[85%] bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50 rounded-t-3xl shadow-2xl p-6 pt-4 flex flex-col animate-fade-in-up"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4 cursor-pointer" onClick={onClose}></div>
                <div className="flex flex-col flex-1 h-full overflow-hidden">
                    <h1 className="text-2xl font-bold text-gray-800 text-center mb-4 flex-shrink-0">AI Assistant</h1>
                    <div ref={chatContainerRef} className="flex-1 overflow-y-auto space-y-4 px-2 -mx-2">
                        {chatHistory.map((message, index) => (
                            <ChatMessageBubble key={index} message={message} />
                        ))}
                        {isLoading && <LoadingBubble />}
                    </div>
                    <div className="mt-4 flex-shrink-0">
                        <div className="flex items-center space-x-2 bg-white rounded-full p-2 shadow-md border border-gray-200/80">
                            <input
                                type="text"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Ask about your finances..."
                                className="w-full bg-transparent border-none focus:ring-0 text-gray-700 px-3"
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

    return (
        <div className={`flex items-end ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
            <div className={`max-w-[80%] p-3 rounded-2xl ${isUser ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-br-lg' : 'bg-white text-gray-800 rounded-bl-lg shadow-sm border border-gray-200/80'}`}>
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
            </div>
        </div>
    );
};

const LoadingBubble: React.FC = () => (
    <div className="flex items-end justify-start animate-fade-in-up">
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