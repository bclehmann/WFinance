import { Action, Reducer } from "redux";
import { useDispatch } from "react-redux";
import API from "../api";

type BasicAction = { type: string } & Action;
type FetchCandidatesAction = { tickerSymbol: string } & BasicAction;
type ReceiveResultsAction = { results: resultsType } & BasicAction;
type SetDisplayItemAction = { displayItem: displayEnum } & BasicAction;
type SetTimeIntervalAction = { timeInterval: number } & BasicAction;

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
  pricingResults: null
};

export interface IState {
  tickerSymbol?: string;
  candidates: resultsType;
  displayItem: displayEnum;
  timeInterval: number;
  pricingResults: any;
}

const actionTypes = {
  fetchCandidates: "FETCH_CANDIDATES",
  receiveCandidates: "RECEIVE_RESULTS",
  receivePricing: "RECEIVE_PRICING",
  setDisplayItem: "SET_DISPLAY_ITEM",
  setTimeInterval: "SET_TIME_INTERVAL"
};

export const actionCreators = (dispatch: any) => ({
  setTicker: async (tickerSymbol: string) => {
    dispatch({
      type: actionTypes.fetchCandidates,
      tickerSymbol
    } as BasicAction);
  },
  searchTickers: async (
    tickerSymbol: string,
    displayItem: displayEnum,
    timeInterval: number
  ) => {
    var searchResultsPromise = await API.searchSymbols(tickerSymbol);
    var results = JSON.parse(searchResultsPromise.data);

    if (results.bestMatches === undefined) {
      return;
    }
    //@ts-ignore
    results.bestMatches = results.bestMatches.map(m => ({
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
    dispatch({ type: actionTypes.receiveCandidates, results } as BasicAction);

    var pricingResults;
    switch (displayItem) {
      case displayEnum.daily:
        pricingResults = await API.fetchPriceDaily(
          results["bestMatches"][0]["symbol"]
        );
        break;
      case displayEnum.intraday:
        pricingResults = await API.fetchPriceIntraday(
          results["bestMatches"][0]["symbol"],
          timeInterval
        );
        break;
    }

    pricingResults = JSON.parse(pricingResults.data);
    if (displayItem === displayEnum.daily) {
      pricingResults["Series"] = pricingResults["Time Series (Daily)"];
      pricingResults["Time Series (Daily)"] = undefined;
    } else if (displayItem === displayEnum.intraday) {
      var propertyName = `Time Series (${timeInterval}min)`;
      pricingResults["Series"] = pricingResults[propertyName];
      pricingResults[propertyName] = undefined;
    }
    console.log(pricingResults);
    let arr = new Array();
    for (const property in pricingResults["Series"]) {
      //for in cannot guarantee any ordering
      let curr = pricingResults["Series"][property];
      arr.push({
        open: curr["1. open"],
        high: curr["2. high"],
        low: curr["3. low"],
        close: curr["4. close"],
        volume: curr["5. volume"],
        date: new Date(property)
      });
    }
    pricingResults["Series"] = arr.sort((a, b) => a["date"] - b["date"]); //Sort by date ascending (most recent last)
    dispatch({
      type: actionTypes.receivePricing,
      results: pricingResults
    } as BasicAction);
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
    default:
      return state;
      break;
  }
};
