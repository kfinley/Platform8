using Microsoft.EntityFrameworkCore.Metadata.Builders;

using Platform8.Core.Data;

namespace Platform8.Expenses.Data
{
  public class ExpenseConfiguration : EntityTypeConfiguration<Expense>
  {
    public override void Configure(EntityTypeBuilder<Expense> builder)
    {
      base.ConfigureEntityTable(builder);
      builder.Property(e => e.Amount).HasPrecision(19,4);
    }
  }
}
