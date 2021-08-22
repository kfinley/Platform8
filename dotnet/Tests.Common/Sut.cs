using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;

using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

using Moq;
using Moq.AutoMock;
using Moq.Language.Flow;

namespace Platform8.Tests.Common {

  public class Sut<T, TData> : Sut<T>
      where T : class {

    public void Run(Action<T> setup) {
      setup(Target);
    }

    public TData Result { get; set; }

    public void SetResult(Func<T, TData> getResult) {
      Result = getResult(Target);
    }
  }

  public class Sut<T> where T : class {

    private T target;

    private Dictionary<Type, object> reals = new Dictionary<Type, object>();

    public AutoMocker Mocker;

    public Sut(params Mock[] args) {

      Setup(new List<Mock>(args));
    }

    /// <summary>
    /// Create an instance of a Sut<T>.
    /// </summary>
    public Sut(Action<T> setterAction, params Mock[] args) {

      Setup(new List<Mock>(args));
      this.PostInitializeSetterAction = setterAction;
    }

    private void Setup(List<Mock> args) {

      this.Mocker = new AutoMocker(MockBehavior.Loose);

      this.ServiceCollection = new ServiceCollection();

      ServiceCollection.AddLogging(config => config.AddConsole());

      args.ForEach(m => {
        Mocker.Use(m);
      });
    }

    private void Initialize() {

      Mocker.Use<IServiceProvider>(ServiceCollection.BuildServiceProvider());

      target = Mocker.CreateInstance<T>();

      this.PostInitializeSetterAction?.Invoke(target);
    }

    public ServiceCollection ServiceCollection;

    public T Target {
      get {
        if (target == null)
          Initialize();
        return target;
      }
    }

    public Action<T> PostInitializeSetterAction { get; set; }

    public void Use<TParam>(TParam paramInstance)
        where TParam : class {

      ServiceCollection.AddTransient<TParam>(x => paramInstance);
      Mocker.Use<IServiceProvider>(ServiceCollection.BuildServiceProvider());
      Mocker.Use<TParam>(paramInstance);
    }

    public void Use<TService>(Expression<Func<TService, bool>> setup) where TService : class {

      Mocker.Use<TService>(setup);

      ServiceCollection.AddTransient<TService>(x => Mocker.Get<TService>());
      Mocker.Use<IServiceProvider>(ServiceCollection.BuildServiceProvider());

    }

    public void Use<TService, TImplementation>() where TService : class where TImplementation : class, TService {

      ServiceCollection.AddTransient<TService, TImplementation>();
      Mocker.Use<IServiceProvider>(ServiceCollection.BuildServiceProvider());

      Mocker.Use<TService>(Mocker.CreateInstance<TImplementation>());
    }

    public void Use<TService>() where TService : class {

      ServiceCollection.AddTransient<TService, TService>();
      Mocker.Use<IServiceProvider>(ServiceCollection.BuildServiceProvider());

      Mocker.Use<TService>(Mocker.CreateInstance<TService>());
    }

    public void Use(Type type) {

      ServiceCollection.AddTransient(type, type);
      Mocker.Use<IServiceProvider>(ServiceCollection.BuildServiceProvider());
      Mocker.Use(type, Mocker.CreateInstance(type));
    }

    public ISetup<TMock, Task> Setup<TMock>(Expression<Func<TMock, Task>> expression)
        where TMock : class {

      return Mocker.Setup(expression);
    }

    public ISetup<TMock, TMockResult> Setup<TMock, TMockResult>(Expression<Func<TMock, TMockResult>> expression)
        where TMock : class {

      return Mocker.Setup<TMock, TMockResult>(expression);
    }

    public ISetup<TMock> Setup<TMock>(Expression<Action<TMock>> expression)
        where TMock : class {

      return Mocker.Setup(expression);
    }

    public TService Get<TService>()
      where TService : class {
      return reals.ContainsKey(typeof(TService)) ? (TService)reals[typeof(TService)] : Mocker.Get<TService>();
    }

    public ISetup<TMock, Task> SetupAsync<TMock>(Expression<Func<TMock, Task>> expression)
        where TMock : class {
      return Mocker.Setup(expression);
    }

    public ISetup<TMock, Task<TMockResult>> SetupAsync<TMock, TMockResult>(Expression<Func<TMock, Task<TMockResult>>> expression)
        where TMock : class {
      var setup = Mocker.Setup(expression);
      return setup;
    }

    public void Verify<TMock>(Expression<Action<TMock>> expression, Times times)
        where TMock : class {
      Mocker.Verify(expression, times);
    }

    public void VerifyAll() {
      Mocker.VerifyAll();
    }

  }

}
