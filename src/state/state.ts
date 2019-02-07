import { Store } from '@ngrx/store'
import { SetAction } from './actions';
import { OnDestroy } from '@angular/core';

export abstract class Stateful implements OnDestroy {
  private setAction: SetAction;

  constructor(private baseStore: Store<any>) {
    this.baseStore = baseStore;
    this.setAction = new SetAction();
  }

  public set(key: any, value: any) {
    this.setAction.payload = { key, value };

    this.baseStore.dispatch(this.setAction);
  }

  public listen(key: any) {
    return this.baseStore.select('app', key);
  }

  public get(key: any) {
    return new Promise((resolve, reject) => {
      this.baseStore.select('app', key).subscribe((result: any) => {
        resolve(result);
      });
    }); 
  }

  public ngOnDestroy() {
    console.log('destoryed');
  }
}