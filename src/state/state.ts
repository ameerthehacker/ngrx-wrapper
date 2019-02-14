import { Injectable, Inject, OnInit, DebugElement } from '@angular/core';
import { Store } from '@ngrx/store'
import { SetAction, SetStateAction } from './actions';
import { OnDestroy } from '@angular/core';
import { IStorageConfig } from './state.module';
import { Storage_Enums } from './storage.enums';
import { Observable } from 'rxjs';
import { ObservableManagerService } from './observable-manager.service';

@Injectable()
export class Stateful {
  private setAction: SetAction;

  constructor(private baseStore: Store<any>, private observableManagerService: ObservableManagerService, @Inject('storageConfig') private storageConfig: IStorageConfig) {
    this.baseStore = baseStore;
    this.setAction = new SetAction();
    //this.setDefaultState();
  }

  setDefaultState(): void {
    debugger
    if (this.storageConfig.db === Storage_Enums.IndexDb) {
      var dbReq = window.indexedDB.open("db_state", 1);
      dbReq.onupgradeneeded = function () {
        var db = dbReq.result;
        db.createObjectStore("state");
      };
      dbReq.onerror = function () {
        console.log("failed opening DB:")
      };
      dbReq.onsuccess = function () {
        let db = dbReq.result;
        let transaction = db.transaction("state", "readwrite");
        let objstore = transaction.objectStore("state");
        let response = objstore.get("state");
        response.onsuccess = function () {
          this.baseStore.dispatch(new SetStateAction(JSON.parse(response.result).app));
        }.bind(this)
      }.bind(this)
      this.baseStore.subscribe(response => {
        var dbReq = window.indexedDB.open("db_state", 1);
        dbReq.onsuccess = function () {
          let db = dbReq.result;
          let transaction = db.transaction("state", "readwrite");
          let objstore = transaction.objectStore("state");
          objstore.put(JSON.stringify(response), "state");
        }
      });
    }
    else if (this.storageConfig.db === Storage_Enums.SessionStorage) {
    }
    else if (this.storageConfig.db === Storage_Enums.LocalStorage) {
    }

  }

  public set(key: any, value: any) {
    const db = this.storageConfig.db;
    this.setAction.payload = { key, value, db };
    this.baseStore.dispatch(this.setAction);
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

    }
  }
}