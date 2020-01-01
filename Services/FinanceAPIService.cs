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
		private static string APIKey;

		public static void Init() {
			var APIFileReader = new StreamReader(new FileStream("FinanceAPIConfig.json", FileMode.Open));
			string asString = APIFileReader.ReadToEnd();

			Dictionary<string,string> parseResult = JsonSerializer.Deserialize<Dictionary<string,string>>(asString);
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
	}
}
