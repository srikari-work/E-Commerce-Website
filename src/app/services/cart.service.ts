import { Injectable } from '@angular/core'; //marks this as service that can be injected into components
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../models/cart-item';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root' //makes service globally available
})
export class CartService {
  private cartItems: CartItem[] = []; //to hold current cart items
  private cartSubject: BehaviorSubject<CartItem[]> = new BehaviorSubject<CartItem[]>([]); //holds the latest cart data and notifies subscribes when changes occur

  constructor() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartItems = JSON.parse(savedCart);
      this.cartSubject.next(this.cartItems);
    }
  }
  // returns an observavle, so components can subscribe to cart updates
  getCartItems() {
    return this.cartSubject.asObservable();
  }

  getCartSnapshot(): CartItem[] {
    return [...this.cartItems]; //returns a copy to prevent direct modification
  }

  addToCart(product: Product) {
    const item = this.cartItems.find(i => i.product.id === product.id);
    if (item) {
      item.quantity += 1;
    } else {
      this.cartItems.push({ product, quantity: 1 });
    }
    this.updateCart();
  }

  removeFromCart(productId: number) {
    this.cartItems = this.cartItems.filter(item => item.product.id !== productId);
    this.updateCart();
  }

  clearCart() {
    this.cartItems = [];
    this.updateCart();
  }

  updateQuantity(productId: number, quantity: number) {
    const item = this.cartItems.find(i => i.product.id === productId);
    if (item) {
      item.quantity = quantity;
      if (item.quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        this.updateCart();
      }
    }
  }
  //updates cartSubject to reflect the latest cart data and saves cart state to localstorage
  private updateCart() {
    this.cartSubject.next(this.cartItems);
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }
}
