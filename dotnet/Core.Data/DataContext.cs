using System.Linq;
using System.Threading;
using System.Threading.Tasks;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace Platform8.Core.Data
{
  public class DataContext<T> : DbContext where T : DbContext
  {
    public DataContext(DbContextOptions<T> options) : base(options) { }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
      ChangeTracker
      .Entries()
      .Where(e => e.Entity is BaseEntity && (
              e.State == EntityState.Added))
      .ForEach<EntityEntry>(entityEntry => {
        ((BaseEntity)entityEntry.Entity).DateCreated = SystemTime.UtcNow;
        ((BaseEntity)entityEntry.Entity).Status = EntityStatus.Active;
      });

      return base.SaveChangesAsync(cancellationToken);
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
      base.OnModelCreating(builder);

      builder.ApplyConfigurationsFromAssembly(GetType().Assembly);
    }
  }
}
