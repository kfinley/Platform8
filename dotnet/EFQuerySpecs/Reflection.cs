using System;
using System.Collections.Concurrent;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;

namespace EFQuerySpecs {
  public static class Reflection {
    private static ConcurrentDictionary<Type, PropertyInfo[]> s_KnownProperties = new ConcurrentDictionary<Type, PropertyInfo[]>();

    public static LambdaExpression CreateLambdaExpression<T>(string propertyName) {
      return CreateLambdaExpression(typeof(T), propertyName);
    }

    public static LambdaExpression CreateLambdaExpression(Type type, string propertyName) {
      var param = Expression.Parameter(type, "x");
      Expression body = param;
      foreach (var member in propertyName.Split('.')) {
        body = Expression.PropertyOrField(body, member);
      }
      return Expression.Lambda(body, param);
    }

    public static string GetPropertyName(this Expression propertyExpression) {
      var propName = string.Empty;

      try {
        if (propertyExpression is MemberExpression) {
          propName = ((MemberExpression)propertyExpression).Member.Name;
        } else if (propertyExpression is UnaryExpression) {
          propName = ((MemberExpression)((UnaryExpression)propertyExpression).Operand).Member.Name;
        } else if (propertyExpression.GetPropertyValue("Body").GetType().Name == "PropertyExpression") {
          propName = ((MemberExpression)propertyExpression.GetPropertyValue("Body")).Member.Name;
        } else {
          throw new Exception("propertyExpression type unknown.");
        }
      } catch (Exception ex) {
        throw new Exception("Error in Reflection.GetPropertyName", ex);
      }
      return propName;
    }
    public static PropertyInfo GetProperty(this Type type, string name, object source) {
      return s_KnownProperties.GetOrAdd(type, t => t.GetProperties()).Where(p => p.Name == name).FirstOrDefault();
    }

    public static object GetPropertyValueOrNull(this Type type, object source, string property) {

      return type.GetProperty(property, source)?.GetValue(source);
    }

    public static object GetPropertyValue(this object source, string property) {
      try {

        return source.GetType().GetPropertyValueOrNull(source, property);

      } catch (Exception ex) {
        throw new Exception("Error in Reflection.GetPropertyValue", ex);
      }
    }

  }
}
