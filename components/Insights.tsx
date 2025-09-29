import React, { useMemo } from 'react';
import { Expense, Category, Goal, Earning, EarningSource, Budgets } from '../types';
import { CATEGORIES_CONFIG, FINANCIAL_TIPS, EARNING_SOURCES_CONFIG } from '../constants';

interface InsightsProps {
  expenses: Expense[];
  earnings: Earning[];
  goal: Goal;
  budgets: Budgets;
}

const ProgressBar: React.FC<{ color: string; percentage: number }> = ({ color, percentage }) => (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div className="h-2.5 rounded-full" style={{ width: `${percentage}%`, backgroundColor: color }}></div>
    </div>
);

const BreakdownItem: React.FC<{ icon: string; name: string; total: number; maxTotal: number; color: string; }> = ({ icon, name, total, maxTotal, color }) => {
    const percentage = maxTotal > 0 ? (total / maxTotal) * 100 : 0;
    
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <span className="text-lg">{icon}</span>
                    <span className="font-semibold text-gray-700">{name}</span>
                </div>
                <span className="font-bold text-gray-800">LKR {total.toFixed(2)}</span>
            </div>
            <ProgressBar color={color} percentage={percentage} />
        </div>
    );
};

const Insights: React.FC<InsightsProps> = ({ expenses, earnings, goal, budgets }) => {
  const { categoryData, totalSpending, earningData, totalEarnings } = useMemo(() => {
    const catData = Object.values(Category).map(category => {
      const total = expenses
        .filter(e => e.category === category)
        .reduce((sum, e) => sum + e.amount, 0);
      return { name: category, value: total };
    });
    
    const spendingTotal = catData.reduce((sum, item) => sum + item.value, 0);

    const earnData = Object.values(EarningSource).map(source => {
        const total = earnings
          .filter(e => e.source === source)
          .reduce((sum, e) => sum + e.amount, 0);
        return { name: source, value: total };
      });
      
    const earningsTotal = earnData.reduce((sum, item) => sum + item.value, 0);

    return { 
        categoryData: catData.filter(d => d.value > 0), 
        totalSpending: spendingTotal,
        earningData: earnData.filter(d => d.value > 0),
        totalEarnings: earningsTotal,
    };
  }, [expenses, earnings]);
  
  const weeklyTotal = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    return expenses
      .filter(e => {
        const [y, m, d] = e.date.split('-').map(Number);
        const expenseDate = new Date(y, m - 1, d);
        return expenseDate >= startOfWeek;
      })
      .reduce((sum, e) => sum + e.amount, 0);
  }, [expenses]);

  return (
    <div className="space-y-8 pb-24 animate-fade-in-up">
      <h1 className="text-3xl font-bold text-gray-800">Insights</h1>

      <MotivationalMessage weeklyTotal={weeklyTotal} goal={goal} />
      
      <BudgetTracker expenses={expenses} budgets={budgets} />

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200/80">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Category Breakdown</h2>
        <div className="space-y-4">
            {categoryData.length > 0 ? (
                categoryData.map(item => {
                    const config = CATEGORIES_CONFIG[item.name as Category];
                    return (
                        <BreakdownItem 
                            key={item.name} 
                            name={item.name}
                            icon={config.icon}
                            total={item.value}
                            maxTotal={totalSpending}
                            color={config.color}
                        />
                    )
                })
            ) : (
                 <p className="text-center text-gray-500 py-4">No spending data for category breakdown.</p>
            )}
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200/80">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Earning Source Breakdown</h2>
        <div className="space-y-4">
            {earningData.length > 0 ? (
                earningData.map(item => {
                    const config = EARNING_SOURCES_CONFIG[item.name as EarningSource];
                    return (
                        <BreakdownItem 
                            key={item.name} 
                            name={item.name}
                            icon={config.icon}
                            total={item.value}
                            maxTotal={totalEarnings}
                            color={config.color}
                        />
                    )
                })
            ) : (
                 <p className="text-center text-gray-500 py-4">No income data for breakdown.</p>
            )}
        </div>
      </div>

      <TipsCarousel />
    </div>
  );
};

const BudgetTracker: React.FC<{ expenses: Expense[], budgets: Budgets }> = ({ expenses, budgets }) => {
    const monthlySpending = useMemo(() => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        
        const spending: Partial<Record<Category, number>> = {};

        expenses.forEach(expense => {
            const [y, m] = expense.date.split('-').map(Number);
            if (y === currentYear && (m - 1) === currentMonth) {
                spending[expense.category] = (spending[expense.category] || 0) + expense.amount;
            }
        });
        return spending;
    }, [expenses]);
    
    const budgetedCategories = Object.keys(budgets).filter(
        (cat) => (budgets[cat as Category] ?? 0) > 0
    ) as Category[];


    if (budgetedCategories.length === 0) {
        return null; 
    }
    
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200/80">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Monthly Budget Tracker</h2>
            <div className="space-y-4">
                {budgetedCategories.map(category => {
                    const spent = monthlySpending[category] || 0;
                    const budget = budgets[category]!;
                    const percentage = budget > 0 ? (spent / budget) * 100 : 0;
                    
                    let progressBarColor = '#4ade80'; // Green
                    if (percentage > 75) progressBarColor = '#facc15'; // Yellow
                    if (percentage >= 100) progressBarColor = '#f87171'; // Red
                    
                    const config = CATEGORIES_CONFIG[category];

                    return (
                        <div key={category}>
                            <div className="flex justify-between items-center mb-1">
                                <div className="flex items-center space-x-2">
                                    <span className="text-lg">{config.icon}</span>
                                    <span className="font-semibold text-gray-700">{category}</span>
                                </div>
                                <span className="text-sm font-semibold text-gray-600">
                                    LKR {spent.toFixed(0)} / <span className="text-gray-500">{budget.toFixed(0)}</span>
                                </span>
                            </div>
                            <ProgressBar color={progressBarColor} percentage={Math.min(percentage, 100)} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const MotivationalMessage = React.memo<{ weeklyTotal: number, goal: Goal }>(({ weeklyTotal, goal }) => {
    let message = "Keep track of your spending to reach your goals!";
    if (weeklyTotal > 0 && weeklyTotal < goal.weekly) {
        message = `Great job! You're LKR ${(goal.weekly - weeklyTotal).toFixed(2)} under your weekly goal.`;
    } else if (weeklyTotal > goal.weekly) {
        message = `You've exceeded your weekly goal by LKR ${(weeklyTotal - goal.weekly).toFixed(2)}. Let's review!`;
    }

    return (
        <div className="bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-white p-4 rounded-2xl shadow-lg text-center">
            <p className="font-semibold">{message}</p>
        </div>
    );
});

const TipsCarousel: React.FC = () => {
    const [currentTip, setCurrentTip] = React.useState(0);

    const nextTip = () => {
        setCurrentTip((prev) => (prev + 1) % FINANCIAL_TIPS.length);
    };

    return (
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200/80 relative">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Financial Hacks</h2>
            <p className="text-gray-600 min-h-[60px]">{FINANCIAL_TIPS[currentTip]}</p>
            <button 
                onClick={nextTip}
                className="absolute bottom-4 right-4 bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center text-gray-600 shadow-sm hover:bg-gray-200 transition-colors"
            >
                →
            </button>
        </div>
    );
}

export default Insights;