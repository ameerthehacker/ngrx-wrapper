import { NgModule } from "@angular/core";
import { StoreModule } from '@ngrx/store';
import { rootReducer } from './reducers';
import { Stateful } from './state';

@NgModule({
  imports: [StoreModule.forRoot({ 
    app: rootReducer
   })],
   providers:[Stateful]
})
export class StateModule {}