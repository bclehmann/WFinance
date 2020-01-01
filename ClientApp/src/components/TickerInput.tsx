import * as React from "react";
import { bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import { actionCreators } from "../store/FinanceInfo";
import { ApplicationState as IState } from "../store/index";

interface propType {
  financeInfo: IState["financeInfo"];
  setTicker: (resource: string) => void;
}

interface stateType {}

class TickerInput extends React.Component<propType, stateType> {
  render = () => (
    <input
      type="text"
      className="form-control"
      placeholder="Ticker (e.g. MSFT, HMC) or Name (Microsoft Technologies, Honda Motor Company)"
      value={
        this.props.financeInfo.resource === undefined
          ? ""
          : this.props.financeInfo.resource
      }
      onChange={e => this.props.setTicker(e.target.value)}
    />
  );
}

const mapStateToProps = (state: IState) => ({
  financeInfo: state.financeInfo
});

const mapDispatchToProps = dispatch => ({
  setTicker: resource => dispatch(actionCreators.fetchInfo(resource))
});

export default connect(mapStateToProps, mapDispatchToProps)(TickerInput);
