import React, { useMemo, useState } from 'react';
import { Expense, Category, Earning, EarningSource } from '../types';
import { CATEGORIES_CONFIG, EARNING_SOURCES_CONFIG } from '../constants';

interface DashboardProps {
  expenses: Expense[];
  earnings: Earning[];
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (expenseId: number) => void;
  userName: string | null;
}

type Transaction = (Expense & { type: 'expense' }) | (Earning & { type: 'earning' });

const Dashboard: React.FC<DashboardProps> = ({ expenses, earnings, onEditExpense, onDeleteExpense, userName }) => {
  const [activeView, setActiveView] = useState<'today' | 'month'>('today');

  const { transactions, totals } = useMemo(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;
    
    const allTransactions: Transaction[] = [
        ...expenses.map(e => ({ ...e, type: 'expense' as const })),
        ...earnings.map(e => ({ ...e, type: 'earning' as const }))
    ].sort((a, b) => b.id - a.id);

    const getTotals = (filterFn: (dateStr: string) => boolean) => {
        const filteredExpenses = expenses.filter(e => filterFn(e.date));
        const filteredEarnings = earnings.filter(e => filterFn(e.date));

        const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
        const totalEarnings = filteredEarnings.reduce((sum, e) => sum + e.amount, 0);

        return {
            expenses: totalExpenses,
            earnings: totalEarnings,
            balance: totalEarnings - totalExpenses
        };
    };

    const todayTotals = getTotals(date => date === todayStr);
    const monthTotals = getTotals(date => {
        const [y, m] = date.split('-');
        return new Date().getFullYear() === Number(y) && (new Date().getMonth() + 1) === Number(m);
    });

    return { 
        transactions: allTransactions.filter(t => t.date === todayStr),
        totals: { today: todayTotals, month: monthTotals }
    };
  }, [expenses, earnings]);
  
  const categoryTotals = useMemo(() => 
    Object.values(Category).reduce((acc, category) => {
      acc[category] = expenses
        .filter(e => e.category === category)
        .reduce((sum, e) => sum + e.amount, 0);
      return acc;
    }, {} as Record<Category, number>),
    [expenses]
  );

  const dateString = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="space-y-6 flex flex-col flex-1 animate-fade-in-up">
       <div>
        <h1 className="text-3xl font-bold text-gray-800">Hello, {userName || 'Friend'}!</h1>
        <p className="text-gray-500">{dateString}</p>
       </div>
       <Header 
        totals={activeView === 'today' ? totals.today : totals.month}
        activeView={activeView} 
        setActiveView={setActiveView} 
      />
      <CategoryStories categoryTotals={categoryTotals} />
      <RecentTransactions transactions={transactions} onEditExpense={onEditExpense} onDeleteExpense={onDeleteExpense} />
    </div>
  );
};

interface HeaderProps {
    totals: { earnings: number, expenses: number, balance: number };
    activeView: 'today' | 'month';
    setActiveView: (view: 'today' | 'month') => void;
}

const Header: React.FC<HeaderProps> = ({ totals, activeView, setActiveView }) => {
    return (
        <div className="text-center space-y-4">
            <div className="flex justify-center space-x-8">
                <button onClick={() => setActiveView('today')} className={`text-lg font-semibold transition-all duration-300 relative pb-1 ${activeView === 'today' ? 'text-gray-900' : 'text-gray-400'}`}>
                    Today
                    {activeView === 'today' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>}
                </button>
                <button onClick={() => setActiveView('month')} className={`text-lg font-semibold transition-all duration-300 relative pb-1 ${activeView === 'month' ? 'text-gray-900' : 'text-gray-400'}`}>
                    This Month
                    {activeView === 'month' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>}
                </button>
            </div>
            <div>
                 <p className="text-gray-500 text-lg">Net Balance</p>
                 <h1 className="text-5xl font-bold text-gray-800 tracking-tighter">
                    LKR {totals.balance.toFixed(2)}
                </h1>
            </div>
            <div className="flex justify-around items-center pt-2">
                <div className="text-center">
                    <p className="text-gray-500 text-sm">Income</p>
                    <p className="font-bold text-lg text-green-500">LKR {totals.earnings.toFixed(2)}</p>
                </div>
                <div className="text-center">
                    <p className="text-gray-500 text-sm">Expenses</p>
                    <p className="font-bold text-lg text-red-500">LKR {totals.expenses.toFixed(2)}</p>
                </div>
            </div>
        </div>
    );
};

