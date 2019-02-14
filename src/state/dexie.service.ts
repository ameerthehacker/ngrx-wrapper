import Dexie from 'dexie';
import { Injectable } from '@angular/core';

@Injectable()
export class DexieService extends Dexie {
    private db: Dexie.Table<any, string>;
    constructor() {
        super("_stateDb");
        this.version(1).stores({
            state: ''
        });
        this.db = this.table('state');
    }
    set(key: string, value: string) {
        this.db.put(value, key);
    }
    get(key: string): any {
        return this.db.get(key)
    }
}