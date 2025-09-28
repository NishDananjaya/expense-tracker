export enum Category {
  Food = 'Food',
  Travel = 'Travel',
  Shopping = 'Shopping',
  Bills = 'Bills',
  Other = 'Other',
}

export enum EarningSource {
  Salary = 'Salary',
  Freelance = 'Freelance',
  Investment = 'Investment',
  Gift = 'Gift',
  Other = 'Other',
}

export interface Expense {
  id: number;
  amount: number;
  category: Category;
  notes: string;
  date: string; // YYYY-MM-DD
}

export interface Earning {
  id: number;
  amount: number;
  source: EarningSource;
  notes: string;
  date: string; // YYYY-MM-DD
}

export interface Goal {
  daily: number;
  weekly: number;
}

export enum Screen {
    Home = 'Home',
    Insights = 'Insights',
    Reports = 'Reports',
    Profile = 'Profile',
}