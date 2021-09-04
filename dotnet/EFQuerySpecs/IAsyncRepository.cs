using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;

using Microsoft.EntityFrameworkCore;

namespace EFQuerySpecs {
  public interface IAsyncRepository<TContext, TEntityBase>
    where TContext : DbContext {
    Task<TEntity> GetAsync<TEntity>(Guid id, CancellationToken cancellationToken = default)
      where TEntity : class, TEntityBase;
    Task<TEntity> FirstOrDefaultAsync<TEntity>(Expression<Func<TEntity, bool>> where, CancellationToken cancellationToken = default)
      where TEntity : class, TEntityBase;
    Task<TEntity> FirstOrDefaultAsync<TEntity, TProperty>(Expression<Func<TEntity, bool>> where, Expression<Func<TEntity, TProperty>> include, CancellationToken cancellationToken = default)
      where TEntity : class, TEntityBase;
    Task<TEntity> FirstOrDefaultAsync<TEntity>(IQuerySpec<TEntity> spec, CancellationToken cancellationToken = default)
      where TEntity : class, TEntityBase;
    Task<TEntity> SaveAsync<TEntity>(TEntity entity, CancellationToken cancellationToken = default)
      where TEntity : class, TEntityBase;
    Task<IReadOnlyList<TEntity>> ListAllAsync<TEntity>(CancellationToken cancellationToken = default)
      where TEntity : class, TEntityBase;
    Task<IReadOnlyList<TResult>> ListAsync<TEntity, TResult>(IQuerySpec<TEntity, TResult> spec, CancellationToken cancellationToken = default)
      where TEntity : class, TEntityBase;
    Task<IReadOnlyList<TEntity>> ListAsync<TEntity>(IQuerySpec<TEntity> spec, CancellationToken cancellationToken = default)
      where TEntity : class, TEntityBase;
  }
}
