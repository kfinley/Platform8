using System;
using System.Linq;
using System.Linq.Expressions;

using Microsoft.EntityFrameworkCore;

namespace Platform8.Core.Data
{
  public class QuerySpec<TEntity, TResult> : QuerySpec<TEntity>, IQuerySpec<TEntity, TResult>
    where TEntity : class
  {
    public Func<TEntity, TResult> Selector { get; set; }
  }

  public class QuerySpec<TEntity> : IQuerySpec<TEntity>
    where TEntity : class
  {
    public int? Take { get; set; }
    public int? Skip { get; set; }
    public Expression<Func<TEntity, bool>> Where { get; set; }
    public Expression<Func<TEntity, object>> OrderBy { get; set; }
    
    public IQueryable<TEntity> Apply(DbContext context)
    {
      return this.GetQuery(context.Set<TEntity>().AsQueryable());
    }

    public virtual IQueryable<TEntity> GetQuery(IQueryable<TEntity> query) {

      query = this.Where.HasValue() ? query.Where(Where) : query;
      query = this.OrderBy.HasValue() ? query.OrderBy(OrderBy) : query;
      query = this.Skip.HasValue ? query.Skip(this.Skip.Value) : query;
      query = this.Take.HasValue ? query.Take(this.Take.Value) : query;

      return query;
    }
  }
}
