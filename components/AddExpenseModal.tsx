import React, { useState } from 'react';
import { Category } from '../types';
import { CATEGORIES_CONFIG } from '../constants';

interface AddExpenseModalProps {
  onClose: () => void;
  onAddExpense: (expense: { amount: number; category: Category; notes: string }) => void;
}

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ onClose, onAddExpense }) => {
  const [amount, setAmount] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    if (amount && selectedCategory) {
      onAddExpense({
        amount: parseFloat(amount),
        category: selectedCategory,
        notes,
      });
    }
  };

  return (
    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-100 via-blue-100 to-purple-100 w-full max-w-sm rounded-3xl shadow-2xl p-6 space-y-6 relative animate-fade-in-up">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
        
        <h2 className="text-2xl font-bold text-center text-gray-800">Add Expense</h2>
        
        <div>
            <label className="text-sm font-medium text-gray-500">Amount (LKR)</label>
            <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full text-center text-4xl font-bold text-gray-800 bg-transparent border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none py-2 transition-colors"
            />
        </div>
        
        <div>
            <label className="text-sm font-medium text-gray-500 mb-2 block">Category</label>
            <div className="grid grid-cols-3 gap-3">
                {Object.values(Category).map((cat) => (
                    <CategoryButton
                        key={cat}
                        category={cat}
                        isSelected={selectedCategory === cat}
                        onClick={() => setSelectedCategory(cat)}
                    />
                ))}
            </div>
        </div>

        <div>
            <label className="text-sm font-medium text-gray-500">Notes (Optional)</label>
            <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g., Lunch with friends"
                className="w-full p-3 mt-1 bg-white/80 rounded-lg border-2 border-transparent text-gray-800 focus:border-blue-500 focus:outline-none transition-all"
            />
        </div>
        
        <button
            onClick={handleSubmit}
            disabled={!amount || !selectedCategory}
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            Add Expense
        </button>
      </div>
    </div>
  );
};

interface CategoryButtonProps {
    category: Category;
    isSelected: boolean;
    onClick: () => void;
}

const CategoryButton: React.FC<CategoryButtonProps> = ({ category, isSelected, onClick }) => {
    const config = CATEGORIES_CONFIG[category];
    const baseStyle = "flex flex-col items-center justify-center p-2 rounded-xl cursor-pointer transition-all duration-300 border-2";
    const selectedStyle = `bg-white shadow-inner scale-105`;
    const unselectedStyle = "bg-white/70 shadow-md hover:shadow-lg border-transparent";
    const dynamicStyle = isSelected ? { borderColor: config.color } : {};
    
    return (
        <div
            onClick={onClick}
            className={`${baseStyle} ${isSelected ? selectedStyle : unselectedStyle}`}
            style={dynamicStyle}
        >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl bg-gradient-to-br ${config.gradient} mb-1`}>
                {config.icon}
            </div>
            <span className="text-xs font-semibold text-gray-600">{category}</span>
        </div>
    );
};


export default AddExpenseModal;