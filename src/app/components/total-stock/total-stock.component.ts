import { Component, OnInit } from '@angular/core';
import { Stateful } from 'src/state/state';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-total-stock',
  templateUrl: './total-stock.component.html',
  styleUrls: ['./total-stock.component.scss']
})
export class TotalStockComponent implements OnInit {
  totalStock: 0;

  constructor(private store: Store<any>, private state: Stateful) { 
    //super(store);
  }

  async ngOnInit() {
    (await this.state.listen('PRODUCTS')).subscribe(products => {
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
