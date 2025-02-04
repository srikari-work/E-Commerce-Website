import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/cart-item';
import { Product } from 'src/app/models/product';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];

  constructor(private cartService: CartService, private router: Router) { }
  //subscribes to the cartService.getCartItems() observable to updates cartItems whenever the cart is modified
  ngOnInit(): void {
    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
    });
  }

  updateQuantity(productId: number, quantity: string) {
    const qty = parseInt(quantity, 10);
    if (!isNaN(qty)) {
      this.cartService.updateQuantity(productId, qty);
    }
  }

  removeItem(productId: number) {
    this.cartService.removeFromCart(productId);
  }

  getTotal() {
    return this.cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }

  
  onQuantityChange(event: Event, productId: number) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement) {
      const newQuantity = inputElement.value;
      this.updateQuantity(productId, newQuantity);
    }
  }

  viewProductDetails(product: Product) {
    this.router.navigate(['/products', product.id]);
  }

  proceedToCheckout() {
    this.router.navigate(['/checkout']);
  }
  
  
}
