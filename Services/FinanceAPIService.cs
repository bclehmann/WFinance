using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Where1.WFinance.Services
{
	public class FinanceAPIService : IFinanceAPIService
	{
		private readonly HttpClient _httpClient;
		private static readonly string APIKey;

		//
		//This is a static constructor, it's only a thing in C#
		//It is basically the same thing as an init method which runs automatically before the first instance is made	
		static FinanceAPIService()
		{
			var APIFileReader = new StreamReader(new FileStream("FinanceAPIConfig.json", FileMode.Open));
			string asString = APIFileReader.ReadToEnd();

			Dictionary<string, string> parseResult = JsonSerializer.Deserialize<Dictionary<string, string>>(asString);
			APIKey = parseResult.GetValueOrDefault("AlphaVantageKey");
			APIFileReader.Close();
			APIFileReader.Dispose();
		}

		public FinanceAPIService(HttpClient httpClient)
		{
			_httpClient = httpClient;
		}

		public async Task<JsonResult> SearchSymbolAsync(string keywords)
		{
			var response = await _httpClient.GetAsync($"https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords={keywords}&apikey={APIKey}");

			return new JsonResult(await response.Content.ReadAsStringAsync());
		}

		public async Task<JsonResult> FetchSymbolPriceIntradayAsync(string symbol, int stepMinutes)
		{
			int[] supportedIntervals = { 1, 5, 15, 30, 60 };
			if (!supportedIntervals.Contains(stepMinutes)) {
				string intervalString = "";
				foreach (int curr in supportedIntervals) {
					intervalString += curr+",";
				}
				intervalString=intervalString.Substring(0, intervalString.Length - 1);

				throw new ArgumentException($"The API only supports intervals of {intervalString}", nameof(stepMinutes));
			}

			var response = await _httpClient.GetAsync($"https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol={symbol}&interval={stepMinutes}min&outpusize=full&apikey={APIKey}");

			return new JsonResult(await response.Content.ReadAsStringAsync());
		}

		public async Task<JsonResult> FetchSymbolPriceDailyAsync(string symbol)
		{
			var response = await _httpClient.GetAsync($"https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol={symbol}&outputsize=full&apikey={APIKey}");

			return new JsonResult(await response.Content.ReadAsStringAsync());
		}
	}
}
