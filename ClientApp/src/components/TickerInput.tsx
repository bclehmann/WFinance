import * as React from "react";
import { bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import { actionCreators, displayEnum } from "../store/FinanceInfo";
import { ApplicationState as IState } from "../store/index";
import "../components/home.css";

interface propType {
  financeInfo: IState["financeInfo"];
  setTicker: (ticker: string) => void;
  searchTickers: (
    ticker: string,
    displayItem: displayEnum,
    timeInterval: number
  ) => void;
  setDisplayItem: (item: number) => void;
}

interface stateType {
  lastKeystroke?: number;
  showAutoComplete: boolean;
}

class TickerInput extends React.Component<propType, stateType> {
  constructor(props: propType) {
    super(props);
    this.state = { showAutoComplete: false };
  }

  render = () => (
    <span>
      <div className="row form-group">
        <div className="col-8">
          <input
            type="text"
            className="form-control"
            placeholder="Ticker (e.g. MSFT, HMC) or Name (Microsoft Technologies, Honda Motor Company)"
            value={
              this.props.financeInfo.tickerSymbol === undefined
                ? ""
                : this.props.financeInfo.tickerSymbol
            }
            onChange={e => {
              this.props.setTicker(e.target.value);
              this.setState({
                lastKeystroke: new Date().getTime(),
                showAutoComplete: true
              });
              window.setTimeout(() => {
                //Prevents sending a new request unless they have stopped typing for 200 ms, so that we don't send a billion requests
                if (this.state.lastKeystroke! < new Date().getTime() - 200) {
                  this.props.searchTickers(
                    this.props.financeInfo.tickerSymbol!,
                    this.props.financeInfo.displayItem,
                    this.props.financeInfo.timeInterval
                  );
                }
              }, 250);
            }}
            onClick={() => this.setState({ showAutoComplete: true })}
          />
        </div>
        <div className="col-3">
          <select
            className="form-control form-control-lg"
            value={this.props.financeInfo.displayItem}
            onChange={e => this.props.setDisplayItem(parseInt(e.target.value))}
          >
            <option value={displayEnum.daily}>Daily Close</option>
            <option value={displayEnum.intraday}>Intraday</option>
          </select>
        </div>
      </div>

      <div
        className="tickerAutocomplete"
        style={{ display: this.state.showAutoComplete ? "initial" : "none" }}
      >
        {this.props.financeInfo.candidates.bestMatches.map((m, i) => {
          return (
            <div
              className="autocompleteRow"
              key={i}
              onClick={() => {
                this.props.setTicker(m.symbol);
                this.props.searchTickers(
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
  searchTickers: (
    tickerSymbol: string,
    displayItem: displayEnum,
    timeInterval: number
  ) =>
    actionCreators(dispatch).searchTickers(
      tickerSymbol,
      displayItem,
      timeInterval
    ),
  setDisplayItem: (item: number) => {
    actionCreators(dispatch).setDisplayItem(item);
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(TickerInput);
