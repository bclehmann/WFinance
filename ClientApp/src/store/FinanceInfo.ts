import { Action, Reducer } from "redux";
import { useDispatch } from "react-redux";
import API from "../api";

type BasicAction = { type: string } & Action;
type FetchInfoAction = { tickerSymbol: string } & BasicAction;
type ReceiveResultsAction = { results: any[] } & BasicAction;

const initialState = {
  tickerSymbol: undefined,
  results: undefined
};

export interface IState {
  tickerSymbol?: string;
  results?: any;
}

const actionTypes = {
  fetchInfo: "FETCH_INFO",
  receiveResults: "RECEIVE_RESULTS"
};

export const actionCreators = (dispatch: any) => ({
  setTicker: async (tickerSymbol: string) => {
    dispatch({ type: actionTypes.fetchInfo, tickerSymbol } as BasicAction);
  },
  searchTickers: async (tickerSymbol: string) => {
    var searchResultsPromise = API.searchSymbols(tickerSymbol);
    var results = await searchResultsPromise;
    dispatch({ type: actionTypes.receiveResults, results } as BasicAction);
  }
});

export const reducer: Reducer<IState> = (
  state: IState | undefined,
  incomingAction: BasicAction
): IState => {
  if (state === undefined) {
    return initialState;
  }

  switch (incomingAction.type) {
    case actionTypes.fetchInfo:
      let fetchAction = incomingAction as FetchInfoAction;
      return { ...state, tickerSymbol: fetchAction.tickerSymbol };
    case actionTypes.receiveResults:
      let receiveAction = incomingAction as ReceiveResultsAction;
      return { ...state, results: receiveAction.results };
    default:
      return state;
  }
};
