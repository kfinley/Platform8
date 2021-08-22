using System;
using System.Collections.Generic;

using MediatR;

namespace Platform8.Transactions.Models
{
  public class Transaction
  {
    public Guid Id { get; set; }
    public Guid AccountId { get; set; }
    public DateTime Date { get; set; }
    public int Sequence { get; set; }
    public string Description { get; set; }
    public decimal Amount { get; set; }

    public string ExtendedDetails { get; set; }
    public string AppearsOnStatementAs { get; set; }
    public string Address { get; set; }
    public string City { get; set; }
    public string State { get; set; }
    public string PostalCode { get; set; }
    public string Country { get; set; }
    public string Reference { get; set; }
    public string Category { get; set; }
  }

  public class ListTransactionsRequest : IRequest<ListTransactionsResponse>
  {
    public Guid? OwnerId { get; set; }
    public DateTime StartDate { get; set; }
  }

  public class ListTransactionsResponse : List<Transaction>
  {
    public ListTransactionsResponse(IEnumerable<Transaction> list) : base(list) { }
  }

  public class UnreviewedTransactionsRequest : IRequest<UnreviewedTransactionsResponse>
  {
    public Guid? OwnerId { get; set; }
    public DateTime StartDate { get; set; }
  }

  public class UnreviewedTransactionsResponse : List<Transaction>
  {
    public UnreviewedTransactionsResponse(IEnumerable<Transaction> list) : base(list) { }
  }
}
