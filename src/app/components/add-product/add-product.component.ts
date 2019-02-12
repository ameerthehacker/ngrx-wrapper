import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Stateful } from 'src/state/state';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit, AfterViewInit {

  fb: FormBuilder;
  formGroup: FormGroup;

  constructor(store: Store<any>, private state: Stateful) {
    //super(store);

    this.fb = new FormBuilder();

    this.formGroup = this.fb.group({
      productCode: [],
      productName: [],
      stock: []
    });
  }
  public products: any[];

  onAddProductSubmit() {
    var result = this.formGroup.value;
    var id = this.products.length + 1;
    this.state.set('PRODUCTS', [...this.products, { id, productCode: result.productCode, name: result.productName, stock: parseInt(result.stock) }]);
  }

  ngOnInit() {
  }

  ngAfterViewInit(){
    const d = this.state.listen('PRODUCTS').subscribe((p: any[] = []) => {
      this.products = p;
    });
    
  }

}
