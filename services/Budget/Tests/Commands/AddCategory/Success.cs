using System;
using System.Linq.Expressions;
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
using Platform8.Budget.Commands;
using Platform8.Budget.Models;
using Platform8.Core.Data;
using Platform8.Budget.Data;
using Platform8.Core;

namespace Platform8.Budget.Tests
{
  [Subject("Add Category")]
  public class When_AddCategory_Requested : SpecBase
  {
    public When_AddCategory_Requested(MSpecFixture fixture)
      : base(fixture)
    {
      Setup(this, context, of);
    }

    static Sut<AddCategoryHandler> Sut = new Sut<AddCategoryHandler, AddCategoryResponse>();

    static AddCategoryRequest Request;
    static AddCategoryResponse Result;

    Establish context = () =>
    {
      var testUserId = Guid.NewGuid();

      var testBudget = new Models.Budget
      {
        Id = Guid.NewGuid(),
        OwnerId = testUserId
      };

      Request = new AddCategoryRequest
      {
        OwnerId = testUserId,
        Name = "Test",
        Allocation = new NumberRange
        {
          Start = 10,
          End = 15
        }
      };

      Sut.SetupAsync<IAsyncRepository<BudgetDataContext, Models.Budget>, Models.Budget>(r =>
         r.FirstOrDefaultAsync(Argument.IsAny<Expression<Func<Models.Budget, bool>>>(), Argument.IsAny<CancellationToken>()))
       .ReturnsAsync(testBudget);

      Sut.SetupAsync<IAsyncRepository<BudgetDataContext, Models.Category>, Models.Category>(r => r.SaveAsync(Argument.IsAny<Models.Category>(), Argument.IsAny<CancellationToken>()))
        .ReturnsAsync(new Models.Category {
          Id = Guid.NewGuid(),
          Name = Request.Name,
          Allocation = Request.Allocation,
          Budget = testBudget,
          DateCreated = SystemTime.UtcNow,
          Status = EntityStatus.Active
        });
    };

    Because of = async () => Result = await Sut.Target.Handle(Request, new CancellationTokenSource().Token);

    [Fact]
    public void It_should_return_a_successful_result() => should_return_a_successful_result();
    It should_return_a_successful_result = () =>
    {
      Result.Should().NotBeNull();
      Result.Success.Should().BeTrue();
    };

    [Fact]
    public void It_should_get_the_Budget_the_user() => should_get_the_Budget_the_user();
    It should_get_the_Budget_the_user = () =>
    {
      Sut.Verify<IAsyncRepository<BudgetDataContext, Models.Budget>>(p => p.FirstOrDefaultAsync(Argument.IsAny<Expression<Func<Models.Budget, bool>>>(), Argument.IsAny<CancellationToken>()), Times.Once());
    };

    [Fact]
    public void It_should_save_a_new_Category_to_the_Data_Repository() => should_save_a_new_Category_to_the_Data_Repository();
    It should_save_a_new_Category_to_the_Data_Repository = () => {
        Sut.Verify<IAsyncRepository<BudgetDataContext, Models.Category>>(p => p.SaveAsync(Argument.IsAny<Models.Category>(), Argument.IsAny<CancellationToken>()), Times.Once());
    };

    [Fact]
    public void It_should_return_the_id_of_the_added_Category() => should_return_the_id_of_the_added_Category();
    It should_return_the_id_of_the_added_Category = () => {
      Result.Id.Should().NotBeEmpty();
    };
  }
}
