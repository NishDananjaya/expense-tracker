import React, { useState, useEffect } from 'react';
import { Category, Expense, EarningSource, Earning } from '../types';
import { CATEGORIES_CONFIG, EARNING_SOURCES_CONFIG } from '../constants';

interface AddTransactionModalProps {
  onClose: () => void;
  onSaveExpense: (expense: Omit<Expense, 'date' | 'id'> & { id?: number }) => void;
  onSaveEarning: (earning: Omit<Earning, 'date' | 'id'>) => void;
  expenseToEdit: Expense | null;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ onClose, onSaveExpense, onSaveEarning, expenseToEdit }) => {
  const [type, setType] = useState<'expense' | 'earning'>('expense');
  const [amount, setAmount] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSource, setSelectedSource] = useState<EarningSource | null>(null);
  const [notes, setNotes] = useState('');

  const isEditing = expenseToEdit !== null;

  useEffect(() => {
    if (isEditing) {
      setType('expense');
      setAmount(String(expenseToEdit.amount));
      setSelectedCategory(expenseToEdit.category);
      setNotes(expenseToEdit.notes);
    }
  }, [expenseToEdit, isEditing]);


  const handleSubmit = () => {
    if (!amount) return;

    if (type === 'expense' && selectedCategory) {
        onSaveExpense({
            ...(isEditing ? { id: expenseToEdit.id } : {}),
            amount: parseFloat(amount),
            category: selectedCategory,
            notes,
        });
    } else if (type === 'earning' && selectedSource) {
        onSaveEarning({
            amount: parseFloat(amount),
            source: selectedSource,
            notes,
        });
    }
  };

  const isSubmitDisabled = !amount || (type === 'expense' && !selectedCategory) || (type === 'earning' && !selectedSource);

  return (
    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50 w-full max-w-sm rounded-3xl shadow-2xl p-6 space-y-6 relative animate-fade-in-up">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
        
        {!isEditing && (
            <div className="bg-gray-200/70 p-1 rounded-full flex">
                <button 
                    onClick={() => setType('expense')} 
                    className={`w-1/2 py-2 rounded-full text-sm font-bold transition-all duration-300 ${type === 'expense' ? 'bg-white shadow-md text-gray-800' : 'text-gray-500'}`}
                >
                    Expense
                </button>
                <button 
                    onClick={() => setType('earning')} 
                    className={`w-1/2 py-2 rounded-full text-sm font-bold transition-all duration-300 ${type === 'earning' ? 'bg-white shadow-md text-gray-800' : 'text-gray-500'}`}
                >
                    Earning
                </button>
            </div>
        )}
        
        <h2 className="text-2xl font-bold text-center text-gray-800">{isEditing ? 'Edit Expense' : `Add ${type === 'expense' ? 'Expense' : 'Earning'}`}</h2>
        
        <div>
            <label className="text-sm font-medium text-gray-500">Amount (LKR)</label>
            <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full text-center text-4xl font-bold text-gray-800 bg-transparent border-b-2 border-gray-300 focus:border-pink-500 focus:outline-none py-2 transition-colors"
            />
        </div>
        
        <div>
            <label className="text-sm font-medium text-gray-500 mb-2 block">{type === 'expense' ? 'Category' : 'Source'}</label>
            <div className="grid grid-cols-3 gap-3">
                {type === 'expense' ? (
                    Object.values(Category).map((cat) => (
                        <CategoryButton
                            key={cat}
                            category={cat}
                            isSelected={selectedCategory === cat}
                            onClick={() => setSelectedCategory(cat)}
                        />
                    ))
                ) : (
                    Object.values(EarningSource).map((src) => (
                        <SourceButton
                            key={src}
                            source={src}
                            isSelected={selectedSource === src}
                            onClick={() => setSelectedSource(src)}
                        />
                    ))
                )}
            </div>
        </div>

        <div>
            <label className="text-sm font-medium text-gray-500">Notes (Optional)</label>
            <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g., Lunch with friends"
                className="w-full p-3 mt-1 bg-white/80 rounded-lg border-2 border-transparent text-gray-800 focus:border-pink-500 focus:outline-none transition-all"
            />
        </div>
        
        <button
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
            className="w-full py-4 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isEditing ? 'Save Changes' : `Add ${type === 'expense' ? 'Expense' : 'Earning'}`}
        </button>
      </div>
    </div>
  );
};

const CategoryButton: React.FC<{ category: Category, isSelected: boolean, onClick: () => void }> = ({ category, isSelected, onClick }) => {
    const config = CATEGORIES_CONFIG[category];
    const baseStyle = "flex flex-col items-center justify-center p-2 rounded-xl cursor-pointer transition-all duration-300 border-2";
    const selectedStyle = `bg-white shadow-inner scale-105`;
    const unselectedStyle = "bg-white/70 shadow-md hover:shadow-lg border-transparent";
    const dynamicStyle = isSelected ? { borderColor: config.color } : {};
    
    return (
        <div onClick={onClick} className={`${baseStyle} ${isSelected ? selectedStyle : unselectedStyle}`} style={dynamicStyle}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl bg-gradient-to-br ${config.gradient} mb-1`}>
                {config.icon}
            </div>
            <span className="text-xs font-semibold text-gray-600">{category}</span>
        </div>
    );
};

const SourceButton: React.FC<{ source: EarningSource, isSelected: boolean, onClick: () => void }> = ({ source, isSelected, onClick }) => {
    const config = EARNING_SOURCES_CONFIG[source];
    const baseStyle = "flex flex-col items-center justify-center p-2 rounded-xl cursor-pointer transition-all duration-300 border-2";
    const selectedStyle = `bg-white shadow-inner scale-105`;
    const unselectedStyle = "bg-white/70 shadow-md hover:shadow-lg border-transparent";
    const dynamicStyle = isSelected ? { borderColor: config.color } : {};
    
    return (
        <div onClick={onClick} className={`${baseStyle} ${isSelected ? selectedStyle : unselectedStyle}`} style={dynamicStyle}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl bg-gradient-to-br ${config.gradient} mb-1`}>
                {config.icon}
            </div>
            <span className="text-xs font-semibold text-gray-600">{source}</span>
        </div>
    );
};

export default AddTransactionModal;