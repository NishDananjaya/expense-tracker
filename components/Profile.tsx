
import React, { useState } from 'react';
import { Goal } from '../types';

interface ProfileProps {
  goal: Goal;
  setGoal: (goal: Goal) => void;
}

const Profile: React.FC<ProfileProps> = ({ goal, setGoal }) => {
  const [localGoal, setLocalGoal] = useState<Goal>(goal);
  const [isSaved, setIsSaved] = useState(false);
  
  const handleSave = () => {
    setGoal(localGoal);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-8 pb-24">
      <div className="flex items-center space-x-4">
        <img src="https://picsum.photos/100" alt="Profile" className="w-24 h-24 rounded-full shadow-lg border-4 border-white" />
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Alex Doe</h1>
          <p className="text-gray-500">Your Personal Finance</p>
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
              className="w-full p-3 mt-1 bg-white/80 rounded-lg border-2 border-transparent focus:border-blue-500 focus:outline-none transition-all"
              placeholder="e.g., 100"
            />
          </div>
          <div>
            <label className="text-gray-600 font-medium">Weekly Goal (LKR)</label>
            <input 
              type="number"
              value={localGoal.weekly}
              onChange={(e) => setLocalGoal(g => ({ ...g, weekly: Number(e.target.value) }))}
              className="w-full p-3 mt-1 bg-white/80 rounded-lg border-2 border-transparent focus:border-blue-500 focus:outline-none transition-all"
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

      <div className="bg-white/60 p-6 rounded-2xl shadow-lg backdrop-blur-sm border border-white/30">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Settings</h2>
        <div className="space-y-3">
            <button className="w-full text-left p-3 rounded-lg hover:bg-white/50 transition-colors">Notifications</button>
            <button className="w-full text-left p-3 rounded-lg hover:bg-white/50 transition-colors">Export Data</button>
            <button className="w-full text-left p-3 rounded-lg hover:bg-white/50 transition-colors text-red-500">Logout</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
