import React, { useMemo, useState } from 'react';
import { Expense, Earning } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface ReportsProps {
    expenses: Expense[];
    earnings: Earning[];
}

const Reports: React.FC<ReportsProps> = ({ expenses, earnings }) => {
    const now = new Date();
    const currentMonthName = now.toLocaleString('default', { month: 'long' });
    const currentYear = now.getFullYear();
    const [activeYearlyView, setActiveYearlyView] = useState<'expense' | 'earning'>('expense');

    return (
        <div className="space-y-8 pb-24 animate-fade-in-up">
            <h1 className="text-3xl font-bold text-gray-800 text-center">Financial Overview</h1>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200/80">
                <h2 className="text-xl font-semibold text-gray-700 mb-1 text-center">{currentMonthName} Snapshot</h2>
                <p className="text-center text-gray-500 mb-4">Daily net flow heatmap</p>
                <CalendarHeatmap expenses={expenses} earnings={earnings} year={currentYear} month={now.getMonth()} />
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200/80">
                <h2 className="text-xl font-semibold text-gray-700 mb-1 text-center">{currentYear} Yearly Breakdown</h2>
                <p className="text-center text-gray-500 mb-4">Distribution by Month</p>
                
                <div className="flex justify-center mb-4 bg-gray-100 p-1 rounded-full max-w-sm mx-auto">
                    <button 
                        onClick={() => setActiveYearlyView('expense')} 
                        className={`w-1/2 py-2 text-sm font-bold rounded-full transition-all duration-300 ${activeYearlyView === 'expense' ? 'bg-white shadow-md text-gray-800' : 'text-gray-500'}`}
                    >
                        Expenses
                    </button>
                    <button 
                        onClick={() => setActiveYearlyView('earning')} 
                        className={`w-1/2 py-2 text-sm font-bold rounded-full transition-all duration-300 ${activeYearlyView === 'earning' ? 'bg-white shadow-md text-gray-800' : 'text-gray-500'}`}
                    >
                        Earnings
                    </button>
                </div>

                <div>
                    {activeYearlyView === 'expense' ? (
                        <YearlyPieChart expenses={expenses} year={currentYear} type="expense" />
                    ) : (
                        <YearlyPieChart expenses={earnings} year={currentYear} type="earning" />
                    )}
                </div>
            </div>
        </div>
    );
};

interface CalendarHeatmapProps {
    expenses: Expense[];
    earnings: Earning[];
    year: number;
    month: number;
}

const CalendarHeatmap: React.FC<CalendarHeatmapProps> = ({ expenses, earnings, year, month }) => {
    const [selectedDayInfo, setSelectedDayInfo] = useState<{ day: number, net: number } | null>(null);

    const { dailyNet, maxNet, minNet } = useMemo(() => {
        const netTotals: { [day: number]: number } = {};

        const processTransactions = (transactions: (Expense | Earning)[], isExpense: boolean) => {
            transactions.forEach(t => {
                const [tYear, tMonth, tDay] = t.date.split('-').map(Number);
                if (tYear === year && (tMonth - 1) === month) {
                    const day = tDay;
                    const amount = isExpense ? -t.amount : t.amount;
                    netTotals[day] = (netTotals[day] || 0) + amount;
                }
            });
        };

        processTransactions(expenses, true);
        processTransactions(earnings, false);

        const allValues = Object.values(netTotals);
        const max = Math.max(0, ...allValues.filter(v => v > 0));
        const min = Math.min(0, ...allValues.filter(v => v < 0));

        return { dailyNet: netTotals, maxNet: max, minNet: min };
    }, [expenses, earnings, year, month]);

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });

    const getDayStyle = (day: number) => {
        const net = dailyNet[day] || 0;
        if (net > 0) {
            const opacity = maxNet > 0 ? 0.1 + (net / maxNet) * 0.9 : 0.1;
            return { backgroundColor: `rgba(16, 185, 129, ${opacity})` }; // Green for profit
        }
        if (net < 0) {
            const opacity = minNet < 0 ? 0.1 + (net / minNet) * 0.9 : 0.1;
            return { backgroundColor: `rgba(192, 38, 211, ${opacity})` }; // Purple for loss
        }
        return { backgroundColor: 'rgba(229, 231, 235, 0.5)' }; // Gray for no activity
    };
    
    const handleDayClick = (day: number) => {
        const net = dailyNet[day] || 0;
        if (selectedDayInfo && selectedDayInfo.day === day) {
            setSelectedDayInfo(null);
        } else {
            setSelectedDayInfo({ day, net });
        }
    };

    return (
        <div>
            <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-gray-500 mb-2">
                {weekdays.map(day => <div key={day}>{day}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} />)}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    return (
                        <button
                            key={day}
                            onClick={() => handleDayClick(day)}
                            className={`w-full aspect-square rounded-lg transition-all duration-300 relative focus:outline-none ${selectedDayInfo?.day === day ? 'ring-2 ring-purple-500 ring-offset-2' : ''}`}
                            style={getDayStyle(day)}
                        >
                            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white mix-blend-screen">{day}</span>
                        </button>
                    );
                })}
            </div>
            <div className="mt-4 text-center min-h-[40px] flex items-center justify-center">
                {selectedDayInfo ? (
                    <p className="text-gray-700 font-semibold animate-fade-in-up text-sm">
                        On <span className="text-purple-600">{monthName} {selectedDayInfo.day}</span>, your net flow was <span className={selectedDayInfo.net >= 0 ? 'text-green-600' : 'text-red-500'}>LKR {selectedDayInfo.net.toFixed(2)}</span>.
                    </p>
                ) : (
                    <p className="text-gray-500 text-sm">Tap on a day to see details.</p>
                )}
            </div>
        </div>
    );
}

