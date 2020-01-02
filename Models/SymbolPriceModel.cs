using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Where1.WFinance.Models
{
	[BindProperties]
	public class SymbolPriceModel
	{
		public string Symbol { get; set; }
		public string Type { get; set; }
		public int? StepMinutes { get; set; }
	}
}
