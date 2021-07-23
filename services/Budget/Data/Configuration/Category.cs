using Microsoft.EntityFrameworkCore.Metadata.Builders;

using Platform8.Core.Data;

namespace Platform8.Budget.Data
{
  public class CategoryConfiguration : EntityTypeConfiguration<Models.Category>
  {
    public override void Configure(EntityTypeBuilder<Models.Category> builder)
    {
      base.ConfigureEntityTable(builder);
      builder.OwnsOne(c => c.Allocation).Property(p => p.Start).HasPrecision(10, 4);
      builder.OwnsOne(c => c.Allocation).Property(p => p.End).HasPrecision(10, 4);

    }
  }
}
