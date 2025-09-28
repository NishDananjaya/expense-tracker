
import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Expense, Category, Goal } from '../types';
import { CATEGORIES_CONFIG, FINANCIAL_TIPS } from '../constants';

interface InsightsProps {
  expenses: Expense[];
  goal: Goal;
}

const Insights: React.FC<InsightsProps> = ({ expenses, goal }) => {
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly'>('weekly');

  const categoryData = Object.values(Category).map(category => {
    const total = expenses
      .filter(e => e.category === category)
      .reduce((sum, e) => sum + e.amount, 0);
    return { name: category, value: total };
  }).filter(d => d.value > 0);
  
  const colors = categoryData.map(d => CATEGORIES_CONFIG[d.name as Category].color);

  // For Bar Chart - Weekly spending
  const getWeekData = () => {
    const data = Array(7).fill(0).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return {
        name: d.toLocaleDateString('en-US', { weekday: 'short' }),
        spending: 0,
        date: d.toISOString().split('T')[0]
      };
    }).reverse();

    expenses.forEach(expense => {
      const expenseDate = expense.date;
      const dayData = data.find(d => d.date === expenseDate);
      if (dayData) {
        dayData.spending += expense.amount;
      }
    });

    return data;
  };
  const weekData = getWeekData();
  const weeklyTotal = weekData.reduce((sum, day) => sum + day.spending, 0);


  return (
    <div className="space-y-8 pb-24">
      <h1 className="text-3xl font-bold text-gray-800">Insights</h1>

      <MotivationalMessage weeklyTotal={weeklyTotal} goal={goal} />

      <div className="bg-white/60 p-4 rounded-2xl shadow-lg backdrop-blur-sm border border-white/30">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Weekly Spending</h2>
        <div className="w-full h-64">
           <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weekData} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '1rem'
                }}
              />
              <Legend />
              <Bar dataKey="spending" fill="#8884d8" name="Spending (LKR)" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white/60 p-4 rounded-2xl shadow-lg backdrop-blur-sm border border-white/30">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Category Breakdown</h2>
         <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <PieChart>
                <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    innerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    paddingAngle={5}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                    {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                </Pie>
                <Tooltip 
                    contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '1rem'
                    }}
                />
                </PieChart>
            </ResponsiveContainer>
        </div>
      </div>
      
      <TipsCarousel />
    </div>
  );
};

const MotivationalMessage: React.FC<{ weeklyTotal: number, goal: Goal }> = ({ weeklyTotal, goal }) => {
    let message = "Keep track of your spending to reach your goals!";
    if (weeklyTotal < goal.weekly) {
        message = `Great job! You're LKR ${(goal.weekly - weeklyTotal).toFixed(2)} under your weekly goal.`;
    } else {
        message = `You've exceeded your weekly goal by LKR ${(weeklyTotal - goal.weekly).toFixed(2)}. Let's review!`;
    }

    return (
        <div className="bg-gradient-to-r from-blue-400 to-purple-500 text-white p-4 rounded-2xl shadow-lg text-center">
            <p className="font-semibold">{message}</p>
        </div>
    );
};

const TipsCarousel: React.FC = () => {
    const [currentTip, setCurrentTip] = useState(0);

    const nextTip = () => {
        setCurrentTip((prev) => (prev + 1) % FINANCIAL_TIPS.length);
    };

    return (
        <div className="bg-white/60 p-4 rounded-2xl shadow-lg backdrop-blur-sm border border-white/30 relative">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Financial Hacks</h2>
            <p className="text-gray-600 min-h-[60px]">{FINANCIAL_TIPS[currentTip]}</p>
            <button 
                onClick={nextTip}
                className="absolute bottom-4 right-4 bg-white/50 w-8 h-8 rounded-full flex items-center justify-center text-gray-600 shadow-md hover:bg-white transition-colors"
            >
                →
            </button>
        </div>
    );
}

export default Insights;
