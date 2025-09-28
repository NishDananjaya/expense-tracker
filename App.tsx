import React, { useState, useCallback, useEffect } from 'react';
import { Expense, Goal, Screen, Earning } from './types';
import BottomNav from './components/BottomNav';
import Dashboard from './components/Dashboard';
import Insights from './components/Insights';
import Profile from './components/Profile';
import Reports from './components/Reports';
import AddTransactionModal from './components/AddExpenseModal';
import WelcomeModal from './components/WelcomeModal';

const App: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<Screen>(Screen.Home);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const [userName, setUserName] = useState<string | null>(() => localStorage.getItem('userName'));

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    try {
      const savedExpenses = localStorage.getItem('expenses');
      return savedExpenses ? JSON.parse(savedExpenses) : [];
    } catch (error) {
      console.error("Failed to parse expenses from localStorage", error);
      return [];
    }
  });
  
  const [earnings, setEarnings] = useState<Earning[]>(() => {
    try {
      const savedEarnings = localStorage.getItem('earnings');
      return savedEarnings ? JSON.parse(savedEarnings) : [];
    } catch (error) {
      console.error("Failed to parse earnings from localStorage", error);
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
    localStorage.setItem('earnings', JSON.stringify(earnings));
  }, [earnings]);

  useEffect(() => {
    localStorage.setItem('goal', JSON.stringify(goal));
  }, [goal]);
  
  useEffect(() => {
    if (userName) {
      localStorage.setItem('userName', userName);
    }
  }, [userName]);

  const handleSaveExpense = useCallback((expenseData: Omit<Expense, 'date' | 'id'> & { id?: number }) => {
    setExpenses(prevExpenses => {
      if (expenseData.id !== undefined) {
        // Editing existing expense
        return prevExpenses.map(exp => 
          exp.id === expenseData.id ? { ...exp, ...expenseData } : exp
        );
      } else {
        // Adding new expense
        const newExpense: Expense = {
          id: Date.now(),
          date: new Date().toISOString().split('T')[0],
          amount: expenseData.amount,
          category: expenseData.category,
          notes: expenseData.notes,
        };
        return [newExpense, ...prevExpenses];
      }
    });
    setIsModalOpen(false);
    setEditingExpense(null);
  }, []);
  
  const handleSaveEarning = useCallback((earningData: Omit<Earning, 'date' | 'id'>) => {
    setEarnings(prevEarnings => {
        const newEarning: Earning = {
          id: Date.now(),
          date: new Date().toISOString().split('T')[0],
          ...earningData
        };
        return [newEarning, ...prevEarnings];
    });
    setIsModalOpen(false);
  }, []);

  const handleEditClick = (expense: Expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingExpense(null);
  }

  const renderScreen = () => {
    switch (activeScreen) {
      case Screen.Home:
        return <Dashboard expenses={expenses} earnings={earnings} onEditExpense={handleEditClick} />;
      case Screen.Insights:
        return <Insights expenses={expenses} earnings={earnings} goal={goal} />;
      case Screen.Reports:
        return <Reports expenses={expenses} earnings={earnings} />;
      case Screen.Profile:
        return <Profile goal={goal} setGoal={setGoal} userName={userName} />;
      default:
        return <Dashboard expenses={expenses} earnings={earnings} onEditExpense={handleEditClick} />;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-[420px] h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50 rounded-[40px] shadow-2xl overflow-hidden relative flex flex-col font-sans">
        <main className="flex-1 p-6 flex flex-col overflow-y-auto">
          {renderScreen()}
        </main>
        
        <BottomNav 
          activeScreen={activeScreen} 
          setActiveScreen={setActiveScreen} 
          onAddClick={() => setIsModalOpen(true)}
        />
        
        {isModalOpen && (
          <AddTransactionModal 
            onClose={handleCloseModal} 
            onSaveExpense={handleSaveExpense}
            onSaveEarning={handleSaveEarning}
            expenseToEdit={editingExpense}
          />
        )}
        {!userName && <WelcomeModal onSaveName={setUserName} />}
      </div>
    </div>
  );
};

export default App;