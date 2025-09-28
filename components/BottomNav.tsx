import React from 'react';
import { Screen } from '../types';

interface BottomNavProps {
  activeScreen: Screen;
  setActiveScreen: (screen: Screen) => void;
  onAddClick: () => void;
}

const HomeIcon = ({ active }: { active: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-7 w-7 transition-all duration-300 ${active ? 'text-gray-900' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const ChartIcon = ({ active }: { active: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-7 w-7 transition-all duration-300 ${active ? 'text-gray-900' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
  </svg>
);

const ReportsIcon = ({ active }: { active: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-7 w-7 transition-all duration-300 ${active ? 'text-gray-900' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const ProfileIcon = ({ active }: { active: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-7 w-7 transition-all duration-300 ${active ? 'text-gray-900' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);


const BottomNav: React.FC<BottomNavProps> = ({ activeScreen, setActiveScreen, onAddClick }) => {
  const navItems = [
    { screen: Screen.Home, icon: HomeIcon, label: 'Home' },
    { screen: Screen.Insights, icon: ChartIcon, label: 'Insights' },
    { screen: Screen.Reports, icon: ReportsIcon, label: 'Reports' },
    { screen: Screen.Profile, icon: ProfileIcon, label: 'Profile' },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 h-24 bg-white/70 backdrop-blur-md rounded-t-3xl flex items-center justify-around px-2">
      {navItems.slice(0, 2).map((item) => (
        <NavButton key={item.screen} item={item} activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
      ))}
      
      <AddButton onClick={onAddClick} />

      {navItems.slice(2).map((item) => (
         <NavButton key={item.screen} item={item} activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
      ))}
    </div>
  );
};

interface NavButtonProps {
    item: { screen: Screen, icon: React.FC<{ active: boolean }>, label: string };
    activeScreen: Screen;
    setActiveScreen: (screen: Screen) => void;
}

const NavButton: React.FC<NavButtonProps> = ({ item, activeScreen, setActiveScreen}) => {
    const isActive = activeScreen === item.screen;
    return (
        <button onClick={() => setActiveScreen(item.screen)} className="flex flex-col items-center justify-center space-y-1 w-20">
          <item.icon active={isActive} />
          <span className={`text-xs font-semibold transition-all duration-300 ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>{item.label}</span>
        </button>
    );
}

const AddButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <button onClick={onClick} className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 text-white shadow-lg -translate-y-6 transform hover:scale-110 transition-transform duration-300 flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    </button>
  );
}

export default BottomNav;