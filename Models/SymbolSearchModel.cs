using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Where1.WFinance.Models
{
	[BindProperties]
	public class SymbolSearchModel
	{
		public string Keywords { get; set; }
	}
}
