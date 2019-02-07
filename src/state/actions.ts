import { Action } from '@ngrx/store';

export enum ActionTypes {
  SET = 'SET data for a key'
}

export class SetAction implements Action {
  readonly type: ActionTypes = ActionTypes.SET;

  constructor(public payload?: any) {}
}