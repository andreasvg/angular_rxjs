import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from "@angular/core/testing";
import { StandardDataProvider } from '../../testing/StandardDataProvider';
import { of, Subject } from "rxjs";
import { TestScheduler } from 'rxjs/testing';
import { ProductService } from "../product.service";
import { ProductDetailComponent } from './product-detail.component';
import { cold } from 'jasmine-marbles';

describe(`ProductDetailComponent marble testing`, () => {
  let fixture: ComponentFixture<ProductDetailComponent>;
  let component: ProductDetailComponent;
  let mockProductService;
  let dataProvider: StandardDataProvider;

  beforeEach(async() => {
    createMocks();

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

  function createMocks(): void {
    dataProvider = new StandardDataProvider();
    const product = {...dataProvider.products[0]};

    mockProductService = jasmine.createSpyObj(['foo$']);
    mockProductService.selectedProduct$ = of(product);
    mockProductService.suppliersForSelectedProduct$ = of([...dataProvider.suppliers]);
  }

  it(`should create`, () => {
    // Arrange:
    // Act:
    fixture.detectChanges();

    // Assert:
    expect(component).toBeTruthy();
  });

  describe(`vm$`, () => {
    let scheduler: TestScheduler;

    beforeEach(() => {
      scheduler = new TestScheduler((actual, expected) => {
        expect(actual).toEqual(expected);
      })
    });

    it(`should contain the expected value`, () => {
      // Arrange:
      const product = {...dataProvider.products[0]};
      const expectedTitle: string = `Product Detail [${product.productName}]`;
      const suppliers = [...dataProvider.suppliers];

       const expectedObservable = cold('(a|)', { a: {
          title: expectedTitle,
          product,
          suppliers
        }
      });

      // Act:
      fixture.detectChanges();

      // Assert:
      expect(component.vm$).toBeObservable(expectedObservable);
    });


  });
});
