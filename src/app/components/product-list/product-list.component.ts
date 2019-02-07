import { Component, OnInit } from '@angular/core';
import { Stateful } from 'src/state/state';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent extends Stateful implements OnInit {

  products: any;

  constructor(private store: Store<any>) { 
    super(store);
  }

  ngOnInit() {
    this.listen('PRODUCTS').subscribe((products) => {
      this.products = products;
    });

    const products = [
      {
        id: 1,
        productCode: 'P000',
        name: 'Soap',
        stock: 2,
      },
      { 
        id: 2,
        productCode: 'P0001',
        name: 'Pencil',
        stock: 5
      },
      { 
        id: 3,
        productCode: 'P0004',
        name: 'Powder',
        stock: 7
      }
    ]

    this.set('PRODUCTS', products);
  }

  onProductSelected(id) {
    this.set('SELECTED_PRODUCT_ID', id);
  }
}
