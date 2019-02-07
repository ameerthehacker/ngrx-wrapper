import { Component, OnInit } from '@angular/core';
import { Stateful } from 'src/state/state';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent extends Stateful implements OnInit {
  selectedProduct: any;

  constructor(private store: Store<any>) {
    super(store);
  }

  ngOnInit() {
    this.listen('SELECTED_PRODUCT_ID').subscribe((id) => {
      if(id) {
        this.get('PRODUCTS').then((products: any) => {
          this.selectedProduct = products.find(product => product.id == id);
        });
      }
    })
  }
}
