import { Action, Reducer } from "redux";
import { useDispatch } from "react-redux";
import API from "../api";

type BasicAction = { type: string } & Action;
type FetchInfoAction = { tickerSymbol: string } & BasicAction;
type ReceiveResultsAction = { results: resultsType } & BasicAction;

interface resultsType {
  bestMatches: Array<any>;
}

interface matchType {
  symbol: string;
  name: string;
  type: string;
  region: string;
  marketOpen: string;
  marketClose: string;
  timezone: string;
  currency: string;
  matchscore: number;
}

const initialState = {
  tickerSymbol: undefined,
  results: {
    bestMatches: new Array()
  }
};

export interface IState {
  tickerSymbol?: string;
  results: resultsType;
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
    var searchResultsPromise = await API.searchSymbols(tickerSymbol);
    var results = JSON.parse(searchResultsPromise.data);
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
      //@ts-ignore
      if (receiveAction.results["Error Message"] !== undefined) {
        return {
          ...state,
          results: initialState.results
        };
      }
      let results = receiveAction.results;
      results.bestMatches= results.bestMatches.map(m => ({
        //The API is actually low-key stupid
        symbol: m["1. symbol"],
        name: m["2. name"],
        type: m["3. type"],
        region: m["4. region"],
        marketOpen: m["5. marketOpen"],
        marketClose: m["6. marketClose"],
        timezone: m["7. timezone"],
        currency: m["8. currency"],
        matchScore: m["9. matchScore"]
      }));
      return { ...state, results };
    default:
      return state;
  }
};
