import * as React from "react";
import { bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import {
  actionCreators,
  displayEnum,
  timeIntervals
} from "../store/FinanceInfo";
import { ApplicationState as IState } from "../store/index";
import "../components/home.css";

interface propType {
  financeInfo: IState["financeInfo"];
  setTicker: (ticker: string) => any;
  searchTickers: (ticker: string) => any;
  setDisplayItem: (item: number) => any;
  setTimeInterval: (item: number) => any;
  fetchPrice: (
    symbol: string,
    displayItem: displayEnum,
    interval: number
  ) => any;
}

interface stateType {
  lastKeystroke?: number;
}

class TickerInput extends React.Component<propType, stateType> {
  constructor(props: propType) {
    super(props);
    this.state = {};
  }
  render = () => (
    <span>
      <div className="row form-group">
        <div className="col-6">
          <input
            type="text"
            className="form-control"
            placeholder="Ticker (e.g. MSFT) or Name (Microsoft Technologies)"
            list="symbols"
            value={
              this.props.financeInfo.tickerSymbol === undefined
                ? ""
                : this.props.financeInfo.tickerSymbol
            }
            onChange={e => {
              this.props.setTicker(e.target.value);
              this.setState({
                lastKeystroke: new Date().getTime()
              });
              window.setTimeout(() => {
                //Prevents sending a new request unless they have stopped typing for 200 ms, so that we don't send a billion requests
                if (this.state.lastKeystroke! < new Date().getTime() - 200) {
                  this.props.searchTickers(
                    this.props.financeInfo.tickerSymbol!
                  );
                  this.props.fetchPrice(
                    this.props.financeInfo.tickerSymbol!,
                    this.props.financeInfo.displayItem,
                    this.props.financeInfo.timeInterval
                  );
                }
              }, 250);
            }}
          />
          <datalist id="symbols">
            {this.props.financeInfo.candidates.bestMatches.map((m, i) => (
              <option value={m.symbol}>
                {m.symbol} - {m.name}, {m.region}
              </option>
            ))}
          </datalist>
          {/*
          <div
            className="tickerAutocomplete"
            style={{
              display: this.state.showAutoComplete ? "initial" : "none"
            }}
            onBlur={() => this.setState({ showAutoComplete: false })}
          >
            {this.props.financeInfo.candidates.bestMatches.map((m, i) => {
              return (
                <div
                  tabIndex={0}
                  className="autocompleteRow"
                  key={i}
                  onClick={() => {
                    this.props.setTicker(m.symbol);
                    this.props.searchTickers(m.symbol);
                    this.props.fetchPrice(
                      m.symbol,
                      this.props.financeInfo.displayItem,
                      this.props.financeInfo.timeInterval
                    );
                    this.setState({ showAutoComplete: false });
                  }}
                >
                  {m.symbol} - {m.name}, {m.region}
                </div>
              );
            })}
          </div>*/}
        </div>
        <div className="row col-3">
          <label className="col-4 col-form-label" htmlFor="typeSelect">
            Type:
          </label>
          <select
            className="col-8 form-control"
            id="typeSelect"
            value={this.props.financeInfo.displayItem}
            onChange={e => {
              this.props.setDisplayItem(parseInt(e.target.value));
              this.props.fetchPrice(
                this.props.financeInfo.tickerSymbol!,
                parseInt(e.target.value),
                this.props.financeInfo.timeInterval
              );
            }}
          >
            <option value={displayEnum.daily}>Daily Close</option>
            <option value={displayEnum.intraday}>Intraday</option>
          </select>
        </div>
        <div className="row col-3">
          <label className="col-5 col-form-label" htmlFor="timeSelect">
            Interval:
          </label>
          <select
            disabled={
              this.props.financeInfo.displayItem !== displayEnum.intraday
            }
            className="col-7 form-control"
            id="timeSelect"
            value={this.props.financeInfo.timeInterval}
            onChange={e => {
              this.props.setTimeInterval(parseInt(e.target.value));
              this.props.fetchPrice(
                this.props.financeInfo.tickerSymbol!,
                this.props.financeInfo.displayItem,
                parseInt(e.target.value)
              );
            }}
          >
            {timeIntervals.map((t, i) => (
              <option key={i} value={t}>
                {t} Minutes
              </option>
            ))}
          </select>
        </div>
      </div>
    </span>
  );
}

const mapStateToProps = (state: IState) => ({
  financeInfo: state.financeInfo
});

const mapDispatchToProps = (dispatch: any) => ({
  setTicker: (tickerSymbol: string) =>
    actionCreators(dispatch).setTicker(tickerSymbol),
  searchTickers: (tickerSymbol: string) =>
    actionCreators(dispatch).searchTickers(tickerSymbol),
  setDisplayItem: (item: number) => {
    actionCreators(dispatch).setDisplayItem(item);
  },
  setTimeInterval: (interval: number) => {
    actionCreators(dispatch).setTimeInterval(interval);
  },
  fetchPrice: (symbol: string, displayItem: displayEnum, interval: number) => {
    actionCreators(dispatch).fetchPrice(symbol, displayItem, interval);
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(TickerInput);
