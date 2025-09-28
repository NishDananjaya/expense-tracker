import React, { useState, useEffect } from 'react';
import { Goal } from '../types';
import { FINANCIAL_TIPS } from '../constants';

interface ProfileProps {
  goal: Goal;
  setGoal: (goal: Goal) => void;
  userName: string | null;
}

const LightbulbIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12,2A7,7,0,0,0,5,9c0,2.38,1.19,4.47,3,5.74V17a1,1,0,0,0,1,1h6a1,1,0,0,0,1-1v-2.26c1.81-1.27,3-3.36,3-5.74A7,7,0,0,0,12,2ZM9,21a1,1,0,0,0,1,1h4a1,1,0,0,0,1-1v-1H9v1Z" />
    </svg>
);


const Profile: React.FC<ProfileProps> = ({ goal, setGoal, userName }) => {
  const [localGoal, setLocalGoal] = useState<Goal>(goal);
  const [isSaved, setIsSaved] = useState(false);
  
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [isTipVisible, setIsTipVisible] = useState(true);

  useEffect(() => {
    const tipInterval = setInterval(() => {
      setIsTipVisible(false); // Trigger exit animation

      setTimeout(() => {
        setCurrentTipIndex(prevIndex => (prevIndex + 1) % FINANCIAL_TIPS.length);
        setIsTipVisible(true); // Trigger enter animation
      }, 500); // Must match animation duration
    }, 5000); // 5 seconds per tip

    return () => clearInterval(tipInterval);
  }, []);

  const handleSave = () => {
    setGoal(localGoal);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-8 pb-24 animate-fade-in-up">
      <div className="flex flex-col items-center text-center space-y-2">
        <div className="w-28 h-28 rounded-full shadow-lg border-4 border-white bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{userName || 'My Profile'}</h1>
          <p className="text-gray-500">Manage your goals and settings</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200/80">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Spending Goals</h2>
        <div className="space-y-4">
          <div>
            <label className="text-gray-600 font-medium">Daily Goal (LKR)</label>
            <input 
              type="number"
              value={localGoal.daily}
              onChange={(e) => setLocalGoal(g => ({ ...g, daily: Number(e.target.value) }))}
              className="w-full p-3 mt-1 bg-gray-100 rounded-lg border-2 border-transparent text-gray-800 focus:border-pink-500 focus:outline-none focus:bg-white transition-all"
              placeholder="e.g., 100"
            />
          </div>
          <div>
            <label className="text-gray-600 font-medium">Weekly Goal (LKR)</label>
            <input 
              type="number"
              value={localGoal.weekly}
              onChange={(e) => setLocalGoal(g => ({ ...g, weekly: Number(e.target.value) }))}
              className="w-full p-3 mt-1 bg-gray-100 rounded-lg border-2 border-transparent text-gray-800 focus:border-pink-500 focus:outline-none focus:bg-white transition-all"
              placeholder="e.g., 700"
            />
          </div>
        </div>
        <button 
          onClick={handleSave}
          className="w-full mt-6 py-3 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300">
          {isSaved ? 'Saved!' : 'Save Goals'}
        </button>
      </div>
      
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200/80">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Tips to Reduce Expenses</h2>
        <div className="overflow-hidden min-h-[60px] flex items-center">
            <div className={`flex items-start w-full space-x-3 ${isTipVisible ? 'animate-slide-in-left' : 'animate-slide-out-right'}`}>
              <LightbulbIcon />
              <p className="text-gray-700 flex-1">{FINANCIAL_TIPS[currentTipIndex]}</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;