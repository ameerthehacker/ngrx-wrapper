import { NgModule } from "@angular/core";
import { StoreModule } from '@ngrx/store';
import { rootReducer } from './reducers';

@NgModule({
  imports: [StoreModule.forRoot({ 
    app: rootReducer
   })]
})
export class StateModule {}