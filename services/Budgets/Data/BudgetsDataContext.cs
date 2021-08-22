using Microsoft.EntityFrameworkCore;

using Platform8.Core.Data;

namespace Platform8.Budgets.Data {

  public class BudgetsDataContext : DataContext<BudgetsDataContext> {
    public BudgetsDataContext(DbContextOptions<BudgetsDataContext> options) : base(options) { }

    public DbSet<Budget> Budgets { get; set; }
    public DbSet<Category> Categories { get; set; }
  }
}
