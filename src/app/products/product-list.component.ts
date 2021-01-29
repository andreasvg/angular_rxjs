import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { BehaviorSubject, combineLatest, EMPTY, Observable, of, Subject } from 'rxjs';
import { catchError, filter, map, scan, tap } from 'rxjs/operators';

import { Product } from './product';
import { ProductService } from './product.service';
import { ProductCategoryService } from '../product-categories/product-category.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent {
  pageTitle = 'Product List';
  errorMessage = '';
  private categorySelectedSubject = new BehaviorSubject<number>(0);
  private categorySelectedAction$ = this.categorySelectedSubject.asObservable();

  products$: Observable<Product[]> = this.productService.productsWithAdd$
    .pipe(
      tap(p => console.log(p)),
      catchError(err => {
        this.errorMessage = err;
        return EMPTY;
      })
    );

  public productsFiltered$: Observable<Product[]> = combineLatest(
    [
      this.productService.productsWithAdd$,
      this.categorySelectedAction$
    ])
    .pipe(
      tap(([products, categoryId]) => console.log(categoryId)),
      map(([products, categoryId]) =>
        products.filter(product =>
          categoryId > 0 ? product.categoryId === categoryId : true))
    );

  categories$ = this.productCategoryService.productCategories$
      .pipe(
        catchError(err => {
          this.errorMessage = err;
          return EMPTY;
        })
      );

  constructor(private productService: ProductService, private productCategoryService: ProductCategoryService) { }

  onAdd(): void {
    this.productService.productAdded(null);
  }

  onSelected(categoryId: string): void {
    this.categorySelectedSubject.next(+categoryId);
  }
}
