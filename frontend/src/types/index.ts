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
