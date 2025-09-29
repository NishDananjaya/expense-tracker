import React, { useState, useEffect, useMemo } from 'react';
import { Goal, Budgets, Category } from '../types';
import { FINANCIAL_TIPS, CATEGORIES_CONFIG } from '../constants';
import { AVATARS } from './Avatars';

interface ProfileProps {
  goal: Goal;
  setGoal: (goal: Goal) => void;
  userName: string | null;
  userAvatar: string | null;
  budgets: Budgets;
  setBudgets: (budgets: Budgets) => void;
}

const LightbulbIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12,2A7,7,0,0,0,5,9c0,2.38,1.19,4.47,3,5.74V17a1,1,0,0,0,1,1h6a1,1,0,0,0,1-1v-2.26c1.81-1.27,3-3.36,3-5.74A7,7,0,0,0,12,2ZM9,21a1,1,0,0,0,1,1h4a1,1,0,0,0,1-1v-1H9v1Z" />
    </svg>
);

const Profile: React.FC<ProfileProps> = ({ goal, setGoal, userName, userAvatar, budgets, setBudgets }) => {
  const [localGoal, setLocalGoal] = useState<Goal>(goal);
  const [localBudgets, setLocalBudgets] = useState<Budgets>(budgets);
  const [isSaved, setIsSaved] = useState(false);
  
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [isTipVisible, setIsTipVisible] = useState(true);

  const avatarUrl = useMemo(() => {
    const defaultAvatarUrl = 'https://api.dicebear.com/8.x/personas/png?seed=default&backgroundColor=c0aede,d1d4f9,ffd5dc,ffdfbf,c2f2d0,bfe2f2';
    if (!userAvatar) {
        return defaultAvatarUrl;
    }
    const avatar = AVATARS.find(a => a.id === userAvatar);
    return avatar ? avatar.url : defaultAvatarUrl;
  }, [userAvatar]);

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
    setBudgets(localBudgets);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };
  
  const handleBudgetChange = (category: Category, amount: string) => {
    const numericAmount = parseFloat(amount);
    setLocalBudgets(prev => {
        const newBudgets = {...prev};
        if (isNaN(numericAmount) || numericAmount <= 0) {
            delete newBudgets[category];
        } else {
            newBudgets[category] = numericAmount;
        }
        return newBudgets;
    });
  };

  return (
    <div className="space-y-8 pb-24 animate-fade-in-up">
      <div className="flex flex-col items-center text-center space-y-2">
        <div className="w-28 h-28 rounded-full shadow-lg border-4 border-white bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center p-1">
            <div className="w-full h-full bg-white rounded-full overflow-hidden">
              <img src={avatarUrl} alt={userName || 'User Avatar'} className="w-full h-full object-cover" />
            </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{userName || 'My Profile'}</h1>
          <p className="text-gray-500">Manage your goals and settings</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200/80">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Settings</h2>
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-600">Spending Goals</h3>
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
        
        <hr className="my-6 border-gray-200" />

        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-600">Monthly Budgets</h3>
            {Object.values(Category).map(cat => (
                 <div key={cat}>
                    <label className="text-gray-600 font-medium flex items-center space-x-2">
                      <span>{CATEGORIES_CONFIG[cat].icon}</span>
                      <span>{cat}</span>
                    </label>
                    <input 
                      type="number"
                      value={localBudgets[cat] || ''}
                      onChange={(e) => handleBudgetChange(cat, e.target.value)}
                      className="w-full p-3 mt-1 bg-gray-100 rounded-lg border-2 border-transparent text-gray-800 focus:border-pink-500 focus:outline-none focus:bg-white transition-all"
                      placeholder="Not set"
                    />
                  </div>
            ))}
        </div>


        <button 
          onClick={handleSave}
          className="w-full mt-6 py-3 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300">
          {isSaved ? 'Saved!' : 'Save Settings'}
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

      <div className="text-center text-gray-400 text-xs">
        Made by Nishan Dananjaya
      </div>
    </div>
  );
};

export default Profile;
