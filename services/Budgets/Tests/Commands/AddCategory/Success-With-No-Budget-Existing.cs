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
using EFQuerySpecs;

using Platform8.Tests.Common.Specs;
using Platform8.Tests.Common;
using Platform8.Budgets.Commands;
using Platform8.Budgets.Models;
using Platform8.Core.Data;
using Platform8.Budgets.Data;
using Platform8.Core;

namespace Platform8.Budgets.Tests {
  [Subject("Add Category")]
  public class When_AddCategory_With_No_Budget_Existing_Requested : SpecBase {
    public When_AddCategory_With_No_Budget_Existing_Requested(MSpecFixture fixture)
      : base(fixture) {
      Setup(this, context, of);
    }

    static Sut<AddCategoryHandler> Sut = new Sut<AddCategoryHandler, AddCategoryResponse>();

    static AddCategoryRequest Request;
    static AddCategoryResponse Result;
    static Guid TestUserId = Guid.NewGuid();

    Establish context = () => {

      var testBudget = new Data.Budget {
        Id = Guid.NewGuid(),
        OwnerId = TestUserId
      };

      Request = new AddCategoryRequest {
        OwnerId = TestUserId,
        Name = "Test",
        Allocation = new NumberRange {
          Start = 10,
          End = 15
        }
      };

      Sut.SetupAsync<IAsyncRepository<BudgetsDataContext, IEntity>, Data.Budget>(r => r.SaveAsync(Argument.IsAny<Data.Budget>(), Argument.IsAny<CancellationToken>()))
        .ReturnsAsync(new Data.Budget {
          Id = Guid.NewGuid(),
          OwnerId = TestUserId,
          DateCreated = SystemTime.UtcNow,
          Status = EntityStatus.Active
        });

      Sut.SetupAsync<IAsyncRepository<BudgetsDataContext, IEntity>, Data.Category>(r => r.SaveAsync(Argument.IsAny<Data.Category>(), Argument.IsAny<CancellationToken>()))
        .ReturnsAsync(new Data.Category {
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
    It should_return_a_successful_result = () => {
      Result.Should().NotBeNull();
      Result.Success.Should().BeTrue();
    };

    [Fact]
    public void It_should_try_to_get_the_Budget_the_user() => should_try_to_get_the_Budget_the_user();
    It should_try_to_get_the_Budget_the_user = () => {
      Sut.Verify<IAsyncRepository<BudgetsDataContext, IEntity>>(p => p.FirstOrDefaultAsync(Argument.IsAny<Expression<Func<Data.Budget, bool>>>(), Argument.IsAny<CancellationToken>()), Times.Once());
    };

    [Fact]
    public void It_should_save_a_new_Budget_to_the_Data_Repository() => should_save_a_new_Budget_to_the_Data_Repository();
    It should_save_a_new_Budget_to_the_Data_Repository = () => {
      Sut.Verify<IAsyncRepository<BudgetsDataContext, IEntity>>(p => p.SaveAsync(Argument.Is<Data.Budget>(b =>
        b.OwnerId == TestUserId
      ), Argument.IsAny<CancellationToken>()), Times.Once());
    };

    [Fact]
    public void It_should_save_a_new_Category_to_the_Data_Repository() => should_save_a_new_Category_to_the_Data_Repository();
    It should_save_a_new_Category_to_the_Data_Repository = () => {
      Sut.Verify<IAsyncRepository<BudgetsDataContext, IEntity>>(p => p.SaveAsync(Argument.Is<Data.Category>(c =>
        c.Name == Request.Name &&
        c.Allocation == Request.Allocation &&
        c.Budget.Id.HasValue()
      ), Argument.IsAny<CancellationToken>()), Times.Once());
    };

    [Fact]
    public void It_should_return_the_id_of_the_added_Category() => should_return_the_id_of_the_added_Category();
    It should_return_the_id_of_the_added_Category = () => {
      Result.Id.Should().NotBeEmpty();
    };
  }
}
