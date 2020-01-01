import * as React from 'react';
import { connect } from 'react-redux';
import TickerInput from "../components/TickerInput";

const Home = () => (
    <div>
        <TickerInput />
  </div>
);

export default connect()(Home);
