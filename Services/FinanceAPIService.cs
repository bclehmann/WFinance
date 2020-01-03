using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Reflection;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
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

		private string RemovePrefixes(string response)
		{
			string temp = Regex.Replace(response, @"\d\. ", "");
			return Regex.Replace(temp, @"Time Series \(.*\)", "Series");
		}

		private bool RateLimited(string response)
		{
			return response.Contains("\"Note\": \"Thank you for using Alpha Vantage! Our standard API call frequency ");
		}

		private List<Dictionary<string, string>> ConvertSeriesToArray(Dictionary<string, Dictionary<string, string>> input)
		{
			List<Dictionary<string, string>> objectList = new List<Dictionary<string, string>>();
			foreach (KeyValuePair<string, Dictionary<string, string>> curr in input)
			{//The type is unwieldly, but one would assume it's a string, so I didn't use var
				var temp = new Dictionary<string, string>();
				foreach (KeyValuePair<string, string> curr2 in curr.Value)
				{
					temp.Add(curr2.Key, curr2.Value);
				}
				temp.Add("date", curr.Key);

				objectList.Add(temp);
			}

			return objectList;
		}

		private Dictionary<string, object> FormatSeriesRequest(string responseContent)
		{
			var responseString = RemovePrefixes(responseContent);

			var responseStringSeries = "{" + responseString.Substring(responseString.IndexOf("\"Series\""));

			var obj = JsonSerializer.Deserialize<Dictionary<string, Dictionary<string, object>>>(responseString);
			var objSeries = JsonSerializer.Deserialize<Dictionary<string, Dictionary<string, Dictionary<string, string>>>>(responseStringSeries);
			var series = ConvertSeriesToArray(objSeries.GetValueOrDefault("Series"));

			var returnObj = new Dictionary<string, object>();
			foreach (var curr in obj.Keys)
			{
				if (curr != "Series")
				{
					returnObj.Add(curr, obj.GetValueOrDefault(curr));
				}
			}
			returnObj.Add("Series", series);

			return returnObj;
		}

		public async Task<IActionResult> SearchSymbolAsync(string keywords)
		{
			var response = await _httpClient.GetAsync($"https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords={keywords}&apikey={APIKey}");
			string responseString = await response.Content.ReadAsStringAsync();

			if (RateLimited(responseString))
			{
				return new StatusCodeResult(429);//Status code for too many requests
			}
			responseString = RemovePrefixes(await response.Content.ReadAsStringAsync());

			return new JsonResult(JsonSerializer.Deserialize<object>(responseString));
		}

		public async Task<IActionResult> FetchSymbolPriceIntradayAsync(string symbol, int stepMinutes)
		{
			int[] supportedIntervals = { 1, 5, 15, 30, 60 };
			if (!supportedIntervals.Contains(stepMinutes))
			{
				string intervalString = "";
				foreach (int curr in supportedIntervals)
				{
					intervalString += curr + ",";
				}
				intervalString = intervalString.Substring(0, intervalString.Length - 1);

				return new BadRequestResult();
				//throw new ArgumentException($"The API only supports intervals of {intervalString}", nameof(stepMinutes));
			}

			var response = await _httpClient.GetAsync($"https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol={symbol}&interval={stepMinutes}min&outpusize=full&apikey={APIKey}");
			string responseString = await response.Content.ReadAsStringAsync();

			if (RateLimited(responseString))
			{
				return new StatusCodeResult(429);//Status code for too many requests
			}

			return new JsonResult(FormatSeriesRequest(responseString));
		}

		public async Task<IActionResult> FetchSymbolPriceDailyAsync(string symbol)
		{
			var response = await _httpClient.GetAsync($"https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol={symbol}&outputsize=full&apikey={APIKey}");
			string responseString = await response.Content.ReadAsStringAsync();

			if (RateLimited(responseString))
			{
				return new StatusCodeResult(429);//Status code for too many requests
			}

			return new JsonResult(FormatSeriesRequest(responseString));
		}
	}
}
