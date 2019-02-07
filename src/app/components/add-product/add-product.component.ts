import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Stateful } from 'src/state/state';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent extends Stateful implements OnInit {

  fb: FormBuilder;
  formGroup: FormGroup;

  constructor(store: Store<any>) { 
    super(store);

    this.fb = new FormBuilder();

    this.formGroup = this.fb.group({
      productCode: [],
      productName: [],
      stock: []
    });
  }

  onAddProductSubmit() {
    this.get('PRODUCTS').then((products: any) => {
      const result = this.formGroup.value;
      const id = products.length + 1;

      this.set('PRODUCTS', [...products, { id, productCode: result.productCode, name: result.productName, stock: parseInt(result.stock) } ]);
    });
  }

  ngOnInit() {
  }

}
