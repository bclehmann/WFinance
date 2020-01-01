using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using Where1.WFinance.Services;

namespace Where1.WFinance.Controllers
{
	public class SymbolSearchModel
	{
		public string Keyword;
	}

	[Route("api/[controller]")]
	[ApiController]
	public class SymbolSearchController : ControllerBase
	{
		private static readonly HttpClient _httpClient;

		//
		//This is a static constructor, it's only a thing in C#
		//It is basically the same thing as an init method which runs automatically before the first instance is made
		static SymbolSearchController()
		{
			if (_httpClient == null)
			{
				_httpClient = new HttpClient();
			}
		}

		public async Task<JsonResult> Post(string keywords)
		{
			var service = new FinanceAPIService(_httpClient);
			return await service.SearchSymbolAsync(keywords);
		}
	}
}
