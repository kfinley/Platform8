using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

using Microsoft.EntityFrameworkCore;

namespace EFQuerySpecs {

  public interface IQuerySpec<T, TResult> : IQuerySpec<T> {
    Func<T, TResult> Selector { get; }
  }

  public interface IQuerySpec<T> {
    int? Take { get; }
    int? Skip { get; }

    List<Tuple<Expression, Expression>> Includes { get; }
    Expression<Func<T, bool>> Where { get; }
    Expression<Func<T, object>> OrderBy { get; }
    IQueryable<T> Apply(DbContext context);

    void AddInclude<TProperty>(Expression<Func<T, TProperty>> include);
    void AddInclude<TProperty, TPropertyProperty>(Expression<Func<T, TProperty>> include, Expression<Func<TProperty, TPropertyProperty>> thenInclude);
  }
}
