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
	public class SymbolSearchModel {
		public string Keyword;
	}

	[Route("api/[controller]")]
	[ApiController]
	public class SymbolSearchController : ControllerBase
	{
		private readonly HttpClient _httpClient;
		public SymbolSearchController()
		{
			_httpClient = new HttpClient();
		}

		public async Task<JsonResult> Post(string keywords)
		{
			var service = new FinanceAPIService(_httpClient);
			return await service.SearchSymbolAsync(keywords);
		}
	}
}
