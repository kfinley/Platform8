using Platform8.WebApi;

namespace Platform8.Transactions.Api {
  public class Program : ApiProgramBase {

    public static void Main(string[] args) =>
      ApiProgramBase.Run<Startup>(args);
  }
}
