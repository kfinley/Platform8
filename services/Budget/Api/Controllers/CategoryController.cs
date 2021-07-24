using System;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

using MediatR;

using Platform8.BudgetService.Models;

namespace Platform8.BudgetService.Api.Controllers
{
  [Authorize]
  [ApiController]
  public class CategoryController : ControllerBase
  {

    private readonly ILogger<CategoryController> logger;
    private readonly IMediator mediator;
    
    public CategoryController(IMediator mediator, ILogger<CategoryController> logger)
    {
      this.mediator = mediator;
      this.logger = logger;
    }

    [HttpPost]
    [Route("/budget/v1/category")]
    public async Task<IActionResult> Category(AddCategoryRequest request) {
      request.OwnerId = new Guid(this.User.Claims.FirstOrDefault(c => c.Type == "username")?.Value);
      return Ok(await mediator.Send(request));
    }
  }
}
