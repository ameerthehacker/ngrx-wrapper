import { Action } from '@ngrx/store';

export enum ActionTypes {
  SET = 'SET data for a key',
  SET_STATE = 'Initialize the state'
}

export class SetAction implements Action {
  readonly type: ActionTypes = ActionTypes.SET;

  constructor(public payload?: any) {}
}

export class SetStateAction implements Action {
  readonly type: ActionTypes = ActionTypes.SET_STATE;

  constructor(public payload?: any) {}
}