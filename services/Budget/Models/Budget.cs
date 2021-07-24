using System;
using System.Collections.Generic;

using MediatR;

using Platform8.Core;

namespace Platform8.BudgetService.Models
{
  public class Budget {
    public Guid Id { get; set; }    
    public IList<Models.Category> Categories { get; set; }
  }
  
  public class GetBudgetRequest : IRequest<GetBudgetResponse>
  {
    public Guid OwnerId { get; set; }
  }

  public class GetBudgetResponse{
    public Budget Budget { get; set; }
    public string Error { get; set; }
  }
}
