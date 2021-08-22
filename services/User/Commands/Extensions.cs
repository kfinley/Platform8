using System;
using System.Collections.Generic;
using System.Net;

using Amazon.CognitoIdentityProvider.Model;
using Amazon.Runtime;

namespace Platform8.User.Commands {
  public static class Extensions {
    public static bool IsSuccess(this AmazonWebServiceResponse response)
      => (int)response.HttpStatusCode >= 200 && (int)response.HttpStatusCode <= 299;


    public static void Add(this List<AttributeType> target, string name, string value) {
      target.Add(new AttributeType {
        Name = name,
        Value = value
      });
    }
  }
}
