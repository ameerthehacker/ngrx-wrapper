import { NgModule, ModuleWithProviders, InjectionToken } from "@angular/core";
import { StoreModule } from '@ngrx/store';
import { rootReducer } from './reducers';
import { Stateful } from './state';

export interface IStorageConfig{
  saveState: boolean;
  db: 'localstorage' | 'indexdb' | 'sessionstorage'
}

@NgModule({
  imports: [StoreModule.forRoot({ 
    app: rootReducer
   })],
   providers:[Stateful]
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