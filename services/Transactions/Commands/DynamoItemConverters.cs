using Platform8.Transactions.Models;

namespace Platform8.Transactions.Commands {

  public static class DynamoItemConverters {

    public static Transaction ConvertItemToTransaction(DynamoItem item) {

      var result = new Transaction() {
        Id = item.GetGuid("id"),
        Date = item.GetDate("date"),
        Sequence = item.GetInt32("sequence"),
        Amount = item.GetDecimal("amount"),
        AccountId = item.GetGuid("accountId"),
        Description = item.GetString("description"),
        ExtendedDetails = item.GetString("extendedDetails"),
        AppearsOnStatementAs = item.GetString("appearsOnStatementAs"),
        Address = item.GetString("address"),
        City = item.GetString("city"),
        State = item.GetString("state"),
        PostalCode = item.GetString("postalCode"),
        Country = item.GetString("country"),
        Reference = item.GetString("reference"),
        Category = item.GetString("category")
      };
      return result;
    }
  }
}