const CategoryStories = React.memo<{ categoryTotals: Record<Category, number> }>(({ categoryTotals }) => (
    <div>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Categories</h2>
        <div className="flex space-x-4 overflow-x-auto pb-3 -mx-6 px-6">
            {Object.entries(categoryTotals)
                .filter(([, total]) => total > 0)
                .map(([category, total]) => (
                <CategoryStoryItem key={category} category={category as Category} total={total} />
            ))}
        </div>
    </div>
));

const CategoryStoryItem: React.FC<{ category: Category; total: number }> = ({ category, total }) => {
    const config = CATEGORIES_CONFIG[category];
    return (
        <div className="flex flex-col items-center space-y-2 flex-shrink-0 w-20">
            <div className="w-16 h-16 rounded-full p-1 bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600">
                <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-2xl">
                    {config.icon}
                </div>
            </div>
            <p className="text-xs text-gray-700 font-semibold truncate w-full text-center">{category}</p>
        </div>
    );
};


const RecentTransactions = React.memo<{ transactions: Transaction[], onEditExpense: (expense: Expense) => void, onDeleteExpense: (expenseId: number) => void }>(({ transactions, onEditExpense, onDeleteExpense }) => (
  <div className="flex flex-col flex-1">
    <h2 className="text-xl font-semibold text-gray-700 mb-2">Today's Transactions</h2>
    <div className="space-y-0 overflow-y-auto flex-1 pb-20 -mx-6 px-6">
      {transactions.length > 0 ? transactions.map(transaction => (
        <TransactionItem key={`${transaction.type}-${transaction.id}`} transaction={transaction} onEdit={onEditExpense} onDelete={onDeleteExpense} />
      )) : (
        <p className="text-center text-gray-500 py-8">No transactions today.</p>
      )}
    </div>
  </div>
));

const EditIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
    </svg>
)

const TrashIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
    </svg>
)

const TransactionItem: React.FC<{ transaction: Transaction, onEdit: (expense: Expense) => void, onDelete: (expenseId: number) => void }> = ({ transaction, onEdit, onDelete }) => {
  const isExpense = transaction.type === 'expense';
  const config = isExpense ? CATEGORIES_CONFIG[transaction.category] : EARNING_SOURCES_CONFIG[transaction.source];
  const title = transaction.notes || (isExpense ? transaction.category : transaction.source);
  const subtitle = transaction.notes ? (isExpense ? transaction.category : transaction.source) : null;
  const amountPrefix = isExpense ? '-' : '+';
  const amountColor = isExpense ? 'text-gray-800' : 'text-green-600';

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-200/80">
      <div className="flex items-center space-x-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl`} style={{backgroundColor: config.color + '20'}}>
            <span className="text-lg">{config.icon}</span>
        </div>
        <div>
          <p className="font-semibold text-gray-800">{title}</p>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <p className={`font-bold ${amountColor}`}>{amountPrefix}LKR {transaction.amount.toFixed(2)}</p>
        {isExpense && (
            <div className="flex items-center space-x-2 text-gray-400">
                <button onClick={() => onEdit(transaction)} className="hover:text-gray-600 transition-colors">
                    <EditIcon />
                </button>
                 <button onClick={() => onDelete(transaction.id)} className="hover:text-red-500 transition-colors">
                    <TrashIcon />
                </button>
            </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;