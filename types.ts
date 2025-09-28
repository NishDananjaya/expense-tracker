
export enum Category {
  Food = 'Food',
  Travel = 'Travel',
  Shopping = 'Shopping',
  Bills = 'Bills',
  Other = 'Other',
}

export interface Expense {
  id: number;
  amount: number;
  category: Category;
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
    Profile = 'Profile',
}
