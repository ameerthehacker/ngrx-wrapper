import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Stateful } from 'src/state/state';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  title = 'ngx-wrapper';

  constructor(private statefulService: Stateful) {
    this.statefulService.int({
      db: 'localstorage',
      saveState: true
    })
  }

  ngOnDestroy() {
    console.log('destroy');
  }
}
