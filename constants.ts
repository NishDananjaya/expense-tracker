
import { Category, Expense } from './types';

export const CATEGORIES_CONFIG: { [key in Category]: { icon: string; color: string; gradient: string } } = {
  [Category.Food]: {
    icon: '🍔',
    color: '#FF6B6B',
    gradient: 'from-red-400 to-yellow-400',
  },
  [Category.Travel]: {
    icon: '🚖',
    color: '#4D96FF',
    gradient: 'from-blue-400 to-cyan-400',
  },
  [Category.Shopping]: {
    icon: '🛍️',
    color: '#F7C566',
    gradient: 'from-yellow-400 to-orange-400',
  },
  [Category.Bills]: {
    icon: '💡',
    color: '#4BC0C0',
    gradient: 'from-teal-400 to-green-400',
  },
  [Category.Other]: {
    icon: '💸',
    color: '#C7A2CB',
    gradient: 'from-purple-400 to-pink-400',
  },
};

export const sampleExpenses: Expense[] = [
    { id: 1, amount: 25, category: Category.Food, notes: 'Lunch with colleagues', date: new Date().toISOString().split('T')[0] },
    { id: 2, amount: 50, category: Category.Shopping, notes: 'New T-shirt', date: new Date().toISOString().split('T')[0] },
    { id: 3, amount: 15, category: Category.Travel, notes: 'Metro ride', date: new Date().toISOString().split('T')[0] },
    { id: 4, amount: 120, category: Category.Bills, notes: 'Electricity bill', date: '2023-10-25' },
    { id: 5, amount: 35, category: Category.Food, notes: 'Dinner', date: '2023-10-26' },
    { id: 6, amount: 80, category: Category.Other, notes: 'Movie tickets', date: '2023-10-24' },
    { id: 7, amount: 10, category: Category.Food, notes: 'Coffee', date: new Date().toISOString().split('T')[0] },
];

export const FINANCIAL_TIPS = [
    "Cook at home 3 times a week to save up to LKR 2000 monthly.",
    "Unsubscribe from promotional emails to avoid impulse shopping.",
    "Use public transport for short distances to cut down on travel costs.",
    "Review your subscriptions. Do you use them all?",
    "Set a 24-hour waiting period before making any non-essential purchase."
];
