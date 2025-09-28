import React, { useState, useCallback, useEffect } from 'react';
import { Expense, Goal, Screen, Earning } from './types';
import BottomNav from './components/BottomNav';
import Dashboard from './components/Dashboard';
import Insights from './components/Insights';
import Profile from './components/Profile';
import Reports from './components/Reports';
import AiAssistant from './components/AiAssistant';
import AddTransactionModal from './components/AddExpenseModal';
import WelcomeModal from './components/WelcomeModal';

const AiIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="currentColor">
       <path d="M12,2A10,10,0,0,0,2,12a9.89,9.89,0,0,0,1.5,5.1A1,1,0,0,0,4.9,16h0a1,1,0,0,0,.7-1.71,7.91,7.91,0,0,1,1-.95A8,8,0,1,1,12,20a7.92,7.92,0,0,1-3.66-1,1,1,0,0,0-1.09.21L6,20.41a1,1,0,0,0,.45,1.36A10,10,0,1,0,12,2Zm-1,5a1,1,0,1,0-1,1A1,1,0,0,0,11,7Zm4,0a1,1,0,1,0-1,1A1,1,0,0,0,15,7Zm-4,6a3,3,0,0,0-3,3,1,1,0,0,0,2,0,1,1,0,0,1,2,0,1,1,0,0,0,2,0,3,3,0,0,0-3-3Z"/>
    </svg>
);

const AiBubble: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <button
        onClick={onClick}
        className="absolute bottom-28 right-5 w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 text-white shadow-lg transform hover:scale-110 transition-transform duration-300 flex items-center justify-center z-40"
        aria-label="Open AI Assistant"
    >
        <AiIcon />
    </button>
);


const App: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<Screen>(Screen.Home);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);

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

  const handleDeleteExpense = useCallback((expenseId: number) => {
    setExpenses(prevExpenses => prevExpenses.filter(exp => exp.id !== expenseId));
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
        return <Dashboard expenses={expenses} earnings={earnings} onEditExpense={handleEditClick} onDeleteExpense={handleDeleteExpense} />;
      case Screen.Insights:
        return <Insights expenses={expenses} earnings={earnings} goal={goal} />;
      case Screen.Reports:
        return <Reports expenses={expenses} earnings={earnings} />;
      case Screen.Profile:
        return <Profile goal={goal} setGoal={setGoal} userName={userName} />;
      default:
        return <Dashboard expenses={expenses} earnings={earnings} onEditExpense={handleEditClick} onDeleteExpense={handleDeleteExpense} />;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-[420px] h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50 rounded-[40px] shadow-2xl overflow-hidden relative flex flex-col font-sans">
        <main className="flex-1 p-6 flex flex-col overflow-y-auto">
          {renderScreen()}
        </main>
        
        <AiBubble onClick={() => setIsAiChatOpen(true)} />

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
        
        {isAiChatOpen && (
            <AiAssistant 
                expenses={expenses} 
                earnings={earnings} 
                userName={userName} 
                onClose={() => setIsAiChatOpen(false)} 
            />
        )}

        {!userName && <WelcomeModal onSaveName={setUserName} />}
      </div>
    </div>
  );
};

export default App;