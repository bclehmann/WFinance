import * as React from "react";
import { connect } from "react-redux";
import TickerInput from "../components/TickerInput";
import FinancePlot from "./FinancePlot";

const Home = () => (
  <div>
    <TickerInput />
    <FinancePlot />
  </div>
);

export default connect()(Home);
