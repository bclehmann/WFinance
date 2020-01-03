import { Action, Reducer } from "redux";
import { useDispatch } from "react-redux";
import API from "../api";

type BasicAction = { type: string } & Action;
type FetchCandidatesAction = { tickerSymbol: string } & BasicAction;
type ReceiveResultsAction = { results: resultsType } & BasicAction;
type SetDisplayItemAction = { displayItem: displayEnum } & BasicAction;
type SetTimeIntervalAction = { timeInterval: number } & BasicAction;
type APIErrorAction = { errorCode: number } & BasicAction;

interface resultsType {
  bestMatches: Array<any>;
}

export enum displayEnum {
  daily,
  intraday
}

export const timeIntervals: number[] = new Array(1, 5, 15, 30, 60);

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
  candidates: {
    bestMatches: new Array()
  },
  displayItem: displayEnum.daily,
  timeInterval: 15,
  pricingResults: null,
  error: false,
  errorCode: undefined
};

export interface IState {
  tickerSymbol?: string;
  candidates: resultsType;
  displayItem: displayEnum;
  timeInterval: number;
  pricingResults: any;
  error: boolean;
  errorCode?: number;
}

const actionTypes = {
  fetchCandidates: "FETCH_CANDIDATES",
  receiveCandidates: "RECEIVE_RESULTS",
  receivePricing: "RECEIVE_PRICING",
  setDisplayItem: "SET_DISPLAY_ITEM",
  setTimeInterval: "SET_TIME_INTERVAL",
  apiError: "API_ERROR",
  apiErrorResolved: "API_ERROR_RESOLVED"
};

export const actionCreators = (dispatch: any) => ({
  setTicker: async (tickerSymbol: string) => {
    dispatch({
      type: actionTypes.fetchCandidates,
      tickerSymbol
    } as BasicAction);
  },
  searchTickers: async (tickerSymbol: string) => {
    var results;
    try {
      var searchResults = await API.searchSymbols(tickerSymbol);
      results = searchResults.data;
    } catch (e) {
      dispatch({ type: actionTypes.apiError, errorCode:e.response.status } as APIErrorAction);
      return;
    }

    if (results.bestMatches === undefined) {
      return;
    }
    if (results["Error Message"] !== undefined) {
      return;
    }
    dispatch({ type: actionTypes.receiveCandidates, results } as BasicAction);
  },
  fetchPrice: async (
    symbol: string,
    displayItem: displayEnum,
    timeInterval: number
  ) => {
    var pricingResults;
    try {
      switch (displayItem) {
        case displayEnum.daily:
          pricingResults = await API.fetchPriceDaily(symbol);
          break;
        case displayEnum.intraday:
          pricingResults = await API.fetchPriceIntraday(symbol, timeInterval);
          break;
      }

      pricingResults = pricingResults.data;
    } catch (e) {
      dispatch({ type: actionTypes.apiError, errorCode:e.response.status } as APIErrorAction);
      return;
    }

    dispatch({
      type: actionTypes.receivePricing,
      results: pricingResults
    } as BasicAction);
    dispatch({ type: actionTypes.apiErrorResolved } as BasicAction);
  },
  setDisplayItem: (index: number) => {
    dispatch({ type: actionTypes.setDisplayItem, displayItem: index });
  },
  setTimeInterval: (interval: number) => {
    dispatch({ type: actionTypes.setTimeInterval, timeInterval: interval });
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
    case actionTypes.fetchCandidates:
      let fetchAction = incomingAction as FetchCandidatesAction;
      return { ...state, tickerSymbol: fetchAction.tickerSymbol };
      break;
    case actionTypes.receiveCandidates:
      let receiveAction = incomingAction as ReceiveResultsAction;
      //@ts-ignore
      if (receiveAction.results["Error Message"] !== undefined) {
        return {
          ...state,
          candidates: initialState.candidates
        };
      }
      let candidates = receiveAction.results;
      return { ...state, candidates };
      break;
    case actionTypes.receivePricing:
      let pricingAction = incomingAction as ReceiveResultsAction;
      //@ts-ignore
      if (pricingAction.results["Error Message"] !== undefined) {
        return {
          ...state,
          pricingResults: initialState.pricingResults
        };
      }
      let pricingResults = pricingAction.results;
      return { ...state, pricingResults };
      break;
    case actionTypes.setDisplayItem:
      let displayAction = incomingAction as SetDisplayItemAction;
      return {
        ...state,
        displayItem: displayAction.displayItem
      };
      break;
    case actionTypes.setTimeInterval:
      let timeAction = incomingAction as SetTimeIntervalAction;
      return {
        ...state,
        timeInterval: timeAction.timeInterval
      };
      break;
    case actionTypes.apiError:
      let errorAction = incomingAction as APIErrorAction;
      return {
        ...state,
        pricingResults: initialState.pricingResults,
        error: true,
        errorCode: errorAction.errorCode
      };
    case actionTypes.apiErrorResolved:
      return {
        ...state,
        error: false,
        errorCode: undefined
      };
      break;
    default:
      return state;
      break;
  }
};
