using System;
using System.Collections.Generic;

using MediatR;

namespace Platform8.FinancialAccounts.Models
{
  public class ListAccountsRequest : IRequest<ListAccountsResponse>
  {
    public int? Skip { get; set; }
    public int? Take { get; set; }
    public Guid? OwnerId { get; set; }
  }

  public class ListAccountsResponse : List<AccountInList>
  {
    public ListAccountsResponse(IEnumerable<AccountInList> list) : base(list) { }
  }
}

