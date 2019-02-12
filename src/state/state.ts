import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store'
import { SetAction, SetStateAction } from './actions';
import { OnDestroy } from '@angular/core';

export interface IConfig {
  saveState: boolean;
  db: 'localstorage' | 'indexdb' | 'sessionstorage'
}

@Injectable()
export class Stateful {
  private setAction: SetAction;
  private config: IConfig;

  constructor(private baseStore: Store<any>) {
    this.baseStore = baseStore;
    this.setAction = new SetAction();

    var dbReq = window.indexedDB.open("db_state", 1);
    dbReq.onupgradeneeded = function () {
      var db = dbReq.result;
      db.createObjectStore("state");
    };
    dbReq.onerror = function () {
      console.log("failed opening DB:")
    };
    dbReq.onsuccess = function () {
      console.log("opened DB")
    };
  }

  int(config: IConfig) {
    this.config = config;

    if (config.saveState) {
      if (config.db === "indexdb") {
        var dbReq = window.indexedDB.open("db_state", 1);
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
      else if(config.db === "sessionstorage"){
        const state = sessionStorage.getItem('app');
        if (state) {
          const stateJSON = JSON.parse(state).app;
          this.baseStore.dispatch(new SetStateAction(stateJSON));
        }
        this.baseStore.subscribe(result => {
          sessionStorage.setItem('app', JSON.stringify(result));
        });
      }
      else {
        const state = localStorage.getItem('app');
        if (state) {
          const stateJSON = JSON.parse(state).app;
          this.baseStore.dispatch(new SetStateAction(stateJSON));
        }
        this.baseStore.subscribe(result => {
          localStorage.setItem('app', JSON.stringify(result));
        });
      }
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