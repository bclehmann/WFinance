import * as React from "react";
import { bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import { actionCreators } from "../store/FinanceInfo";
import { ApplicationState as IState } from "../store/index";

interface propType {
  financeInfo: IState["financeInfo"];
  setTicker: (ticker: string) => void;
  searchTickers: (ticker: string) => void;
}

interface stateType {
  lastKeystroke?: number;
}

class TickerInput extends React.Component<propType, stateType> {
  render = () => (
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
        this.setState({ lastKeystroke: new Date().getTime() });
        window.setTimeout(() => { //Prevents sending a new request unless they have stopped typing for 200 ms, so that we don't send a billion requests
          if (this.state.lastKeystroke! < new Date().getTime() - 200) {
            this.props.searchTickers(this.props.financeInfo.tickerSymbol!);
          }
        }, 250);
      }}
    />
  );
}

const mapStateToProps = (state: IState) => ({
  financeInfo: state.financeInfo
});

const mapDispatchToProps = (dispatch: any) => ({
  setTicker: (tickerSymbol: string) =>
    actionCreators(dispatch).setTicker(tickerSymbol),
  searchTickers: (tickerSymbol: string) =>
    actionCreators(dispatch).searchTickers(tickerSymbol)
});

export default connect(mapStateToProps, mapDispatchToProps)(TickerInput);
