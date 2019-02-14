import { ActionTypes, SetAction } from './actions';
import { Storage_Enums } from './storage.enums';
import { DexieService } from './dexie.service';

export function rootReducer(state: any = {}, action: SetAction) {
  switch (action.type) {
    case ActionTypes.SET:
      const { key, value } = action.payload;
      const result = {
        ...state
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

