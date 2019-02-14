import { Component, OnInit, Injector } from '@angular/core';
import { Stateful } from 'src/state/state';
import { Store } from '@ngrx/store';
import { ObservableManager } from 'src/state/observable-manager';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent extends ObservableManager implements OnInit {
  selectedProduct: any;

  constructor(injector: Injector) {
    super(injector);
  }

  async ngOnInit() {
    this.listen('SELECTED_PRODUCT_ID', (id) => {
      if(id) {
        this.get('PRODUCTS').then((products: any) => {
          this.selectedProduct = products.find(product => product.id == id);
        });
      }
    })
  }
}
