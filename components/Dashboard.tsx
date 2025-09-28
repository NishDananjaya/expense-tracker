
import React from 'react';
import { Expense, Category } from '../types';
import { CATEGORIES_CONFIG } from '../constants';

interface DashboardProps {
  expenses: Expense[];
}

const Dashboard: React.FC<DashboardProps> = ({ expenses }) => {
  const today = new Date().toISOString().split('T')[0];
  const todayExpenses = expenses.filter(e => e.date === today);
  const totalToday = todayExpenses.reduce((sum, e) => sum + e.amount, 0);

  const categoryTotals = Object.values(Category).reduce((acc, category) => {
    acc[category] = expenses
      .filter(e => e.category === category)
      .reduce((sum, e) => sum + e.amount, 0);
    return acc;
  }, {} as Record<Category, number>);

  return (
    <div className="space-y-8 pb-24">
      <Header totalToday={totalToday} />
      <CategoryGrid categoryTotals={categoryTotals} />
      <RecentTransactions expenses={todayExpenses} />
    </div>
  );
};

const Header: React.FC<{ totalToday: number }> = ({ totalToday }) => (
  <div className="text-center">
    <p className="text-gray-500 text-lg">Today's Spending</p>
    <h1 className="text-5xl font-bold text-gray-800 tracking-tighter">
      LKR {totalToday.toFixed(2)}
    </h1>
  </div>
);

const CategoryGrid: React.FC<{ categoryTotals: Record<Category, number> }> = ({ categoryTotals }) => (
    <div>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Categories</h2>
        <div className="grid grid-cols-2 gap-5">
        {Object.entries(categoryTotals).map(([category, total]) => (
            <CategoryCard key={category} category={category as Category} total={total} />
        ))}
        </div>
    </div>
);

const CategoryCard: React.FC<{ category: Category; total: number }> = ({ category, total }) => {
  const config = CATEGORIES_CONFIG[category];
  return (
    <div className="bg-white/60 p-4 rounded-2xl shadow-md backdrop-blur-sm border border-white/30 transform hover:-translate-y-1 transition-transform duration-300">
      <div className="flex items-center space-x-3">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl bg-gradient-to-br ${config.gradient} shadow-inner`}>
          {config.icon}
        </div>
        <div>
          <p className="font-semibold text-gray-700">{category}</p>
          <p className="font-bold text-lg text-gray-900">LKR {total.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};


const RecentTransactions: React.FC<{ expenses: Expense[] }> = ({ expenses }) => (
  <div>
    <h2 className="text-xl font-semibold text-gray-700 mb-4">Today's Transactions</h2>
    <div className="space-y-3">
      {expenses.length > 0 ? expenses.map(expense => (
        <TransactionItem key={expense.id} expense={expense} />
      )) : (
        <p className="text-center text-gray-500 py-4">No transactions today. Good job!</p>
      )}
    </div>
  </div>
);

const TransactionItem: React.FC<{ expense: Expense }> = ({ expense }) => {
  const config = CATEGORIES_CONFIG[expense.category];
  return (
    <div className="flex items-center justify-between p-3 bg-white/80 rounded-xl shadow-sm backdrop-blur-sm border border-white/30">
      <div className="flex items-center space-x-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl bg-gradient-to-br ${config.gradient}`}>
          {config.icon}
        </div>
        <div>
          <p className="font-semibold text-gray-800">{expense.category}</p>
          <p className="text-sm text-gray-500">{expense.notes || 'No notes'}</p>
        </div>
      </div>
      <p className="font-bold text-gray-800">-LKR {expense.amount.toFixed(2)}</p>
    </div>
  );
}

export default Dashboard;
