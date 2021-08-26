using Platform8.WebApi;

namespace Platform8.User.Api {
  public class Program : ApiProgramBase {

    public static void Main(string[] args) =>
      ApiProgramBase.Run<Startup>(args);
  }
}
