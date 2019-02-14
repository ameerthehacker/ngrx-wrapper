import { Component, OnInit, AfterViewInit, Injector } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ObservableManager } from 'src/state/observable-manager';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent extends ObservableManager implements OnInit, AfterViewInit {

  fb: FormBuilder;
  formGroup: FormGroup;

  constructor(injector: Injector) {
    super(injector);

    this.fb = new FormBuilder();

    this.formGroup = this.fb.group({
      productCode: [],
      productName: [],
      stock: []
    });
  }
  public products: any[] = [];

  onAddProductSubmit() {
    var result = this.formGroup.value;
    var id = this.products.length + 1;
    this.set('PRODUCTS', [...this.products, { id, productCode: result.productCode, name: result.productName, stock: parseInt(result.stock) }]);
  }

  ngOnInit() {
  }

  ngAfterViewInit(){
    this.listen('PRODUCTS', (p: any[] = []) => {
      this.products = p || this.products;
    });
  }

}
