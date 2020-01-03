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
      let graphType = "";
      switch (this.props.financeInfo.displayItem) {
        case displayEnum.daily:
          graphType = "Daily Close";
          break;
        case displayEnum.intraday:
          graphType = `Intraday (${
            this.props.financeInfo.timeInterval
          } minute interval)`;
          break;
      }
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
            layout={{
              title: {
                text: `${
                  this.props.financeInfo.pricingResults["Meta Data"].Symbol
                } | ${graphType}`,
                x: 0, //Left aligned
                font: {
                  size: 20
                }
              }
            }}
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
