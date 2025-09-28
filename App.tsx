import React, { useState, useCallback, useEffect } from 'react';
import { Expense, Goal, Screen } from './types';
import BottomNav from './components/BottomNav';
import Dashboard from './components/Dashboard';
import Insights from './components/Insights';
import Profile from './components/Profile';
import AddExpenseModal from './components/AddExpenseModal';

const App: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<Screen>(Screen.Home);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    try {
      const savedExpenses = localStorage.getItem('expenses');
      return savedExpenses ? JSON.parse(savedExpenses) : [];
    } catch (error) {
      console.error("Failed to parse expenses from localStorage", error);
      return [];
    }
  });

  const [goal, setGoal] = useState<Goal>(() => {
    try {
      const savedGoal = localStorage.getItem('goal');
      return savedGoal ? JSON.parse(savedGoal) : { daily: 100, weekly: 700 };
    } catch (error) {
      console.error("Failed to parse goal from localStorage", error);
      return { daily: 100, weekly: 700 };
    }
  });

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('goal', JSON.stringify(goal));
  }, [goal]);

  const handleAddExpense = useCallback((expense: Omit<Expense, 'id' | 'date'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
    };
    setExpenses(prevExpenses => [newExpense, ...prevExpenses]);
    setIsModalOpen(false);
  }, []);

  const renderScreen = () => {
    switch (activeScreen) {
      case Screen.Home:
        return <Dashboard expenses={expenses} />;
      case Screen.Insights:
        return <Insights expenses={expenses} goal={goal} />;
      case Screen.Profile:
        return <Profile goal={goal} setGoal={setGoal} />;
      default:
        return <Dashboard expenses={expenses} />;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-[420px] h-[850px] bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-[40px] shadow-2xl overflow-hidden relative flex flex-col font-sans">
        <main className="flex-grow overflow-y-auto p-6 scroll-smooth scroll-container">
          {renderScreen()}
        </main>
        
        <BottomNav 
          activeScreen={activeScreen} 
          setActiveScreen={setActiveScreen} 
          onAddClick={() => setIsModalOpen(true)}
        />
        
        {isModalOpen && (
          <AddExpenseModal 
            onClose={() => setIsModalOpen(false)} 
            onAddExpense={handleAddExpense} 
          />
        )}
      </div>
    </div>
  );
};

export default App;