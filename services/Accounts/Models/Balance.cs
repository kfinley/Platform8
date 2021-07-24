using System;

using Platform8.Core.Data;

namespace Platform8.Accounts.Models
{
  public class Balance : BaseEntity
  {
    public DateTime Date { get; set; }
    public Account Account { get; set; }
    public decimal Amount { get; set; }
  }
}
