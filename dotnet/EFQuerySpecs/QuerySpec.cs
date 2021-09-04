using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

using Microsoft.EntityFrameworkCore;

namespace EFQuerySpecs {
  public class QuerySpec<TEntity, TResult> : QuerySpec<TEntity>, IQuerySpec<TEntity, TResult>
    where TEntity : class {
    public Func<TEntity, TResult> Selector { get; set; }
  }

  public class QuerySpec<TEntity> : IQuerySpec<TEntity>
    where TEntity : class {

    public int? Take { get; set; }
    public int? Skip { get; set; }
    public List<Tuple<Expression, Expression>> Includes { get; set; } = new List<Tuple<Expression, Expression>>();
    public Expression<Func<TEntity, bool>> Where { get; set; }
    public Expression<Func<TEntity, object>> OrderBy { get; set; }

    public void AddInclude<TProperty>(Expression<Func<TEntity, TProperty>> include) {
      this.Includes.Add(Tuple.Create((Expression)include, (Expression)null));
    }

    public void AddInclude<TProperty, TPropertyProperty>(Expression<Func<TEntity, TProperty>> include, Expression<Func<TProperty, TPropertyProperty>> thenInclude) {
      this.Includes.Add(Tuple.Create((Expression)include, (Expression)thenInclude));
    }

    public IQueryable<TEntity> Apply(DbContext context) {
      return this.GetQuery(context.Set<TEntity>().AsQueryable());
    }

    public virtual IQueryable<TEntity> GetQuery(IQueryable<TEntity> query) {
      foreach (var include in this.Includes) {
        query = query.Include(include);
      }

      query = this.Where != null ? query.Where(Where) : query;
      query = this.OrderBy != null ? query.OrderBy(OrderBy) : query;
      query = this.Skip.HasValue ? query.Skip(this.Skip.Value * this.Take.Value) : query;
      query = this.Take.HasValue ? query.Take(this.Take.Value) : query;

      return query;
    }
  }
}
