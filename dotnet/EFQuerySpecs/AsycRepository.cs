using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace EFQuerySpecs {
  public class AsyncRepository<TContext, TEntityBase> : IAsyncRepository<TContext, TEntityBase>
    where TContext : DbContext {

    private ILogger logger;

    public AsyncRepository(TContext context, ILogger<AsyncRepository<TContext, TEntityBase>> logger) {
      this.logger = logger;
      this.Context = context;
    }

    public DbContext Context { get; set; }

    public async Task<TEntity> GetAsync<TEntity>(Guid id, CancellationToken cancellationToken = default)
      where TEntity : class, TEntityBase {

      return await this.Context.Set<TEntity>().FindAsync(id);
    }

    public async Task<TEntity> FirstOrDefaultAsync<TEntity>(Expression<Func<TEntity, bool>> where, CancellationToken cancellationToken = default)
      where TEntity : class, TEntityBase {

      return await FirstOrDefaultAsync(new QuerySpec<TEntity> {
        Where = where
      }, cancellationToken);
    }

    public async Task<TEntity> FirstOrDefaultAsync<TEntity, TProperty>(Expression<Func<TEntity, bool>> where, Expression<Func<TEntity, TProperty>> include, CancellationToken cancellationToken = default)
      where TEntity : class, TEntityBase {

      var querySpec = new QuerySpec<TEntity> {
        Where = where
      };
      querySpec.AddInclude(include);

      return await FirstOrDefaultAsync(querySpec, cancellationToken);
    }

    public async Task<TEntity> FirstOrDefaultAsync<TEntity>(IQuerySpec<TEntity> spec, CancellationToken cancellationToken = default)
      where TEntity : class, TEntityBase {

      return await spec.Apply(this.Context).FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<TEntity>> ListAllAsync<TEntity>(CancellationToken cancellationToken = default)
      where TEntity : class, TEntityBase {

      return await this.Context.Set<TEntity>().ToListAsync(cancellationToken);
    }

    public Task<IReadOnlyList<TResult>> ListAsync<TEntity, TResult>(IQuerySpec<TEntity, TResult> spec, CancellationToken cancellationToken = default)
      where TEntity : class, TEntityBase {

      return Task.FromResult<IReadOnlyList<TResult>>(spec.Apply(this.Context).Select(spec.Selector).ToList());
    }

    public async Task<IReadOnlyList<TEntity>> ListAsync<TEntity>(IQuerySpec<TEntity> spec, CancellationToken cancellationToken = default)
      where TEntity : class, TEntityBase {

      return await spec.Apply(this.Context).ToListAsync(cancellationToken);
    }

    public async Task<TEntity> SaveAsync<TEntity>(TEntity entity, CancellationToken cancellationToken)
      where TEntity : class, TEntityBase {

      var savedEntity = this.Context.Add(entity);
      var result = await this.Context.SaveChangesAsync();

      if (result > 0) {
        return (TEntity)savedEntity.Entity;
      }

      //TODO: Log and throw for now...
      var error = $"{entity.GetType().Name} was not saved.";
      this.logger.LogError(error);
      throw new Exception(error);
    }
  }
}
