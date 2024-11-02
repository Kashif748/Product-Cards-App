import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {CartService} from "../services/cart.service";
import CartItem from "../interface/cart";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit{
  cartService = inject(CartService);
  cartItems = this.cartService.cartItems;
  cartRecentPurchas: CartItem[] = [];
  loading: boolean = false;
  purchaseSuccess = false;

  constructor() {}
  ngOnInit(): void {
    this.showDateRangePurchases();
  }
  remove(product: CartItem) {
    this.cartService.removeFromCart(product)
  }
  onQuantitySelected(product: CartItem, quantity: number): void {
    this.cartService.updateInCart(product, Number(quantity));
  }
  showDateRangePurchases(): void {
    this.loading = true;

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 2);

    this.cartService.recentPurchases(startDate, endDate)
      .then(data => {
        this.cartRecentPurchas = data;
        this.loading = false;
      })
      .catch(err => {
        this.loading = false;
      });
  }

  handlePurchase(): void {
    this.cartService.purchase();
    this.purchaseSuccess = true;
    setTimeout(() => this.purchaseSuccess = false, 3000);
  }
}
