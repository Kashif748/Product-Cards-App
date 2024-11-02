import {computed, Injectable, signal} from '@angular/core';
import CartItem from "../interface/cart";
import Product from "../interface/Product";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems = signal<CartItem[]>([]);
  constructor() { }
  cartItemsTotal = computed(() => this.cartItems().reduce((acc, curr) => acc + curr.quantity, 0));
  subTotal = computed(() => this.cartItems().reduce((acc, curr) => {
    return acc + (curr.product.price * curr.quantity);
  }, 0));

  addProduct(product: Product): void {
    const index = this.cartItems().findIndex(item =>
      item.product.title === product.title);
    if (index === -1) {
      this.cartItems.update(items => [...items, { product, quantity: 1 }]);
    } else {
      this.cartItems.update((items: CartItem[]): CartItem[] =>
        [
          ...items.slice(0, index),
          { ...items[index], quantity: items[index].quantity + 1 },
          ...items.slice(index + 1)
        ]);
    }
  }

  removeFromCart(cartItem: CartItem): void {
    this.cartItems.update(items => items.filter(item =>
      item.product.title !== cartItem.product.title));
  }

  updateInCart(cartItem: CartItem, quantity: number): void {
    this.cartItems.update(items =>
      items.map(item => item.product.title === cartItem.product.title ?
        { product: cartItem.product, quantity } : item));
  }
  recentPurchases(startDate: Date, endDate: Date): Promise<CartItem[]> {
    const start = startDate.toISOString().split('T')[0];
    const end = endDate.toISOString().split('T')[0];

    return fetch(`https://fakestoreapi.com/carts?startdate=${start}&enddate=${end}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch cart items');
        }
        return res.json();
      })
      .then(data => this.processCartData(data))
      .catch(error => {
        return [];
      });
  }

  private processCartData(data: any): CartItem[] {
    return data.map((item: CartItem) => ({
      product: item.product,
      quantity: item.quantity,
    }));
  }
  purchase(): void {
    this.cartItems.update(() => []);
  }
}
