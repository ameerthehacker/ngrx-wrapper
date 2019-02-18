import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { StatefulService } from '../state/state.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ngrx-wrapper';
  productsVisisble: boolean = true;

  constructor() {}

  onHideBtnClick() {
    this.productsVisisble = !this.productsVisisble;
  }
}