const YearlyPieChart: React.FC<{ expenses: (Expense[] | Earning[]), year: number, type: 'expense' | 'earning' }> = ({ expenses, year, type }) => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const isExpense = type === 'expense';
    
    const chartData = useMemo(() => {
        const monthlyTotals = Array(12).fill(0);
        expenses.forEach(e => {
            const expenseDate = new Date(e.date);
            if (expenseDate.getFullYear() === year) {
                monthlyTotals[expenseDate.getMonth()] += e.amount;
            }
        });

        return monthNames
            .map((name, index) => ({
                name,
                value: monthlyTotals[index],
            }))
            .filter(item => item.value > 0);
    }, [expenses, year]);

    const totalValue = useMemo(() => chartData.reduce((sum, entry) => sum + entry.value, 0), [chartData]);

    const EXPENSE_COLORS = ['#f87171', '#f472b6', '#e879f9', '#c084fc', '#a78bfa', '#818cf8', '#60a5fa', '#38bdf8', '#22d3ee', '#2dd4bf', '#facc15', '#fb923c'];
    const EARNING_COLORS = ['#34d399', '#6ee7b7', '#a7f3d0', '#059669', '#047857', '#065f46', '#10b981', '#14b8a6', '#2dd4bf', '#6d28d9', '#8b5cf6', '#a78bfa'];
    const COLORS = isExpense ? EXPENSE_COLORS : EARNING_COLORS;

    if (chartData.length === 0) {
        return <div className="text-center text-gray-500 py-8 h-[300px] flex flex-col justify-center">
            <h3 className="font-semibold text-lg text-gray-800">{isExpense ? "Yearly Expenses" : "Yearly Earnings"}</h3>
            <p>No {type} data for this year.</p>
        </div>;
    }
    
    const onPieClick = (_: any, index: number) => {
        setActiveIndex(index === activeIndex ? null : index);
    };

    const activeData = activeIndex !== null ? chartData[activeIndex] : null;

    return (
        <div className="w-full h-[350px] flex flex-col items-center">
            <div className="w-full h-[250px] relative">
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            paddingAngle={3}
                            onClick={onPieClick}
                        >
                            {chartData.map((entry, index) => (
                                <Cell 
                                    key={`cell-${index}`} 
                                    fill={COLORS[monthNames.indexOf(entry.name) % COLORS.length]} 
                                    stroke={activeIndex === index ? (isExpense ? '#c084fc' : '#34d399') : 'none'}
                                    strokeWidth={4}
                                    style={{
                                        transform: activeIndex === index ? 'scale(1.05)' : 'scale(1)',
                                        transformOrigin: 'center center',
                                        transition: 'transform 0.2s ease-in-out',
                                        cursor: 'pointer'
                                    }}
                                />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    {activeData ? (
                        <>
                            <span className="text-xl font-bold text-gray-800">LKR {activeData.value.toFixed(2)}</span>
                            <span className="text-xs text-gray-500 font-semibold">{activeData.name}</span>
                        </>
                    ) : (
                        <>
                            <span className="text-xl font-bold text-gray-800">LKR {totalValue.toFixed(2)}</span>
                            <span className="text-xs text-gray-500 font-semibold">Total {isExpense ? 'Spent' : 'Earned'}</span>
                        </>
                    )}
                </div>
            </div>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-4 px-2">
                {chartData.map((entry) => (
                    <div key={`legend-${entry.name}`} className="flex items-center space-x-2 text-xs">
                        <span 
                            className="w-2.5 h-2.5 rounded-full" 
                            style={{ backgroundColor: COLORS[monthNames.indexOf(entry.name) % COLORS.length] }} 
                        />
                        <span className="text-gray-600 font-medium">{entry.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};


export default Reports;