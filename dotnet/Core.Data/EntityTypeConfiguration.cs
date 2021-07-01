using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Platform8.Core.Data
{
  public abstract class EntityTypeConfiguration<T> : IEntityTypeConfiguration<T> where T : class, IEntity
  {

    protected void ConfigureEntityTable(EntityTypeBuilder<T> b, string tableName = "")
    {
      if (tableName.HasValue())
      {
        b.ToTable(tableName);
      }
      b.Property(p => p.Id)
       .ValueGeneratedNever();
      b.HasIndex(u => u.Id);
    }

    public abstract void Configure(EntityTypeBuilder<T> builder);
  }
}
