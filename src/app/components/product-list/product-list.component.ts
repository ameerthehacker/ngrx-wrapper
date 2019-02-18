import { Component, OnInit, Injector } from '@angular/core';
import { StatefulService } from 'src/state/state.service';
import { Store } from '@ngrx/store';
import { Stateful } from 'src/state/stateful';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent extends Stateful implements OnInit {

  products: any;

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    this.listen('PRODUCTS', (products) => {
      this.products = products;
    });
  }

  onProductSelected(id) {
    this.set('SELECTED_PRODUCT_ID', id);
  }
}
