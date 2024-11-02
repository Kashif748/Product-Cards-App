import {Component, inject, Input} from '@angular/core';
import {CommonModule, CurrencyPipe} from "@angular/common";
import Product from "../interface/Product";
import {CartService} from "../services/cart.service";

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CurrencyPipe, CommonModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent {
  @Input() product!: Product;
  cartService = inject(CartService);

  addProduct(productItem: Product) {
    this.cartService.addProduct(productItem);
  }
}
