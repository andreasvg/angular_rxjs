import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { combineLatest, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Product } from './product';
import { ProductCategory } from '../product-categories/product-category';
import { Supplier } from '../suppliers/supplier';
import { SupplierService } from '../suppliers/supplier.service';
import { ProductCategoryService } from '../product-categories/product-category.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsUrl = 'api/products';
  private suppliersUrl = this.supplierService.suppliersUrl;

  constructor(private http: HttpClient,
              private supplierService: SupplierService, private productCategoryService: ProductCategoryService) { }

  public products$ = this.http.get<Product[]>(this.productsUrl)
          .pipe(
            // map((products: Product[]) =>    // map to an array of products (RxJS map operator)
            //   products.map(product => ({    // use the JS array map method to transform each element
            //     ...product,                 // spread the original object into the new object
            //     price: product.price * 1.5, // modify the price property
            //     searchKey: [product.productName]  // add a brand new property
            //   }) as Product)
            //   ),
            catchError(this.handleError)
          );

  productsWithCategory$: Observable<Product[]> = combineLatest(
    [this.products$, this.productCategoryService.productCategories$]
  )
  .pipe(
    map(([products, categories]) => // map to the arrays of products and product categories (RxJS map operator)
      products.map(product => ({    // use the JS array map method to transform each element
        ...product,                 // spread the original object into the new object
        price: product.price * 1.5, // modify the price property
        category: categories.find(c => product.categoryId === c.id).name  // get the category name from the categories stream
        } as Product)
      )
    ),
    catchError(this.handleError)
  );

  private fakeProduct(): Product {
    return {
      id: 42,
      productName: 'Another One',
      productCode: 'TBX-0042',
      description: 'Our new product',
      price: 8.9,
      categoryId: 3,
      // category: 'Toolbox',
      quantityInStock: 30
    };
  }

  private handleError(err: any): Observable<never> {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }

}