import { ActionTypes, SetAction } from './actions';
import { Storage_Enums } from './storage.enums';

export function rootReducer(state: any = {}, action: SetAction) {
  switch (action.type) {
    case ActionTypes.SET:
      const { key, value } = action.payload;
      const result = {
        ...state
      }
      // set values in the local storage
      if(action.payload.db === Storage_Enums.LocalStorage){
        saveStateInLocalStorage(key, value);
      }
      else if(action.payload.db === Storage_Enums.SessionStorage){
        saveStateInSessionStorage(key, value);
      }
      else if(action.payload.db === Storage_Enums.IndexDb){

      }
      result[key] = value;
      return result;
      break;
    case ActionTypes.SET_STATE:

      const payload = action.payload;
      return payload;
      break;
  }
}

export function saveStateInLocalStorage(key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value));
}
export function saveStateInSessionStorage(key: string, value: any){
  sessionStorage.setItem(key, JSON.stringify(value));
}