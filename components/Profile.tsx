import React, { useState } from 'react';
import { Goal } from '../types';

interface ProfileProps {
  goal: Goal;
  setGoal: (goal: Goal) => void;
  userName: string | null;
}

const Profile: React.FC<ProfileProps> = ({ goal, setGoal, userName }) => {
  const [localGoal, setLocalGoal] = useState<Goal>(goal);
  const [isSaved, setIsSaved] = useState(false);
  
  const handleSave = () => {
    setGoal(localGoal);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-8 pb-24 animate-fade-in-up">
      <div className="flex flex-col items-center text-center space-y-2">
        <div className="w-28 h-28 rounded-full shadow-lg border-4 border-white bg-gradient-to-br from-blue-200 to-purple-200 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{userName || 'My Profile'}</h1>
          <p className="text-gray-500">Manage your goals and settings</p>
        </div>
      </div>

      <div className="bg-white/60 p-6 rounded-2xl shadow-lg backdrop-blur-sm border border-white/30">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Spending Goals</h2>
        <div className="space-y-4">
          <div>
            <label className="text-gray-600 font-medium">Daily Goal (LKR)</label>
            <input 
              type="number"
              value={localGoal.daily}
              onChange={(e) => setLocalGoal(g => ({ ...g, daily: Number(e.target.value) }))}
              className="w-full p-3 mt-1 bg-white/80 rounded-lg border-2 border-transparent text-gray-800 focus:border-blue-500 focus:outline-none transition-all"
              placeholder="e.g., 100"
            />
          </div>
          <div>
            <label className="text-gray-600 font-medium">Weekly Goal (LKR)</label>
            <input 
              type="number"
              value={localGoal.weekly}
              onChange={(e) => setLocalGoal(g => ({ ...g, weekly: Number(e.target.value) }))}
              className="w-full p-3 mt-1 bg-white/80 rounded-lg border-2 border-transparent text-gray-800 focus:border-blue-500 focus:outline-none transition-all"
              placeholder="e.g., 700"
            />
          </div>
        </div>
        <button 
          onClick={handleSave}
          className="w-full mt-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300">
          {isSaved ? 'Saved!' : 'Save Goals'}
        </button>
      </div>
    </div>
  );
};

export default Profile;