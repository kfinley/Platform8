using System;
using System.Collections.Generic;
using Platform8.Core.Data;

namespace Platform8.Accounts.Models
{
  public class Account : BaseEntity
  {
    public string Name { get; set; }
    public string FinancialInstitution { get; set; }
    public string AccountType { get; set; }
    public decimal StartingBalance { get; set; }

    public Guid OwnerId { get; set; }
    public IList<Balance> Balances { get; set; }
  }

  public class AccountInList {
    public Guid Id { get; set; }
    public string Name { get; set; }
    public decimal Balance { get; set; }
  }
}
