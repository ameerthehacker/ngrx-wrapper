import { NgModule, ModuleWithProviders, InjectionToken } from "@angular/core";
import { StoreModule } from '@ngrx/store';
import { rootReducer } from './reducers';
import { Stateful } from './state';
import { DexieService } from './dexie.service';
import { ObservableManagerService } from './observable-manager.service';

export interface IStorageConfig{
  db: 'localstorage' | 'indexdb' | 'sessionstorage' | '';
}

@NgModule({
  imports: [StoreModule.forRoot({ 
    app: rootReducer
   })],
   providers:[Stateful, ObservableManagerService, DexieService]
})

export class StateModule {
  static forRoot(storageConfig: IStorageConfig): ModuleWithProviders{
    return {
      ngModule: StateModule,
      providers: [
        {
          provide: 'storageConfig',
          useValue: storageConfig
        }
      ]
    }
  }
}