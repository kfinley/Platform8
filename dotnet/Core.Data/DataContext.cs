using System;
using System.Data;
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
      .ForEach<EntityEntry>(entityEntry =>
      {
        if (((BaseEntity)entityEntry.Entity).Id.HasValue())
        {
          var existing = this.Find((BaseEntity)entityEntry.Entity, entity => ((BaseEntity)entityEntry.Entity).Id == entity.Id );
          if (existing.HasValue()) {
            throw new DataException("Existing entity with ID was found.");
          }
        } else {
          ((BaseEntity)entityEntry.Entity).Id = Guid.NewGuid();
        }

        ((BaseEntity)entityEntry.Entity).DateCreated = SystemTime.UtcNow;
        ((BaseEntity)entityEntry.Entity).Status = EntityStatus.Active;
      });

      return base.SaveChangesAsync(cancellationToken);
    }

    private TEntity Find<TEntity>(TEntity entity, Func<TEntity, bool> predicate) where TEntity : class
    {
      var genericMethod = this.GetType().GetMethod("Set");
      var set = genericMethod.MakeGenericMethod(new[] { entity.GetType() }).Invoke(this, null) as IQueryable<TEntity>;

      return set.FirstOrDefault(predicate);
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
      base.OnModelCreating(builder);

      builder.ApplyConfigurationsFromAssembly(GetType().Assembly);
    }
  }
}
