import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { CartService } from '../../services/cart.service';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = []; //stores all products from api
  displayedProducts: Product[] = []; //stores products for current page
  pageSize = 4;
  pageIndex = 0;
  totalProducts = 0;

  constructor(private productService: ProductService, private cartService: CartService, private router: Router) { }
  //lifecycle hook that runs after component is initialized
  ngOnInit(): void {
    this.productService.getProducts().subscribe((products) => { //subscribe-to handle asynchronous API responses
      this.products = products;
      this.totalProducts = products.length;
      this.updateDisplayedProducts();
    });
  }
  //to display products for current page
  updateDisplayedProducts() {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.displayedProducts = this.products.slice(start, end);
  }
  //updating the page based on pageevent
  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateDisplayedProducts();
  }
  //detailed view of particular product
  viewProductDetails(product: Product) {
    this.router.navigate(['/products', product.id]);
  }
  //adding product to cart
  addToCart(product: Product) {
    this.cartService.addToCart(product);
    alert(`${product.title} added to cart!`);
  }
}

