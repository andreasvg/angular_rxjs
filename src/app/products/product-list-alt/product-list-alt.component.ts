import { ChangeDetectionStrategy, Component } from '@angular/core';

import { EMPTY, Observable, Subject, Subscription } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Product } from '../product';
import { ProductService } from '../product.service';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list-alt.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListAltComponent {
  pageTitle = 'Products';
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();
  selectedProduct$: Observable<Product> = this.productService.selectedProduct$;

  products$: Observable<Product[]> = this.productService.productsWithCategory$
    .pipe(
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      })
    );
  sub: Subscription;

  constructor(private productService: ProductService) { }

  onSelected(productId: number): void {
    this.productService.selectedProductChanged(productId);
  }
}
