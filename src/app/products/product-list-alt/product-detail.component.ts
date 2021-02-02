import { ChangeDetectionStrategy, Component } from '@angular/core';
import { combineLatest, EMPTY, Subject } from 'rxjs';
import { catchError, combineAll, filter, map } from 'rxjs/operators';
import { Product } from '../product';

import { ProductService } from '../product.service';

@Component({
  selector: 'pm-product-detail',
  templateUrl: './product-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailComponent {
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  private product$ = this.productService.selectedProduct$
    .pipe(
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      })
    );

  private pageTitle$ = this.product$
      .pipe(
        map((p: Product) => p ? `Product Detail [${p.productName}]` : null)
      );

  private productSuppliers$ = this.productService.suppliersForSelectedProduct$
    .pipe(
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      })
    );

  public vm$ = combineLatest(
    [
      this.pageTitle$,
      this.product$,
      this.productSuppliers$
    ]
  ).pipe(
    filter(([product]) => Boolean(product)),
    map(([title, product, suppliers]) => ({
      title,
      product,
      suppliers
    }))
  );

  constructor(private productService: ProductService) { }

}
