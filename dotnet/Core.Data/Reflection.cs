using System;
using System.Collections.Concurrent;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;

namespace Platform8.Core.Data
{
  public static class Reflection
  {
    private static ConcurrentDictionary<Type, PropertyInfo[]> s_KnownProperties = new ConcurrentDictionary<Type, PropertyInfo[]>();

    public static LambdaExpression CreateLambdaExpression<T>(string propertyName)
    {
      return CreateLambdaExpression(typeof(T), propertyName);
    }

    public static LambdaExpression CreateLambdaExpression(Type type, string propertyName)
    {
      var param = Expression.Parameter(type, "x");
      Expression body = param;
      foreach (var member in propertyName.Split('.'))
      {
        body = Expression.PropertyOrField(body, member);
      }
      return Expression.Lambda(body, param);
    }

    public static string GetPropertyName(this Expression propertyExpression)
    {
      var propName = string.Empty;

      try
      {
        if (propertyExpression is MemberExpression)
        {
          propName = ((MemberExpression)propertyExpression).Member.Name;
        }
        else if (propertyExpression is UnaryExpression)
        {
          propName = ((MemberExpression)((UnaryExpression)propertyExpression).Operand).Member.Name;
        }
        else if (propertyExpression.GetPropertyValue("Body").GetType().Name == "PropertyExpression")
        {
          propName = ((MemberExpression)propertyExpression.GetPropertyValue("Body")).Member.Name;
        }
        else
        {
          throw new Exception("propertyExpression type unknown.");
        }
      }
      catch (Exception ex)
      {
        throw new Exception("Error in Reflection.GetPropertyName", ex);
      }
      return propName;
    }
    public static PropertyInfo GetProperty(this Type type, string name, object source)
    {
      return s_KnownProperties.GetOrAdd(type, t => t.GetProperties()).Where(p => p.Name == name).FirstOrDefault();
    }

    public static object GetPropertyValueOrNull(this Type type, object source, string property)
    {

      return type.GetProperty(property, source)?.GetValue(source);
    }

    public static object GetPropertyValue(this object source, string property)
    {
      try
      {

        return source.GetType().GetPropertyValueOrNull(source, property);

      }
      catch (Exception ex)
      {
        throw new Exception("Error in Reflection.GetPropertyValue", ex);
      }
    }

    public static T GetPropertyValue<T>(this object source, string property)
    {
      try
      {

        return (T)source.GetPropertyValue(property);

      }
      catch (Exception ex)
      {
        throw new Exception("Error in Reflection.GetPropertyValue<T>", ex);
      }
    }

    public static PropertyInfo GetProperty<T, TProperty>(Expression<Func<T, TProperty>> expression)
    {
      MemberExpression memberExpression = null;

      if (expression.Body.NodeType == ExpressionType.Convert)
      {
        memberExpression = ((UnaryExpression)expression.Body).Operand as MemberExpression;
      }
      else if (expression.Body.NodeType == ExpressionType.MemberAccess)
      {
        memberExpression = expression.Body as MemberExpression;
      }

      if (memberExpression == null)
      {
        throw new ArgumentException("Not a member access", "expression");
      }

      return memberExpression.Member as PropertyInfo;
    }

    public static TResult GetPropertyValue<T, TResult>(this object source, Expression<Func<T, TResult>> expression)
    {
      return (TResult)GetProperty(expression).GetValue(source);
    }
  }
}
