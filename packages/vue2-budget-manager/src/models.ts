export interface Budget {
  id: string;
  categories: Category[];
}

export interface Category {
  id: string;
  name: string;
  allocation: NumberRange;
  classifications: Classification[];
}

export interface NumberRange {
  start: number;
  end: number;
}

export interface Classification {
  id: string;
  name: string;
}
