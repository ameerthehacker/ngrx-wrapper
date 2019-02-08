import { Component, OnInit } from '@angular/core';
import { Stateful } from 'src/state/state';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  products: any;

  constructor(private store: Store<any>, private state: Stateful) { 
    //super(store);
  }

  ngOnInit() {
    this.state.listen('PRODUCTS').subscribe((products) => {
      this.products = products;
    });

  }
  
  onProductSelected(id) {
    this.state.set('SELECTED_PRODUCT_ID', id);
  }
}
