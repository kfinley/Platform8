using System;
using System.Threading;

using Machine.Specifications;
using Machine.Specifications.Model;

using FluentAssertions;
using Xunit;
using Moq;
using It = Machine.Specifications.It;
using Argument = Moq.It;

using Platform8.Tests.Common.Specs;
using Platform8.Tests.Common;
using Platform8.User.Commands;
using Platform8.User.Data;
using Platform8.User.Models;
using Platform8.Core.Data;

namespace Platform8.User.Tests {
  [Subject("Save User")]
  public class When_SaveUser_Requested : SpecBase {
    public When_SaveUser_Requested(MSpecFixture fixture)
      : base(fixture) {
      Setup(this, context, of);
    }

    static Sut<SaveUserHandler> Sut = new Sut<SaveUserHandler, SaveUserResponse>();
    static SaveUserRequest Request;
    static SaveUserResponse Result;

    Establish context = () => {
      Request = new SaveUserRequest {
        Id = Guid.NewGuid(),
        FirstName = "Bob",
        LastName = "Jones",
        Email = "Bob@Jones.com"
      };

      Sut.SetupAsync<IAsyncRepository<UserDataContext>, Models.User>(r => r.SaveAsync(Argument.IsAny<Models.User>(), Argument.IsAny<CancellationToken>()))
        .ReturnsAsync(new Models.User {
          Id = Request.Id,
          FirstName = Request.FirstName,
          LastName = Request.LastName,
          Email = Request.Email,
          Status = EntityStatus.Active
        });
    };

    Because of = async () => Result = await Sut.Target.Handle(Request, new CancellationTokenSource().Token);

    It should_return_a_successful_result = () => {
      Result.Should().NotBeNull();
      Result.Success.Should().BeTrue();
    };

    [Fact]
    public void It_should_return_a_successful_result() =>
        should_return_a_successful_result();

    [Fact]
    public void It_should_save_a_new_User_to_the_Data_Repository() => should_save_a_new_User_to_the_Data_Repository();
    It should_save_a_new_User_to_the_Data_Repository = () => {
      Sut.Verify<IAsyncRepository<UserDataContext>>(p => p.SaveAsync(Argument.IsAny<Models.User>(), Argument.IsAny<CancellationToken>()), Times.Once());
    };
  }

}
