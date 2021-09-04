using System;
using System.Collections.Generic;

using MediatR;

namespace Platform8.Expenses.Models {

  public class ListExpensesRequest : IRequest<ListExpensesResponse> {
    public int? Page { get; set; }
    public int? PageSize { get; set; }
    public Guid OwnerId { get; set; }

  }

  public class ListExpensesResponse : List<Expense> {
    public ListExpensesResponse(IEnumerable<Expense> list) : base(list) { }
  }

}
