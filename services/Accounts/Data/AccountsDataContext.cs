using Microsoft.EntityFrameworkCore;

using Platform8.Core.Data;

namespace Platform8.Accounts.Data {

  public class AccountsDataContext: DataContext<AccountsDataContext> {
      public AccountsDataContext(DbContextOptions<AccountsDataContext> options): base(options) { }

      public DbSet<Models.Account> Accounts { get; set; }
      public DbSet<Models.Balance> Balances { get; set; }
  }
}
