using System;

namespace Platform8.Transactions.Models
{
  public class Transaction
  {
    public Guid Id { get; set; }
    public Guid AccountId { get; set; }
    public DateTime Date { get; set; }
    public string Description { get; set; }
    public decimal Amount { get; set; }
  }

}
