import React, { useState } from 'react';
import { AVATARS } from './Avatars';

interface WelcomeModalProps {
  onSaveProfile: (name: string, avatarId: string) => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ onSaveProfile }) => {
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);

  const handleSave = () => {
    if (name.trim() && selectedAvatar) {
      onSaveProfile(name.trim(), selectedAvatar);
    }
  };

  return (
    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50 w-full max-w-sm rounded-3xl shadow-2xl p-6 space-y-6 animate-fade-in-up">
        <h1 className="text-3xl font-bold text-gray-800 text-center">Welcome!</h1>
        <p className="text-center text-gray-600">Let's set up your profile.</p>
        
        <div>
            <label className="text-sm font-medium text-gray-500 mb-2 block text-center">Choose your avatar</label>
            <div className="flex justify-center space-x-3">
                {AVATARS.map(avatar => (
                    <button 
                        key={avatar.id}
                        onClick={() => setSelectedAvatar(avatar.id)}
                        className={`w-14 h-14 rounded-full p-1 transition-all duration-300 ${selectedAvatar === avatar.id ? 'bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 scale-110' : 'bg-gray-200 hover:scale-105'}`}
                        aria-pressed={selectedAvatar === avatar.id}
                        aria-label={`Select avatar ${avatar.id}`}
                    >
                        <div className="w-full h-full bg-white rounded-full overflow-hidden">
                            <img src={avatar.url} alt={`Avatar for selection ${avatar.id.replace('avatar','')}`} className="w-full h-full object-cover" />
                        </div>
                    </button>
                ))}
            </div>
        </div>

        <div>
          <label htmlFor="name-input" className="text-sm font-medium text-gray-500 mb-2 block text-center">What should we call you?</label>
          <input
            id="name-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full p-3 bg-white/80 rounded-lg border-2 border-transparent text-gray-800 focus:border-pink-500 focus:outline-none transition-all text-center"
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          />
        </div>
        <button
          onClick={handleSave}
          disabled={!name.trim() || !selectedAvatar}
          className="w-full py-3 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default WelcomeModal;
