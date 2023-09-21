export interface Author {
  _id?: string;
  firstName?: string;
  lastName?: string;
  dob?: Date | string;
  description?: string;
}

export interface Category {
  _id?: string;
  name?: string;
}

export interface Publisher {
  _id?: string;
  name?: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
}

export interface Book {
  _id?: string;
  title?: string;
  page_number?: number;
  price?: number;
  published_date?: Date | string;
  author?: Author;
  category?: Category;
  publisher?: Publisher;
}

interface bookItems {
  quantity?: number;
  book?: Book;
}

export interface Order {
  _id?: string;
  customerName?: string;
  customerPhoneNumber?: string;
  items?: bookItems[];
  totalPrice?: number;
}

export interface SearchFilter {
  page?: number;
  limit?: number;
  fullTextSearch?: string;
}
