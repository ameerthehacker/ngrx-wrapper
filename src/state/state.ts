import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store'
import { SetAction, SetStateAction } from './actions';
import { OnDestroy } from '@angular/core';

export interface IConfig {
  saveState: boolean;
  db: 'localstorage' | 'indexdb' 
}

@Injectable()
export class Stateful {
  private setAction: SetAction;
  private config: IConfig;

  constructor(private baseStore: Store<any>) {
    this.baseStore = baseStore;
    this.setAction = new SetAction();
  }

  int(config: IConfig){
    this.config = config;

    if(config.saveState) {
      const state = localStorage.getItem('app');

      if(state) {
        const stateJSON = JSON.parse(state).app;
        this.baseStore.dispatch(new SetStateAction(stateJSON));
      }

      this.baseStore.subscribe(result => {
        localStorage.setItem('app', JSON.stringify(result));
      });
    }
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

}