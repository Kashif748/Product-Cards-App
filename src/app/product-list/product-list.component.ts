import {Component, HostListener, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {CommonModule} from "@angular/common";
import {ProductCardComponent} from "../product-card/product-card.component";
import {HttpClient} from "@angular/common/http";
import {LoaderComponent} from "../loader/loader.component";
import {ProductService} from "../services/product.service";
import Product from "../interface/Product";
import {catchError, takeUntil, tap} from "rxjs/operators";
import {of, Subject} from "rxjs";

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, LoaderComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  loading = false;
  limit = 10;

  constructor(private http: HttpClient) {}
  apiService = inject(ProductService);
  error: unknown;
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.fetchProducts();
  }

  fetchProducts() {
    this.loading = true;
    this.apiService.getProducts(this.limit).pipe(
      takeUntil(this.destroy$),
      tap(() => this.loading = true),
      tap((data: Product[]) => {
        this.products = [...this.products, ...data];
      }),
      catchError((error: unknown) => {
        this.error = error;
        return of([]);
      }),
      tap(() => this.loading = false)
    ).subscribe();
  }

  @HostListener('window:scroll', [])
  onScroll() {
    const pos = window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;
    if (pos) {
      this.limit = this.limit + 10;
      this.fetchProducts();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
