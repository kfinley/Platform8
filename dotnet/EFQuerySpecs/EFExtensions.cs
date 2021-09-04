using System;
using System.Collections;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;

using Microsoft.EntityFrameworkCore;

namespace EFQuerySpecs {
  public static class EFExtensions {

    public static IQueryable<T> Include<T>(this IQueryable<T> query, Tuple<Expression, Expression> include) {
      CreateItemTypeAndProperty(include.Item1, out Type itemType, out PropertyInfo itemProperty);

      var queryExpression = Expression.Call(
                typeof(EntityFrameworkQueryableExtensions),
                "Include",
                new Type[] {
                    itemType,
                    itemProperty.PropertyType
                },
                query.Expression,
                include.Item1
                );
      query = query.Provider.CreateQuery<T>(queryExpression);

      if (include.Item2 != null) {
        CreateItemTypeAndProperty(include.Item2, out Type thenIncludeItemType, out PropertyInfo thenIncludeItemProperty);
        var item1Lambda = Reflection.CreateLambdaExpression<T>(Reflection.GetPropertyName(include.Item1));

        var parentIncludeTypeInfo = item1Lambda.Body.Type.GetTypeInfo();

        if (parentIncludeTypeInfo.IsGenericType && parentIncludeTypeInfo.ImplementedInterfaces.Contains(typeof(IList))) {
          thenIncludeItemType = parentIncludeTypeInfo.GetGenericArguments()[0];
        }

        queryExpression = Expression.Call(
              typeof(EntityFrameworkQueryableExtensions),
              "ThenInclude",
              new Type[] {
                  typeof(T),
                  thenIncludeItemType,
                  thenIncludeItemProperty.PropertyType
              },
              query.Expression,
              include.Item2
              );

        query = query.Provider.CreateQuery<T>(queryExpression);
      }
      return query;
    }

    private static void CreateItemTypeAndProperty(object item, out Type itemType, out PropertyInfo itemProperty) {
      itemType = item.GetType().GenericTypeArguments[0].GenericTypeArguments[0];
      var itemPropertyName = ((PropertyInfo)((MemberExpression)((LambdaExpression)(item)).Body).Member).Name;

      itemProperty = itemType.GetRuntimeProperty(itemPropertyName);
    }
  }
}
