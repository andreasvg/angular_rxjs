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
  private errorMessageSubject = new Subject<string>();
  public errorMessage$ = this.errorMessageSubject.asObservable();
  private categorySelectedSubject = new BehaviorSubject<number>(0);
  private categorySelectedAction$ = this.categorySelectedSubject.asObservable();

  // private products$: Observable<Product[]> = this.productService.productsWithAdd$
  //   .pipe(
  //     tap(p => console.log(p)),
  //     catchError(err => {
  //       this.errorMessage = err;
  //       return EMPTY;
  //     })
  //   );

  private productsFiltered$: Observable<Product[]> = combineLatest(
    [
      this.productService.productsWithAdd$,
      this.categorySelectedAction$
    ])
    .pipe(
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      }),
      tap(([products, categoryId]) => console.log(categoryId)),
      map(([products, categoryId]) =>
        products.filter(product =>
          categoryId > 0 ? product.categoryId === categoryId : true))
    );

  private categories$ = this.productCategoryService.productCategories$
      .pipe(
        catchError(err => {
          this.errorMessageSubject.next(err);
          return EMPTY;
        })
      );

  public vm$ = combineLatest([
    this.productsFiltered$,
    this.categories$
  ]).pipe(
    map(([products, categories]) => ({
      products,
      categories
    }))
  );

  constructor(private productService: ProductService, private productCategoryService: ProductCategoryService) { }

  onAdd(): void {
    this.productService.productAdded(null);
  }

  onSelected(categoryId: string): void {
    this.categorySelectedSubject.next(+categoryId);
  }
}
