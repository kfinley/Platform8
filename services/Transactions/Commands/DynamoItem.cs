using System;
using System.Collections.Generic;

using Amazon.DynamoDBv2.Model;

namespace Platform8.Transactions.Commands
{
  public class DynamoItem
  {
    private Dictionary<string, AttributeValue> item = new Dictionary<string, AttributeValue>();

    internal DynamoItem(Dictionary<string, AttributeValue> item)
    {
      this.item = item;
    }

    public string GetString(string key)
    {
      return item.GetValueOrDefault(key)?.S;
    }

    public DateTime GetDate(string key) {
      return DateTime.Parse(item.GetValueOrDefault(key)?.S);
    }

    public Guid GetGuid(string key) {
      return Guid.Parse(item.GetValueOrDefault(key)?.S);
    }

    public int GetInt32(string key)
    {
      return Convert.ToInt32(item.GetValueOrDefault(key)?.N);
    }

    public double GetDouble(string key)
    {
      return Convert.ToDouble(item.GetValueOrDefault(key)?.N);
    }

    public decimal GetDecimal(string key) {
      return Convert.ToDecimal(item.GetValueOrDefault(key)?.N);
    }
  }
}
