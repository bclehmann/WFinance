import axios from "axios";

export default class API {
  static searchSymbols = (keywords: string) =>
    axios.post(`/api/SymbolSearch?keywords=${keywords}`);
}
