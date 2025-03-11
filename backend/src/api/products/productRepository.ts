import type { Product } from "@/api/products/productModel";

export const products: Product[] = [
  { id: 1, name: "Fries", available: true },
  { id: 2, name: "Big Mac", available: true },
  { id: 3, name: "Drink", available: false },
  { id: 4, name: "6 pc. McNuggets", available: true },
  { id: 5, name: "12 pc. McNuggets", available: false },
  { id: 6, name: "(New) Cheeseburger", available: false },
  { id: 7, name: "Sundae", available: true },
];

export class ProductRepository {
  async findAllAsync(): Promise<Product[]> {
    return products;
  }

  async findByIdAsync(id: number): Promise<Product | null> {
    return products.find((product) => product.id === id) || null;
  }

  async searchAsync(query: string): Promise<Product[]> {
    if (!query) return products;

    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // Escape special characters
    const regex = new RegExp(escapedQuery, "i"); // Case-insensitive search

    return products.filter((product) => regex.test(product.name));
  }

  async createAsync(product: Product): Promise<Product[]> {
    products.push(product);
    return products;
  }

  async deleteAsync(id: number): Promise<Product[] | null> {
    const product = products.find((p) => p.id === id);
    if (!product) {
      return null;
    }
    const index = products.indexOf(product);
    products.splice(index, 1);
    return products;
  }
}
