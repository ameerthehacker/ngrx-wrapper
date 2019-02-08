import { Component, OnInit } from '@angular/core';
import { Stateful } from 'src/state/state';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  selectedProduct: any;

  constructor(private store: Store<any>, private state: Stateful) {
    //super(store);
  }

  ngOnInit() {
    this.state.listen('SELECTED_PRODUCT_ID').subscribe((id) => {
      if(id) {
        this.state.get('PRODUCTS').then((products: any) => {
          this.selectedProduct = products.find(product => product.id == id);
        });
      }
    })
  }
}
