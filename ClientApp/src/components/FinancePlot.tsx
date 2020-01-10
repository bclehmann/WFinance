import * as React from "react";
import Plot from "react-plotly.js";
import { connect } from "react-redux";
import { ApplicationState } from "../store";
import { displayEnum, actionCreators, IState } from "../store/FinanceInfo";

interface propType {
  financeInfo: IState;
}

class FinancePlot extends React.Component<propType, any> {
  constructor(props: propType) {
    super(props);

    let now = new Date();
    this.state = {
      from: "2010-01-01",
      to: `${now.getFullYear()}-${(now.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${now
        .getDate()
        .toString()
        .padStart(2, "0")}`,
      adjustYAutomatically: true,
      min: 0,
      max: 100,
      graphType: "scatter"
    };
  }

  render = () => {
    if (this.props.financeInfo.error) {
      return (
        <div className="alert alert-warning">
          <h3>
            We seem to have had an error. Please stand by. Error Code:{" "}
            {this.props.financeInfo.errorCode}
          </h3>
          <p>
            {(() => {
              switch (this.props.financeInfo.errorCode) {
                case 400: //Bad Request
                  return "Bad Request. The server could not parse the request. This is probably the software developer's fault.";
                  break;
                case 429: //Too Many Requests
                  return "Too Many Requests. You've exceeded the API call quota for this time period. You can spend more money on a premium API key to increase your quota.";
                  break;
                case 500: //Internal Server Error
                  return "Internal Server Error. This is probably the software developer's fault.";
                  break;
              }
            })()}
            <hr />
            <br />
            <a
              target="_blank"
              href={`https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/${
                this.props.financeInfo.errorCode
              }`}
            >
              Error {this.props.financeInfo.errorCode}
            </a>
          </p>
        </div>
      );
    } else if (this.props.financeInfo.pricingResults !== null) {
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
          <div>
            <div className="row">
              <label htmlFor="from" className="col-2 col-form-label">
                Start Date:
              </label>
              <input
                type="date"
                id="from"
                value={this.state.from}
                className="form-control col-2"
                onChange={e => {
                  this.setState({ from: e.target.value });
                }}
              />
              <label htmlFor="to" className="col-2 col-form-label">
                End Date:
              </label>
              <input
                type="date"
                id="to"
                value={this.state.to}
                className="form-control col-2"
                onChange={e => {
                  this.setState({ to: e.target.value });
                }}
              />
              <label htmlFor="autoscale" className="col-2 col-form-label">
                Autoscale Y-Axis:
              </label>
              <select
                id="autoscale"
                className="form-control col-2"
                onChange={
                  e =>
                    this.setState({
                      adjustYAutomatically: parseInt(e.target.value) === 1
                    }) //Option elements cannot have a boolean value -_-
                }
                value={this.state.adjustYAutomatically ? 1 : 0} //Ditto
              >
                <option value={1}>Yes</option>
                <option value={0}>No</option>
              </select>
            </div>
            <div
              className="row"
              style={{
                marginTop: "1em"
              }}
            >
              <div className="col-4">
                <div className="row">
                  <label htmlFor="type" className="col-6 col-form-label">
                    Graph Type:
                  </label>
                  <select
                    id="type"
                    className="form-control col-6"
                    onChange={e =>
                      this.setState({
                        graphType: e.target.value
                      })
                    }
                    value={this.state.graphType}
                  >
                    <option value="scatter">Line</option>
                    <option value="ohlc">OHLC</option>
                    <option value="candlestick">Candlestick</option>
                  </select>
                </div>
              </div>
              <div className="col-8">
                <div className="row">
                  <span
                    style={{
                      display: this.state.adjustYAutomatically ? "none" : "flex"
                    }}
                  >
                    <label htmlFor="min" className="col-3 col-form-label">
                      Minimum:
                    </label>
                    <input
                      type="number"
                      id="min"
                      value={this.state.min}
                      className="form-control col-3"
                      onChange={e => {
                        this.setState({ min: e.target.value });
                      }}
                    />
                    <label htmlFor="max" className="col-3 col-form-label">
                      Maximum:
                    </label>
                    <input
                      type="number"
                      id="max"
                      value={this.state.max}
                      className="form-control col-3"
                      onChange={e => {
                        this.setState({ max: e.target.value });
                      }}
                    />
                  </span>
                </div>
              </div>
            </div>
          </div>
          <Plot
            data={[
              {
                x: this.props.financeInfo.pricingResults.Series.map(
                  (m: any) => m.date
                ),
                y: this.props.financeInfo.pricingResults.Series.map(
                  (m: any) => m.close
                ),
                close: this.props.financeInfo.pricingResults.Series.map(
                  (m: any) => m.close
                ),
                high: this.props.financeInfo.pricingResults.Series.map(
                  (m: any) => m.high
                ),
                low: this.props.financeInfo.pricingResults.Series.map(
                  (m: any) => m.low
                ),
                open: this.props.financeInfo.pricingResults.Series.map(
                  (m: any) => m.open
                ),
                type: this.state.graphType,
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
              },
              xaxis: {
                autorange: false,
                domain: [0, 1],
                range: [this.state.from, this.state.to],
                title: "Date",
                type: "date",
                rangeslider: {
                  visible: false
                }
              },
              yaxis: {
                autorange: this.state.adjustYAutomatically,
                domain: [0, 1],
                range: [this.state.min, this.state.max],
                type: "linear"
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
