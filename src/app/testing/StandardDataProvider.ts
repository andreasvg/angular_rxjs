import { StandardDataBuilder } from './StandardDataBuilder';
import { Product } from '../products/product';
import { Supplier } from '../suppliers/supplier';

export class StandardDataProvider {
  private readonly recordBuilder = new StandardDataBuilder();

    products = this.recordBuilder.BuildRecords<Product>((i) =>
    ({
      id: i,
      productName: `ProductName${i.toString()}`,
      productCode: `ProductCode${i.toString()}`,
      description: `Description${i.toString()}`,
      price: i,
      categoryId: 1,
      category: 'Tool',
      quantityInStock: i,
      searchKey: [],
      supplierIds: [1,2]
    })
  );

  suppliers = this.recordBuilder.BuildRecords<Supplier>((i) =>
  ({
    id: i,
    name: `Name${i.toString()}`,
    cost: i,
    minQuantity: i
  })
);

}
