import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from "@angular/core/testing";
import { StandardDataProvider } from '../../testing/StandardDataProvider';
import { Subject } from "rxjs";
import { Supplier } from "src/app/suppliers/supplier";
import { Product } from "../product";
import { ProductService } from "../product.service";
import { ProductDetailComponent } from './product-detail.component';

class MockProductService {
  public selectedProductSubject = new Subject<Product>();
  public selectedProduct$ = this.selectedProductSubject.asObservable();

  public suppliersForSelectedProductSubject = new Subject<Supplier>();
  public suppliersForSelectedProduct$ = this.suppliersForSelectedProductSubject.asObservable();
}

describe(`ProductDetailComponent`, () => {
  let fixture: ComponentFixture<ProductDetailComponent>;
  let component: ProductDetailComponent;
  let mockProductService: MockProductService;
  let dataProvider: StandardDataProvider;

  beforeEach(async() => {
    dataProvider = new StandardDataProvider();

    mockProductService = new MockProductService();

    TestBed.configureTestingModule({
      providers: [ { provide: ProductService, useValue: mockProductService } ],
      declarations: [ ProductDetailComponent ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetailComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture = null;
    component = null;
    dataProvider = null;
    mockProductService = null;
  });

  it(`should create`, () => {
    // Arrange:
    // Act:
    fixture.detectChanges();

    // Assert:
    expect(component).toBeTruthy();
  });

  describe(`pageTitle`, () => {

    it(`should contain the expected value`, (done) => {
      // Arrange:
      const product = {...dataProvider.products[0]};
      const expectedTitle: string = `Product Detail [${product.productName}]`;
      fixture.detectChanges();

      // Act:
      component.vm$.subscribe((vm) => {
        // Assert:
        expect(vm.title).toBe(expectedTitle);
        done();
      });

      mockProductService.selectedProductSubject.next(product);
      mockProductService.suppliersForSelectedProductSubject.next({...dataProvider.suppliers[0]});
    });

    // it(`should emit null when no product has been emitted`, (done) => {
    //   // Arrange:
    //   fixture.detectChanges();
    //   mockProductService.selectedProductSubject.next(null);
    //   mockProductService.suppliersForSelectedProductSubject.next(null);

    //   // Act:
    //   component.vm$.subscribe((vm) => {
    //     // Assert:
    //     expect(vm.title).toBeNull();
    //     done();
    //   });

    // });
  });
});
