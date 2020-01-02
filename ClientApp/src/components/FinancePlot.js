"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_plotly_js_1 = require("react-plotly.js");
var react_redux_1 = require("react-redux");
var FinancePlot = /** @class */ (function (_super) {
    __extends(FinancePlot, _super);
    function FinancePlot() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.render = function () {
            return React.createElement(react_plotly_js_1.default, { data: { x: [1, 2, 3], y: [1, 1, 2], type: "scatter" } });
        };
        return _this;
    }
    return FinancePlot;
}(React.Component));
var mapStateToProps = function (state) { return ({
    financeInfo: state.financeInfo
}); };
exports.default = react_redux_1.connect(mapStateToProps)(FinancePlot);
//# sourceMappingURL=FinancePlot.js.map