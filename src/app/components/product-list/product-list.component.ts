import { Component, OnInit, Injector } from '@angular/core';
import { Stateful } from 'src/state/state';
import { Store } from '@ngrx/store';
import { ObservableManager } from 'src/state/observable-manager';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent extends ObservableManager implements OnInit {

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
