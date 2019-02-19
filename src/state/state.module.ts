import { NgModule, ModuleWithProviders, InjectionToken } from "@angular/core";
import { StoreModule } from '@ngrx/store';
import { rootReducer } from './reducers';
import { StatefulService } from './state.service';
import { DexieService } from './dexie.service';
import { ObservableManagerService } from './observable-manager.service';

export interface IStorageConfig{
  db: 'localstorage' | 'indexdb' | 'sessionstorage' | '';
  prefix?: undefined | string;
}

@NgModule({
  imports: [StoreModule.forRoot({ 
    app: rootReducer
   })],
   providers:[StatefulService, ObservableManagerService, DexieService]
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