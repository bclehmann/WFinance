import axios from "axios";

export default class API {
  static searchSymbols = (keywords: string) =>
    axios.post(`/api/SymbolSearch`, { keywords });
  static fetchPriceDaily = (symbol: string) =>
    axios.post("api/SymbolPrice", { symbol, type: "DAILY" });
  static fetchPriceIntraday = (symbol: string, stepMinutes: number) =>
    axios.post("api/SymbolPrice", { symbol, type: "INTRADAY", stepMinutes });
}
