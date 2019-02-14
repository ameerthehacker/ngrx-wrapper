import { Component, OnInit, Injector } from '@angular/core';
import { Stateful } from 'src/state/state';
import { Store } from '@ngrx/store';
import { ObservableManager } from 'src/state/observable-manager';

@Component({
  selector: 'app-total-stock',
  templateUrl: './total-stock.component.html',
  styleUrls: ['./total-stock.component.scss']
})
export class TotalStockComponent extends ObservableManager implements OnInit {
  totalStock: 0;

  constructor(injector: Injector) { 
    super(injector);
  }

  ngOnInit() {
    this.listen('PRODUCTS', products => {
      this.totalStock = 0;
      
      if(products) {
        products.forEach(product => {
          this.totalStock += product.stock;
        });
      }
      else{
        this.totalStock = 0;
      }
    });

    this.listen('PRODUCTS', products => {
      this.totalStock = 0;
      
      if(products) {
        products.forEach(product => {
          this.totalStock += product.stock;
        });
      }
      else{
        this.totalStock = 0;
      }
    });
  }

}
