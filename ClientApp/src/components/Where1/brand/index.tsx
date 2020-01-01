import * as React from "react";
import "./brand.css";

interface IProptype {
  subtext: string;
}

class Brand extends React.Component<IProptype, null> {
  render = () => (
    <span>
      <img src="/images/logo_full_transparent.png" className="logo" />{" "}
      <h1 className="logo-subtext">{this.props.subtext}</h1>
    </span>
  );
}

export default Brand;
