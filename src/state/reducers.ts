import { ActionTypes, SetAction } from './actions';

export function rootReducer(state: any = {}, action: SetAction) {
  switch(action.type) {
    case ActionTypes.SET:

      const { key, value } = action.payload;
      const result = {
        ...state
      }
      result[key] = value;

      return result;
    break;
  }
}