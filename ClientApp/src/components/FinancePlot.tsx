import * as React from "react";
import Plot from "react-plotly.js";
import { connect } from "react-redux";
import { ApplicationState } from "../store";
import { displayEnum, actionCreators, IState } from "../store/FinanceInfo";

interface propType {
  financeInfo: IState;
}

class FinancePlot extends React.Component<propType, any> {
  render = () => {
    if (this.props.financeInfo.pricingResults !== null) {
      return (
        <span>
          <Plot
            data={[
              {
                x: this.props.financeInfo.pricingResults.Series.map(
                  (m: any) => m.date
                ),
                y: this.props.financeInfo.pricingResults.Series.map(
                  (m: any) => m.close
                ),
                type: "scatter",
                mode: "lines",
                line: {
                  width: 1,
                  color: "#65AEF6"
                }
              }
            ]}
          />
        </span>
      );
    }

    return null;
  };
}

const mapStateToProps = (state: ApplicationState) => ({
  financeInfo: state.financeInfo
});

const mapDispatchToProps = (dispatch: any) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(FinancePlot);
