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
    <div className="space-y-8 pb-24 animate-fade-in-up">
      <div className="flex flex-col items-center text-center space-y-2">
        <div className="w-28 h-28 rounded-full shadow-lg border-4 border-white bg-gradient-to-br from-blue-200 to-purple-200 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
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

      <div className="bg-white/60 p-6 rounded-2xl shadow-lg backdrop-blur-sm border border-white/30">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Settings</h2>
        <div className="space-y-2">
            <SettingsItem icon={NotificationIcon} text="Notifications" />
            <SettingsItem icon={ExportIcon} text="Export Data" />
        </div>
      </div>
    </div>
  );
};

const NotificationIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const ExportIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

const SettingsItem: React.FC<{icon: React.FC, text: string}> = ({ icon: Icon, text }) => (
    <button className="w-full flex items-center space-x-4 text-left p-3 rounded-xl hover:bg-white/50 transition-colors text-gray-700">
        <div className="w-10 h-10 flex items-center justify-center bg-gray-100/70 rounded-full">
            <Icon />
        </div>
        <span className="font-medium text-lg">{text}</span>
    </button>
);

export default Profile;