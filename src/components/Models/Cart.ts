import { IProduct } from '../../types/index.ts'
import { EventEmitter } from "../base/Events";

export class Cart extends EventEmitter {
  private productsList: IProduct [] = [];

  getProductList(): IProduct [] {
    return this.productsList;
  }

  addProduct(product: IProduct): void {
    this.productsList.push(product);
    this.emit('basket:changed', this.getProductList());
  }

  removeProduct(product: IProduct): void {
    this.productsList = this.productsList.filter(p => p.id !== product.id);
    this.emit('basket:changed', this.getProductList());
  }

  clear(): void {
    this.productsList = [];
    this.emit('basket:changed', this.getProductList())
  }

  getTotalPrice(): number {
    return this.productsList.reduce((sum, product) => sum + (product.price ?? 0), 0);
  }

  getTotalProducts(): number {
    return this.productsList.length;
  }

  hasProduct(id: string): boolean {
    return this.productsList.some(product => product.id === id);
  }
}