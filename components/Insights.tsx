import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Expense, Category, Goal } from '../types';
import { CATEGORIES_CONFIG, FINANCIAL_TIPS } from '../constants';

interface InsightsProps {
  expenses: Expense[];
  goal: Goal;
}

const EmptyState: React.FC<{ message: string }> = ({ message }) => (
    <div className="text-center py-10 h-64 flex items-center justify-center">
        <p className="text-gray-500">{message}</p>
    </div>
);

const Insights: React.FC<InsightsProps> = ({ expenses, goal }) => {
  const categoryData = useMemo(() => 
    Object.values(Category).map(category => {
      const total = expenses
        .filter(e => e.category === category)
        .reduce((sum, e) => sum + e.amount, 0);
      return { name: category, value: total };
    }).filter(d => d.value > 0),
    [expenses]
  );
  
  const colors = useMemo(() => 
    categoryData.map(d => CATEGORIES_CONFIG[d.name as Category].color),
    [categoryData]
  );

  const weekData = useMemo(() => {
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
  }, [expenses]);

  const weeklyTotal = useMemo(() => 
    weekData.reduce((sum, day) => sum + day.spending, 0),
    [weekData]
  );

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, percent, name }: any) => {
    const radius = outerRadius + 25; // Place label further out
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#374151" // text-gray-700
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        style={{ fontSize: '13px', fontWeight: 500 }}
      >
        {`${name} ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="space-y-8 pb-24 animate-fade-in-up">
      <h1 className="text-3xl font-bold text-gray-800">Insights</h1>

      <MotivationalMessage weeklyTotal={weeklyTotal} goal={goal} />

      <div className="bg-white/50 p-4 rounded-2xl shadow-lg border border-white/30">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Weekly Spending</h2>
         {expenses.length === 0 ? <EmptyState message="Add some expenses to see your weekly spending." /> : (
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weekData} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#60A5FA" />
                      <stop offset="100%" stopColor="#A78BFA" />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '1rem'
                    }}
                    itemStyle={{ color: '#1f2937' }}
                    cursor={{ fill: 'rgba(96, 165, 250, 0.3)' }}
                  />
                  <Legend />
                  <Bar dataKey="spending" fill="url(#barGradient)" name="Spending (LKR)" radius={[10, 10, 0, 0]} animationDuration={800} />
                </BarChart>
              </ResponsiveContainer>
            </div>
        )}
      </div>

      <div className="bg-white/50 p-4 rounded-2xl shadow-lg border border-white/30">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Category Breakdown</h2>
        {categoryData.length === 0 ? <EmptyState message="No spending data for category breakdown." /> : (
          <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                  <PieChart margin={{ top: 20, right: 40, bottom: 20, left: 40 }}>
                  <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={70}
                      innerRadius={35}
                      fill="#8884d8"
                      dataKey="value"
                      paddingAngle={5}
                      animationDuration={800}
                      label={renderCustomizedLabel}
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
                      itemStyle={{ color: '#1f2937' }}
                  />
                  </PieChart>
              </ResponsiveContainer>
          </div>
        )}
      </div>
      
      <TipsCarousel />
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
        <div className="bg-gradient-to-r from-blue-400 to-purple-500 text-white p-4 rounded-2xl shadow-lg text-center">
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
        <div className="bg-white/50 p-4 rounded-2xl shadow-lg border border-white/30 relative">
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