export interface Book {
  _id: string;
  title: string;
  author: string[];
  description: string;
  category: string;
  price: number;
  publisher: string;
  publishDate: string;
  language: string;
  pages: number;
  stock: number;
  coverImageUrl: string;
  imageUrls: string[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  name: string;
  imageUrl: string;
  clerkId: string;
}

export interface Cart {
  _id: string;
  user: User;
  items: CartItem[];
}

export interface CartItem {
  book: Book;
  quantity: number;
}
