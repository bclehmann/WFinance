import { Action, Reducer } from "redux";

type BasicAction = { type: string } & Action;
type FetchInfoAction = { resource: string } & BasicAction;

const initialState = {
  resource: undefined
};

export interface IState {
  resource?: string;
}

const actionTypes = {
  fetchInfo: "FETCH_INFO"
};

export const actionCreators = {
  fetchInfo: (resource: string) =>
    ({ type: actionTypes.fetchInfo, resource } as BasicAction)
};

export const reducer: Reducer<IState> = (
  state: IState | undefined,
  incomingAction: BasicAction
): IState => {
  if (state === undefined) {
    return initialState;
  }

  switch (incomingAction.type) {
    case actionTypes.fetchInfo:
      let action = incomingAction as FetchInfoAction;
      return { ...state, resource: action.resource };
    default:
      return state;
  }
};
