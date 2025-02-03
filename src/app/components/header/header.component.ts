import { Component } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { Observable } from 'rxjs'; //asynchronous stream of data that changes over time
import { map } from 'rxjs/operators'; //used to transform data emitted by an observable

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  //to store the total count of items in cart and automatically update whenever the cart data changes
  cartItemCount$: Observable<number>; //property of type observable<number>

  constructor(private cartService: CartService) { //injection of cartService into the component allowing to access cart data
    this.cartItemCount$ = this.cartService.getCartItems().pipe( //pipe allows to apply multiple transfomations to observable
      map(items => items.reduce((acc, item) => acc + item.quantity, 0))
    );
  }
}
