import { Injectable, Inject, OnInit, DebugElement } from '@angular/core';
import { Store } from '@ngrx/store'
import { SetAction, SetStateAction } from './actions';
import { IStorageConfig } from './state.module';
import { Storage_Enums } from './storage.enums';
import { DexieService } from './dexie.service';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

@Injectable()
export class StatefulService {
  private setAction: SetAction;
  private prefix: string;

  constructor(private baseStore: Store<any>, @Inject('storageConfig') private storageConfig: IStorageConfig, private indexDb: DexieService) {
    this.baseStore = baseStore;
    this.setAction = new SetAction();
    this.prefix = storageConfig.prefix || 'ssm';
  }

  public set(key: any, value: any) {
    if(!key.startsWith(this.prefix)) {
      key = `${this.prefix}-${key}`;
    }

    const db = this.storageConfig.db;
    this.setAction.payload = { key, value };
    this.baseStore.dispatch(this.setAction);
    if (db === Storage_Enums.LocalStorage) {
      this.saveStateInLocalStorage(key, value);
    }
    else if (db === Storage_Enums.SessionStorage) {
      this.saveStateInSessionStorage(key, value)
    }
    else if (db === Storage_Enums.IndexDb) {
      this.saveStateInIndexDb(key, value)
    }
  }

  public listen(key: any, callback): Subscription {
    if(!key.startsWith(this.prefix)) {
      key = `${this.prefix}-${key}`;
    }

    let $storeValue = this.baseStore.select('app', key);
    
    const observable: Subscription = $storeValue.subscribe(data => {
      let storeValue = data;
      if (!storeValue && this.storageConfig.db) {
        this.getValueFromStorage(key).then(response => {
          this.set(key, response);
        });
      }
      
      callback(data);
    });

    return observable;
  }

  public get(key: any, callback) {
    if(!key.startsWith(this.prefix)) {
      key = `${this.prefix}-${key}`;
    }

    let $storeValue = this.baseStore.select('app', key);
    
    const observable: Subscription = $storeValue.pipe(first()).subscribe(data => {
      let storeValue = data;
      if (!storeValue && this.storageConfig.db) {
        this.getValueFromStorage(key).then(response => {
          this.set(key, response);
        });
      }
      
      callback(data);
    });

    return observable;
  }
  
  getValueFromStorage(key: string): Promise<any> {
    if (this.storageConfig.db == Storage_Enums.LocalStorage) {
      let itemValue = localStorage.getItem(key);
      if (itemValue == "undefined") {
        return Promise.resolve(undefined);
      }
      return Promise.resolve(JSON.parse(itemValue));
    }
    else if (this.storageConfig.db == Storage_Enums.SessionStorage) {
      let itemValue = sessionStorage.getItem(key);
      if (itemValue == "undefined") {
        return Promise.resolve(undefined);
      }
      return Promise.resolve(JSON.parse(itemValue));
    }
    else if (this.storageConfig.db == Storage_Enums.IndexDb) {
      let itemValue: any;
      
      return new Promise((resolve, reject) => {
        this.indexDb.get(key).then((response: any) => {
          itemValue = response;
          if (itemValue == undefined) {
            resolve(undefined);
          }
          else {
            resolve(JSON.parse(itemValue));
          }
        });
      })
    }
  }

  saveStateInLocalStorage(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }
  saveStateInSessionStorage(key: string, value: any) {
    sessionStorage.setItem(key, JSON.stringify(value));
  }
  saveStateInIndexDb(key: string, value: any) {
    this.indexDb.set(key, JSON.stringify(value));
  }
}


