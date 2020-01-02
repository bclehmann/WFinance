using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using Where1.WFinance.Services;
using Where1.WFinance.Models;

namespace Where1.WFinance.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class SymbolPriceController : ControllerBase
	{
		private static readonly HttpClient _httpClient;

		//
		//This is a static constructor, it's only a thing in C#
		//It is basically the same thing as an init method which runs automatically before the first instance is made
		static SymbolPriceController()
		{
			if (_httpClient == null)
			{
				_httpClient = new HttpClient();
			}
		}
		//string symbol, string type = "DAILY", int stepMinutes=60
		public async Task<IActionResult> Post(SymbolPriceModel parameters)
		{
			var service = new FinanceAPIService(_httpClient);
			switch (parameters.Type.ToUpper())
			{
				case "DAILY":
					return await service.FetchSymbolPriceDailyAsync(parameters.Symbol);
					break;
				case "INTRADAY":
					return await service.FetchSymbolPriceIntradayAsync(parameters.Symbol, parameters.StepMinutes.GetValueOrDefault());
					break;
				default:
					return BadRequest();
					break;
			}
		}
	}
}
