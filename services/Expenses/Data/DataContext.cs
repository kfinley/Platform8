using Microsoft.EntityFrameworkCore;

using Platform8.Core.Data;

namespace Platform8.Expenses.Data {

  public class DataContext: DataContext<DataContext> {
      public DataContext(DbContextOptions<DataContext> options): base(options) { }

      public DbSet<Expense> Expenses { get; set; }      
  }
}
