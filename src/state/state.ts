import { Injectable, Inject, OnInit, DebugElement } from '@angular/core';
import { Store } from '@ngrx/store'
import { SetAction, SetStateAction } from './actions';
import { OnDestroy } from '@angular/core';
import { IStorageConfig } from './state.module';
import { Storage_Enums } from './storage.enums';

@Injectable()
export class Stateful {
  private setAction: SetAction;

  constructor(private baseStore: Store<any>, @Inject('storageConfig') private storageConfig: IStorageConfig) {
    this.baseStore = baseStore;
    this.setAction = new SetAction();
    this.setDefaultState();
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

      // var dbReq = window.indexedDB.open("db_state", 1);
      // dbReq.onsuccess = function () {
      //   let db = dbReq.result;
      //   let transaction = db.transaction("state", "readwrite");
      //   let objstore = transaction.objectStore("state");
      //   let response = objstore.get("state");
      //   response.onsuccess = function () {
      //     this.baseStore.dispatch(new SetStateAction(JSON.parse(response.result).app));
      //   }.bind(this)
      // }.bind(this)
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
      const data = Object.assign({}, sessionStorage);
      if (data) {
        for (const [key, val] of Object.entries(data)) {
          data[key] = JSON.parse(val);
        }
        this.baseStore.dispatch(new SetStateAction(data));
      }
    }
    else if (this.storageConfig.db === Storage_Enums.LocalStorage) {
      const data = Object.assign({}, localStorage);
      if (data) {
        for (const [key, val] of Object.entries(data)) {
          data[key] = JSON.parse(val);
        }
        this.baseStore.dispatch(new SetStateAction(data));
      }
    }

  }

  public set(key: any, value: any) {
    const db = this.storageConfig.db;
    this.setAction.payload = { key, value, db };

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