import { Injectable, Inject, OnInit, DebugElement } from '@angular/core';
import { Store } from '@ngrx/store'
import { SetAction, SetStateAction } from './actions';
import { OnDestroy } from '@angular/core';
import { IStorageConfig } from './state.module';
import { Storage_Enums } from './storage.enums';
import { Observable } from 'rxjs';
import { DexieService } from './dexie.service';
import { ObservableManagerService } from './observable-manager.service';

@Injectable()
export class Stateful {
  private setAction: SetAction;
  //private table: Dexie.Table<any, string>;

  constructor(private baseStore: Store<any>, @Inject('storageConfig') private storageConfig: IStorageConfig, private indexDb: DexieService) {
    this.baseStore = baseStore;
    this.setAction = new SetAction();
  }

  public set(key: any, value: any) {
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

  public listen(key: any, callback) {
    let $storeValue = this.baseStore.select('app', key);
    
    const observable = $storeValue.subscribe(data => {
      let storeValue = data;
      if (!storeValue && this.storageConfig.db) {
        const response = this.getValueFromStorage(key);
        this.set(key, response);
      }
      
      callback(data);
    });

    return observable;
  }

  public get(key: any) {
    return new Promise((resolve, reject) => {
      const observable = this.baseStore.select('app', key).subscribe((result: any) => {
        resolve({ result, observable });
      });
    });
  }
  getValueFromStorage(key: string): any {
    if (this.storageConfig.db == Storage_Enums.LocalStorage) {
      let itemValue = localStorage.getItem(key);
      if (itemValue == "undefined") {
        return undefined;
      }
      return JSON.parse(itemValue);
    }
    else if (this.storageConfig.db == Storage_Enums.SessionStorage) {
      let itemValue = sessionStorage.getItem(key);
      if (itemValue == "undefined") {
        return undefined;
      }
      return JSON.parse(itemValue);
    }
    else if (this.storageConfig.db == Storage_Enums.IndexDb) {
      let itemValue: any;
      this.indexDb.get(key).then((response: any) => {
        itemValue = response;
        if (itemValue == "undefined" || itemValue == undefined) {
          return undefined;
        }
        return JSON.parse(itemValue);
      });
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


