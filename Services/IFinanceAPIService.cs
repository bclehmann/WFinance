using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Where1.WFinance.Services
{
	interface IFinanceAPIService
	{
		Task<IActionResult> SearchSymbolAsync(string keywords);
		Task<IActionResult> FetchSymbolPriceDailyAsync(string symbol);
		Task<IActionResult> FetchSymbolPriceIntradayAsync(string symbol, int stepMinutes);
	}
}
