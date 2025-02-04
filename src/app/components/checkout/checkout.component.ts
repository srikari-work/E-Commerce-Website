import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit{
  checkoutForm: FormGroup;
  submitted = false;
  totalPrice = 0;

  constructor(private fb: FormBuilder, private cartService: CartService, private router: Router) {
    this.checkoutForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      cardNumber: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]],
      expiration: ['', Validators.required],
      cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3}$')]],

    });
  }

  ngOnInit(): void {
      this.cartService.getCartItems().subscribe(items => {
        this.totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
      })
  }

  onSubmit() {
    this.submitted = true;
    if(this.checkoutForm.valid) {
      const orderDetails = {
        name: this.checkoutForm.value.name,
        address: this.checkoutForm.value.address,
        totalPrice: this.totalPrice,
        items: this.cartService.getCartSnapshot()
      }
      this.cartService.clearCart();
      this.router.navigate(['/order-confirmation'], {state: { order: orderDetails }});
    }
  }

}
