import React, { useState } from 'react';

interface WelcomeModalProps {
  onSaveName: (name: string) => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ onSaveName }) => {
  const [name, setName] = useState('');

  const handleSave = () => {
    if (name.trim()) {
      onSaveName(name.trim());
    }
  };

  return (
    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50 w-full max-w-sm rounded-3xl shadow-2xl p-6 space-y-6 animate-fade-in-up">
        <h1 className="text-3xl font-bold text-gray-800 text-center">Welcome!</h1>
        <p className="text-center text-gray-600">What should we call you?</p>
        <div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full p-3 mt-1 bg-white/80 rounded-lg border-2 border-transparent text-gray-800 focus:border-pink-500 focus:outline-none transition-all text-center"
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          />
        </div>
        <button
          onClick={handleSave}
          disabled={!name.trim()}
          className="w-full py-3 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default WelcomeModal;