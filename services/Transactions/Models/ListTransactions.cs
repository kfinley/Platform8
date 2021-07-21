using System;
using System.Collections.Generic;
using MediatR;

namespace Platform8.Transactions.Models
{
  public class ListTransactionsRequest : IRequest<ListTransactionsResponse>
  {
    public Guid? UserId { get; set; }
    public DateTime StartDate { get; set; }
  }
  public class ListTransactionsResponse : List<Transaction>
  {
    public ListTransactionsResponse(IEnumerable<Transaction> list) : base(list) { }
  }

}