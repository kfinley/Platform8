using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Platform8.Core.Data
{
    public interface IAsyncRepository<TContext, TEntity>
      where TEntity: IEntity
      where TContext: DbContext
    {
      Task<TEntity> GetAsync(Guid id, CancellationToken cancellationToken = default);
      Task<TEntity> FirstOrDefaultAsync(Expression<Func<TEntity, bool>> where, CancellationToken cancellationToken = default);
      Task<TEntity> FirstOrDefaultAsync<TProperty>(Expression<Func<TEntity, bool>> where, Expression<Func<TEntity, TProperty>> include, CancellationToken cancellationToken = default);
      Task<TEntity> FirstOrDefaultAsync(IQuerySpec<TEntity> spec, CancellationToken cancellationToken = default);
      Task<TEntity> SaveAsync(TEntity entity, CancellationToken cancellationToken = default);
      Task<IReadOnlyList<TEntity>> ListAllAsync(CancellationToken cancellationToken = default);
      Task<IReadOnlyList<TResult>> ListAsync<TResult>(IQuerySpec<TEntity, TResult> spec, CancellationToken cancellationToken = default);
      Task<IReadOnlyList<TEntity>> ListAsync(IQuerySpec<TEntity> spec, CancellationToken cancellationToken = default);
    }
}
